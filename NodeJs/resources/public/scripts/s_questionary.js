/***************
 ** Constants **
 ***************/
var COUNTER_QUESTION = 1;
var COUNTER_LANGUAGE = 0;
var CHOOSEN_LANGUAGE = "Español";
var CHOOSEN_LANGUAGE_ID = 0;

/***********
 ** Utils **
 ***********/

function openTab(linkTabId, folioId) {
    var tabList = document.getElementById('languagesTabList');

    var tabElement = document.getElementById(linkTabId);

    // If tabElement is null, it is because the close tab button has been clicked
    if (tabElement != null) {
        // Delete the 'active' class from all <a> elements inside tabList
        var links = tabList.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            links[i].classList.remove('active');
            links[i].setAttribute('aria-selected', false);
            links[i].setAttribute('tabindex', -1);
        }

        // Add the 'active' class to the clicked <a> element
        tabElement.classList.add('active');
        // Change the aria-selected property to true
        tabElement.setAttribute('aria-selected', true);
        // Remove the tabindex attribute
        tabElement.removeAttribute('tabindex');

        // Delete the 'active' class from all <div> elements inside myTabContent
        var tabContents = document.getElementById('myTabContent').getElementsByClassName('tab-pane');
        for (var i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove('active', 'show');
        }

        // Add the 'active' class to the clicked <div> element
        var tabContent = document.getElementById(folioId);
        tabContent.classList.add('active', 'show');


    }
}

function removeLanguagesTab(language) {
    var languagesTabList = document.getElementById("languagesTabList");
    var links = languagesTabList.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        if (links[i].textContent == language) {
            var folioId = "folio_" + links[i].id.split("_")[1];
            languagesTabList.removeChild(links[i].parentElement);

            var folio = document.getElementById(folioId);
            folio.parentElement.removeChild(folio);
        }
    }

    // If the removed tab is the active one, set the first tab as active
    if (links[1] != undefined) {
        // From linkTab_0, just the number is needed for the folioId
        var folioId = "folio_" + links[1].id.split("_")[1];
        openTab(links[1].id, folioId);
    }
}

function addLanguagesTab(language) {
    var languagesTabList = document.getElementById("languagesTabList");

    var li = document.createElement("li");
    li.className = "nav-item";
    li.role = "presentation";
    var a = document.createElement("a");
    a.id = "linkTab_" + COUNTER_LANGUAGE;
    a.className = "nav-link";
    a.href = "#";
    a.role = "tab";
    a.setAttribute("aria-selected", "false");
    a.tabIndex = "-1";
    a.textContent = language;

    var folioId = "folio_" + COUNTER_LANGUAGE;

    a.addEventListener("click", function() {openTab(a.id, folioId)});

    li.appendChild(a);
    languagesTabList.appendChild(li);

    addFolio(folioId, language);

    COUNTER_LANGUAGE++;
}

function addFolioHeader(folioHeaderId) {
    var folioHeader = document.getElementById(folioHeaderId);

    var h3 = document.createElement("h3");
    h3.textContent = "Cuestionario";
    folioHeader.appendChild(h3);

    var p = document.createElement("p");
    p.textContent = "Criterios de correción: ----";
    folioHeader.appendChild(p);

    var ul = document.createElement("ul");
    ul.className = "single-choice";
    var li = document.createElement("li");
    var label = document.createElement("label");
    label.textContent = "Preguntas con solo una opción posible";
    var small = document.createElement("small");
    small.appendChild(label);
    li.appendChild(small);
    ul.appendChild(li);
    folioHeader.appendChild(ul);

    var ul = document.createElement("ul");
    ul.className = "multiple-choice";
    var li = document.createElement("li");
    var label = document.createElement("label");
    label.textContent = "Preguntas con varias opciones posibles";
    var small = document.createElement("small");
    small.appendChild(label);
    li.appendChild(small);
    ul.appendChild(li);
    folioHeader.appendChild(ul);
}

