"use strict"

var mongoose = require("mongoose");
var app = require("./app");
var port = 3999;
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/api-rest-node", {useNewUrlParser: true})
    .then(()=>{
        console.log("conexion a la base de datos exitosa");

        //Crear el servidor
        app.listen(port, ()=>{
            console.log("El servidor https://localhost:3999 esta activo");
        })
    }).catch(error => { console.log(error) });