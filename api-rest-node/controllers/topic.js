"use strict"
var Topic = require("../models/topic");
var validator = require("validator");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");
var fs = require("fs");
var path = require("path");

var controller ={
    save: function(req, res){
        //get data
        var params = req.body;

       try{
            //Validate data
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);
        }catch(error){
            return res.status(400).send({
                message: "Los datos no fueron enviados correctamente",
                status: "error"
            });
        }

        if(validate_title && validate_content && validate_lang){
            //Create topic object
            var topic = new Topic();
            topic.title = params.title;
            topic.content = params.content;
            topic.code = params.code;
            topic.lang = params.lang;
            topic.date = Date.now();
            topic.user = req.user.sub;

            //Save topic
            topic.save((err, topicStored)=>{
                if(err || !topicStored){
                    return res.status(400).send({
                        message: "No se ha guardado el tema",
                        status: "error"
                    });
                }
                
                return res.status(200).send({
                    topic: topicStored,
                    status: "success"
                });
            });
            
        }else{
                return res.status(400).send({
                    message: "No envio los datos correctamente",
                    status: "error"
                });
        }
      
        
    },

    getTopics: function(req, res){
        //Get page number
        var page = req.params.page;
        if(page == null || page == undefined || page == 0 || page == "0"){
            page = 1;
        }

        //Options for mongoose_paginate library
        var options ={
            sort: {date: -1},
            page: page,
            populate: "user",
            limit: 5
        };

        //Get paginated topics 
        Topic.paginate({}, options, (err, topics)=>{
            if(err){
                return res.status(500).send({
                    message: "Error al buscar los temas",
                    status: "error"
                }); 
            }

            if(!topics){
                return res.status(400).send({
                    message: "No se consiguio ningun tema",
                    status: "error"
                }); 
            }

                return res.status(200).send({
                    status: "success",
                    topics: topics.docs,
                    totalDocs: topics.totalDocs,
                    totalPages: topics.totalPages
                }); 
            
        });
    },

    getTopicsByUser: function(req, res){
        //Get user id
        if(req.params.id){
            var userId = req.params.id;
        }else{
            return res.status(400).send({
                message: "No envio el id del usuario",
                status: "error"
            });
        }


        //Find his or her topics
        Topic.find({"user": userId}).sort([["date", "descending"]]).exec((err, topics)=>{
            if(err){
                return res.status(500).send({
                    message: "Error al buscar los temas",
                    status: "error"
                }); 
            }

            if(!topics){
                return res.status(400).send({
                    message: "No se consiguio ningun tema de este usuario",
                    status: "error"
                }); 
            }

            //return them
                return res.status(200).send({
                    status: "success",
                    topics: topics,
                }); 
            
        });

        
    },

    getTopic: function(req, res){
        //Get topic id
        if(req.params.id){
            var topicId = req.params.id;
        }else{
            return res.status(400).send({
                message: "No envio el id del tema",
                status: "error"
            });
        }

        //Find topic
        Topic.findById(topicId).populate("user").populate("comments.user").exec((err, topic)=>{
            if(err){
                return res.status(500).send({
                    message: "Error al buscar el tema",
                    status: "error"
                }); 
            }

            if(!topic){
                return res.status(400).send({
                    message: "No se consiguio el tema",
                    status: "error"
                }); 
            }

            //return it
                return res.status(200).send({
                    status: "success",
                    topic: topic,
                }); 
            
        });

        
    },

    updateTopic: function(req, res){
        //Get topic id
        if(req.params.id){
            var topicId = req.params.id;
        }else{
            return res.status(400).send({
                message: "No envio el id del tema",
                status: "error"
            });
        }

        
        var params = req.body;

        try{
             //Validate data
             var validate_title = !validator.isEmpty(params.title);
             var validate_content = !validator.isEmpty(params.content);
             var validate_lang = !validator.isEmpty(params.lang);
         }catch(error){
             return res.status(400).send({
                 message: "Los datos no fueron enviados correctamente",
                 status: "error"
             });
         }

         var update = {
             title: params.title,
             content: params.content,
             lang: params.lang,
             code: params.code,
         };

        //Find topic and update
        Topic.findOneAndUpdate({_id: topicId, user: req.user.sub}, update, {new: true}, (err, topicUpdated)=>{
            if(err){
                return res.status(500).send({
                    message: "Error al actualizar el tema",
                    status: "error"
                }); 
            }

            if(!topicUpdated){
                return res.status(400).send({
                    message: "No se actualizo el tema",
                    status: "error"
                }); 
            }

            return res.status(200).send({
                status: "success",
                topic_updated: topicUpdated,
            }); 
            
        });

        
    },

    deleteTopic: function(req, res){
        //Get topic id
        if(req.params.id){
            var topicId = req.params.id;
        }else{
            return res.status(400).send({
                message: "No envio el id del tema",
                status: "error"
            });
        }

        Topic.findOneAndDelete({_id: topicId, user: req.user.sub}, (err, topicDeleted)=>{
            if(err){
                return res.status(500).send({
                    message: "Error al eliminar el tema",
                    status: "error"
                }); 
            }

            if(!topicDeleted){
                return res.status(400).send({
                    message: "No se elimino el tema",
                    status: "error"
                }); 
            }

            return res.status(200).send({
                status: "success",
                topic_deleted: topicDeleted,
            }); 
            
        });
    },

    search: function(req, res){
        var search = req.params.search;

        if(search){
            Topic.find({
                $or: [
                    {title: {$regex: search, $options: "i"}},
                    {content: {$regex: search, $options: "i"}},
                    {code: {$regex: search, $options: "i"}},
                    {lang: {$regex: search, $options: "i"}},

                ]
            }).populate("user").exec((err, topics)=>{
                if(err){
                    return res.status(500).send({
                        message: "Error al buscar el tema",
                        status: "error"
                    }); 
                }
    
                if(topics.length == 0){
                    return res.status(400).send({
                        message: "No se encontro el tema",
                        status: "error"
                    }); 
                }
    
                return res.status(200).send({
                    status: "success",
                    topics: topics,
                }); 
            });
        }else{
            return res.status(400).send({
                message: "No envio ningun dato para buscar",
                status: "error"
            }); 
        }
    }
}

module.exports = controller;