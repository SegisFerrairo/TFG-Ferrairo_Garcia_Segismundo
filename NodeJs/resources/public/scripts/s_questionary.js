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

function generateRandomSeed() {
    // Get the current date in milliseconds
    var nowDate = new Date();

    // Obtain the seconds from the midnight UTC of January 1, 1970
    var seed = Math.floor(nowDate.getTime()) % 1000;

    return seed;
}

function shuffleArray(array, seed) {                // <-- ADDED ARGUMENT
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {  
      // Pick a remaining element…
      i = Math.floor(random(seed) * m--);        // <-- MODIFIED LINE
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
      ++seed                                     // <-- ADDED LINE
    }
  
    return array;
}
  
function random(seed) {
    var x = Math.sin(seed++) * 10000; 
    return x - Math.floor(x);
}


function getDifficultyValue() {
    var radios = document.getElementById('clasification').getElementsByTagName('input');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}

function resetDifficulty() {
    var radios = document.getElementById('clasification').getElementsByTagName('input');
    for (var i = 0; i < radios.length; i++) {
        radios[i].checked = false;
    }
}

function resetSidebar() {
    var sidebar = document.getElementById("sidebarQuestionsList");
    // Remove all children from the sidebar, all of them
    while (sidebar.firstChild) {
        sidebar.removeChild(sidebar.firstChild);
    }
}

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
    // var links = languagesTabList.getElementsByTagName("a"); Exclude the first tab, the header
    var links = Array.from(languagesTabList.getElementsByTagName("a")).slice(1);
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

function addCabeceraTab() {
    var languagesTabList = document.getElementById("languagesTabList");

    var li = document.createElement("li");
    li.className = "nav-item";
    li.role = "presentation";
    var a = document.createElement("a");
    a.id = "header-linkTab";
    a.className = "nav-link active";
    a.role = "tab";
    a.setAttribute("aria-selected", "false");
    a.tabIndex = "-1";
    a.textContent = "Cabecera";

    var folioHeaderId = "folioHeader";

    a.addEventListener("click", function() {openTab(a.id, folioHeaderId)});
    li.appendChild(a);
    languagesTabList.appendChild(li);

    addFolioHeader(folioHeaderId);
}

