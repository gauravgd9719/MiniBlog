const express = require('express');
const router = express.Router();

const authticate = require('../middleware/auth')
const authorContr = require('../controller/authorController')
const blogContr = require('../controller/blogController')




router.post('/authors', authorContr.author)
router.post('/login', authorContr.loginAuthor)

router.post('/blogs',authticate.authentication, blogContr.blogs)
router.get('/blogs', authticate.authentication, blogContr.getBlogs)
router.put('/blogs/:blogId',authticate.authentication, blogContr.updateBlogs)
router.delete('/blogs/:blogId',authticate.authentication, blogContr.deleteBlogs)
router.delete('/blogs', authticate.authentication, blogContr.deleteByQuery)




router.all("/*",function(req,res){
    res.status(404).send({msg:"invalid http request"})
})

module.exports = router;