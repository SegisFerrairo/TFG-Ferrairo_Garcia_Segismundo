/***************
 ** Constants **
 ***************/
let COUNTER_TOPIC = 0;
var COUNTER_QUESTION = 1;
var CHOOSEN_TOPIC = "Español";
var CHOOSEN_TOPIC_ID = 0;

/***********
 ** Utils **
 ***********/

//  <li class="nav-item" role="presentation">
//     <a id="linkTab2" class="nav-link" href="#" role="tab" aria-selected="false" tabindex="-1">
//         Inglés
//     </a>
// </li>

function addTopicsTab(topic) {
    var topicsTabList = document.getElementById("topicsTabList");
    // Get the inputs checked from the form choosenTopics and add them to the tabs
    var inputs = document.getElementById("choosenTopics").getElementsByTagName("fieldset")[0].getElementsByTagName("input");
    // Iterate over the inputs and add the tabs
    // Console log type of inputs
    console.log("Type ", typeof inputs);
    console.log("Inputs ", inputs);
    console.log("Inputs ", inputs.length);

    for (var i = 0; i < inputs.length; i++) {
        console.log("patatat");
        console.log("Input ", inputs[i]);
        if (inputs[i].checked) {
            console.log("Id ", inputs[i].id);
            var li = document.createElement("li");
            li.className = "nav-item";
            li.role = "presentation";
            var a = document.createElement("a");
            a.id = "linkTab" + COUNTER_TOPIC;
            a.className = "nav-link";
            a.href = "#";
            a.role = "tab";
            a.setAttribute("aria-selected", "false");
            a.tabIndex = "-1";
            a.textContent = topic;
            li.appendChild(a);
            topicsTabList.appendChild(li);
            COUNTER_TOPIC++;
        }
    }
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

async function listData() {
    var sidebar = document.getElementById("sidebar");

    // Remove all the topics from the sidebar except the first one
    while (sidebar.getElementsByTagName("ul")[0].childElementCount > 1) {
        sidebar.getElementsByTagName("ul")[0].removeChild(sidebar.getElementsByTagName("ul")[0].lastChild);
    }

    // Get the questions from the DB
    var data=[];
    try {
        data = await getQuestionsByLanguage(CHOOSEN_TOPIC);
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
    }

    //console.log("data: ", data)

    // if data is empty, create a no-topics element
    if (data.length == 0) {        
        createNoTopicsElement(sidebar.getElementsByTagName("ul")[0]);
        return;
    }

    // Get the topics from the DB
    var topics;
    try {
        topics = await getTopicsByLanguage(CHOOSEN_TOPIC);
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
    }

    topics.forEach(function(topic) {
        var li_topic = document.createElement("li");
        li_topic.id = "topic-" + topic
        li_topic.className = "topic mb-1";

        var button = document.createElement("button");
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
                button.className = "btn btn-link";
                // CHOOSEN_TOPIC_ID is the index of the language in the languages array
                CHOOSEN_TOPIC_ID = question.languages.findIndex(language => language.name == CHOOSEN_TOPIC);
                button.textContent = question.languages[CHOOSEN_TOPIC_ID].statement; 
                li.appendChild(button);
                ul.appendChild(li);

                selectQuestionListener(button);
            }
        });

        div.appendChild(ul);
        li_topic.appendChild(div);

        sidebar.getElementsByTagName("ul")[0].appendChild(li_topic);

        expandTopicListener(button,div);
    });

}

/* <div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
    <label class="form-check-label" for="flexSwitchCheckDefault">Inglés</label>
</div> */

function addOptionNames(languages) {
    var fieldset = document.getElementById("choosenTopics").getElementsByTagName("fieldset")[0];
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
        addTopicsTab("Español");
        div.appendChild(input);
        var label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = "flexSwitchCheck-Español";
        label.textContent = "Español";
        div.appendChild(label);
        fieldset.appendChild(div);

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
    });
}

function addQuestion(question) {
    // add question to Folio
    var folioBody = document.getElementById("folio").getElementsByClassName("folio-body")[0];

    var div = document.createElement("div");
    div.id = "question" + COUNTER_QUESTION;
    div.className = "question";
    var label = document.createElement("label");
    label.textContent = COUNTER_QUESTION + ". " + question.languages[CHOOSEN_TOPIC_ID].statement;
    div.appendChild(label);

    var button = document.createElement("button");
    button.type = "button";
    button.className = "btn-close question-close";
    button.addEventListener("click", function() {     
        removeQuestionListener(this.parentElement, question._id);
    });
    div.appendChild(button);

    var ul = document.createElement("ul");
    // Distinct between single-choice and multiple-choice questions
    question.languages[CHOOSEN_TOPIC_ID].answer.length > 1 ? ul.className = "multiple-choice" : ul.className = "single-choice";
    question.languages[CHOOSEN_TOPIC_ID].options.forEach(function(option) {
        var li = document.createElement("li");
        var label = document.createElement("label");
        label.textContent = option;
        li.appendChild(label);
        ul.appendChild(li);
    });
    div.appendChild(ul);
    folioBody.appendChild(div);

    COUNTER_QUESTION++;
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
        const response = await fetch('/questionary/getTopics', {
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

function getQuestionById(questionId) {
    fetch('/questionary/getQuestionById:' + questionId, {
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
    })
    .then(responseData => {
        console.debug('Respuesta del servidor:', responseData);
        addQuestion(responseData);
        return;
    })
    .catch(error => {
        console.error('Error en la solicitud:', error.message);
    });
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

/*********************
 ** Event Listeners **
 *********************/

function removeQuestionListener(newQuestion, questionId) {
    newQuestion.parentElement.removeChild(newQuestion);        
    disableQuestion(document.getElementById("button-" + questionId));
}

function dropdownTopicsListener() {
    var li = document.getElementById("topicsDropdown");
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
    });
}

function selectQuestionListener(button) {   
    button.addEventListener("click", function() {
        disableQuestion(button);
        var questionId = button.id.split("-")[1];
        getQuestionById(questionId);        
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

function switchedTopicsListener(switchInput, topic) {
    switchInput.addEventListener("change", function() {
        // If the input is checked, add the tab
        if (this.checked) {
            addTopicsTab(topic);
        }
    });
}

/****************
 ** DOM Loaded **
 ****************/

document.addEventListener("DOMContentLoaded", function() {
    getLanguagesNames();
    //getAllDBData();
    listData();
    dropdownTopicsListener();
});