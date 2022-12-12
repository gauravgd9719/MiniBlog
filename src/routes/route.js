const express = require('express');
const router = express.Router();

const authticate = require('../middleware/auth')
const authorContr = require('../controller/authorController')
const blogContr = require('../controller/blogController')




router.post('/authors', authorContr.author)
router.post('/login', authorContr.loginAuthor)

router.post('/blogs',authticate.auth, blogContr.blogs)
router.get('/blogs', authticate.auth, blogContr.getBlogs)




router.all("/*",function(req,res){
    res.status(404).send({msg:"invalid http request"})
})

module.exports = router;