"use strict"

var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");

var Schema = mongoose.Schema;

var ConmmentSchema = Schema({
    content: String,
    date: {type: Date, deafault: Date.now()},
    user: {type: Schema.ObjectId, ref: "User"}
});
var Comment = mongoose.model("Comment", ConmmentSchema);

var TopicSchema = Schema({
    title: String,
    content: String,
    code: String,
    lang: String,
    date: {type: Date, deafault: Date.now()},
    user: {type: Schema.ObjectId, ref: "User"},
    comments: [ConmmentSchema]
});

TopicSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Topic", TopicSchema);