const {Expense}=require('../model/expenditure');

const addExpense=async(req,res,next)=>{
 try {
    const {Amount,Description,Category}=req.body;
    // console.log( Amount)
    // console.log(Description)
    const PostData=await Expense.create({ amount:Amount,description:Description, category:Category})
  //console.log(PostData)  
    res.status(201).json({PostData})

 } catch (error) {
    console.log(error);
    res.status(501).json({message:"failed to post data"})
 }
}
const fetchExpense=async(req,res,next)=>{
    try {
        const Details=await Expense.findAll();
        res.status(201).json({message:"data fetch successfully"})  
        console.log(Details) 
    } catch (error) {
        console.log(error);
        res.status(404).json({message:"failed to fetch details"})
    }

}
module.exports={
    addExpense,
    fetchExpense,
}
