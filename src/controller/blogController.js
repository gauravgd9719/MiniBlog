

const blogModel = require('../model/blogModel')
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

        const createBlogs  = await blogModel.create(requestData)
        res.status(200).send({status:true, data: createBlogs})

    }catch(error){
        res.status(500).send({status:false, message: error.message})
        return
    }
}

const getBlogs = async function(req,res){
    try{
        const {authorId, category, tags, subcategory} = req.query
        
        const filter = { isDeleted: false, isPublished: true }

        if(!authorId && !category && !tags && !subcategory){
            let allBlogsData = await blogModel.find(filter)
            res.status(200).send({status:true, data: allBlogsData})
            return
        }

        if(authorId){
            filter.authorId = authorId
        }

        if(req.query.authorId){
            if(!validator.validObjectId(req.query.authorId)){
                return res.status(400).send({status:false, message:`${authorId} not valid authorId`})
            }else{
                req.query.authorId = authorId
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

        const blogsData = await blogModel.find({filter})

        if(blogsData.length == 0){
            return res.status(404).send({status:false, message:`Blogs Not Found`})
        }

        res.status(200).send({status:true, data: blogsData})
        return

    }catch(err){
        res.status(500).send({status:false, message:err.message})
    }
}



const updateBlogs = async function(req,res){
    try{
        let data = req.body;
        let blogId = req.params.blogId;

        //authorisation
        const decodedToken = req.decodedToken.userId

        if(!blogId){
            return res.status(400).send({status:false, message:`blogId required`})
        }

        if(!validator.validObjectId(blogId)){
            return res.status(400).send({status:false, message:`${blogId} invalid blogId`})
        }


        //==
        const findAuthorId = await blogModel.findById(blogId).select({authorId:1, _id:0})
        const author = findAuthorId.authorId.toString();

        if(decodedToken != author){
            return res.status(403).send({status:false, message:`Not authorised you are! for changes this blogs`})
        }
        //==

        let updateData = await blogModel.findOneAndUpdate(
            {_id: blogId, isDeleted:false},
            { 
                $set: {title: data.title, body: data.body, publishedAt: new Date() ,isPublished: true},
                $addToSet: {tags: data.tags, subcategory: data.subcategory}
            },
            {new:true}
            )

            res.status(200).send({status:true, data: updateData})

    }catch(error){
        res.status(500).send({status:false, message:error.message})
        return
    }
}

const deleteBlogs = async function(req,res){
    try{
        const blogId = req.params.blogId;
        const decodedToken = req.decodedToken.userId

        if(!blogId){
            return res.status(400).send({status:false, message:`BlogId is required`})
        }
        if(!validator.validObjectId(blogId)){
            return res.status(400).send({status:false, message:`This ${blogId} is invalid blogId`})
        }

        let CheckBlogId = await blogModel.findById({_id: blogId})

        if(!CheckBlogId || CheckBlogId.isDeleted== true){
            return res.status(404).send({status:false, message:`Blog is alread deleted`})
        }

        //==
        const findAuthorId = await blogModel.findById(blogId).select({authorId:1,_id:0})
        const author = findAuthorId.authorId.toString();
    
        if(decodedToken != author){
            return res.status(403).send({status:false,msg:"You are not Authorised for doing operations on this blogs"})
        }
        //== 

         const deleteBlog = await blogModel.findOneAndUpdate(
            { _id: blogId },
            { $set: { isDeleted: true, deletedAt: Date.now() } },
            { new: true }
          );

         res.status(200).send({status:true, message:`Deleted Successfully`})

    }catch(error){
        res.status(500).send({status:false, message:error.message})
        return
    }
}

const deleteByQuery = async function (req, res) {
    try {
      const data = req.query;
      const filterQuery = { isPublished: false, isDeleted: false }
      const { category, tags, subcategory, authorId } = data;
      const decodedToken = req.decodedToken.userId

  
      if (!validator.isValidRequestBody(data)) {
        return res.status(400).send({ status: false, msg: "Please Give at least One Query/filter" })
      }
  
      //authorisations --->
      if (authorId) {
        if (authorId == decodedToken) {
          filterQuery.authorId = authorId
        }
        else {
          return res.status(404).send({ msg: "user is not authorised for this operation" })
        }
      }
      else {
        filterQuery.authorId = decodedToken
      }

      if (authorId) {
        if (!validator.validObjectId(authorId)) {
          return res.status(400).send({ status: false, msg: "Please enter a valid author id" })
        }
      }
  
      ///--->
      if (category) {
        filterQuery.category = category
      }
      if (tags) {
        filterQuery.tags = tags
      }
      if (subcategory) {
        filterQuery.subcategory = subcategory
      }
  
      const deleteData = await blogModel.updateMany(filterQuery, { $set: { isDeleted: true, deletedAt: new Date() } })
  
      if (deleteData.modifiedCount == 0) {
        return res.status(404).send({ msg: "Document not found" })
      }
  
      return res.status(200).send({ status: true, msg: "Sucessfully deleted" })
    }
    catch (err) {
      return res.status(500).send({ status: false, msg: err.message });
    }
  
  }





module.exports = {
    blogs,
    getBlogs,
    updateBlogs,
    deleteBlogs,
    deleteByQuery
}



// getBlogs?


