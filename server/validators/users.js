const { check, validationResult } = require("express-validator");

const validatorCreateUser = [
    check("fullName")
    .trim()
    .notEmpty().withMessage("Field cannot be empty")
    .isAlpha('es-ES', { ignore: ' ' }).withMessage("Only letters")
    .isLength({ min: 2, max: 90 }).withMessage("Character count: min 2, max 90"),
    check("userName")
    .trim()
    .notEmpty().withMessage("Field cannot be empty")
    .isAlpha('es-ES', { ignore: ' ' }).withMessage("Only letters")
    .isLength({ min: 2, max: 90 }).withMessage("Character count: min 2, max 90"),
    check("email")
    .trim()
    .notEmpty().withMessage("Field cannot be empty")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(),
    check("password")
    .trim()
    .notEmpty().withMessage("Field cannot be empty")
    .isLength({ min: 8, max: 15 }).withMessage("Character count: min 8, max 15"),
    (req, res, next) => {
        try {
            validationResult(req).throw()
            return next() //si pasa validaciones, sigue hacia el controlador
        } catch (err) {
            res.status(400).send({ errors: err.array() })
        }
    }
]
const validatorModifyUser = [
    check("fullName")
    .optional()
    .trim()
    .notEmpty().withMessage("Field cannot be empty")
    .isAlpha('es-ES', { ignore: ' ' }).withMessage("Only letters")
    .isLength({ min: 2, max: 90 }).withMessage("Character count: min 2, max 90"),
    check("userName")
    .trim()
    .notEmpty().withMessage("Field cannot be empty")
    .isAlpha('es-ES', { ignore: ' ' }).withMessage("Only letters")
    .isLength({ min: 2, max: 90 }).withMessage("Character count: min 2, max 90"),
    check("email")
    .optional()
    .trim()
    .notEmpty().withMessage("Field cannot be empty")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(),
    check("password")
    .optional()
    .trim()
    .notEmpty().withMessage("Field cannot be empty")
    .isLength({ min: 8, max: 15 }).withMessage("Character count: min 8, max 15"),
    (req, res, next) => {
        try {
            validationResult(req).throw()
            return next() //si pasa validaciones, sigue hacia el controlador
        } catch (err) {
            res.status(400).send({ errors: err.array() })
        }
    }
]

const validatorResetPassword = [
    check("password_1")
    .isLength({ min: 8, max: 15 }).withMessage("Character count: min 8, max 15")
    .trim(),
    check("password_2")
    .custom(async(password_2, { req }) => {
        if (req.body.password_1 !== password_2) {
            throw new Error('Passwords must be identical')
        }
    }),
    (req, res, next) => {
        const token = req.params.token
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const arrWarnings = errors.array()
            console.log(arrWarnings)
            res.render("reset", { arrWarnings, token })
        } else {
            return next()
        }
    }
]

module.exports = { validatorCreateUser, validatorModifyUser, validatorResetPassword }