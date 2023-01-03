const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
        user:"awesomeblogs77@gmail.com",
        pass:"pghyhetxgcloxdsp"
    }
})
async function sendOtp(email,otp){
    try {
        let mailData = {
            from:"awesomeblogs77@gmail.com",
            to:email,
            subject:"Test mail",
            text:`Otp to login is ${otp}`
        }
        await transporter.sendMail(mailData)
    } catch (error) {
        console.log(error)
        throw "Cannot send mail"
    }
}

module.exports = {sendOtp}