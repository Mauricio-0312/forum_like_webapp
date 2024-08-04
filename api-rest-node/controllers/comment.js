"use strict"
var Topic = require("../models/topic");
var validator = require("validator");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");
var fs = require("fs");
var path = require("path");
const topic = require("../models/topic");

var controller ={
    save: function(req, res){
        //get topic id
        var topicId = req.params.topicId;

        //Check if content is gotten
        if(req.body.content && req.body.content != ""){

            //Find the topic
            Topic.findById(topicId).exec((err, topic)=>{
                if(err){
                    return res.status(500).send({
                        message: "Error al guardar el comentario",
                        status: "error"
                    }); 
                }
    
                if(!topic){
                    return res.status(400).send({
                        message: "No se guardo el comentario",
                        status: "error"
                    }); 
                }
    
                //Creating comment
                var comment = {
                    content: req.body.content,
                    user: req.user.sub,
                    date: Date.now()
                }

                //Push it into the comments array of the topic object
                topic.comments.push(comment);

                //Save topic 
                topic.save((err, topicSaved)=>{
                    if(err || !topicSaved){
                        return res.status(500).send({
                            message: "Error al guardar el comentario",
                            status: "error"
                        }); 
                    }

                    Topic.findById(topicSaved._id).populate("user").populate("comments.user").exec((err, topic)=>{
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
                            
                            //Return successful response

                            return res.status(200).send({
                                status: "success",
                                topic: topic,
                            }); 
                        
                    });
                });

               
            });
        }else{
            return res.status(404).send({
                status: "error",
                message: "No envio el contenido"
            })
        }
    },
    update: function(req, res){
        //get topic and comment id
        var topicId = req.params.topicId;
        var commentId = req.params.commentId;

        //Check if content is gotten
        if(req.body.content){
            //find and update topic
            Topic.findOneAndUpdate(
                {"comments._id": commentId, _id: topicId},
                {
                    "$set":{
                        "comments.$.content": req.body.content
                    }
                },
                {new: true},
                (err, topicUpdated)=>{
                    if(err){
                        return res.status(500).send({
                            message: "Error al editar el comentario",
                            status: "error"
                        }); 
                    }
        
                    if(!topicUpdated){
                        return res.status(400).send({
                            message: "No se edito el comentario",
                            status: "error"
                        }); 
                    }

                    return res.status(200).send({
                        status: "success",
                        topic: topicUpdated,
                    }); 
                }
            )
        }else{
            return res.status(404).send({
                status: "error",
                message: "No envio el contenido"
            })
        }

    },
    delete: function(req, res){
        //Get comment an topic id
        var commentId = req.params.commentId;
        var topicId = req.params.topicId;

        //Find topic
        Topic.findById(topicId, (err, topic)=>{
            if(err){
                return res.status(500).send({
                    message: "Error al eliminar el comentario",
                    status: "error"
                }); 
            }

            if(!topic){
                return res.status(400).send({
                    message: "No se elimino el comentario",
                    status: "error"
                }); 
            }

            //Find comment
            var comment = topic.comments.id(commentId);

            if(comment){
                //delete comment
                comment.remove();

                //Update the topic 
                topic.save();

                Topic.findById(topic._id).populate("user").populate("comments.user").exec((err, topicFound)=>{
                    if(err){
                        return res.status(500).send({
                            message: "Error al buscar el tema",
                            status: "error"
                        }); 
                    }
        
                    if(!topicFound){
                        return res.status(400).send({
                            message: "No se consiguio el tema",
                            status: "error"
                        }); 
                    }
                        
                        //Return successful response

                        return res.status(200).send({
                            status: "success",
                            topic: topicFound,
                        }); 
                    
                });
            }else{
                return res.status(400).send({
                    message: "No existe el comentario",
                    status: "error"
                }); 
            }
        })
    }
}

module.exports = controller;