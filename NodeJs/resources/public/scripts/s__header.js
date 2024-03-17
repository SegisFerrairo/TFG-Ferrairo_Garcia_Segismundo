/***********
 ** Utils **
 ***********/

function lastClicked() {
    var navLinks = document.getElementById('mainNavbar').getElementsByClassName('nav-link');

    // Check if the url matches a nav-link and add active class
    var currentPage = window.location.pathname;
    for (var i = 0; i < navLinks.length; i++) {
        if (navLinks[i].getAttribute('href') == currentPage) {
            var current = document.getElementsByClassName('active');
            if (current.length > 0) {
                current[0].classList.remove('active');
            }
            navLinks[i].classList.add('active');
        }
    }
}

function dropdownNavBar() {
    document.getElementById('dropdown-button').addEventListener('click', function (event) {
        event.preventDefault();

        document.getElementById('dropdown-button').classList.toggle('collapsed');

        var dbButton = document.getElementById('db-options');
        // Change aria-expanded attribute of dropdown button
        if (document.getElementById('dropdown-button').getAttribute('aria-expanded') == 'true') {
            document.getElementById('dropdown-button').setAttribute('aria-expanded', 'false');
            document.getElementById('mainNavbar').removeAttribute('style');
            dbButton.classList.add('db-options-right');       
        } else {
            document.getElementById('dropdown-button').setAttribute('aria-expanded', 'true');            
            document.getElementById('mainNavbar').style.height = '111px';
            dbButton.classList.remove('db-options-right');
            // If db-options aria-expanded is true, expand height of mainNavbar
            dbButton.addEventListener('click', function() {
                if (dbButton.getAttribute('aria-expanded') == 'true') {
                    document.getElementById('mainNavbar').style.height = '250px';
                }
                else {
                    document.getElementById('mainNavbar').style.height = '111px';
                }
            });        
        }

        // Change class collapse for collapsing in the element with id mainNavbar
        document.getElementById('mainNavbar').classList.toggle('collapse');
        document.getElementById('mainNavbar').classList.toggle('collapsing');
        
        
        document.getElementById('mainNavbar').classList.toggle('collapse');
        document.getElementById('mainNavbar').classList.toggle('show');        
    });

    // If mainNavbar changes its width, remove style attribute
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991) {
            document.getElementById('mainNavbar').removeAttribute('style');
        }

    });
}

function dropdownDB() {
    var dbOptions = document.getElementById('db-options');
    var dropdownMenu = dbOptions.getElementsByClassName('dropdown-menu')[0];
    dbOptions.addEventListener('click', function () {
        // If contains show class, remove it
        if (dbOptions.classList.contains('show')) {
            dbOptions.classList.remove('show');
            // Set aria-expanded to false
            dbOptions.setAttribute('aria-expanded', 'false');
            dropdownMenu.classList.remove('show');
        } else {
            dbOptions.classList.add('show');
            // Set aria-expanded to true
            dbOptions.setAttribute('aria-expanded', 'true');
            dropdownMenu.classList.add('show');
        }       
    });

    // if is clicked outside the dropdown, remove show class
    window.addEventListener('click', function (event) {
        if (!dbOptions.contains(event.target)) {
            dbOptions.classList.remove('show');
            // Set aria-expanded to false
            dbOptions.setAttribute('aria-expanded', 'false');
            dropdownMenu.classList.remove('show');
        }
    });
}

/************
 ** Import **
 ************/

