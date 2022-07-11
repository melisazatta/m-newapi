const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const PostSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, required: true },
    public_id: String,
    hidden: Boolean,
},
    { timestamps: true }
);

PostSchema.set("toJSON", {
    transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.public_id;
        delete ret.__v;
    }
})

PostSchema.index({ title: 'text' }) //podríamos hacer un find by title en posts/find/:query

const Post = mongoose.model("Post", PostSchema)
module.exports = Post