function addFolioHeader(folioHeaderId) {
    var myTabContent = document.getElementById("myTabContent");

    var divContainer = document.createElement("div");
    divContainer.id = folioHeaderId;
    divContainer.className = "tab-pane fade folio-container";
    // Add language as a class to the div
    // div.classList.add("language-"+language);
    var divHeader = document.createElement("div");
    divHeader.className = "folio-header";
    divHeader.id = "header-" + folioHeaderId;  
    divHeader.style.padding = "30px";


    var divTop = document.createElement("div");
    // display: flex; justify-content: space-between;
    divTop.className = "d-flex justify-content-between";

    var divTitle = document.createElement("div");

    var div = document.createElement("div");
    div.className = "form-floating";
    div.style.width = "400px";

    var input = document.createElement("input");
    input.type = "input";
    input.className = "form-control mb-2";
    input.id = "floatingTopic-title";
    div.appendChild(input);

    var label = document.createElement("label");
    label.htmlFor = "floatingTopic-title";
    label.textContent = "Título del cuestionario";
    div.appendChild(label);

    divTitle.appendChild(div);


    var div = document.createElement("div");
    div.className = "form-floating";
    var input = document.createElement("input");
    input.type = "input";
    input.className = "form-control mb-2";
    input.id = "floatingTopic-subtitle";
    div.appendChild(input);

    var label = document.createElement("label");
    label.htmlFor = "floatingTopic-subtitle";
    label.textContent = "Subtítulo del cuestionario";
    div.appendChild(label);

    divTitle.appendChild(div);

    divTop.appendChild(divTitle);

    var divOptions = document.createElement("div");
    divTop.className = "d-flex justify-content-between";

    var div = document.createElement("div");
    div.className = "form-floating";
    var input = document.createElement("input");
    input.type = "input";
    input.className = "form-control mb-2";
    input.id = "floatingTopic-calification";
    div.appendChild(input);

    var label = document.createElement("label");
    label.htmlFor = "floatingTopic-calification";
    label.textContent = "Puntuación máxima";
    div.appendChild(label);

    divOptions.appendChild(div);

    var div = document.createElement("div");
    div.className = "form-floating";
    var input = document.createElement("input");
    input.type = "input";
    input.className = "form-control mb-2";
    input.id = "floatingTopic-version";
    div.appendChild(input);

    var label = document.createElement("label");
    label.htmlFor = "floatingTopic-version";
    label.textContent = "Número de versiones";
    div.appendChild(label);

    divOptions.appendChild(div);

    divTop.appendChild(divOptions);

    divHeader.appendChild(divTop);

    var div = document.createElement("div");
    div.className = "form-check form-switch mt-2";
    var input = document.createElement("input");
    input.className = "form-check-input";
    input.type = "checkbox";
    input.id = "answersSwitch";
    input.checked = true;
    div.appendChild(input);

    var label = document.createElement("label");
    label.className = "form-check-label";
    label.htmlFor = "answersSwitch";
    label.innerHTML = "<small>Incluir respuestas</small>";
    div.appendChild(label);

    divHeader.appendChild(div);
    
    var ul = document.createElement("ul");
    ul.className = "list-unstyled ps-0";
    var li = document.createElement("li");
    li.className = "border-top my-3";
    ul.appendChild(li);
    divHeader.appendChild(ul);

    var div = document.createElement("div");
    div.className = "form-group";
    var label = document.createElement("label");
    label.htmlFor = "exampleTextarea";
    label.textContent = "Criterios de corrección:";

    var p = document.createElement("p");
    p.className = "mt-2";

    var popoverButton = document.createElement("button");
    popoverButton.type = "button";
    popoverButton.id = "popoverButton-criteriaUseExample";
    popoverButton.className = "btn btn-secondary me-1";
    popoverButton.textContent = "Ejemplo";
    p.appendChild(popoverButton);

    var popoverDiv = document.createElement("div");
    popoverDiv.className = "popover bs-popover-auto fade show mt-1";
    popoverDiv.setAttribute("role", "tooltip");
    popoverDiv.id = "popoverDiv-criteriaUseExample";
    popoverDiv.setAttribute("data-popper-placement", "bottom");

    popoverDiv.style.minWidth = "500px";
    popoverDiv.style.position = "absolute";
    popoverDiv.style.display = "none";

    var copyClipboard = document.createElement("button");
    copyClipboard.type = "button";
    copyClipboard.className = "btn btn-outline-primary btn-sm";
    copyClipboard.textContent = "Copiar al portapapeles";
    copyClipboard.style.float = "right";
    copyClipboard.style.margin = "5px";
    popoverDiv.appendChild(copyClipboard);

    var popoverHeader = document.createElement("h3");
    popoverHeader.className = "popover-header";
    popoverHeader.textContent = "Ejemplo de uso";

    popoverDiv.appendChild(popoverHeader);

    var popoverBody = document.createElement("div");
    popoverBody.className = "popover-body";
    popoverBody.innerHTML = "Duración máxima del examen 2 horas<br>\nNormas del test:<br>\n-> El test se recogerá a los 30 minutos del comienzo del examen<br>\n-> Cada respuesta incorrecta resta 1/2 respuesta correcta<br>\n-> No olvides indicar la modalidad del test en la hoja de respuestas";

    popoverDiv.appendChild(popoverBody);
    document.body.appendChild(popoverDiv);

    popoverListener(popoverButton, popoverDiv);

    copyClipboard.addEventListener("click", function() {
        navigator.clipboard.writeText(popoverBody.textContent);
    });

    var small = document.createElement("small");
    var strongContent = "<strong>Consejo: </strong>";
    small.innerHTML = "(" + strongContent + "Usa -> para crear sublistas)";
    p.appendChild(small);

    label.appendChild(p);
    div.appendChild(label);

    var textarea = document.createElement("textarea");
    textarea.className = "form-control";
    textarea.id = "exampleTextarea";
    textarea.rows = "3";
    div.appendChild(textarea);
    divHeader.appendChild(div);

    var ul = document.createElement("ul");
    ul.className = "list-unstyled ps-0";
    var li = document.createElement("li");
    li.className = "border-top my-3";
    ul.appendChild(li);
    divHeader.appendChild(ul);

    var ul = document.createElement("ul");
    ul.className = "single-choice";
    var li = document.createElement("li");
    var label = document.createElement("label");
    label.textContent = "Preguntas con solo una opción posible";
    var small = document.createElement("small");
    small.appendChild(label);
    li.appendChild(small);
    ul.appendChild(li);
    divHeader.appendChild(ul);

    var ul = document.createElement("ul");
    ul.className = "multiple-choice";
    var li = document.createElement("li");
    var label = document.createElement("label");
    label.textContent = "Preguntas con varias opciones posibles";
    var small = document.createElement("small");
    small.appendChild(label);
    li.appendChild(small);
    ul.appendChild(li);
    divHeader.appendChild(ul);

    divContainer.appendChild(divHeader);

    myTabContent.appendChild(divContainer);

    popoverDivListener();
}

