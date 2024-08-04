"use strict"

//requires
var express = require("express");
var bodyParser = require("body-parser");

//Execute express
var app = express();

//Cargar archivo de rutas
var routes = require("./routes");
//Cors

//middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Ruta prueba
app.get("/prueba", (req, res)=>{
    return res.status(200).send({
        message: "Hola nklsnvkls",
        titulo: "Nuevo titulo"
    })
});

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use("/api", routes);

//Exports module
module.exports = app;