function addFolio(folioId, language) {
    var myTabContent = document.getElementById("myTabContent");

    var div = document.createElement("div");
    div.id = folioId;
    div.className = "tab-pane fade folio-container";
    // Add language as a class to the div
    div.classList.add("language-"+language);
    var divHeader = document.createElement("div");
    divHeader.className = "folio-header";
    divHeader.id = "header-" + folioId;    
    div.appendChild(divHeader);

    var divBody = document.createElement("div");
    divBody.className = "folio-body";
    var ol = document.createElement("ol");
    ol.className = "list-group ms-3";
    ol.id = "list-" + folioId;
    divBody.appendChild(ol);
    div.appendChild(divBody);
    myTabContent.appendChild(div);

    addFolioHeader(divHeader.id);
}

function disableQuestion(button) {
    // button.classList.toggle("disabled");
    var li = button.parentElement;
    if (button.classList.contains("disabled")) {   
        button.classList.remove("disabled");         
        li.style.listStyleType = "disc";
    }
    else {
        button.classList.add("disabled");
        li.style.listStyleType = "circle";
    }        
}

function createNoTopicsElement(ul) {
    var li = document.createElement("li");
    li.className = "no-topics";
    var link = document.createElement("a");
    link.href = "/newQuestion";
    link.textContent = "No hay temas";
    li.appendChild(link);
    li.style.listStyleType = "none";
    ul.appendChild(li);
}

async function listSidebarData() {
    var sidebar = document.getElementById("sidebar");

    // Remove all the topics from the sidebar except the first one
    // while (document.getElementById("sidebarQuestionsList").childElementCount > 1) {
    //     document.getElementById("sidebarQuestionsList").removeChild(document.getElementById("sidebarQuestionsList").lastChild);
    // }

    // Get the questions from the DB
    var data=[];
    try {
        data = await getQuestionsByLanguage(CHOOSEN_LANGUAGE);
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
    }

    // if data is empty, create a no-topics element
    if (data.length == 0) {        
        createNoTopicsElement(document.getElementById("sidebarQuestionsList"));
        return;
    }

    // Get the topics from the DB
    var topics;
    try {
        topics = await getTopicsByLanguage(CHOOSEN_LANGUAGE);
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
    }

    topics.forEach(function(topic) {
        var li_topic = document.createElement("li");
        li_topic.id = "topic-" + topic
        li_topic.className = "topic mb-1";

        var button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-toggle align-items-center rounded collapsed";
        button.setAttribute("data-bs-toggle", "collapse");
        button.setAttribute("data-bs-target", "#topic-" + topic + "-collapse");
        button.setAttribute("aria-expanded", "false");

        var span = document.createElement("span");
        span.className = "svg-container me-1";
        button.textContent = topic;
        button.insertBefore(span, button.firstChild);

        li_topic.appendChild(button);        

        var div = document.createElement("div");
        div.className = "collapse topic-container";
        div.id = "topic-" + topic + "-collapse";
        var ul = document.createElement("ul");
        ul.className = "btn-toggle-nav list-unstyled fw-normal pb-1 small";

        data.forEach(function(question) {
            if (question.topic == topic) {
                var li = document.createElement("li");
                li.className = "mb-1"
                li.style.listStyleType = "disc";

                var button = document.createElement("button");
                button.type = "button";
                button.id = "button-" + question._id;
                button.className = "btn btn-link cut-text me-2";
                // CHOOSEN_LANGUAGE_ID is the index of the language in the languages array
                CHOOSEN_LANGUAGE_ID = question.languages.findIndex(language => language.name == CHOOSEN_LANGUAGE);
                button.textContent = question.languages[CHOOSEN_LANGUAGE_ID].statement; 
                li.appendChild(button);

                var button_delete = document.createElement("button");
                button_delete.type = "button";
                button_delete.id = "button_delete-" + question._id;
                button_delete.className = "btn btn-outline-danger btn-delete btn-sm";

                var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                svg.setAttribute("width", "16");
                svg.setAttribute("height", "16");
                svg.setAttribute("fill", "currentColor");
                svg.setAttribute("class", "bi bi-trash-fill");
                svg.setAttribute("viewBox", "0 0 16 16");

                var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", "M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0");

                svg.appendChild(path);
                button_delete.appendChild(svg);
                                
                li.appendChild(button_delete);
                ul.appendChild(li);

                selectQuestionListener(button);
                button_delete.addEventListener("click", function() {                    
                    deleteQuestionFromDBListener(question._id);
                });
            }
        });

        div.appendChild(ul);
        li_topic.appendChild(div);

        document.getElementById("sidebarQuestionsList").appendChild(li_topic);

        expandTopicListener(button,div);
    });

}

