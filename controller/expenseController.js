const { Expense } = require("../model/expenditure");
const authenticate = require("../middleware/auth");
const { sequelize } = require("../database/squelize");
const { User } = require("../model/login");
const { Op } = require("sequelize");

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
        console.log(userId);

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

        console.log("responseses>>>>>", responseses, "<<<<<<<<<responseses");
        const totalAmount = (req.user.total_Expense) - (responseses[0].dataValues.amount);
        // console.log("req.user.total_Expense",req.user.total_Expense);//total expense amount
        // console.log("responseses[0].dataValues.amount",responseses[0].dataValues.amount);//deleted expense amount
        // console.log("responseses.amount",responseses.amount);//undefined
        try {
            const update = await User.update(
                {
                    total_Expense: totalAmount
                },
                {
                    where: { id: req.user.id },
                    transaction: t,
                });
            console.log(" update>>>>>", update);
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
module.exports = {
    addExpense,
    fetchExpense,
    deleteExpense,
};
