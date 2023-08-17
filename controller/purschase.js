const { Order } = require('../model/orders')
const Razorpay = require('razorpay');

const purchaseMemberShip = async (req, res) => {
    const rzp = new Razorpay({ key_id: 'rzp_test_eaAXI8UTVuqwMe', key_secret: 'BsFlXNdaL6YdMWXeU2pEy3IU' });
    const options = {
        amount: 50000,
        currency: "INR"
    }
    const order = await rzp.orders.create(options);
    console.log("order>>>>>>>>>", order)
//till now order is created
    try {
            const response = await Order.create({ orderid: order.id, status: 'PENDING', userdetailId: req.user.id })
            console.log(response)
            res.status(201).json({ order, key_id: rzp.key_id }) 
    }catch (error) {
            console.log(error);
        }
    }



const updatetransactionstatus = async (req, res) => {

        const { order_id, payment_id } = req.body;

        try {
            const update = await Order.update({ paymentId: payment_id, orderId: order_id, status: "successful" },{where:{userdetailId: req.user.id}})
            console.log('update>>>>>>>>>>>>>', update)
            res.status(202).json({ sucess: true, message: "transaction successful" })
        } catch (error) {
            console.log(error)
        }
    }

    module.exports = {
        purchaseMemberShip,
        updatetransactionstatus
    }