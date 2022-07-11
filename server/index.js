const express = require("express")
const cors = require("cors")
require("dotenv").config()
const port = process.env.PORT || 3030
require('./DB_Config/db')

const server = express()
server.use(express.json());
server.use(express.urlencoded({ extended: true }))
server.use(express.static("storage"))
server.use(cors())

server.use("/users", require("./users/usersRoute"))
server.use("/posts", require("./posts/postRoute"))

server.get("/", (req, res)=> res.send("MZ API"))


//404
server.use((req, res, next) => {
    let error = new Error("Resource not found");
    error.status = 404
    next(error)

})

//Error handler
server.use((error, req, res, next) => {
    if (!error.status) {
        error.status = 500
        error.message = "Internal Server Error"
    }

    res.status(error.status).json({ status: error.status, message: error.message })
})

server.listen(port, (err) => {
    err ? console.log(`Error: ${err}`) : console.dir(`Server running on port http://localhost:${port}`)
})

//server.listen(3000, (err) => {
//    err ? console.dir("Server failed...") : console.dir("Server running on port http://localhost:3000")
//})
