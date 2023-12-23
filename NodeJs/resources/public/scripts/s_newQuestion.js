/***************
 ** Constants **
 ***************/
let counterTab = 1;

/***********
 ** Utils **
 ***********/

function openTab(nextLinkTab, nextTab) {
    var tabList = document.getElementById('tabList');

    var tabElement = document.getElementById(nextLinkTab);

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
        var tabContents = document.getElementById('myTabContent').getElementsByTagName('form');
        for (var i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove('active', 'show');
        }

        // Add the 'active' class to the clicked <div> element
        var tabContent = document.getElementById(nextTab);
        tabContent.classList.add('active', 'show');
    }
}

function closeTab(nextLinkTab, nextTab) {
    var tabLink = document.getElementById(nextLinkTab);
    var tab = document.getElementById(nextTab);

    tabLink.remove();
    tab.remove();
}

function howManyOptions(type) {
    // If mainform has no childs yet, options will be 2 (the default number of options)
    if (document.getElementById('myMainFormContent').hasChildNodes() == false) {
        return 2;
    }
    else {
        // If mainform has childs, options will be the number of type="radio" elements
        var options = document.getElementById('mainform').getElementsByTagName('input');
    }

    var counter = 0;
    for (var i = 0; i < options.length; i++) {
        if (options[i].type == type) {
            counter++;
        }
    }
    return counter;
}

function createOptions(optionsName, fieldset) {
    var numOptions = howManyOptions('radio');

    // Create the asnwer options
    for (var i = 1; i <= numOptions; i++) {
        var divOpcion = document.createElement("div");
        divOpcion.className = "form-check mb-2";

        var inputRadio = document.createElement("input");
        inputRadio.className = "form-check-input";
        inputRadio.setAttribute("type", "radio");
        inputRadio.setAttribute("id", "optionRadio" + i);
        inputRadio.setAttribute("name", optionsName);
        inputRadio.setAttribute("value", "option" + i);

        if (document.getElementById('myMainFormContent').hasChildNodes() == false) {
            if (i == 1) {
                inputRadio.setAttribute("checked", "");
            }
        }
        else {
            // Checks if the option element with the same value field at the MainForm is checked
            if (document.querySelector(`input[value="option${i}"]`).checked) {
                inputRadio.setAttribute("checked", "");
            }
        }

        var inputRespuesta = document.createElement("input");
        inputRespuesta.className = "form-control form-control-sm";
        inputRespuesta.setAttribute("type", "text");
        inputRespuesta.setAttribute("placeholder", "Añade tu respuesta");
        inputRespuesta.setAttribute("id", "inputOption" + i);
        inputRespuesta.setAttribute("name", "inputOption" + i);
        inputRespuesta.setAttribute("for", "optionRadio" + i);

        divOpcion.appendChild(inputRadio);
        divOpcion.appendChild(inputRespuesta);

        fieldset.appendChild(divOpcion);
    }
}

function addForm(nextTab, optionsName) {
    // Create the form
    var formulario = document.createElement("form");
    formulario.id = nextTab;

    if (document.getElementById('myMainFormContent').hasChildNodes() == true) {
        formulario.classList.add('tab-pane', 'fade');
        formulario.setAttribute('role', 'tabpanel');
    }

    // Create the fieldsetq
    var fieldset = document.createElement("fieldset");

    // Create the <div> for the question statement
    var divEnunciado = document.createElement("div");
    divEnunciado.className = "form-group mb-4";

    var labelEnunciado = document.createElement("label");
    labelEnunciado.className = "form-label mt-4";
    labelEnunciado.setAttribute("for", nextTab+"_statement");
    labelEnunciado.textContent = "Introduce el enunciado de tu pregunta:";

    var textareaEnunciado = document.createElement("textarea");
    textareaEnunciado.className = "form-control";
    textareaEnunciado.setAttribute("id", nextTab+"_statement");
    textareaEnunciado.setAttribute("name", nextTab+"_statement");
    textareaEnunciado.setAttribute("rows", "3");

    divEnunciado.appendChild(labelEnunciado);
    divEnunciado.appendChild(textareaEnunciado);

    // Add the div of the question statement and the options to the fieldset
    fieldset.appendChild(divEnunciado);

    // Create and add the options
    createOptions(optionsName, fieldset);

    // Add fieldset to form
    formulario.appendChild(fieldset);

    // Attach to the DOM
    if (document.getElementById('myMainFormContent').hasChildNodes() == false) {
        // // Add the submit button
        // var submitButton = document.createElement("button");
        // submitButton.id = "submitButton";
        // submitButton.className = "btn btn-primary";
        // submitButton.setAttribute("type", "submit");
        // submitButton.setAttribute("value", "Enviar");
        // submitButton.textContent = "Enviar";

        // formulario.appendChild(submitButton);

        // Adding the main form to the DOM
        document.getElementById('myMainFormContent').appendChild(formulario);
    }
    else {
        // Adding the new form to the DOM
        document.getElementById('myTabContent').appendChild(formulario);
    }
}

