const express = require('express');
const path = require('path');
var Question = require('./db/database');

var index = require('./routes/index');
var about = require('./routes/about');
var newQuestion = require('./routes/newQuestion');
var error404 = require('./routes/404');

var app = express();

app.set("port", process.env.PORT || 3000);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use('/', index);
app.use('/about', about);
app.use('/newQuestion', newQuestion);

app.use(express.json());

// Redirect to 404 page if no route is found
app.use('*', error404);

app.listen(app.get("port"), function(){
  var url = "http://localhost:"+app.get("port");
  console.log("La aplicación está escuchando en "+url);
});

app.post('/newQuestion/addQuestion', function (req, res) {
  const data = req.body;

  var question = new Question ({
    topic: data.topic,
    languages: []
  });

  // Delete data.topic from data
  delete data.topic;

  Object.values(data).forEach(language => {
    question.languages.push({
      name: language.name,
      statement: language.statement,
      options: language.options,
      answer: language.answer
    });
  });
 
  question.save(function (err, doc) {
    if (!err) {
        // console.log(doc);
        res.status(200).json({ message: 'Pregunta añadida exitosamente.' });          
    }
    else {
        // console.log(err);
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
  });
});