function addFolio(folioId, language) {
    var myTabContent = document.getElementById("myTabContent");

    var div = document.createElement("div");
    div.id = folioId;
    div.className = "tab-pane fade folio-container";
    // Add language as a class to the div
    div.classList.add("language-"+language);
    div.style.padding = "50px";

    var divHeader = document.createElement("div");
    divHeader.className = "folio-header";
    divHeader.id = "header-" + folioId;    

    var button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline-primary mb-3";
    button.textContent = "Espacio reservado para la cabecera del cuestionario";
    button.style.width = "100%";

    button.addEventListener("click", function() { openTab("header-linkTab", "folioHeader") });

    divHeader.appendChild(button);

    var ul = document.createElement("ul");
    ul.className = "list-unstyled ps-0";
    var li = document.createElement("li");
    li.className = "border-top my-3";
    ul.appendChild(li);
    divHeader.appendChild(ul);

    div.appendChild(divHeader);

    var divBody = document.createElement("div");
    divBody.className = "folio-body";
    var ol = document.createElement("ol");
    ol.className = "list-group ms-3";
    ol.id = "list-" + folioId;
    divBody.appendChild(ol);
    div.appendChild(divBody);

    myTabContent.appendChild(div);

    //addFolioHeader(divHeader.id);
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
    // Remove all the topics from the sidebar
    resetSidebar();

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

    var searchQuestionContent = document.getElementById("searchQuestionContent").value;
    if (searchQuestionContent != "") {
        // Filter the data by question.statements, question.topics and question.options
        data = data.filter(question => question.languages[CHOOSEN_LANGUAGE_ID].statement.toLowerCase().includes(searchQuestionContent.toLowerCase()) || question.topic.toLowerCase().includes(searchQuestionContent.toLowerCase()) || question.languages[CHOOSEN_LANGUAGE_ID].options.some(option => option.toLowerCase().includes(searchQuestionContent.toLowerCase())));
    }

    var difficulty = getDifficultyValue();

    if (difficulty != undefined) {
        data = data.filter(question => question.difficulty == difficulty);
    }


    // Obtain the topics from the questions data
    var topics = data.map(question => question.topic);
    topics = topics.filter((topic, index) => topics.indexOf(topic) === index); // Remove duplicates
    // Oder alphabetically
    topics.sort();

    topics.forEach(function(topic) {
        var li_topic = document.createElement("li");
        li_topic.id = "topic-" + topic
        li_topic.className = "topic mb-1";

        var button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-toggle align-items-center rounded collapsed";
        button.setAttribute("data-bs-toggle", "collapse");
        button.setAttribute("data-bs-target", "topic-" + topic + "-collapse");
        // button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-expanded", "true");
        

        var span = document.createElement("span");
        span.className = "svg-container me-1";
        button.textContent = topic;
        button.insertBefore(span, button.firstChild);

        li_topic.appendChild(button);        

        var div = document.createElement("div");
        // div.className = "collapse topic-container";
        div.className = "topic-container";
        div.id = "topic-" + topic + "-collapse";
        var ul = document.createElement("ul");
        ul.className = "btn-toggle-nav list-unstyled fw-normal pb-1 small";

        expandTopicListener(button,div);

        data.forEach(function(question) {
            if (question.topic == topic && (difficulty != undefined ? question.difficulty == difficulty : true)) {
                var li = document.createElement("li");
                li.className = "question mb-1";
                li.style.listStyleType = "disc";

                var divContainer = document.createElement("div");
                divContainer.className = "d-flex";
                var div = document.createElement("div");
                var button = document.createElement("button");
                button.type = "button";
                button.id = "button-" + question._id;
                button.className = "btn btn-link cut-text me-3";
                // CHOOSEN_LANGUAGE_ID is the index of the language in the languages array
                CHOOSEN_LANGUAGE_ID = question.languages.findIndex(language => language.name == CHOOSEN_LANGUAGE);
                button.textContent = question.languages[CHOOSEN_LANGUAGE_ID].statement; 
                
                div.appendChild(button);

                // Show the difficulty of the question under the statement
                var span = document.createElement("span");
                span.className = "badge rounded-pill";
                // span.textContent = "dificultad " + question.difficulty;
                for (var i = 0; i < question.difficulty; i++) {
                    span.textContent += "★";
                }
                span.style.color = "orange";
                span.style.padding = "0px";
                div.appendChild(span);

                divContainer.appendChild(div);
                                
                li.appendChild(divContainer);

                var button_edit = document.createElement("button");
                button_edit.type = "button";
                button_edit.id = "button_edit-" + question._id;
                button_edit.className = "btn btn-outline-secondary btn-edit btn-sm me-2";

                // use the svg /images/pencil-square.svg for button_edit
                var img_edit = document.createElement("img");
                img_edit.src = "/images/pencil-square.svg";
                img_edit.alt = "Editar";
                img_edit.width = "16";
                img_edit.height = "16";
                button_edit.appendChild(img_edit);

                divContainer.appendChild(button_edit);
                li.appendChild(divContainer);

                button_edit.addEventListener("click", function() {
                    editQuestion(question._id);
                });

                var button_delete = document.createElement("button");
                button_delete.type = "button";
                button_delete.id = "button_delete-" + question._id;
                button_delete.className = "btn btn-outline-danger btn-delete btn-sm";

                // use the svg /images/trash.svg for button_delete
                var img_delete = document.createElement("img");
                img_delete.src = "/images/trash-fill.svg";
                img_delete.alt = "Eliminar";
                img_delete.width = "16";
                img_delete.height = "16";
                button_delete.appendChild(img_delete);                
                                
                divContainer.appendChild(button_delete);
                li.appendChild(divContainer);
                ul.appendChild(li);

                // If question is already in the folio, disable the button
                var folioId = "folio_0"; // The first folio is the default one
                if (document.getElementById("list-" + folioId) != null) {
                    var questions = document.getElementById("list-" + folioId).getElementsByClassName("question");
                    for (var j = 0; j < questions.length; j++) {
                        if (questions[j].id.split("-")[1] == question._id) {
                            disableQuestion(button);
                        }
                    }
                }            
           
                selectQuestionListener(button);
                button_delete.addEventListener("click", function() {                    
                    deleteQuestionFromDBListener(question._id);
                });
            }
        });
        
        // If a topic is empty, remove it from the sidebar before adding it
        if (ul.children.length > 0) {
            div.appendChild(ul);
            li_topic.appendChild(div);
            document.getElementById("sidebarQuestionsList").appendChild(li_topic);
        }
        
    });

}

