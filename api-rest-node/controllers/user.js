"use strict"
var User = require("../models/user");
var validator = require("validator");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");
var fs = require("fs");
var path = require("path");

var controller ={
    save: function(req, res){
        //get data
        var params = req.body;

        if(params.email && params.name && params.surname && params.password){ 
            //Validate data
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);

            if(validate_email && validate_name && validate_password && validate_surname){
                //Check if user already exists
                User.findOne({email: params.email}, (err, foundUser)=>{
                    if(err){
                        return res.status(500).send({
                            message: "Error al comprobar si el usuario ya existe",
                            status: "error"
                        });
                    }

                    if(!foundUser){
                        //Encrypt password
                        bcrypt.hash(params.password, null, null, (err, hash)=>{
                            if(err){
                                return res.status(500).send({
                                    message: "Error al encriptar la contraseña",
                                    status: "error"
                                });
                            }

                            if(hash){
                                var user = new User();
                                user.email = params.email;
                                user.name = params.name;
                                user.surname = params.surname;
                                user.password = hash;

                                //save user
                                user.save((err, savedUser)=>{
                                    if(err){
                                        return res.status(500).send({
                                            message: "Error al guardar el usuario",
                                            status: "error"
                                        });
                                    }

                                    if(!savedUser){
                                        return res.status(400).send({
                                            message: "No se guardo el usuario",
                                            status: "error"
                                        });
                                    }

                                    return res.status(200).send({
                                        user: savedUser,
                                        status: "success"
                                    });
                                }); //Close save
                            }
            
                        }); //Close bcrypt
                        
                    }
                });
            
            }else{
                return res.status(400).send({
                    message: "No envio los datos correctamente",
                    status: "error"
                });
            }
        }else{
            return res.status(400).send({
                message: "No envio todos los datos requeridos",
                status: "error"
            });
        }
        
    },

    login: function(req, res){
        //Get data
        var params = req.body;

        //Validate data
        var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validate_password = !validator.isEmpty(params.password);

        if(!validate_email && !validate_password){
            return res.status(400).send({
                message: "No envio los datos correctamente",
                status: "error"
            });
        }
        //Find user
        User.findOne({email: params.email.toLowerCase()}, (err, user)=>{
            if(err){

                return res.status(500).send({
                    message: "Error al identificarse",
                    status: "error"
                }); 
                
            }
            
            if(!user){

                return res.status(400).send({
                    message: "El usuario no existe",
                    status: "error"
                }); 
                
            }

            //Compare password
            bcrypt.compare(params.password, user.password, (err, check)=>{
                if(check){
                    //return token
                    if(params.getToken){
                        return res.status(200).send({
                            token: jwt.createToken(user),
                            
                        }); 
                    }
                    
                    //Return user
                    return res.status(200).send({
                        status: "success",
                        user: user
                    }); 
                }else{
                    return res.status(400).send({
                        message: "Los datos no son correctos",
                        status: "error"
                    }); 
                }
            });
                
            

            
        });


        
    },

    update: function(req, res){

        //Get data
        var params = req.body;
        try{
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        }catch(ex){
            return res.status(400).send({
                message: "Los datos no fueron enviados correctamente",
            }); 
        }

        //Check if email already exists
            User.findOne({email: params.email.toLowerCase()}, (err, foundUser)=>{
                if(err){

                    return res.status(500).send({
                        message: "Error al verificar la duplicidad del email",
                    }); 
                    
                }
                
               
    
               if(!foundUser || foundUser._id == req.user.sub){
                     //Update user
                    User.findOneAndUpdate({_id: req.user.sub}, params, {new: true}, (err, user)=>{
                        if(err){

                            return res.status(500).send({
                                message: "Error al actualizar el usuario",
                            }); 
                            
                        }
                        
                        if(!user){

                            return res.status(400).send({
                                message: "El usuario no se actualizo",
                            }); 
                            
                        }

                        return res.status(200).send({
                            message: "Usuario actualizado exitosamente",
                            status: "success",
                            user: user,
                            changes: params
                        });

                    });
                }

                else if(foundUser && foundUser.email == params.email && foundUser._id != req.user.sub){
    
                    return res.status(400).send({
                        message: "El email ya existe",
                        
                    }); 
                    
                }
            });
        
           

        
        
    },
    
    uploadAvatar: function(req, res){
        //Configured connect-multiparty middleware to save image

        //Check if image is in the request
        if(!req.files.file0){
            return res.status(400).send({
                message: "La imagen no fue enviada",
                status: "error"
            }); 
        }

        var userId = req.user.sub;
        //Get filename and extension
        var file_path = req.files.file0.path;
        var splitfile = file_path.split("\\");
        var filename = splitfile[2];
        var ext_split = splitfile[2].split(".");
        var extension = ext_split[1];
        console.log(extension);
        console.log(file_path);
        console.log(filename);


        //Check image extension
        if(extension != "jpg" && extension != "jpeg" && extension != "png" && extension != "gif"){
            fs.unlink(file_path, (err)=>{

                return res.status(200).send({
                        message: "La extension del archivo no es valida",
                        status: "error"
                    }); 
                });
        }else{
            //Save on database
            User.findOneAndUpdate({_id: userId}, {image: filename}, {new: true}, (err, userUpdated)=>{
                if(err || !userUpdated){

                    return res.status(500).send({
                        message: "Error al actualizar el usuario",
                        status: "error"
                    }); 
                    
                }

                return res.status(200).send({
                    message: "Imagen guardada exitosamente",
                    status: "success",
                    user: userUpdated
                });

            });
        }
    },

    avatar: function(req, res){
        var filename = req.params.filename;
        var file_path = "./uploads/users/"+filename;

        fs.exists(file_path, (exists)=>{
            if(exists){
                return res.sendFile(path.resolve(file_path));
            }else{
                return res.status(400).send({
                    message: "No existe la imagen"
                });
            }
        })
    },

    getUsers: function(req, res){
        User.find().exec((err, users)=>{
            if(err || !users){
                return res.status(400).send({
                    message: "No existen usuarios registrados",
                    status: "error"
                }); 
            }

            return res.status(200).send({
                status: "success",
                users: users
            }); 
        });
    },

    getUser: function(req, res){
        var userId = req.params.id;
        User.findById(userId, (err, user)=>{
            if(err || !user){
                return res.status(400).send({
                    message: "No existe el usuario",
                    status: "error"
                }); 
            }

            return res.status(200).send({
                status: "success",
                user: user
            }); 
        });
    }
}

module.exports = controller;