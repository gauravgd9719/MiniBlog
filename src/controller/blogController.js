
const blogModal = require('../model/blogModel')
const {validator} = require('../utils')

const blogs = async function(req,res){
    try{
        const requestData = req.body;
        const {title, body, authorId, category } = requestData

        //validations start
        if(!validator.isValidRequestBody(requestData)){
            return res.status(400).send({status:false, message:`Provide Blog Basics Details`})
        }

        if (!title) {
            return res.status(400).send({ status: false, message: `Title is mandatory` });
        }
        if (!body) {
            return res.status(400).send({ status: false, message: `Body is mandatory` });
        }
        if (!authorId) {
            return res.status(400).send({ status: false, message: `AuthorId  is a required field` });
        }
        if (!category) {
            return res.status(400).send({ status: false, message: `Category is mandatory` });
        }

        if(!validator.validObjectId(authorId)){
            return res.status(400).send({status:false, message:`This ${authorId} is not valid authorId`})
        }
        // validation End 

        const createBlogs  = await blogModal.create(requestData)
        res.status(200).send({status:true, data: createBlogs})

    }catch(error){
        res.status(500).send({status:false, message: error.message})
        return
    }
}

const getBlogs = async function(req,res){
    try{
        const queryData = req.query;
        const {authorId, category, tags, subcategory} = queryData
        const filter = {isDeleted: false, isPublished: true}

        if(!authorId && !category && !tags && !subcategory){
            let allBlogsData = await blogModal.find(filter)
            res.status(200).send({status:true, data: allBlogsData})
            return
        }

        if(authorId){
            filter.authorId = authorId
        }

        if(authorId){
            if(!validator.validObjectId(authorId)){
                return res.status(400).send({status:false, message:`${authorId} not valid authorId`})
            }
        }
        
        if(category){
            filter.category = category
        }
        if(tags){
            filter.tags = tags
        }
        if(subcategory){
            filter.subcategory = subcategory
        }

        const blogsData = await blogModal.find({filter})

        if(blogsData.length == 0){
            return res.status(404).send({status:false, message:`Blogs Not Found`})
        }

        res.status(200).send({status:true, data: blogsData})
        return

    }catch(err){
        res.status(500).send({status:false, message:err.message})
    }
}


module.exports = {
    blogs,
    getBlogs
}