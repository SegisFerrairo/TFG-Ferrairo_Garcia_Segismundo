const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose.connect("mongodb://mongodb:27017/my_database",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(db => console.log('MongoDB Conectada', db.connection.host))
    .catch(err => console.log('Error al conectar a MongoDB:', err)
);

const question_schema = new mongoose.Schema({
    languages: [{
        name: {
            type: String,
            required: 'This field is required'
        },
        statement: {
            type: String,
            required: 'This field is required'
        },
        options: [{
            type: String,
            required: 'This field is required'
        }],
        answer: {
            type: Number,
            required: 'This field is required'
        }
    }]    
});

var Question = mongoose.model('questions', question_schema);

module.exports = Question;