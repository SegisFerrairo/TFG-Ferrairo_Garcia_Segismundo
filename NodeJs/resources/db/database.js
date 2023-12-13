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

// var studentSchema = new mongoose.Schema({
//     fullName: {
//         type: String,
//         required: 'This field is required'
//     },
//     email: {
//         type: String,
//         required: 'This field is required'
//     },
//     mobile: {
//         type: Number,
//         required: 'This field is required'
//     },
//     city: {
//         type: String,
//         required: 'This field is required'
//     }    
// });

const question_schema = new mongoose.Schema({
    statement: {
        type: String,
        required: 'This field is required'
    },
    option1: {
        type: String,
        required: 'This field is required'
    },
    option2: {
        type: String,
        required: 'This field is required'
    },
    answer: {
        type: Number,
        required: 'This field is required'
    }
});

var Question = mongoose.model('questions', question_schema);

module.exports = Question;

// var question = new Question({
//     statement: '¿Cuál es la capital de España?',
//     option1: 'Madrid',
//     option2: 'Barcelona',
//     answer: 1
// });

// mongoose.model('Student', studentSchema);

// // añadir un nuevo estudiante a la base de datos
// var Student = mongoose.model('Student');
// var student = new Student();
// student.fullName = 'Juan';
// student.email = 'juan@localhost';
// student.mobile = '123456789';
// student.city = 'Madrid';
// student.save(function(err, doc){
//     if(!err)
//         console.log(doc);
//     else
//         console.log(err);
// });


// // Inserta 3 nuevos estudiantes a la base de datos mediante un array
// var Student = mongoose.model('Student');
// var students = [
//     new Student({
//         fullName: 'Pedro',
//         email: 'pedro@localhost',
//         mobile: '123456789',
//         city: 'Madrid'
//     }),
//     new Student({
//         fullName: 'Luis',
//         email: 'luis@localhost',
//         mobile: '123456789',
//         city: 'Madrid'
//     })
// ];

// for(let i=0, j=0; i<students.length; i++){
//     students[i].save(function(err, result){
//         j++;
//         if(j === students.length){
//             exit();
//         }
//     });
// }

// // Busca todos los estudiantes de la base de datos y los ordena por nombre
// var Student = mongoose.model('Student');
// Student.find(function(err, students){
//     if(err)
//         console.log(err);
//     else
//         console.log(students);
// }).sort({fullName: 1});

