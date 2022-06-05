// nodemailer
const nodemailer = require("nodemailer");

module.exports = async function sendDataMail(data, result) {
  let letter = "<h2>Ваш заказ в магазине ....</h2>";
  let totalPrice = 0;

  for (let i = 0; i < result.length; i++) {
    letter += `<p>${result[i]["name"]} - ${data.key[result[i]["id"]]} - ${
      result[i]["cost"] * data.key[result[i]["id"]]
    } uah </p>`;
    totalPrice += result[i]["cost"] * data.key[result[i]["id"]];
  }

  // making a letter
  letter += "<hr>";
  letter += `Сумма заказа: ${totalPrice}`;
  letter += "<hr>";
  letter += `<hr>
                  Имя - ${data.userName} </br>
                  Номер телефона - ${data.phoneNumber}`;
  letter += ` <hr>
                  Данные для отправки - ${data.adress}</br>
                <hr>  
                  `;

  // create test account
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let mailOption = {
    from: "<creatuseandr@icloud.com>",
    to: data.email,
    subject: "shop order",
    text: letter,
    html: letter,
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOption);

  console.log("MessageSent: %s", info.messageId);

  // getting URL for watching message
  console.log("PreviewSent: %s", nodemailer.getTestMessageUrl(info));

  return true;
};
