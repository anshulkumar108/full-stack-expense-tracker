const {Expense}=require('../model/expenditure');
const authenticate=require('../middleware/auth')

const addExpense=async (req,res,next)=>{
 try {
    const {Amount,Description,Category}=req.body;

    const PostData=await Expense.create({ amount:Amount,description:Description, category:Category , userdetailId:req.user.id,authenticate})
  console.log(">>>>",PostData ,">>>>>.")  
    res.status(201).json({PostData})

 } catch (error) {
    console.log(error);
    res.status(501).json({message:"failed to post data"});
 }
}
const fetchExpense=async(req,res,next)=>{
    try {
        const Details=await Expense.findAll();
        res.status(201).json({Details})  
        console.log(Details) 
    } catch (error) {
        console.log(error);
        res.status(404).json({message:"failed to fetch details"})
    }
}

const deleteExpense=async(req,res,next)=>{
    try {
        const userId=req.params.id;
        console.log(userId)
        await Expense.destroy({ where: { id: userId } });
       return res.status(201).json({message:"expense deleted successfully  having"})
    } catch (error) {
        console.log(error)
    }
}
module.exports={
    addExpense,
    fetchExpense,
    deleteExpense
}
