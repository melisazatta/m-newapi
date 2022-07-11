const { tokenVerify } = require("./handleJWT")

const isAuth = async (req, res, next)=> {
    // try{
        if (!req.headers.authorization) {
            let error = new Error("No token provided")
            error.status = 403
            return next(error)
        }
        const token = req.headers.authorization.split(" ").pop()
        const validToken = await tokenVerify(token)
        if (validToken instanceof Error) {
            let error = new Error ("Invalid or expired Token")
            error.status = 403
            return next(error)
        }
        req.user = validToken
        next()

    // } catch (error) {
    //     error.status = 401
    //     error.message = "Forbidden"
    //     return next(error)
    // }    
}

module.exports = isAuth