




function lastClicked() {
    var navLinks = document.getElementById('navbarColor01').getElementsByClassName('nav-link');

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
            document.getElementById('navbarColor01').removeAttribute('style');
            dbButton.classList.add('db-options-right');       
        } else {
            document.getElementById('dropdown-button').setAttribute('aria-expanded', 'true');            
            document.getElementById('navbarColor01').style.height = '111px';
            dbButton.classList.remove('db-options-right');
            // If db-options aria-expanded is true, expand height of navbarColor01
            dbButton.addEventListener('click', function() {
                if (dbButton.getAttribute('aria-expanded') == 'true') {
                    document.getElementById('navbarColor01').style.height = '250px';
                }
                else {
                    document.getElementById('navbarColor01').style.height = '111px';
                }
            });        
        }

        // document.getElementById('navbarColor01')
        // Change class collapse for collapsing in the element with id navbarColor01
        document.getElementById('navbarColor01').classList.toggle('collapse');
        document.getElementById('navbarColor01').classList.toggle('collapsing');
        
        
        document.getElementById('navbarColor01').classList.toggle('collapse');
        document.getElementById('navbarColor01').classList.toggle('show');        
    });

    // If navbarColor01 changes its width, remove style attribute
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991) {
            document.getElementById('navbarColor01').removeAttribute('style');
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
                    var difficulty = questionData[2].replace(/"/g, "");
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

        // Group the questions by id, and each question will have in common: id, topic and difficulty. The languages will be different and will be added to the languages array
        
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


function importQuestionaryListener() {
    var input = document.getElementById("csvFileInput");
    // Add an event listener to the input element to catch the file selected
    input.addEventListener("change", function() {
        importQuestionayCSV(input);        
    });
}
function exportQuestionaryListener() {
    var label = document.getElementById("exportDB");
    label.addEventListener("click", function() {
        console.log("Exporting questionary");
        exportQuestionaryCSV();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var label = document.getElementById("exportDB");
    label.addEventListener("click", function() {
        console.log("Exporting questionary");
        exportQuestionaryCSV();
    });
    // Add event listerner to dropdown button
    dropdownNavBar();
    dropdownDB();
    lastClicked();
});