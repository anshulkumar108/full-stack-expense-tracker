const { User } = require('../model/login')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const Usersignup = async (req, res, next) => {
  const { Name, Email, Password } = req.body;

 
  try {
    // Existing user check
    const existingUser = await User.findOne({ where: { email: Email } });
    if (existingUser) {
      return  res.redirect('/Signin').json({ message: "User already exists" });
    } 

    //  Check if the required fields are provided
   if (!Name || !Email || !Password) {
    return res.status(400).json({ message: "Please provide all required details" });
  }


    // Hashed password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);


    // User creation
    const userdetails = await User.create({
      name: Name,
      email: Email,
      password: hashedPassword,
    });
    
    res.status(201).json({ user: userdetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
 

function generateAccessToken(id,name,ispremiumUser) {
  return jwt.sign({ userId: id,name:name,ispremiumUser }, process.env.JWT_SECRET_KEY);
}


const Usersignin = async (req, res, next) => {

  const { Email, Password} = req.body;

  try {

    const existingUser = await User.findOne({ where: { email: Email } });

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

  }catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
    console.log(error);
  }
}



module.exports = {
  Usersignup,
  Usersignin,
  
}