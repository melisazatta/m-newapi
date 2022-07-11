const mongoose = require("mongoose")
//Creamos un esquema de MongoDB usando el constructor Schema
const Schema = mongoose.Schema;
//creamos una instancia del esquema (Schema)
const UserSchema = new Schema({
    fullName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    timestamps: true //agrega created & updated at
})

//Reformateamos la response que expone el endpoint
UserSchema.set("toJSON", {
    transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
    }
})

//Mongo DB model
const User = mongoose.model("User", UserSchema)

module.exports = User
