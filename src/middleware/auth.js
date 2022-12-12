const jwt = require('jsonwebtoken');

const auth =  function(req,res,next){
    const requestToken = req.headers["x-api-key"]
    if(!requestToken){
        return res.status(400).send({status:false, message:`Token must be presetn`})
    }

    jwt.verify(requestToken,  'thisI@sSecreteKey', function(err, decoded){
        if(err){
            return res.status(401).send({status:false, message:err.message})
        }else{
            req.decodedToken = decoded
            next()
        };
    });
};

module.exports = { auth }