const { Expense } = require('../model/expenditure')
const { User } = require('../model/login');
const { sequelize } = require('../database/squelize')

const showLeaderBoard = async (req, res) => {
    try {
        const leadboard = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'total_amount']],
            //sequelize.fn('SUM(what mathmatical function i want to apply)',sequelize.col('expenses(tableName).amount')//{on which column 
            //we want to apply these mathmatical operations}),'total_amount'{this is column name as we want to store our data}
            include: [
                {
                    model: Expense,//here imported model name
                    attributes: [],
                }
            ],
            //group:[model.columnName]
            group: ['userdetails.id'],
            order: [['total_amount', 'DESC']]
        })
        res.status(200).json(leadboard)
        console.log(leadboard)
    } catch (error) {
        console.log(error);
    }
}


//brute force approach
// const showLeaderBoard=async(req,res)=>{
//     try{
// const user=await User.findAll({
//     attributes:['userdetailId','name',[sequelize.fn('SUM',sequelize.col('expenses.amount')),'total_amount']]
//      include:[
//     {
//         model:Expense,//here imported model name
//         attributes:[],
//     }
//      group:['expenses.id'],//we don't use this because it give total amount of all those user which have added expense
//      it will not give for empty data of expense
//      group: ['userdetails.id'],
//      order:[['total_amount', 'DESC']]
// ],
// });
// const expense=await Expense.findAll({
//     attributes:['userdetailId',[sequelize.fn('SUM',sequelize.col('expenses.amount')),'total_amount']];
//     group:['userdetailId']
// });

// const ExpensesSorted={};
// expense.forEach(expenses => {
// if(ExpensesSorted[expenses.userdetailId]){
//     ExpensesSorted[expenses.userdetailId]=ExpensesSorted[expenses.userdetailId]+expenses.amount;
// }else{
//     ExpensesSorted[expenses.userdetailId]=expenses.amount;
// }
// });
// console.log(ExpensesSorted);
// const userSorted=[];
// user.forEach(expenses => {
//     userSorted.push({name:expenses.name,Total_amount:ExpensesSorted[expenses.id]})

// });
// userSorted.sort((a,b)=>b.Total_amount-a.Total_amount)
// res.status(200).json(userSorted);
//     }catch(error){
// console.log(error);
//     }
// }

module.exports = {
    showLeaderBoard
}