function addOptionNames(languages) {
    var fieldset = document.getElementById("choosenLanguages").getElementsByTagName("fieldset")[0];

    // Create Cabecera Tab
    addCabeceraTab("Cabecera");

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
    label.textContent = "Error: La pregunta no está en el idioma " + language;
    li_q.appendChild(label);

    var button = document.createElement("button");
    button.type = "button";
    button.className = "btn-close question-close";
    button.addEventListener("click", function() {
        removeQuestionFromFolio(question._id);
    });
    li_q.appendChild(button);

    folioList.appendChild(li_q);
}

function addQuestion(folioId, question) {
    var folioList = document.getElementById("list-" + folioId);

    var li_q = document.createElement("li");
    li_q.id = "question-" + question._id;
    // Add topic and difficulty as classes to the li
    li_q.className = "question topic-\"" + question.topic + "\" \"" + "difficulty-\"" + question.difficulty + "\"";
    var label = document.createElement("label");
    label.textContent = question.languages[CHOOSEN_LANGUAGE_ID].statement;
    li_q.appendChild(label);

    var button = document.createElement("button");
    button.type = "button";
    button.className = "btn-close question-close";
    button.addEventListener("click", function() {     
        removeQuestionFromFolio(question._id);
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
                statement: "Error: La pregunta no está en el idioma " + languageName,
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
            questionsData[i][languageName].statement = question.languages[CHOOSEN_LANGUAGE_ID].statement;
            questionsData[i][languageName].options = question.languages[CHOOSEN_LANGUAGE_ID].options;
            questionsData[i][languageName].answer = question.languages[CHOOSEN_LANGUAGE_ID].answer;
        }
    }
    return questionsData;
}

