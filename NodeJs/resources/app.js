const express = require('express');
const path = require('path');
const translate = require('@iamtraction/google-translate');
const langs_supported = require('./public/other/langs.json');

//var Question = require('./db/database');
// ./db/database.js has multiple exports, so we need to import the whole module
var database = require('./db/database');
var Question = database.Question;
// var connectToDatabase = database.connectToDatabase;
// var closeConnection = database.closeConnection;

var index = require('./routes/index');
var questionary = require('./routes/questionary');
var newQuestion = require('./routes/newQuestion');
var test = require('./routes/test');
var error404 = require('./routes/404');

var app = express();

app.set("port", process.env.PORT || 3000);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use('/', index);
app.use('/', questionary);
app.use('/', newQuestion);
app.use('/', test);

app.use(express.json());

/***********
 ** Utils **
 ***********/

// Get the supported languages
app.get('/getSupportedLanguages', async(req, res) => {
  try {
    res.status(200).json(langs_supported);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/getTopics', async(req, res) => {
  try {
    const topics = await Question.find({}).distinct('topic');
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/translate', async(req, res) => {
  try {
    const data = req.body;
    const translation = await translate(data.text, { from: data.from, to: data.to });
    res.status(200).json(translation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/addQuestion', function (req, res) {
  
  const data = req.body;

  var question = new Question ({
    topic: data.topic,
    difficulty: data.difficulty,
    languages: data.languages
  });

  // Delete data.topic from data
  delete data.topic;

  // Delete data.difficulty from data
  delete data.difficulty;
 
  // question.save(function (err, doc) {
  //   if (!err) {
  //       // console.log(doc);
  //       res.status(200).json({ message: 'Pregunta añadida exitosamente.' });          
  //   }
  //   else {
  //       // console.log(err);
  //       res.status(500).json({ error: 'Error al procesar la solicitud.' });
  //   }
  // });
  // Check if the question already exists
  Question   
    .findOne({ topic: question.topic, difficulty: question.difficulty })
    .where('languages.name').equals(data.languages[0].name)
    .exec(function (err, question) {
      if (err) {
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
      }
      else if (question) {
        res.status(409).json({ error: 'La pregunta ya existe.' });
      }
      else {
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
      }
    });
});


/*****************
 ** newQuestion **
 *****************/

// Get the languages from the database
app.get('/newQuestion/getLanguagesNames', async(req, res) => {
  try {
    const languages = await Question.find({}).distinct('languages.name');
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/*****************
 ** questionary **
 *****************/

app.get('/questionary/getTopicsByLanguage:language', async(req, res) => {
  try {
    var language = decodeURIComponent(req.params.language).slice(1).toString();
    const topics = await Question.distinct("topic", {"languages.name": language});
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get topics by language and difficulty
app.get('/questionary/getTopicsByLaD:langAndDiff', async(req, res) => {
  try {
    var langAndDiff = decodeURIComponent(req.params.langAndDiff).slice(1).toString();
    var language = langAndDiff.split("-")[0];
    var difficulty = langAndDiff.split("-")[1];
    
    const topics = await Question.distinct("topic", {"languages.name": language, difficulty: difficulty});
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get('/questionary/getQuestionById:questionId', async(req, res) => {
  try {
    var questionId = req.params.questionId.slice(1).toString();    
    const question = await Question.findOne({ _id: questionId });    
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/questionary/getQuestionsByLanguage:languageName', async(req, res) => {
  try {
    var languageName = req.params.languageName.slice(1).toString();
    const questions = await Question.find({ 'languages.name': languageName });
    res.status(200).json(questions);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/questionary/getAllQuestions', async(req, res) => {
  try {   
    const questions = await Question.find({});
    res.status(200).json(questions);
  } catch (error) {

    res.status(500).json({ message: error.message });
  }
});

app.delete('/questionary/deleteQuestionById:questionId', async(req, res) => {
  try {
    var questionId = req.params.questionId.slice(1).toString();
    const question = await Question.deleteOne({ _id: questionId });
    res.status(200).json({ message: 'Pregunta eliminada exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Redirect to 404 page if no route is found
app.use('*', error404);

app.listen(app.get("port"), function(){
  var url = "http://localhost:"+app.get("port");
  console.log("La aplicación está escuchando en "+url);
});