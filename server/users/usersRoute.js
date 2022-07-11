const router = require("express").Router()
const { validatorCreateUser, validatorModifyUser, validatorResetPassword } = require("../validators/users")
const { getAllUsers, getUserById, createUser, login, forgot, reset, saveNewPass, updateUser, deleteUser } = require("./usersController")

router.get("/", getAllUsers)
router.get("/:id", getUserById)
router.post("/register",validatorCreateUser, createUser)
router.post("/login", login)
 //Forgot password
 router.post("/forgot-password", forgot)
 //Get Magic Link
router.get("/reset/:token", reset);
router.post("/reset/:token", validatorResetPassword, saveNewPass)

router.patch("/:id", validatorModifyUser, updateUser)
router.delete("/:id", deleteUser)

module.exports = router