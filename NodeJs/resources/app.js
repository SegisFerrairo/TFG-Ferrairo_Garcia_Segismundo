const express = require('express');
const path = require('path');
const translate = require('@iamtraction/google-translate');
const langs_supported = require('./public/other/langs.json');

var database = require('./db/database');
var QuestionSchema = database.Question;
// var connectToDatabase = database.connectToDatabase;
// var closeConnection = database.closeConnection;

var index = require('./routes/index');
var Question = require('./routes/Question'); // Change the import statement to use the correct casing
var questionary = require('./routes/questionary');
var error404 = require('./routes/404');

var app = express();

app.set("port", process.env.PORT || 3000);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use('/', index);
app.use('/', questionary);
app.use('/', Question);

app.use(express.json());

/***********
 ** Utils **
 ***********/

app.get('/getAllQuestions', async(req, res) => {
  try {   
    const questions = await QuestionSchema.find({});
    res.status(200).json(questions);
  } catch (error) {

    res.status(500).json({ message: error.message });
  }
});

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
    const topics = await QuestionSchema.find({}).distinct('topic');
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/getQuestionById:questionId', async(req, res) => {
  try {
    var questionId = req.params.questionId.slice(1).toString();    
    const question = await QuestionSchema.findOne({ _id: questionId });    
    res.status(200).json(question);
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

// The above function but with app.put instead of app.post
app.put('/addQuestion', async(req, res) => {
  try {
    const data = req.body;
    // var questionId = data._id;
    var questionId;
    var existingQuestion;
    if (data._id) {
      questionId = data._id;
      existingQuestion = await QuestionSchema.findOne({ _id: questionId });      
    }

    // If question already exists, update it not create a new one
    if (existingQuestion) {
      console.log("Updating question");
      var updatedParameters = { $set: { topic: data.topic, difficulty: data.difficulty, languages: data.languages } };
      await QuestionSchema.updateOne({ _id: questionId }, updatedParameters );
      res.status(200).json({ message: 'Pregunta actualizada exitosamente.' });
    }
    else {
      console.log("Creating question");
      var question = new Question ({
        topic: data.topic,
        difficulty: data.difficulty,
        languages: data.languages
      });
      await question.save();
      res.status(200).json({ message: 'Pregunta añadida exitosamente.' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all questions from the database
app.delete('/deleteAllQuestions', async(req, res) => {
  try {
    const question = await QuestionSchema.deleteMany({});
    res.status(200).json({ message: 'Todas las preguntas han sido eliminadas exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*****************
 ** Question **
 *****************/

// Get the languages from the database
app.get('/Question/getLanguagesNames', async(req, res) => {
  try {
    const languages = await QuestionSchema.find({}).distinct('languages.name');
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/*****************
 ** questionary **
 *****************/

app.get('/questionary/getQuestionsByLanguage:languageName', async(req, res) => {
  try {
    var languageName = req.params.languageName.slice(1).toString();
    const questions = await QuestionSchema.find({ 'languages.name': languageName });
    res.status(200).json(questions);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.delete('/questionary/deleteQuestionById:questionId', async(req, res) => {
  try {
    var questionId = req.params.questionId.slice(1).toString();
    const question = await QuestionSchema.deleteOne({ _id: questionId });
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