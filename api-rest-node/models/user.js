"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    image: String,
    role: String
});

//Delete password when i make a get request
UserSchema.methods.toJSON = function(){
    var obj = this.toObject();
    delete obj.password;

    return obj;
}

module.exports = mongoose.model("User", UserSchema);