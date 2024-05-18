// MultiLingQuiz is part of Segimundo Ferrairó García.

// Segimundo Ferrairó García is free software: you can redistribute it and/or modify it under the terms 
// of the GNU General Public License as published by the Free Software Foundation, 
// either version 3 of the License, or (at your option) any later version.

// Segimundo Ferrairó García is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
// without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License along with Segimundo Ferrairó García. 
// If not, see <https://www.gnu.org/licenses/>.



const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

function connectToDatabase() {
    mongoose.connect("mongodb://mongodb:27017/my_database",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(db => console.log('MongoDB Conectada', db.connection.host))
        .catch(err => console.log('Error al conectar a MongoDB:', err)
    );
}

connectToDatabase();

const question_schema = new mongoose.Schema({
    topic: {
        type: String,
        required: 'This field is required'
    },
    difficulty: {
        type: Number,
        required: 'This field is required'
    },
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
        answer: [{
            type: Number,
            required: 'This field is required'
        }]
    }]    
});

var Question = mongoose.model('questions', question_schema);

//closeConnection();

function closeConnection() {
    mongoose.connection.close();
}

module.exports = {
    Question,
    connectToDatabase,
    closeConnection
}