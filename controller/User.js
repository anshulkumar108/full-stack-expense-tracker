const { User } = require('../model/login')
const bcrypt = require('bcrypt');

const Usersignup = async (req, res, next) => {
  try {
    const { Email } = req.body;
    const email = await User.findOne({ where: { email: Email } });
    if (email) {
      res.status(404);
      console.log('email id alrady exists')
    } else {
      const { Name, Email, Password } = req.body

      // @param data — The data to be encrypted.

      // @param saltOrRounds
      // The salt to be used in encryption. If specified as a number then a salt will be generated with the specified number of rounds and used.

      // @return — A promise to be either resolved with the encrypted data salt or rejected with an Error
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(Password, saltRounds);

      const userdetails = await User.create({ name: Name, email: Email, password: hashedPassword })
      console.log(userdetails)
      res.status(201).json({ userdetails });
    }

  } catch (error) {
    console.log(error);
  }

}

const Usersignin = async (req, res, next) => {

  try {
    const { Email, Password } = req.body;
    console.log(Password)
    const user = await User.findOne({ where: { email: Email } });

    if (!user) {
      res.status(404).json({ message: 'Email ID does not exist' })
      console.log('email id does not exists')

    } else {
      const userPassword = Password;
      const isPasswordValid = await bcrypt.compare(Password, user.password);

      console.log(isPasswordValid)

      if (!isPasswordValid) {
        res.status(402).json({ message: 'Wrong password' });
      } else {
        res.status(201).json({ message: "you log in successful" })
        console.log("you log in successful")
      }
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  Usersignup,
  Usersignin
}