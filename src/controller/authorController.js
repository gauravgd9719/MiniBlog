const authorModel = require('../model/authorModel')
const jwt = require('jsonwebtoken')
const {validator} = require('../utils')


const author  = async function(req,res){
    try{
        let requestBody = req.body;
        let { fname, lname, title, email, password} = requestBody

        //validations start

        if(!validator.isValidRequestBody(requestBody)){
            return res.status(400).send({status:false, message:`Provide basics details`})
        }

        if(!title){
            return res.status(400).send({status:false, message :`Title is required`})}
        if(!fname){
            return res.status(400).send({status:false, message :`FullName is required`})}
        if(!lname){
            return res.status(400).send({status:false, message :`LastName is required`})}
        if(!email){
            return res.status(400).send({status:false, message :`Email is required`})}
        if(!password){ 
            return res.status(400).send({status:false, message :`Password is required`})}

        if(title != "Mr" && title != "Mrs" && title != "Mrs"){
            return res.status(400).send({status:false, message:`Title must be Mr/Mrs/Miss`})
        } 
        
        if(!validator.nameString(fname)){
            return res.status(400).send({status: false, message: `Enter correct first name`})
        }
        if(!validator.nameString(lname)){
            return res.status(400).send({status: false, message: `Enter correct last name`})
        }
        
        if(!validator.validateEmail(email)){
            return res.status(400).send({status:false, message:`This ${email} is not a valid email`})
        }

        let checkEmail = await authorModel.findOne({email:email})
        if(checkEmail){
            return res.status(400).send({status:false, message:`This ${email} is already registered`})
        }

        //validation End

        const createAuthor = await authorModel.create(requestBody)
        res.status(201).send({status:true, data:createAuthor})

    }catch(error){
        res.status(500).send({status:false, message: error.message})
        return
    }
}


const loginAuthor = async function(req,res){
    try{
        let loginCredential = req.body;
        let { email, password } = loginCredential;

        if(!validator.isValidRequestBody(loginCredential)){
            return res.status(400).send({status:false, message:`Enter Email Or Password`})
        }
         
        if(!email){
            return res.status(400).send({status:false, message:`Enter Your Email`})
        }
        if(!password){
            return res.status(400).send({status:false, message:`Enter Your Password`})
        }

        let author = await authorModel.findOne({ email:email, password: password })
        if(!author){
            return res.status(404).send({status:false, message:`Author Not Found`})
        }

        const token = jwt.sign({userId: author._id},
            'thisI@sSecreteKey')
        return res.status(200).send({status:true, data:{token:token}})    
            
    }catch(error){
        res.status(500).send({status:false, message:error.message})
        return
    }
}


module.exports = { author, loginAuthor }