const express = require('express');
const path = require('path');
//var Question = require('./db/database');
// ./db/database.js has multiple exports, so we need to import the whole module
var database = require('./db/database');
var Question = database.Question;
var connectToDatabase = database.connectToDatabase;
var closeConnection = database.closeConnection;

var index = require('./routes/index');
var questionary = require('./routes/questionary');
var newQuestion = require('./routes/newQuestion');
var error404 = require('./routes/404');

var app = express();

app.set("port", process.env.PORT || 3000);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use('/', index);
app.use('/', questionary);
app.use('/', newQuestion);

app.use(express.json());

// Connect to the database
//connectToDatabase();

app.get('/questionary/getQuestionById:questionId', async(req, res) => {
  try {
    var questionId = req.params.questionId.slice(1).toString();    
    const question = await Question.findOne({ _id: questionId });    
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get the questions from the database
app.get('/questionary/getAllQuestions', async(req, res) => {
  try {   
    const questions = await Question.find({});
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

// Redirect to 404 page if no route is found
app.use('*', error404);

app.listen(app.get("port"), function(){
  var url = "http://localhost:"+app.get("port");
  console.log("La aplicación está escuchando en "+url);
});



// const question = await Question.findOne({ _id: ObjectId('65b95497cd0b61412dffbaea') })

// const question = await Question.findOne({ _id: '65b95497cd0b61412dffbaea' })

