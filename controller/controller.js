const {Expense}=require('../model/expModel');

const  getUser = async (req, res, next) =>{
    try {
       let usersDetails = await Expense.findAll();
        res.status(200).json({ usersDetails });
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log(1);
    console.log(userId);
    await Expense.destroy({ where: { id: userId } });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
const updateUser= async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { amount, Description, Category } = req.body;

    await Expense.update(
      { amount, description: Description, category: Category },
      { where: { id: userId } }
    );
    return res.sendStatus(200);
  } catch (error) {
    console.log(error)
    return res.status(500).json(error);
  }
}
const addUser=async(req,res,next)=>{
    try {
        // if(!req.body.Phone){
        //     throw new Error('phone is required')
        // }
        const amount=req.body.amount;
        const description=req.body.Description;
        const category=req.body.Category;
        console.log(req.body);
        const data=await Expense.create({   amount:amount,  description:description,   category:category})
        res.status(200).json({data});
        // console.log(data)
        
    } catch (error) {
        console.log(error);
    }
}



module.exports={
    getUser,
    deleteUser,
    addUser,
    updateUser,
    
}