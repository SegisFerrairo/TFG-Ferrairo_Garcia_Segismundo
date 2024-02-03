/***************
 ** Constants **
 ***************/
let COUNTER_TOPIC = 0;

/***********
 ** Utils **
 ***********/

function disableQuestion(button) {
    button.classList.toggle("disabled");
    var li = button.parentElement;
    if (button.classList.contains("disabled")) {            
        li.style.listStyleType = "circle";
    }
    else {
        li.style.listStyleType = "disc";
    }        
}

function createNoTopicsElement(sidebar) {
    var li = document.createElement("li");
    li.className = "no-topics";
    var link = document.createElement("a");
    link.href = "/newQuestion";
    link.textContent = "No hay temas";
    li.appendChild(link);
    li.style.listStyleType = "none";
    sidebar.appendChild(li);
}

function listData(data) {
    var sidebar = document.getElementById("sidebar");
    // if data is empty, create a no-topics element
    if (data.length == 0) {        
        createNoTopicsElement(sidebar);
        return;
    }

    // if two questions have the same topic, they will be grouped together
    var topics = [];
    data.forEach(function(question) {
        if (!topics.includes(question.topic)) {
            topics.push(question.topic);
        }
    });

    topics.forEach(function(topic) {
        var li_topic = document.createElement("li");
        li_topic.id = "topic" + COUNTER_TOPIC;
        li_topic.className = "topic mb-1";

        var button = document.createElement("button");
        button.className = "btn btn-toggle align-items-center rounded collapsed";
        button.setAttribute("data-bs-toggle", "collapse");
        button.setAttribute("data-bs-target", "#topic" + COUNTER_TOPIC + "-collapse");
        button.setAttribute("aria-expanded", "false");

        var span = document.createElement("span");
        span.className = "svg-container me-1";
        button.textContent = topic;
        button.insertBefore(span, button.firstChild);

        li_topic.appendChild(button);        

        var div = document.createElement("div");
        div.className = "collapse topic-container";
        div.id = "topic" + COUNTER_TOPIC + "-collapse";
        var ul = document.createElement("ul");
        ul.className = "btn-toggle-nav list-unstyled fw-normal pb-1 small";
        
        data.forEach(function(question) {
            if (question.topic == topic) {
                var li = document.createElement("li");
                li.className = "mb-1"
                // li must have bullet points
                li.style.listStyleType = "disc";
                var button = document.createElement("button");
                button.type = "button";
                button.id = "button-" + question._id;
                button.className = "btn btn-link";
                button.textContent = question.languages[0].statement; 
                li.appendChild(button);
                ul.appendChild(li);

                selectQuestionListener(button);
            }
        });

        div.appendChild(ul);
        li_topic.appendChild(div);

        sidebar.getElementsByTagName("ul")[0].appendChild(li_topic);

        expandTopicListener(button,div);

        COUNTER_TOPIC++;
    });

}

/*************
 ** Read DB **
 *************/

// TODO: Optimize the following function
// // Get just the topics and the first language of each topic
// function getMainTopics() {
//     fetch('/questionary/getMainQuestions', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Error al obtener los datos de la base de datos');
//         }
//         return response.json();
//     })
//     .then(responseData => {
//         console.log('Respuesta del servidor:', responseData);
//         listData(responseData);
//     })
//     .catch(error => {
//         console.error('Error en la solicitud:', error.message);
//     });
// }

// Get the questions from the database
function getAllDBData() {
    fetch('/questionary/getAllQuestions', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la base de datos');
        }
        return response.json();
    })
    .then(responseData => {
        console.debug('Respuesta del servidor:', responseData);
        listData(responseData);
        return;
    })
    .catch(error => {
        console.error('Error en la solicitud:', error.message);
    });
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
        return;
    })
    .catch(error => {
        console.error('Error en la solicitud:', error.message);
    });
}

/*********************
 ** Event Listeners **
 *********************/

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


/****************
 ** DOM Loaded **
 ****************/

document.addEventListener("DOMContentLoaded", function() {
    getAllDBData();
});