"use strict"

var jwt = require("jwt-simple");
var moment = require("moment");

var secretKey = "Esta-es-la-clave-secreta-$%&/";

exports.authtenicated = function(req, res, next){
    //Check token in the headers

    if(!req.headers.authorization){
        return res.status(400).send({
            message: "El token no fue enviado en las cabeceras"
        });
    }
    var token = req.headers.authorization.replace(/['"]+/g, "");

    //Decode token
    try{
        var payload = jwt.decode(token, secretKey);

        //Check if it's already expired
        if(payload.exp <= moment().unix()){
            return res.status(400).send({
            message: "El token ha expirado"
        });
        }

    }catch(ex){
        return res.status(400).send({
            message: "El token no es valido"
        });
    }

    req.user = payload;

    next();

}