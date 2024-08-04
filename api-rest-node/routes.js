"use strict"

var express = require("express");
var router = express.Router();
var userController = require("./controllers/user");
var topicController = require("./controllers/topic");
var commentController = require("./controllers/comment");
var md_auth = require("./middlewares/authenticated");
var multipart = require("connect-multiparty");
var md_upload = multipart({uploadDir: "./uploads/users"});

//User routes
router.post("/register", userController.save);
router.post("/login", userController.login);
router.put("/user/update", md_auth.authtenicated, userController.update);
router.post("/upload-avatar", [md_auth.authtenicated, md_upload] ,userController.uploadAvatar);
router.get("/avatar/:filename", userController.avatar);
router.get("/users", userController.getUsers);
router.get("/user/:id", userController.getUser);

//Topic routes
router.post("/saveTopic", md_auth.authtenicated, topicController.save);
router.get("/topics/:page?", topicController.getTopics);
router.get("/userTopics/:id", topicController.getTopicsByUser);
router.get("/topic/:id", topicController.getTopic);
router.get("/search/:search", topicController.search);
router.put("/updateTopic/:id", md_auth.authtenicated, topicController.updateTopic);
router.delete("/deleteTopic/:id", md_auth.authtenicated, topicController.deleteTopic);

//Comment routes
router.post("/comment/topic/:topicId", md_auth.authtenicated, commentController.save);
router.put("/comment/topic/:commentId/:topicId", md_auth.authtenicated, commentController.update);
router.delete("/comment/topic/:commentId/:topicId", md_auth.authtenicated, commentController.delete);


module.exports = router;