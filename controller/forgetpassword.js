const nodemailer = require("nodemailer");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const { User } = require("../model/login");
const Forgotpassword = require("../model/ForgotPasswordRequests");

const forgotpassword = async (req, res) => {
  try {
    const { Email } = req.body;
    const user = await User.findOne({ where: { email: Email } });
    const newid = uuid.v4();
    if (user) {
      let obj = {
        id: newid,
        isactive: true,
        userdetailId: user.id,
      };
      let newobj = await Forgotpassword.create(obj);
      console.log(newobj);
    } else {
      return res.status(500).json({
        message: "No account registered with this mail id",
        sucess: false,
      });
    }
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user:'anshulme96@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
      }
    });
    console.log(process.env.EMAIL, process.env.EMAIL_PASSWORD);

    const mailoptions = {
      from:process.env.EMAIL,
      to: Email,
      subject: "Reset your Password",
      text: "hi welcome",
      html: `<a href="http://localhost:5000/password/resetpassword/${newid}">click on this link to reset your password</a>`,
    };
    console.log(mailoptions);

    transporter.sendMail(mailoptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "can not send email", success: false });
      } else {
        res
          .status(200)
          .json({ message: "email sent successfully", success: true });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const resetpassword = async (req, res) => {};

module.exports = { forgotpassword, resetpassword };