function addOptionNames(languages) {
    var fieldset = document.getElementById("choosenLanguages").getElementsByTagName("fieldset")[0];
    // If Español is in the array, remove it
    if (languages.includes("Español")) {
        languages.splice(languages.indexOf("Español"), 1);

        var div = document.createElement("div");
        div.className = "form-check form-switch";
        var input = document.createElement("input");
        input.className = "form-check-input";
        input.type = "checkbox";
        input.id = "flexSwitchCheck-Español";
        input.disabled = true;
        input.checked = true;
        div.appendChild(input);
        
        var label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = "flexSwitchCheck-Español";
        label.textContent = "Español";
        div.appendChild(label);
        fieldset.appendChild(div);

        addLanguagesTab("Español");
        openTab("linkTab_0", "folio_0");

        var div = document.createElement("div");
        div.className = "dropdown-divider";
        fieldset.appendChild(div);
    }
    languages.forEach(function(language) {
        var div = document.createElement("div");
        div.className = "form-check form-switch";
        var input = document.createElement("input");
        input.className = "form-check-input";
        input.type = "checkbox";
        input.id = "flexSwitchCheck-" + language;
        div.appendChild(input);
        var label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = "flexSwitchCheck-" + language;
        label.textContent = language;
        div.appendChild(label);
        fieldset.appendChild(div);
        switchedLanguagesListener(input, language);
    });
}

function addEmptyQuestion(folioId, question, language) {
    var folioList = document.getElementById("list-" + folioId);

    var li_q = document.createElement("li");
    li_q.id = "question-" + question._id;
    li_q.className = "question empty-question";
    var label = document.createElement("label");
    label.textContent = "La pregunta no está en el idioma " + language;
    li_q.appendChild(label);

    var button = document.createElement("button");
    button.type = "button";
    button.className = "btn-close question-close";
    button.addEventListener("click", function() {
        removeQuestionFromFolioListener(question._id);
    });
    li_q.appendChild(button);

    folioList.appendChild(li_q);
}

function addQuestion(folioId, question) {
    var folioList = document.getElementById("list-" + folioId);

    var li_q = document.createElement("li");
    li_q.id = "question-" + question._id;
    li_q.className = "question";
    var label = document.createElement("label");
    label.textContent = question.languages[CHOOSEN_LANGUAGE_ID].statement;
    li_q.appendChild(label);

    var button = document.createElement("button");
    button.type = "button";
    button.className = "btn-close question-close";
    button.addEventListener("click", function() {     
        removeQuestionFromFolioListener(question._id);
    });
    li_q.appendChild(button);

    var ul = document.createElement("ul");
    // Distinct between single-choice and multiple-choice questions
    question.languages[CHOOSEN_LANGUAGE_ID].answer.length > 1 ? ul.className = "multiple-choice" : ul.className = "single-choice";
    question.languages[CHOOSEN_LANGUAGE_ID].options.forEach(function(option) {
        var li = document.createElement("li");
        var label = document.createElement("label");
        label.textContent = option;
        li.appendChild(label);
        ul.appendChild(li);
    });
    li_q.appendChild(ul);
    folioList.appendChild(li_q);
}

function getSwitchedLanguages() {
    var fieldset = document.getElementById("choosenLanguages").getElementsByTagName("fieldset")[0];
    var inputs = fieldset.getElementsByTagName("input");
    var languages = [];
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            languages.push(inputs[i].id.split("-")[1]);
        }
    }
    return languages;
}