function addTab() {
    // Obtain the name of the new tab
    var newTabName = document.getElementById('newTabName').value;
    document.getElementById('newTabName').value='';

    var nextLinkTab = 'linkTab' + counterTab;    
    var nextTab = 'tab' + counterTab;
    var optionsName = 'optionsRadio' + counterTab;

    counterTab++;

    // Create a new <a> element
    var newLink = document.createElement('a');
    newLink.id = nextLinkTab;
    newLink.classList.add('nav-link');
    newLink.href = "#";                
    newLink.textContent = newTabName;
    newLink.setAttribute('role', 'tab');

    // Attach the event listener to openTab button
    newLink.addEventListener('click', function(){openTab(nextLinkTab, nextTab)});

    
    var newClose = document.createElement('button');
    newClose.classList.add('btn-close');
    newClose.setAttribute('type', 'button');
    newClose.addEventListener('click', function(){closeTab(nextLinkTab, nextTab)});
    

    var linkContainer = document.createElement('li');
    linkContainer.classList.add('nav-item');
    linkContainer.setAttribute('role', 'presentation');
    
    newLink.appendChild(newClose);
    linkContainer.appendChild(newLink);    
    document.getElementById('tabList').appendChild(linkContainer);

    // Create the form of the new tab
    addForm(nextTab, optionsName);

    openTab(nextLinkTab, nextTab);

    addOptionsListeners();
}

function showLangs() { 
    if (document.getElementById('right-space').classList.contains('hidden')) {
        document.getElementById('languages').innerHTML="Ocultar idiomas";

        document.getElementById('right-space').classList.remove('hidden');

    }
    else {                
        document.getElementById('languages').innerHTML="Mostrar idiomas";                    

        document.getElementById('right-space').classList.add('hidden'); 
    }
}

/*********************
 ** Event Listeners **
 *********************/

function addOptionsListeners() {
    document.querySelectorAll('.form-check-input').forEach(elem => elem.addEventListener('change', (event) => {
        // Select all elements with the same value field of the changed element
        document.querySelectorAll(`input[value="${event.target.value}"]`).forEach((input) => {
            input.checked = true;
        });
    }));
}

/***************
 ** Cath data **
 ***************/

// var question = new Question({
//     statement: '¿Cuál es la capital de España?',
//     option1: 'Madrid',
//     option2: 'Barcelona',
//     option3: 'Sevilla',
//     answer: 1
// });

// function catchFormData(mainFormName, optionsMainFormName) {
//     var form = document.getElementById(mainFormName);
//     var formData = new FormData(form);
//     var data = {};
//     data.push
//     data.statement = formData.get(mainFormName+'_statement');
//    
//     var numOptions = howManyOptions('radio');
//     var options = [];
//     for (var i = 1; i <= numOptions; i++) {
//         options.push(formData.get('inputOption'+i));
//     }
//     data.options = options;
//     data.answer = parseInt(formData.get(optionsMainFormName).slice(-1));
//
//     return data;
// }

function catchFormData(mainFormName, optionsMainFormName) {
    var form = document.getElementById(mainFormName);
    var formData = new FormData(form);

    // Create an object with the data
    // var data = {
    //     statement: formData.get(mainFormName+'_statement'),
    //     option1: formData.get('inputOption1'),
    //     option2: formData.get('inputOption2'),

    //     // The answer is the one with the checked attribute,
    //     // and it will be stored as its option number, starting at 1
    //     answer: parseInt(formData.get('optionsMainRadio').slice(-1))       
    // };
    var data = {};
    data.push
    data.statement = formData.get(mainFormName+'_statement');
    
    var numOptions = howManyOptions('radio');
    for (var i = 1; i <= numOptions; i++) {
        var option = 'option'+i;
        data[option] = formData.get('inputOption'+i);
    }

    data.answer = parseInt(formData.get(optionsMainFormName).slice(-1));

    return data;
}

/***************
 ** Send data **
 ***************/

 function sendMainFormData(data) {
    fetch('/newQuestion/addQuestion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar los datos del formulario');
        }
        return response.json();
    })
    .then(responseData => {
        console.log('Respuesta del servidor:', responseData);
        // Redirect to Home Page
        //window.location.href = '/';        
    })
    .catch(error => {
        console.error('Error en la solicitud:', error.message);
    });
}
    
/****************
 ** DOM Loaded **
 ****************/

document.addEventListener("DOMContentLoaded", function() {
    let mainFormName = 'mainform';
    let optionsMainFormName = 'optionsMainRadio';

    addForm(mainFormName, optionsMainFormName);

    // Add event listener to the "Mostrar /Ocultar idiomas" button
    document.getElementById('languages').addEventListener('click', showLangs);

    // Add event listener to the "Añadir pestaña" button
    document.getElementById('newTabName').nextElementSibling.addEventListener('click', addTab);
    // Add event listener to the "Añadir pestaña" button but when the user presses enter key
    document.getElementById('newTabName').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            addTab();
        }
    });

    // Add event listener to the "Enviar" button, submit button of the main form
    document.getElementById('submitButton').addEventListener('click', function(event) {
        event.preventDefault();
        var data = catchFormData(mainFormName, optionsMainFormName);
        //sendMainFormData(data);

        // Get the number of tabs
        var numTabs = document.getElementById('tabList').getElementsByTagName('li').length;
        // Catch the data of each tab
        for (var i = 1; i <= numTabs; i++) {
            // Obtain the name of the tab (content of the <a> element)
            var content = document.getElementById('linkTab' + i).textContent;
            // TODO: add the language of the question to the data
            var tabName = 'tab' + i;
            var optionsName = 'optionsRadio' + i;
            var data = catchFormData(tabName, optionsName);
            //sendMainFormData(data);
            // Reset the form
            document.getElementById(tabName).reset();
        }

        // After sending the main form, clear the form
        document.getElementById(mainFormName).reset();
    });

    addOptionsListeners();
});

