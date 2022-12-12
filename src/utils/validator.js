const mongoose = require("mongoose");

const isValidRequestBody = function(validBody){
    return Object.keys(validBody).length > 0
}

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validateEmail = function(email) {
    return emailRegex.test(email)
};

const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

let nameString = function(name){
    return /[A-Za-z]/.test(name)
}

const validObjectId = function(objectId){
    return mongoose.isValidObjectId(objectId)
}

module.exports = {
     isValidRequestBody , 
     validateEmail,
     isValid,
     nameString,
     validObjectId
}

