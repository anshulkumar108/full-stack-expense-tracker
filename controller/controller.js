const {Expense}=require('./model/expModel');

const  getUser = async (req, res, next) =>{
    try {
       let usersDetails = await Users.findAll();
        console.log(usersDetails)
        res.status(200).json({ usersDetails });
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

const deleteUser = async (req, res, next) => {
    try {
      if (req.params.id === undefined) {
        return res.status(400).json({
          err: 'ID is missing'
        });
      }
      
      const userId = req.params.id;
      await Users.destroy({ where: { id: userId } });
      
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };

const addUser=async(req,res,next)=>{
   console.log('1')
    try {
        // if(!req.body.Phone){
        //     throw new Error('phone is required')
        // }
        const amount=req.body.amount;
        const description=req.body.description;
        const category=req.body.category;
console.log(amount, description, category);
        const data=await Users.create({   amount:amount,  description:description,   category:category})
        res.status(200).json({newUserDetail:data});
        
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    getUser,
    deleteUser,
    addUser,
}