const jwt = require('jsonwebtoken');

const authentication =  function(req,res,next){
    const token = req.headers["x-api-key"]
    if(!token){
        return res.status(400).send({status:false, message:`Token must be present`})
    }

    jwt.verify(token, 'thisI@sSecreteKey', function(err, decoded){
        if(err){
            return res.status(401).send({status:false, message:`enter valid token`})
        }else{
            req.decodedToken = decoded
            next()
        };
    });
};


module.exports = { authentication }