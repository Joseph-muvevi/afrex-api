const ErrorResponse = require("../utils/errorResponse");
const Blog = require("../models/blogs");

// post a blog
exports.postBlog = async (req, res, next) => {
    const {author, title, images, paragraphBlock, listBlock, tags} = req.body

    try {
        const blogTitle = await Blog.findOne({title})

        if(blogTitle) {
            return next(new ErrorResponse("There is a blog with this title, please choose another title", 400))
        }

        const contentBlocks = await Blog.findOne({paragraphBlock, listBlock})

        if(contentBlocks){
            return next(new ErrorResponse("There is a blog with similar paragraph block or list blocks", 400))
        }

        const blog = await Blog.create({author, title, images, paragraphBlock, listBlock, tags})

        res.status(201).json({
            success: true,
            data: blog
        })

    } catch (error) {
        next(error)
    }
}