/**********
 ** Edit **
 **********/

function editQuestion(questionId) {
    // Send the questionId to the newQuestion page and redirect to it
    sessionStorage.setItem("questionId", questionId);
    window.location.href = "/newQuestion";
}



/************
 ** Export **
 ************/

/*----------*
*   LaTex   *
*-----------*/

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

function processCriteria(criteria) {
    var criteriaArray = criteria.split("\n");
    var processedCriteria = [];
    var subcriteria = [];
    for (var i = 0; i < criteriaArray.length; i++) {
        if (criteriaArray[i].startsWith("->")) {
            subcriteria.push(criteriaArray[i].substring(3));
        }
        else {
            if (subcriteria.length > 0) {
                processedCriteria.push(subcriteria);
                subcriteria = [];
            }
            processedCriteria.push(criteriaArray[i]);
        }
    }
    if (subcriteria.length > 0) {
        processedCriteria.push(subcriteria);
    }
            
    return processedCriteria;
}

function catchHeaderData() {
    var headerData = {};
    headerData.title = document.getElementById("floatingTopic-title").value;
    headerData.subtitle = document.getElementById("floatingTopic-subtitle").value;
    headerData.calification = document.getElementById("floatingTopic-calification").value;
    headerData.versions = document.getElementById("floatingTopic-version").value;
    headerData.answers = document.getElementById("answersSwitch").checked;
    var criteria = document.getElementById("exampleTextarea").value;
    headerData.criteria = processCriteria(criteria);

    return headerData;
}

function generateLaTexContent(questions) {
    var headerData = catchHeaderData();
    var title = headerData.title;
    var subtitle = headerData.subtitle;
    var calification = headerData.calification;
    var versions = headerData.versions;
    // if versions is "", it is 3 by default
    if (versions == "") {
        versions = 1;
    }
    var answers = headerData.answers;
    var criteria = headerData.criteria;
    // if criteria is [""] or [], it is an empty array
    if (criteria.length == 1 && criteria[0] == "") {
        criteria = [];
    }    

    var texCode = generateLaTexPackages();
    texCode += generateLaTexChoiceCommand();
    texCode += generateLaTexVersionsAndAnswers(versions, answers);
    texCode += "\\begin{document}\n";  

    texCode += generateLaTexHeader(title, subtitle, criteria, calification);

    texCode += generateLaTexQuestions(questions);

    texCode += "\\end{document}";
    return texCode;
}

function generateLaTexPackages() {
    var texCode = "\\documentclass[a4paper, 10pt]{examdesign}\n";
    texCode += "\\setrandomseed{555}\n";
    texCode += "\\usepackage[spanish]{babel}\n";
    texCode += "\\usepackage[utf8]{inputenc}\n";
    texCode += "\\usepackage{palatino}\n";
    texCode += "\\usepackage{color}\n";
    texCode += "\\usepackage[top=1.5cm, bottom=2cm, left=1.5cm, right=1.5cm]{geometry}\n";
    texCode += "\\usepackage{enumitem}\n";
    texCode += "\\pagenumbering{gobble} % disable page numbering\n\n";
    texCode += "\\usepackage[T1]{fontenc}\n";
    texCode += "\\newcommand{\\role}[1] {\\guillemotleft #1\\guillemotright}\n";
    return texCode;
}

