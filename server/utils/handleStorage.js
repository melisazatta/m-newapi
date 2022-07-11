const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const pathStorage = `${__dirname}/../storage`;
        callback(null, pathStorage)
    },
    filename: (req, file, callback) => {
        const ext = file.originalname.split(".").pop()
        const fileName = `img-${Date.now()}.${ext}`
        callback(null, fileName)
    }
})
//creamos el middleware
const fileUpload = multer({ storage })

module.exports = fileUpload