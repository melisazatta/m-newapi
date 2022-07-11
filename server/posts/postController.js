const Post = require("./postModel")
const fs = require("fs-extra")
//const {matchedData} = require("express-validator")

const Cloudinary = require("cloudinary")
Cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//GET ALL POSTS
const getAllPosts = async (req, res, next) => {
    try {
        const data = await Post.find()
        res.status(200).json(data)
    } catch (err) {
        next()
    }
}

//GET POST BY ID
const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({message: 'Post does not exists'})
        res.status(200).json(post)
    } catch (err) {
        next()
    }
}

//POST NEW POST
const createPost = async (req, res) => {
    // const image = `${process.env.public_url}/${req.file.filename}`
    const result = await Cloudinary.v2.uploader.upload(req.file.path)
    const newPost = new Post({ ...req.body, image: result.url, public_id: result.public_id });
        await newPost.save((error) => {
        if (error) {
            console.log(error);            
        } else res.status(200).json({message:'Post created'})
    });
    console.log(result)
    await fs.unlink(req.file.path)
};

const searchTitleByText = (req, res) => {
    const { query } = req.params
    Post.find({ $text: { $search: query } }, (err, result) => {
        if (err) return next()
        if (result) return res.status(200).send(result)
    })
}

//UPDATE POST
const updatePost = async (req, res, next) => {
    try {
        // const image = `${process.env.public_url}/${req.file.filename}`
          const result = await Cloudinary.v2.uploader.upload(req.file.path)
        const post = await Post.findByIdAndUpdate(req.params.id, {...req.body, image: result.url, public_id: result.public_id})      
        if (!post) return res.status(404).json({message: 'Post does not exists'})
        console.log(post) //esto lo hacemos para aprender que el método retorna el objeto si lo encuentra
        res.status(200).json({ message: "Post Updated" })
    } catch (err) {
        next()
    }
    await fs.unlink(req.file.path)
}
//DELETE POST
const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id )
        if (!post) return res.status(404).json({message: 'Post does not exists'})        
        const result = await Cloudinary.v2.uploader.destroy(post.public_id)
        console.log(result)
        res.status(202).json({message: 'Post deleted'})
    } catch (err) {
        next()
    }

}

module.exports = {getAllPosts, getPostById, createPost, searchTitleByText, updatePost, deletePost }