function generateLaTexChoiceCommand() {
    var texCode = "% Custom command to handle the \"!\" option in choices\n";
    texCode += "\\makeatletter\n";
    texCode += "\\renewcommand{\\exam@ShortKeyChoice}[2][]{%\n";
    texCode += "  \\if#1!%\n";
    texCode += "    \\ifOneCorrectAnswerAlreadyGiven\n";
    texCode += "    , (\\alph{choice})\n";
    texCode += "    \\else\n";
    texCode += "    \\exam@MultipleChoiceShortKeyPrefix\n";
    texCode += "    (\\alph{choice})%\n";
    texCode += "    \\OneCorrectAnswerAlreadyGiventrue\n";
    texCode += "    \\fi\n";
    texCode += "   \\fi\n";
    texCode += "  \\stepcounter{choice}%\n";
    texCode += "  \\ignorespaces}\n";
    texCode += "\\makeatother\n";
    return texCode;
}

function generateLaTexVersionsAndAnswers(versions=1, answers=true) {
    var texCode = "\\NumberOfVersions{" + versions + "}\n";

    if (answers) {
        texCode += "\\ShortKey\n";
    }
    else {
        texCode += "\\NoKey\n";
    }

    texCode += "\\begin{keytop} {\\huge Respuestas correctas para la Modalidad {\\bf \\arabic{version}}}\n";
    texCode += "\\end{keytop}\n";

    return texCode;
}

function generateLaTexHeader(title, subtitle, criteria, calification) {
    var texCode = "\\begin{examtop}\n";
    // If title and subtitle are not empty, add them
    if (title != undefined && title != "") {
        texCode += "\\begin{center}\n";
        texCode += "\\begin{huge}\n";
        texCode += title + "\\\\ \n";
        texCode += "\\end{huge}\n";
    }
    if (subtitle != undefined && subtitle != "") {
        texCode += "\\begin{Large}\n";
        texCode += subtitle + "\\\\ \n";
        texCode += "\\end{Large}\n";
        texCode += "\\end{center}\n";
    }
    texCode += "\\vspace{0.2cm}\n";
    if (criteria != undefined && criteria.length > 0) {
        texCode += "\\begin{itemize}[leftmargin=1.5cm]\n";
        criteria.forEach(function(rule) {
            // if rule is an array, it is a list of rules
            if (Array.isArray(rule)) {
                texCode += "\\begin{itemize}\n";
                rule.forEach(function(subrule) {
                    texCode += "\\item " + subrule + "\n";
                });
                texCode += "\\end{itemize}\n";
            }
            else {
                texCode += "\\item " + rule + "\n";
            }
        });
        texCode += "\\end{itemize}\n";
    }
    texCode += "\\paragraph{}\n";
    if (calification != undefined && calification != "") {
        texCode += "\\textbf{Test (" + calification + " puntos)} --- ";
    }
    texCode += "\\textbf{Modalidad \\arabic{version}}\n";

    texCode += "\\end{examtop}\n";
    return texCode;
}

function generateLaTexQuestions(questions) {
    var texCode = "\\begin{multiplechoice}[examcolumns=1]\n";
    questions.forEach(function(question) {
        var language = Object.keys(question)[0];
        var statement = question[language].statement;
        var options = question[language].options;
        var answer = question[language].answer;
        texCode += "\\begin{question}\n";
        // if the statement starts with "Error", it is an empty question
        if (statement.startsWith("Error")) {
            texCode += "\\textcolor{red}{Pregunta vacía}\n";
            texCode += "\\choice{\\textcolor{red}{"+statement+"}}\n";
        }
        else {        
            texCode += statement + "\n";
            options.forEach(function(option) {
                var correct = answer.includes(options.indexOf(option)+1) ? "[!]" : "";
                texCode += "\\choice" + correct + "{" + option + "}\n";
            });
        }
        texCode += "\\end{question}\n";
    });
    texCode += "\\end{multiplechoice}\n";
    return texCode;
}

/*-----------*
*  Markdown  *
*------------*/

function exportQuestionaryMarkdown(questions, randomSeed) {
    var mdContent = generateMarkdownContent(questions, randomSeed);
    var data = new Blob([mdContent], {type: 'text/markdown'});
    var url = window.URL.createObjectURL(data);
    var a = document.createElement("a");
    a.href = url;
    var language = Object.keys(questions[0])[0];
    a.download = language + "_cuestionario.md";
    a.click();
    window.URL.revokeObjectURL(url);
}