async function distributeQuestionInFolios(questionId) {
    var question = {};
    try {
        question = await getQuestionById(questionId);
    }
    catch (error) {
        console.error('Error en la solicitud:', error.message);
    }


    var switchedLanguages = getSwitchedLanguages();
    // For each switched language, add the question to its corresponding folio. And if the question hasn't the language, don't add it
    switchedLanguages.forEach(function(language) {
        var languageId = question.languages.findIndex(lang => lang.name == language);
        var folioId = "folio_" + Array.from(document.getElementById("languagesTabList").getElementsByTagName("a")).find(link => link.textContent == language).id.split("_")[1];

        // Check if the questioId already exist in the folioId and prevent the addition
        var questions = document.getElementById("myTabContent").getElementsByClassName("language-" + language)[0].getElementsByClassName("question");
        for (var i = 0; i < questions.length; i++) {
            if (questions[i].id.split("-")[1] == questionId) {
                return;
            }
        }

        if (languageId != -1) {
            CHOOSEN_LANGUAGE_ID = languageId;
            // If the language is already in the tab list, add the question to the corresponding folio
            if (document.getElementById(folioId) != null) {
                addQuestion(folioId, question);
            }
        }
        else {
            if (document.getElementById(folioId) != null) {
                addEmptyQuestion(folioId, question, language);
            }
        }
    
    });
}

function updateQuestionsInFolios() {
    var questions = document.getElementById("myTabContent").getElementsByClassName("language-Español")[0].getElementsByClassName("question");
    var i = 0;
    function nextQuestion() {
        if (i < questions.length) {
            var questionId = questions[i].id.split("-")[1];
            distributeQuestionInFolios(questionId).then(nextQuestion);
            i++;
        }
    }
    nextQuestion();
}

function getNotEmptyFoliosIds() {
    var languages = getSwitchedLanguages();
    var folios = [];
    languages.forEach(function(language) {
        var folio = document.getElementById("myTabContent").getElementsByClassName("language-" + language)[0];
        if (folio.getElementsByClassName("question").length > 0) {
            folios.push(folio.id);
        }
    });

    return folios;
}

function catchQuestionary(folioId) {
    var questions = document.getElementById("list-" + folioId).getElementsByClassName("question");
    // Get the language-<language> class from the folio
    var languageName = Array.from(document.getElementById(folioId).classList).find(cl => cl.startsWith("language-")).split("-")[1];
        
    var questionsData = [];

    for (var i = 0; i < questions.length; i++) {
        var question = {};
        
        if (questions[i].classList.contains("empty-question")) {
            // Create an empty question
            question[languageName] = {
                statement: "La pregunta no está en el idioma " + languageName,
                options: [],
                answer: []
            };
            questionsData.push(question);
        }
        else {
            var questionId = questions[i].id.split("-")[1];

            question[languageName] = {
                statement: "process-"+questionId,
                options: [],
                answer: []
            };
            questionsData.push(question);
        }
    }

    return questionsData;
}

async function processData(questionsData) {
    for (var i = 0; i < questionsData.length; i++) {
        var languageName = Object.keys(questionsData[i])[0];
        if (questionsData[i][languageName].statement.startsWith("process-")) {
            var question = {};
            var questionId = questionsData[i][languageName].statement.split("-")[1];
            try {
                question = await getQuestionById(questionId);
            }
            catch (error) {
                console.error('Error en la solicitud:', error.message);
            }

            CHOOSEN_LANGUAGE_ID = question.languages.findIndex(language => language.name == languageName);
            // Add the processed question to the questionsData in the same position
            questionsData[i][languageName].statement = question.languages[CHOOSEN_LANGUAGE_ID].statement;
            questionsData[i][languageName].options = question.languages[CHOOSEN_LANGUAGE_ID].options;
            questionsData[i][languageName].answer = question.languages[CHOOSEN_LANGUAGE_ID].answer;
        }
    }
    return questionsData;
}

function exportQuestionaryLaTex(questions) {
    var texContent = generateLaTexContent(questions);
    var data = new Blob([texContent], {type: 'application/x-latex'});
    var url = window.URL.createObjectURL(data);
    var a = document.createElement("a");
    a.href = url;
    var language = Object.keys(questions[0])[0];
    a.download = language + "_cuestionario.tex";
    a.click();
    window.URL.revokeObjectURL(url);
}

