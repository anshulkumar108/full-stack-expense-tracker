const nodemailer = require("nodemailer");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const { User } = require("../model/login");
const ForgotpasswordRequest = require("../model/ForgotPasswordRequests");

const forgotpassword = async (req, res) => {
  try {
    const {Email} = req.body;
    console.log("email",Email)
    const user = await User.findOne({ where: { email: Email} });
    const newid = uuid.v4();
    if (user) {
      let obj = {
        id: newid,
        isactive: true,
        userdetailId: user.id,
      };
      let newobj = await ForgotpasswordRequest.create(obj);
      console.log(newobj);
    } else {
      return res.status(500).json({
        message: "No account registered with this mail id",
        sucess: false,
      });
    }
    const useremail = process.env.EMAIL;
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: useremail,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    console.log(process.env.EMAIL, process.env.EMAIL_PASSWORD);

    const mailoptions = {
      from: process.env.EMAIL,
      to: Email,
      subject: "Reset your Password",
      text: "hi welcome",
      html: `
      <p> click on link to reset password </p>
      <a href="http://localhost:5000/api/password/resetpassword/${newid}">
       http://localhost:5000/api/password/resetpassword/${newid}
       </a>`,
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

const resetpassword = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const uuid = await ForgotpasswordRequest.findOne({ where: { id: id } });
    if (uuid.id === id) {
      const user = await ForgotpasswordRequest.update(
        { isactive: false },
        { where: {} }
      );
      res.status(200).send(`<html>
    <div id="forgotPassword" class="forgot-password">
    <h2>Forgot Password</h2>
    <form id="resetPassword">
      <label for="password">New Password</label>
      <div>
        <input type="password" id="resetpassword" placeholder="new password" required />
      <button type="submit" id="reset">Reset Password</button>
    </form>
    <button id="cancelResetBtn">Cancel</button>
  </div>

  <script>
  const cancelResetBtn = document.getElementById('cancelResetBtn');
  document.getElementById('resetPassword').addEventListener('submit', async (e) => {
    e.preventDefault();
    const   resetpassword = {
       newPassword: document.getElementById('resetpassword').value,
    };

    console.log( resetpassword);
    try {
        const response = await axios.post('http://localhost:5000/api/password/updatepassword/${id}',resetpassword);
        console.log(response.data); // Handle the response data as needed
        if(res.status==200){
          window.location.href = './signin.html';
        }
    } catch (error) {
        console.error(error);
    }
    document.getElementById('resetpassword').value="";
})
  </script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</html>`);
      res.end();
    }
  } catch (error) {
    console.log(error);
  }
};

const updatepassword = async(req, res) => {
  console.log("resetpassword");
  try {
    const { newPassword } = req.body;
    const { resetpasswordid } = req.params;
    // console.log(resetpasswordid);
    // console.log(newPassword);

    try {
      const user=await ForgotpasswordRequest.findOne({ where : { id: resetpasswordid }})
      console.log("<<<<<<<<<<<<<<<<<<<<",user);
      const newUserPaword=await User.findOne({where:{id:user.userdetailId}})
      console.log("/////////////",newUserPaword);
       if(newUserPaword){
        if(user) {
          //encrypt the password
          let saltRounds=10;
          const newHashedPassword=await bcrypt.hash(newPassword,saltRounds);
          console.log(newHashedPassword);
          User.update({password:newHashedPassword},{where:{id:newUserPaword.id}});
          res.status(200).json({ newHashedPassword,message:"password changed successfully" });
        }else{
          console.log(error);
          res.status(501).json({message:"something is wrong"});
        }

   
      }
  }catch (error) {
    console.log(error);
    res.status(402).json({message:"check details"});
  }
  }catch (error) {
    console.log(error);
  }
};
module.exports = { forgotpassword, resetpassword, updatepassword };
