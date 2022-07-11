//const { findByIdAndRemove, findByIdAndDelete } = require("./UserModel")
const User = require("./UserModel")
const { hashPassword, checkPassword } = require("../utils/handlePassword")
const { tokenSign, tokenVerify} = require("../utils/handleJWT")

//GET ALL USERS
const getAllUsers = async (req, res, next) => {
    try {
        const data = await User.find()
        res.status(200).json(data)
    } catch (err) {
        next()
    }
}

//GET USER BY ID
const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({message: 'User does not exists'})
        res.status(200).json(user)
    } catch (err) {
        next()
    }
}

//POST NEW USER
/**
 * Create User
 *
 * @param {string}      fullName
 * @param {string}      userName
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
//Register new user
const createUser = async (req, res, next) => {
    const password = await hashPassword(req.body.password)
    console.log('User ' + req.body.userName + ' created')
    const data = {
        fullName: req.body.fullName,
        userName: req.body.userName,
        email: req.body.email,
        password: password
    }

    // const tokenData = {
    //     token: await tokenSign(data),
    //     user: data
    // }
    const token = await tokenSign(data)
    User.token = token

    const newUser = new User(data)
    newUser.save((error) => {
        if (error) {
            console.log(error)
        } else res.status(201).json({ message: `User ${req.body.userName} created`, JWT: token})
    })
} //duplicado se rompe--------------------

//Login
const login = async (req, res, next) => {
         const user = await User.findOne({ email: req.body.email });
         if(!User.length) return next();  
         const passwordMatch = await checkPassword(req.body.password, user.password);
         if (passwordMatch) {
            const data = {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                fullName: user.fullName,
            }
            // const tokenData = {
            //     token: await tokenSign(data),
            //     user: data
            // }
            const token = await tokenSign(data)
            User.token = token

            res.status(200).json({ message: ` User ${user.userName} authorized`, JWT: token})         
        } else {
             let error = new Error;
             error.message = "Unauthorized"
             error.status = 401
             next(error)
             }
}

//UPDATE USER
const updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body)
        if (!user) return res.status(404).json({message: 'User does not exists'})
        console.log(`User `+user.userName+ ` Updated`) //esto lo hacemos para aprender que el método retorna el objeto si lo encuentra
        res.status(200).json({ message: "User Updated" })
    } catch (err) {
        next()
    }
}


/* 
Importación de Nodemailer y configuración del transporte
*/
const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.mailtrap_user,
        pass: process.env.mailtrap_pass
    }
});

//forgot password
const forgot = async (req, res, next) => {
    const user = await User.findOne({email: req.body.email})
    if (!User.length) return next();    
    //crear un magic-link con un token de seguridad
    const data = {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        fullName: user.fullName,
        
    }
    const token = await tokenSign(data, "15m")
    const link = `${process.env.public_url}/users/reset/${token}`
    const mailDetails = {
        from: "tech-support@mydomain.com",
        to: data.email,
        subject: 'Password recovery info',
        html: `<h2>Password Recovery Service</h2>
        <p>To reset your password please click the link and follow instructions</p>
        <a href="${link}">Click here to reset password</a>
        `
    }
    transport.sendMail(mailDetails, (err, data) => {
        if (err) {
            let error = new Error()
            next(error)
        } else res.status(200).json({ message: `Hi ${user.userName}, we've sent an email with instructions to ${user.email}` })
    })

}

//FORM -> reset password 
const reset = async (req, res, next) => {
    const { token } = req.params
    
    const tokenStatus = await tokenVerify(token)
    
    if (tokenStatus instanceof Error) {
        res.status(403).json({ message: "Token expired" })
    } else {res.send(tokenStatus)
        // res.render("reset", { tokenStatus, token })
    }
}

//Saves the new password
const saveNewPass = async (req, res, next) => {
    const { token } = req.params
    const tokenStatus = await tokenVerify(token)
    if (tokenStatus instanceof Error) return res.send(tokenStatus);
    const newPassword = await hashPassword(req.body.password_1)
    dbResponse = await changePasswordById(tokenStatus.id, newPassword)
    dbResponse instanceof Error ? next(dbResponse) : res.status(200).json({ message: `Password changed for user ${tokenStatus.userName}` })
}



//DELETE USER
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) return res.status(404).json({message: 'User does not exists'})
        res.status(202).json({message: 'User deleted'})
    } catch (error) {
        next()
    }

}

module.exports = { getAllUsers, getUserById, createUser, login, updateUser,forgot, reset, saveNewPass, deleteUser }