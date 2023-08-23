const { User } = require('../model/login')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const Usersignup = async (req, res, next) => {
  try {
    //Existing user check
    const { Name, Email, Password } = req.body;
    const existingUser = await User.findOne({ where: { email: Email } });
    if (existingUser) {
      return res.status(404).json({ message: "user already exists" });
    } else {
      //hased password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(Password, saltRounds);

      //user creation
      if (Name === null || Email === null || Password === null) {
        return res.status(500).json({ message: "check all input details are filled? " });
      } else {

        const userdetails = await User.create({
          name: Name,
          email: Email,
          password: hashedPassword
        });
        // console.log(userdetails)
        res.status(201).json({ user: userdetails })
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'something went wrong' })
  }

}

function generateAccessToken(id,name,ispremiumUser) {
  return jwt.sign({ userId: id,name:name,ispremiumUser }, 'secret');
}


const Usersignin = async (req, res, next) => {

  const { Email, Password} = req.body;

  try {

    const existingUser = await User.findOne({ where: { email: Email } });
    // console.log(existingUser)
    if (!existingUser) {
      res.status(404).json({ message: 'Email ID does not exist' })
    }

    const isPasswordValid = await bcrypt.compare(Password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(402).json({ message: 'Wrong password' });
    }

    const token = generateAccessToken(existingUser.id,existingUser.name,existingUser.isPremimum)

    res.status(201).json({ user: existingUser, token: token })
    console.log("you log in successful")


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



module.exports = {
  Usersignup,
  Usersignin,
  
}