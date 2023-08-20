const   {Expense}=require('../model/expenditure')
const {User}=require('../model/login');
const {sequelize}=require('../database/squelize')

const showLeaderBoard=async(req,res)=>{
    // const leadboard=await User.findAll();
    try {
        const leadboard=await User.findAll({
            attributes:['id','name',[sequelize.fn('SUM',sequelize.col('expenses.amount')),'total_amount']],
            //sequelize.fn('SUM(what mathmatical function i want to apply)',sequelize.col('expenses(tableName).amount')//{on which column 
        //we want to apply these mathmatical operations}),'total_amount'{this is column name as we want to store our data}
            include:[
                {
                    model:Expense,//here imported model name
                    attributes:[],
                }
            ],
            //group:[model.columnName]
            group:['userdetails.id'],
            order:[['total_amount', 'DESC']]
        })
        res.status(200).json(leadboard)
        console.log(leadboard)
    } catch (error) {
        console.log(error);
    }


}

module.exports = {
    showLeaderBoard
}