function generateLaTexContent(questions) {
    var texCode = "\\documentclass{article}\n";
    texCode += "\\begin{document}\n\n";
    texCode += "\\section*{Preguntas}\n\n";
    texCode += "\\begin{tabular}{|p{6cm}|p{6cm}|p{4cm}|}\n";
    texCode += "\\hline\n";
    texCode += "\\textbf{Pregunta} & \\textbf{Opciones} & \\textbf{Respuesta} \\\\ \n";
    texCode += "\\hline\n";
    questions.forEach(function(question) {
        var statement = question[Object.keys(question)[0]].statement;
        var options = question[Object.keys(question)[0]].options.join(", ");
        var answer = question[Object.keys(question)[0]].answer.join(", ");
        texCode += statement + " & " + options + " & " + answer + " \\\\ \n";
        texCode += "\\hline\n";
    });
    texCode += "\\end{tabular}\n\n";
    texCode += "\\end{document}\n";
    return texCode;
}



/*************
 ** Read DB **
 *************/

// Get all the possible languages from the database
function getLanguagesNames() {
    fetch('/newQuestion/getLanguagesNames', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la base de datos');
        }
        return response.json();
    }
    )
    .then(responseData => {
        console.debug('Respuesta del servidor:', responseData);
        addOptionNames(responseData);
        return responseData;
    })
    .catch(error => {
        console.error('Error en la solicitud:', error.message);
    }
    );
}

