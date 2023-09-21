const { Expense } = require("../model/expenditure");
const authenticate = require("../middleware/auth");
const { sequelize } = require("../database/squelize");
const { User } = require("../model/login");
const { Op } = require("sequelize");
const { fileUrls } = require("../model/fileUrlTable");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const BUCKET_NAME = process.env.BUCKET_NAME;
const IAM_USER_KEY = process.env.IAM_USER_KEY;
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
const AWS_REGION = "us-east-1";

const ITEM_PER_PAGE = 2;

const addExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { Amount, Description, Category } = req.body;
    const PostData = await Expense.create({
      amount: Amount,
      description: Description,
      category: Category,
      userdetailId: req.user.id,
      authenticate,
    });
    // console.log('/////////',req.user,'\\\\\\\\')
    try {
      const totalAmount =
        Number(req.user.total_Expense) + Number(PostData.amount);
      const update = await User.update(
        { total_Expense: totalAmount },
        { where: { id: req.user.id }, transaction: t }
      );
      //   console.log(">>>>",totalAmount ,">>>>>.")
      await t.commit();
      res.status(201).json({ PostData });
    } catch (error) {
      await t.rollback();
      res.status(501).json({ message: "failed to post data" });
    }
  } catch (error) {
    console.log(error);
    await t.rollback();
    res.status(501).json({ message: "failed to post data" });
  }
};
const fetchExpense = async (req, res, next) => {
  try {
    const Details = await Expense.findAll({
      where: { userdetailId: req.user.id },
    });
    res.status(201).json({ Details });
    // console.log(Details)
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "failed to fetch details" });
  }
};

const deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.params.id;
    // console.log(userId);

    if (userId === undefined || userId.length === 0) {
      return res
        .status(404)
        .json({ message: "something wrong with delete user id" });
    }

    const response = await Expense.destroy({
      where: {
        [Op.and]: [{ id: userId }, { userdetailId: req.user.id }],
      },
      transaction: t,
    });

    const responseses = await Expense.findAll({
      where: {
        [Op.and]: [{ id: userId }, { userdetailId: req.user.id }],
      },
    });

    // console.log("responseses>>>>>", responseses, "<<<<<<<<<responseses");
    const totalAmount =
      req.user.total_Expense - responseses[0].dataValues.amount;
    // console.log("req.user.total_Expense",req.user.total_Expense);//total expense amount
    // console.log("responseses[0].dataValues.amount",responseses[0].dataValues.amount);//deleted expense amount
    // console.log("responseses.amount",responseses.amount);//undefined
    try {
      const update = await User.update(
        {
          total_Expense: totalAmount,
        },
        {
          where: { id: req.user.id },
          transaction: t,
        }
      );
      // console.log(" update>>>>>", update);
      if (response === 0) {
        await t.rollback();
        res.status(500).json({ message: "you are not authorized user" });
      } else {
        // console.log(response)
        await t.commit();
        return res
          .status(201)
          .json({ message: "expense deleted successfully  having", response });
      }
    } catch (error) {
      await t.rollback();
      console.log(error);
    }
  } catch (error) {
    await t.rollback();
    // const response = await Expense.destroy({ where:{ userdetailId: req.user.id } ,transaction:t});
    console.log(error);
  }
};

if (!BUCKET_NAME || !IAM_USER_KEY || !IAM_USER_SECRET) {
  // console.error("Required environment variables are missing.");
  process.exit(1);
}

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  },
});

async function getObjectURL(key) {
  let command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: new Date(),
  });
  const url = await getSignedUrl(s3, command);
  return url;
}

async function uploadToS3(data, fileName) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: "public-read",
    Expires: new Date(),
  };
  try {
    const uploadResult = await s3.send(new PutObjectCommand(params));
    console.log("File uploaded successfully:", uploadResult);
    return uploadResult;
  } catch (error) {
    // console.error("Error uploading to S3:", error);
    throw error;
  }
}

const expensedownload = async (req, res) => {
  try {
    const expense = await Expense.findAll({
      where: { userdetailId: req.user.id },
    });
    const stringifiedExpense = JSON.stringify(expense);

    const fileName = `Expense${req.user.id}/${new Date()}.txt`;
    try {
      const s3Response = await uploadToS3(stringifiedExpense, fileName);

      const url = await getObjectURL(fileName);

      let obj = {
        userdetailId: req.user.id,
        fileurl: url,
      };

      await fileUrls.create(obj);
      // Construct the S3 URL based on your bucket and filename
      const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}${new Date().getTime()}`;
      console.log(fileUrl);
      res.status(200).json({ url, success: true });
    } catch (error) {
      console.error("Error in downloadExpense:", error);
      res.status(500).json({ error: " server error" });
    }
  } catch (error) {
    // console.error("Error in downloadExpense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const allfileUrl = async (req, res, next) => {
  try {
    let listOfUrl = await fileUrls.find({
      where: { userdetailId: req.user.id },
    });
    res.json(listOfUrl);
  } catch (error) {
    console.log(error);
  }
};

const getExpenseOnPage = async (req, res, next) => {
  try {

    const {page,limit}=req.query
  //  let startIndex=(parseInt(page) - 1) * parseInt(limit)
  //  let lastIndex=parseInt(page)* parseInt(limit)

    if (!page || !Number.isInteger(parseInt(page)) || parseInt(page) < 1) {
      return res.status(400).json({ error: "Invalid page parameter" });
    }


    const queries={
      offset: (page - 1) * parseInt(limit),
      limit: parseInt(limit),
    }
  
    result = await Expense.findAndCountAll({
      where: {
        userdetailId: req.user.id
      },
      ...queries
    });

    let totalPages=Math.ceil(result.count/limit);

    res.status(200).json({  result,totalPages:totalPages ,page});
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addExpense,
  fetchExpense,
  deleteExpense,
  expensedownload,
  getExpenseOnPage,
};

// In Sequelize, the offset and limit methods are usually used for pagination directly on the query,
//  not on the result of findAll.