function importQuestionayCSV(input) {
    // If there is no file selected, return
    if (input.files.length == 0) {
        console.error("No file selected");
        return;
    }

    var file = input.files[0];

    // Check if the file is a CSV file
    if (file.type != "text/csv") {
        alert("El archivo seleccionado no es un archivo CSV");
        return;
    }

    var groupedQuestions = [];
    var reader = new FileReader();
    reader.readAsText(file);   
    reader.onload = function(event) {
        var csv = event.target.result;
        // If csv is empty, throw an error
        if (csv == "") {
            alert("El archivo seleccionado está vacío");
            return;
        }

        // Group the questions by id, they have in common the id, the topic and the difficulty
        // Split the csv by new line
        var questions = csv.split("\n");

        // Delete de \r character from each question
        questions = questions.map(q => q.replace(/\r/g, ""));
        // If the last element is empty, delete it
        if (questions[questions.length - 1] == "") {
            questions.pop();
        }

        // Remove the first element, the headers
        questions.shift();
        var resultData = [];
        try {
            questions.forEach(function(question) {
                try {
                    var questionData = question.split(",");

                    var id = questionData[0].replace(/"/g, "");
                    var topic = questionData[1].replace(/"/g, "");
                    var difficulty = parseInt(questionData[2].replace(/"/g, ""));
                    var languageName = questionData[3].replace(/"/g, "");
                    var statement = questionData[4].replace(/"/g, "");
                    var options = questionData[5].replace(/"/g, "").split("|");
                    var answer = questionData[6].replace(/"/g, "").split("|").map(a => parseInt(a));
                }
                catch (error) {
                    throw new Error("Error al leer el archivo");
                }

                var question = {
                    id: id,
                    topic: topic,
                    difficulty: difficulty,
                    languages: [
                        {
                            name: languageName,
                            statement: statement,
                            options: options,
                            answer: answer
                        }
                    ]
                };
                resultData.push(question);
            });
        }
        catch (error) {
            alert(error.message);
            return;
        }
        
        // Delete all the questions from the database
        dropAllDB();

        // Group the questions by id, and each question will have in common: id, topic and difficulty. 
        // The languages will be different and will be added to the languages array
        resultData.forEach(function(question) {
            var index = groupedQuestions.findIndex(q => q.id == question.id && q.topic == question.topic && q.difficulty == question.difficulty);
            if (index == -1) {
                groupedQuestions.push(question);
            }
            else {
                groupedQuestions[index].languages.push(question.languages[0]);
            }
        });

        
        // Delete de id of the questions
        groupedQuestions.forEach(function(question) {
            delete question.id;
        });          

        // When sending the questions to the server, increment the counter of questions completly saved, 
        // and when the counter is equal to the length of the groupedQuestions, list the sidebar data
        var counter = 0;
        groupedQuestions.forEach(function(question) {
            sendFormData(question)
            .then(function() {
                counter++;
                if (counter == groupedQuestions.length) {
                    // Refresh the page
                    location.reload();
                }                
            })
            .catch(function(error) {
                console.error(error.message);
                // Just display the alert once
                if (counter == 0) {
                    alert("Error al enviar los datos al servidor");
                }
                counter++;
                location.reload();
            });
        });
    };

    reader.onerror = function() {
        alert("Error al leer el archivo");
    };
    
    // Reset the input
    input.value = "";
}

/************
 ** Export **
 ************/

function exportQuestionaryCSV() {
    console.log("Exporting questionary");
    fetch('/getAllQuestions')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var csv = "id,topic,difficulty,language,statement,options,answer\n";
        data.forEach(function(question) {
            question.languages.forEach(function(language) {
                csv += `${question._id},${question.topic},${question.difficulty},${language.name},${language.statement},${language.options.join("|")},${language.answer.join("|")}\n`;
            });
        });

        var blob = new Blob([csv], { type: "text/csv" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "questionary.csv";
        a.click();
        URL.revokeObjectURL(url);
    })
    .catch(function(error) {
        console.error(error.message);
        alert("Error al exportar el cuestionario");
    });
}


/*************
 ** Drop DB **
 *************/

function dropAllDB() {
    fetch('/deleteAllQuestions', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la base de datos');
        }
        return response.json();
    })
    .then(responseData => {
        console.debug('Respuesta del servidor:', responseData);
        return responseData;
    })
    .catch(error => {
        console.error('Error en la solicitud:', error.message);
    });
}


/*********************
 ** Event Listeners **
 *********************/

function importQuestionaryListener() {
    var input = document.getElementById("csvFileInput");
    // Add an event listener to the input element to catch the file selected
    input.addEventListener("click", function(event) {
        var confirmation = confirm("La BD se restaurará completamente, ¿está seguro?");
        if (confirmation) {
            // Wait until the user selects a file
            input.addEventListener("change", function(event) {
                importQuestionayCSV(input);
            });
        }       
        else {
            // Prevent the event from opening a select file dialog box and reset the input
            event.preventDefault();
            input.value = "";          
        }
    });
}

function exportQuestionaryListener() {
    var label = document.getElementById("exportDB");
    label.addEventListener("click", function() {
        exportQuestionaryCSV();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    lastClicked();
    dropdownNavBar();
    dropdownDB();
    importQuestionaryListener();
    exportQuestionaryListener();
});