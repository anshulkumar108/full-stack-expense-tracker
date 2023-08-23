
require('dotenv').config()


var SibApiV3Sdk = require('sib-api-v3-sdk');

var defaultClient = SibApiV3Sdk.ApiClient.instance;

var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;


const apiInstance =new  SibApiV3Sdk .TransactionalEmailsApi();

var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();// SendSmtpEmail | Values to send a transactional email

const sender={
  email:'anshulme96@gmail.com'
};
const reciver=[{
  email:'anshulrajput.12021996@gmail.com'
}];

apiInstance.sendTransacEmail({
  sender,
  to:reciver,
  subject:"don,t worry i will help you to retrive password",
  textContent:"i click on link"
}).then().catch((error)=>{
  console.log(error);
});

