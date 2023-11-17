const express = require('express');
const path = require('path');

var routes = require('./routes');

var app = express();


app.set("port", process.env.PORT || 3000);

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

app.use(routes);

app.listen(app.get("port"), function(){
  var url = "http://localhost:"+app.get("port");
  console.log("La aplicación está escuchando en "+url);
});