async function getTopicsByLanguage(language) {
    try {
        const response = await fetch('/questionary/getTopicsByLanguage:' + encodeURIComponent(language), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la base de datos');
        }
        
        const responseData = await response.json();
        console.debug('Respuesta del servidor:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
        throw error;
    }
}

async function getTopics() {
    try {
        const response = await fetch('/getTopics', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la base de datos');
        }
        
        const responseData = await response.json();
        console.debug('Respuesta del servidor:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
        throw error;
    }
}

// Get the questions from the database
async function getAllDBData() {
    try {
        const response = await fetch('/questionary/getAllQuestions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos de la base de datos');
        }

        const responseData = await response.json();
        console.debug('Respuesta del servidor:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
        throw error;
    }
}


async function getQuestionById(questionId) {
    try {
        const response = await fetch('/questionary/getQuestionById:' + questionId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos de la base de datos');
        }

        const responseData = await response.json();
        console.debug('Respuesta del servidor:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
        throw error;
    }
}

async function getQuestionsByLanguage(language) {
    try {
        const response = await fetch('/questionary/getQuestionsByLanguage:' + language, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos de la base de datos');
        }

        const responseData = await response.json();
        console.debug('Respuesta del servidor:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
        throw error;
    }
}

function dropQuestionById(questionId) {
    fetch('/questionary/deleteQuestionById:' + questionId, {
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

function dropdownLanguagesListener() {
    var li = document.getElementById("languagesDropdown");
    li.addEventListener("click", function() {
        var a = li.getElementsByClassName("dropdown-toggle")[0];
        // Toggle the value of aria-expanded between true and false when clicked
        a.setAttribute("aria-expanded", a.getAttribute("aria-expanded") === "false" ? "true" : "false");
        // Toggle class show from a
        a.classList.toggle("show");
        var div = li.getElementsByClassName("dropdown-menu")[0];
        // Toggle class show from the div element
        div.classList.toggle("show");

        // Prevent the dropdown from closing when clicking on the div
        if (div.classList.contains("show")) {
            div.addEventListener("click", function(event) {
                event.stopPropagation();
            });
        }

        // Close the dropdown when clicking outside of it
        document.addEventListener("click", function(event) {
            if (!li.contains(event.target)) {
                a.setAttribute("aria-expanded", "false");
                a.classList.remove("show");
                div.classList.remove("show");
            }
        });
    });
}

function switchedLanguagesListener(switchInput, language) {
    switchInput.addEventListener("change", function() {
        // If the input is checked, add the tab
        if (this.checked) {
            addLanguagesTab(language);
            updateQuestionsInFolios();
        }
        // If the input is not checked, remove the tab
        else {
            removeLanguagesTab(language);
        }
    });
}

function expandTopicListener(button, div) {
    button.addEventListener("click", function() {
        // Toggle the value of aria-expanded between true and false when clicked
        this.setAttribute("aria-expanded", this.getAttribute("aria-expanded") === "true" ? "false" : "true");            
        
        // Toggle class collapse from the div element, the next sibling of the button
        div.classList.toggle("collapse");
    });
}

function selectQuestionListener(button) {   
    button.addEventListener("click", function() {
        disableQuestion(button);
        var questionId = button.id.split("-")[1];      
        distributeQuestionInFolios(questionId);
    });
}

function removeQuestionFromFolioListener(questionId) {
    // newQuestion.parentElement.removeChild(newQuestion);   
    // Remove the question from each folio
    var folios = document.getElementById("myTabContent").getElementsByClassName("folio-container");
    for (var i = 0; i < folios.length; i++) {
        var questions = folios[i].getElementsByClassName("question");
        for (var j = 0; j < questions.length; j++) {
            if (questions[j].id.split("-")[1] == questionId) {
                questions[j].parentElement.removeChild(questions[j]);
            }
        }
        // The same for empty questions
        var emptyQuestions = folios[i].getElementsByClassName("empty-question");
        for (var j = 0; j < emptyQuestions.length; j++) {
            if (emptyQuestions[j].id.split("-")[1] == questionId) {
                emptyQuestions[j].parentElement.removeChild(emptyQuestions[j]);
            }
        }
    }     
    disableQuestion(document.getElementById("button-" + questionId));
}

function exportQuestionaryListener() {
    var button = document.getElementById("exportQuestionary");
    button.addEventListener("click", function() {
        var notEmptyFolios = getNotEmptyFoliosIds();
        notEmptyFolios.forEach(async function(folioId) {
            var questions = {};
            try {
                questions = await processData(catchQuestionary(folioId));
            }
            catch (error) {
                console.error('Error en la solicitud:', error.message);
            }
            exportQuestionaryLaTex(questions);
        });
    });
}

function deleteQuestionFromDBListener(questionId) {
    // Set an alert to confirm the deletion
    var confirmation = confirm("¿Estás seguro de que quieres eliminar esta pregunta de la BD?");
    if (!confirmation) {
        return;
    }
    dropQuestionById(questionId);
    // Remove the question from the sidebar
    var li = document.getElementById("button-" + questionId).parentElement;
    
    // If the aren´t questions in the topic, delete the topic
    var topic = li.parentElement.parentElement.parentElement;
    
    li.parentElement.removeChild(li);    
    if (topic.getElementsByTagName("li").length == 0) {
        topic.parentElement.removeChild(topic);
    }
    
    // If the aren't topics in the sidebar, create a no-topics element
    var sidebar = document.getElementById("sidebar");
    if (document.getElementById("sidebarQuestionsList").childElementCount == 1) {
        createNoTopicsElement(document.getElementById("sidebarQuestionsList"));
    }

    removeQuestionFromFolioListener(questionId);
}

function randomQuestionListener() {
    var button = document.getElementById("randomizeQuestions");
    button.addEventListener("click", function() {
        // Check if there are questions in the Español folio and if not, return
        var questions = document.getElementById("myTabContent").getElementsByClassName("language-Español")[0].getElementsByClassName("question");
        //var questions = document.getElementById("list-folio_0").getElementsByClassName("question");
        if (questions.length == 0) {
            return;
        }

        // Add the questions to the folios in a random order
        // Initialize the array randomQuestions with the questions in the Español folio but not a copy of it
        var randomQuestions = Array.from(questions);
        // Shuffle the array
        for (var i = randomQuestions.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            [randomQuestions[i], randomQuestions[j]] = [randomQuestions[j], randomQuestions[i]];
        }

        // Remove all the questions from all the folios
        var folios = document.getElementById("myTabContent").getElementsByClassName("folio-container");
        for (var i = 0; i < folios.length; i++) {
            var questionsFolio = folios[i].getElementsByClassName("question");
            questionsFolio = Array.from(questionsFolio);
            questionsFolio.forEach(function(question) {
                question.parentElement.removeChild(question);
            });
        }

        var i = 0;
        function nextQuestion() {
            if (i < randomQuestions.length) {
                var questionId = randomQuestions[i].id.split("-")[1];
                distributeQuestionInFolios(questionId).then(nextQuestion);
                i++;
            }
        }
        nextQuestion();
    });
}


/****************
 ** DOM Loaded **
 ****************/

document.addEventListener("DOMContentLoaded", function() {
    getLanguagesNames();
    //getAllDBData();
    listSidebarData();
    dropdownLanguagesListener();
    exportQuestionaryListener();
    randomQuestionListener();
});