function generateMarkdownContent(questions, randomSeed) {
    var headerData = catchHeaderData();
    var title = headerData.title;
    var subtitle = headerData.subtitle;
    var calification = headerData.calification;
    var versions = headerData.versions;
    // if versions is "", it is 3 by default
    if (versions == "") {
        versions = 1;
    }
    var answers = headerData.answers;
    var criteria = headerData.criteria;
    // if criteria is [""] or [], it is an empty array
    if (criteria.length == 1 && criteria[0] == "") {
        criteria = [];
    }

    var mdCode = generateMarkdownHeader(title, subtitle, criteria);
    // mdCode += generateMarkdownQuestions(questions, answers);
    // For the number of versions, randomize the questions and add them to the markdown content
    for (var i = 0; i < versions; i++) {
        if (calification != undefined && calification != "") {
            mdCode += "### Test (" + calification + " puntos) - ";
        }
        if (versions > 1) {
            questions = shuffleArray(questions, randomSeed);
            // Change the seed for the next version
            randomSeed = randomSeed + 1;
        }
        mdCode += "Modalidad " + (i+1) + "\n\n";
        mdCode += generateMarkdownQuestions(questions, answers);
    }
    return mdCode;
}

function generateMarkdownHeader(title, subtitle, criteria) {
    var mdCode = "";
    // If title and subtitle are not empty, add them
    if (title != undefined && title != "") {
        mdCode += "# " + title + "\n\n";
    }
    if (subtitle != undefined && subtitle != "") {
        mdCode += "## " + subtitle + "\n\n";
    }
    if (criteria != undefined && criteria.length > 0) {
        mdCode += "### Normas del test\n";
        criteria.forEach(function(rule) {
            // if rule is an array, it is a list of rules
            if (Array.isArray(rule)) {
                rule.forEach(function(subrule) {
                    mdCode += "  - " + subrule + "\n";
                });
            }
            else {
                mdCode += "- " + rule + "\n";
            }
        });
        mdCode += "\n";
    }

    return mdCode;
}

