const jwt = require("jsonwebtoken");
const { User } = require('../model/login');

async function userauthenticate(req, res, next) {
    const token = req.header('Authorization')
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized users" });
    }
    const user = jwt.verify(token, 'secret');
    //output of this above line is  { userId: 2, iat: 1692093001 }
    // console.log("userId>>>>>>",user.userId);
    try {
      const responseUser=  await User.findByPk(user.userId)
      console.log("responseUserId>>>>>>",responseUser.id);
            req.user = responseUser
            next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "Token is not valid" });
    }
}
module.exports = {userauthenticate}