function generateMarkdownQuestions(questions, answers) {
    var mdCode = "";
    var questionNumber = 1; // Variable para la numeración automática

    questions.forEach(function(question) {
        var language = Object.keys(question)[0];
        var statement = question[language].statement;
        var options = question[language].options;
        var answer = question[language].answer;
        
        // if the statement starts with "Error", it is an empty question
        if (statement.startsWith("Error")) {
            mdCode += "$\\color{red}{"; // Cambia el color de la pregunta
            mdCode += questionNumber + ". Pregunta \\ vacía}$\n";
            mdCode += "$\\color{red}{"; 
            statement = statement.replace(/ /g, " \\ ");
            mdCode += "\\ \\ \\ " + statement + "}$\n";
        } else {
            mdCode += questionNumber + ". " + statement + "\n"; // Numeración automática
            options.forEach(function(option) {
                var correct = "";
                if (answers) {
                    correct = answer.includes(options.indexOf(option)+1) ? "[!] " : "";
                }
                mdCode += "  " + String.fromCharCode(97 + options.indexOf(option)) + ". " + correct + option + "\n"; // Utiliza letras para las opciones
            });
        }
        questionNumber++; // Incrementa el número de la pregunta
        mdCode += "\n<br>\n\n";
    });

    return mdCode;
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

async function getQuestionById(questionId) {
    try {
        const response = await fetch('/getQuestionById:' + questionId, {
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


/***************
 ** Post DB **
 ***************/

async function sendFormData(data) {
    try {
        const response = await fetch('/addQuestion', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const responseData = await response.json();
        console.debug('Respuesta del servidor:', responseData);
        return responseData;
    } catch (error) {
        //console.error('Error en la solicitud:', error.message);
        throw error;
    }
}

/*************
 ** Drop DB **
 *************/

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

function dropdownExportListener() {
    var button = document.getElementById("exportDropdown");
    button.addEventListener("click", function() {
        // var a = button.getElementsByClassName("dropdown-toggle")[0];
        // Toggle the value of aria-expanded between true and false when clicked
        button.setAttribute("aria-expanded", button.getAttribute("aria-expanded") === "false" ? "true" : "false");
        // Toggle class show from a
        button.classList.toggle("show");
        var div = button.nextElementSibling;
        // Toggle class show from the div element
        div.classList.toggle("show");

        // Close the dropdown when clicking outside of it
        document.addEventListener("click", function(event) {
            if (!button.contains(event.target)) {
                button.setAttribute("aria-expanded", "false");
                button.classList.remove("show");
                div.classList.remove("show");
            }
        });

        // Add a listener to the dropdown items
        var items = div.getElementsByClassName("dropdown-item");
        for (var i = 0; i < items.length; i++) {
            items[i].addEventListener("click", function() {
                // Get the content of the item
                var content = this.textContent;
                // Replace the content of the exportQuestionary button in strong element
                var strong = document.getElementById("exportQuestionary").getElementsByTagName("strong")[0];
                strong.textContent = content;
            });
        }
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

function removeQuestionFromFolio(questionId) {
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
        var content = button.getElementsByTagName("strong")[0].textContent;
        var notEmptyFolios = getNotEmptyFoliosIds();
        let seed = generateRandomSeed();

        notEmptyFolios.forEach(async function(folioId) {
            var randomSeed = seed;
            var questions = {};
            try {
                questions = await processData(catchQuestionary(folioId));
            }
            catch (error) {
                console.error('Error en la solicitud:', error.message);
            }

            if (content == "Markdown") {
                exportQuestionaryMarkdown(questions, randomSeed);
            }
            else if (content == "LaTeX") {
                exportQuestionaryLaTex(questions);            
            }
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
    
    // Reload the page
    location.reload();
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

function resetDifficultyListener() {
    var button = document.getElementById("resetDifficultyLabel");
    button.addEventListener("click", function() {   
        resetDifficulty();        
        listSidebarData();
    });
}

// when difficulty is changed, update the sidebar
function difficultyListener() {
    var radios = document.getElementById('clasification').getElementsByTagName('input');
    for (var i = 0; i < radios.length; i++) {
        radios[i].addEventListener("change", function() {
            listSidebarData();
        });
    }
}

function popoverListener(popoverButton, popoverDiv) {
    popoverButton.addEventListener("click", function() {
        // if popoverDiv is style display none, display block
        if (popoverDiv.style.display == "none") {
            popoverDiv.style.display = "block";
        }
        // if popoverDiv is style display block, display none
        else {
            popoverDiv.style.display = "none";
        }

        // Prevent the popover from closing when clicking on the div
        if (popoverDiv.classList.contains("show")) {
            popoverDiv.addEventListener("click", function(event) {
                event.stopPropagation();
            });
        }

        // Close the popover when clicking outside of it
        document.addEventListener("click", function(event) {
            if (!popoverButton.contains(event.target)) {
                popoverDiv.style.display = "none";
            }
        });
    });
}

function popoverDivListener() {    
    var popoverButton = document.getElementById("popoverButton-criteriaUseExample");
    var popoverDiv = document.getElementById("popoverDiv-criteriaUseExample");
    popoverButton.addEventListener("click", function() {
        // popoverDiv.style.top = popoverButton.getBoundingClientRect().bottom + window.scrollY + "px";
        // popoverDiv.style.left = popoverButton.getBoundingClientRect().left + window.scrollX + "px";
        popoverDiv.style.top = popoverButton.getBoundingClientRect().bottom + window.scrollY + "px";
        popoverDiv.style.left = popoverButton.getBoundingClientRect().left + window.scrollX + "px";
    });
}

function searchQuestionContentListener() {
    var input = document.getElementById("searchQuestionContent");
    input.addEventListener("input", function() {
        listSidebarData();
    });
}

function resetSearchQuestionContentListener()  {
    var button = document.getElementById("resetSearchQuestionContent");
    button.addEventListener("click", function() {
        var input = document.getElementById("searchQuestionContent");
        input.value = "";
        listSidebarData();
    });
}


/****************
 ** DOM Loaded **
 ****************/

document.addEventListener("DOMContentLoaded", function() {
    resetSearchQuestionContentListener();
    dropdownExportListener();
    resetDifficultyListener();
    searchQuestionContentListener();
    getLanguagesNames();
    listSidebarData();
    difficultyListener();
    dropdownLanguagesListener();
    exportQuestionaryListener();
    randomQuestionListener();
});