/***************
 ** Constants **
 ***************/
let COUNTER_TAB = 1;
let DEFAULT_NUM_OPTIONS = 2;
let MAIN_FORM_ID = 'mainform';
let OPTIONS_MAIN_FORM_NAME_ID = 'optionsMain';
let OPTIONS_FORM_NAME_ID = 'option';
let MAIN_FORM_LANGUAGE = 'Español';
var OPTION_TYPE = 'radio';

/***********
 ** Utils **
 ***********/

function addTab() {
    // Obtain the name of the new tab
    // If the input just contains spaces, show an alert
    if (document.getElementById('newTabName').value.trim() == '') {
        alert('Debes especificar un nombre para la nueva pestaña');
        // Reset the input
        document.getElementById('newTabName').value='';
        return;
    }

    var newTabName = document.getElementById('newTabName').value;

    // Reset the input
    document.getElementById('newTabName').value='';

    var nextLinkTab = 'linkTab' + COUNTER_TAB;    
    var nextTabId = 'tab' + COUNTER_TAB;
    var optionsName = OPTIONS_FORM_NAME_ID + COUNTER_TAB;

    COUNTER_TAB++;

    // Create a new <a> element
    var newLink = document.createElement('a');
    newLink.id = nextLinkTab;
    newLink.classList.add('nav-link');
    newLink.href = "#";                
    newLink.textContent = newTabName;
    newLink.setAttribute('role', 'tab');

    // Attach the event listener to openTab button
    newLink.addEventListener('click', function(){openTab(nextLinkTab, nextTabId)});

    
    var newClose = document.createElement('button');
    newClose.classList.add('btn-close');
    newClose.classList.add('ms-2');
    newClose.setAttribute('type', 'button');
    newClose.addEventListener('click', function(){closeTab(nextLinkTab, nextTabId)});
    

    var linkContainer = document.createElement('li');
    linkContainer.classList.add('nav-item');
    linkContainer.setAttribute('role', 'presentation');
    
    newLink.appendChild(newClose);
    linkContainer.appendChild(newLink);    
    document.getElementById('tabList').appendChild(linkContainer);

    // Create the form of the new tab
    addForm(nextTabId, optionsName);

    openTab(nextLinkTab, nextTabId);

    addOptionsListeners();
}


function openTab(nextLinkTab, nextTabId) {
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
        var tabContent = document.getElementById(nextTabId);
        tabContent.classList.add('active', 'show');
    }
}

function closeTab(nextLinkTab, nextTabId) {
    var tabLink = document.getElementById(nextLinkTab).parentElement;
    var tab = document.getElementById(nextTabId);

    tabLink.remove();
    tab.remove();
}

function howManyOptions(formId) {
    // If mainform has no childs yet, options will be 2 (the default number of options)
    if (document.getElementById(formId) == null) {
        return DEFAULT_NUM_OPTIONS;
    }
    else {
        // If mainform has childs, options will be the number of input elements
        var options = document.getElementById(formId).getElementsByTagName('input');
    }

    var counter = Array.from(options).filter((elem) => elem.type == 'text').length;

    return counter;
}

function createOptions(formId, optionsName, fieldset) {
    var numOptions = howManyOptions(formId);

    // Create the asnwer options
    for (var i = 1; i <= numOptions; i++) {
        var divOpcion = document.createElement("div");
        divOpcion.className = "form-check mb-2";

        var input = document.createElement("input");
        input.className = "form-check-input";
        input.setAttribute("type", OPTION_TYPE);
        input.setAttribute("id", OPTIONS_FORM_NAME_ID + i);
        input.setAttribute("name", optionsName);
        input.setAttribute("value", OPTIONS_FORM_NAME_ID + i);

        if (document.getElementById('myMainFormContent').hasChildNodes() == false) {
            if (i == 1) {
                input.setAttribute("checked", "");
            }
        }
        else {
            // Checks if the option element with the same value field at the MainForm is checked
            if (document.querySelector(`input[value="option${i}"]`).checked) {
                input.setAttribute("checked", "");
            }
        }

        var inputRespuesta = document.createElement("input");
        inputRespuesta.className = "form-control form-control-sm";
        inputRespuesta.setAttribute("type", "text");
        inputRespuesta.setAttribute("placeholder", "Añade tu respuesta");
        inputRespuesta.setAttribute("id", "inputOption" + i);
        inputRespuesta.setAttribute("name", "inputOption" + i);
        inputRespuesta.setAttribute("for", OPTIONS_FORM_NAME_ID + i);
        inputRespuesta.setAttribute("required", "");

        divOpcion.appendChild(input);
        divOpcion.appendChild(inputRespuesta);

        fieldset.appendChild(divOpcion);
    }
}

function addMoreOptions(formId, optionsName, numOptions) {
    if (document.getElementById(formId) == null) {
        return;
    }
    var fieldset = document.getElementById(formId).getElementsByTagName('fieldset')[0];

    // Create the asnwer options
    var divOpcion = document.createElement("div");
    divOpcion.className = "form-check mb-2";

    var input = document.createElement("input");
    input.className = "form-check-input";
    input.setAttribute("type", OPTION_TYPE);
    input.setAttribute("id", OPTIONS_FORM_NAME_ID + numOptions);
    input.setAttribute("name", optionsName);
    input.setAttribute("value", "option" + numOptions);
    //input.setAttribute("checked", "");
    

    var inputRespuesta = document.createElement("input");
    inputRespuesta.className = "form-control form-control-sm";
    inputRespuesta.setAttribute("type", "text");
    inputRespuesta.setAttribute("placeholder", "Añade tu respuesta");
    inputRespuesta.setAttribute("id", "inputOption" + numOptions);
    inputRespuesta.setAttribute("name", "inputOption" + numOptions);
    inputRespuesta.setAttribute("for", OPTIONS_FORM_NAME_ID + numOptions);

    divOpcion.appendChild(input);
    divOpcion.appendChild(inputRespuesta);

    fieldset.appendChild(divOpcion);

    addOptionsListeners();
}

function deleteLastOption(formId) {
    // Delete the div that contains the last option of the form
    // Check firsr if the formId exists
    if (document.getElementById(formId) == null) {
        return;
    }
    var fieldset = document.getElementById(formId).getElementsByTagName('fieldset')[0];
    // But just if there are more than 2 options
    if (howManyOptions(formId) > DEFAULT_NUM_OPTIONS) {
        fieldset.removeChild(fieldset.lastChild);
    }
}

function changeOptionType(value) {
    var pre_optionType = OPTION_TYPE;
    if (value == 'Radio') {
        OPTION_TYPE = 'radio';
    }
    else {
        OPTION_TYPE = 'checkbox';
    }

    // Change the type of the options of the main form
    var options = document.getElementById(MAIN_FORM_ID).getElementsByTagName('input');
    // Just the options that has the same type as pre_optionType
    options = Array.from(options).filter((elem) => elem.type == pre_optionType);
    for (var i = 0; i < options.length; i++) {
        options[i].setAttribute('type', OPTION_TYPE);
    }

    // Change the type of the options of the tabs
    var tabs = document.getElementById('tabList').getElementsByTagName('li');
    for (var i = 0; i < tabs.length; i++) {
        var tabId = 'tab' + tabs[i].getElementsByTagName('a')[0].id.slice(7);
        var options = document.getElementById(tabId).getElementsByTagName('input');
        options = Array.from(options).filter((elem) => elem.type == pre_optionType);
        for (var j = 0; j < options.length; j++) {
            options[j].setAttribute('type', OPTION_TYPE);
        }
    }
}


function addForm(formId, optionsName) {
    // Create the form
    var formulario = document.createElement("form");
    formulario.id = formId;

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
    labelEnunciado.setAttribute("for", formId+"_statement");
    labelEnunciado.textContent = "Introduce el enunciado de tu pregunta:";

    var textareaEnunciado = document.createElement("textarea");
    textareaEnunciado.className = "form-control";
    textareaEnunciado.setAttribute("id", formId+"_statement");
    textareaEnunciado.setAttribute("name", formId+"_statement");
    textareaEnunciado.setAttribute("rows", "3");
    textareaEnunciado.setAttribute("required", "");

    divEnunciado.appendChild(labelEnunciado);
    divEnunciado.appendChild(textareaEnunciado);

    // Add the div of the question statement and the options to the fieldset
    fieldset.appendChild(divEnunciado);

    // Create and add the options
    createOptions(MAIN_FORM_ID, optionsName, fieldset);

    // Add fieldset to form
    formulario.appendChild(fieldset);

    // Attach to the DOM
    if (document.getElementById('myMainFormContent').hasChildNodes() == false) {
        // New + option button
        var moreOptions = document.createElement("button");
        moreOptions.className = "btn mt-2 me-2 btn-outline-secondary btn-sm";
        moreOptions.setAttribute("type", "button");
        moreOptions.setAttribute("id", "moreOptions");
        moreOptions.textContent = "+ Añadir otra opción";
    
        // Add the "Añadir opción" button to the form
        formulario.appendChild(moreOptions);

        // New - option button
        var lessOptions = document.createElement("button");
        lessOptions.className = "btn mt-2 me-2 btn-outline-danger btn-sm";
        lessOptions.setAttribute("type", "button");
        lessOptions.setAttribute("id", "lessOptions");
        lessOptions.textContent = "- Eliminar última opción";

        // Add the "Eliminar opción" button to the form
        formulario.appendChild(lessOptions);


        // Adding the main form to the DOM
        document.getElementById('myMainFormContent').appendChild(formulario);
        addMoreOptionsButtonListener();
        addLessOptionsButtonListener();
    }
    else {
        // Adding the new form to the DOM
        document.getElementById('myTabContent').appendChild(formulario);
    }
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


function submitData() {
    var question = {};
    question.topic = document.getElementById('floatingTopic').value;

    var data = catchFormData(MAIN_FORM_ID, OPTIONS_MAIN_FORM_NAME_ID);
    data.name = MAIN_FORM_LANGUAGE;  
    question['language_'+0] = data;

    // Get the number of tabs
    var tabs = document.getElementById('tabList').getElementsByTagName('li');
    // Catch the data of each tab
    for (var i = 1; i <= tabs.length; i++) {
        var id = tabs[i-1].getElementsByTagName('a')[0].id.slice(7);
        var content = document.getElementById('linkTab' + id).textContent;
        var tabId = 'tab' + id;
        var optionsName = OPTIONS_FORM_NAME_ID + id;
        if (checkEmptyFields(tabId)) {
            return;
        }
        var data = catchFormData(tabId, optionsName);

        // Add content to the data as a new property called name
        data.name = content;
        question['language_'+i] = data;                
    }       
    // Reset each tab
    for (var i = 1; i <= tabs.length; i++) {
        var tabId = 'tab' + tabs[i-1].getElementsByTagName('a')[0].id.slice(7);
        document.getElementById(tabId).reset();
    }     

    //console.log(question);
    // Send the data
    sendFormData(question);

    // After sending the main form, clear the form
    document.getElementById(MAIN_FORM_ID).reset();
}

function missingFieldsAlert(message) {
    var alert = document.createElement('div');
    alert.className = 'alert alert-dismissible alert-danger';
    var button = document.createElement('button');
    button.className = 'btn-close';
    button.setAttribute('type', 'button');
    button.setAttribute('data-bs-dismiss', 'alert');
    alert.appendChild(button);
    var strong = document.createElement('strong');
    strong.textContent = 'Error! ';
    alert.appendChild(strong);
    var u = document.createElement('u');
    u.textContent = 'Rellena los campos vacíos';
    alert.appendChild(u);
    alert.appendChild(document.createTextNode(' y envia de nuevo el formulario.'));
    // add the message to the alert
    if (message != undefined) {
        alert.appendChild(document.createElement('br'));
        alert.appendChild(document.createTextNode(message));
    }
    // Insert as the first child of the body
    document.body.insertBefore(alert, document.body.firstChild);


    // Add the event listener to the button
    button.addEventListener('click', function() {
        alert.remove();
    });
}

/*********************
 ** Event Listeners **
 *********************/

function changeOptionTypeListener() {
    document.querySelector('#optionType').addEventListener('change', (event) => {        
        changeOptionType(event.target.value);
    });
}

// To synchronize the options of the main form with the options of the tabs
function addOptionsListeners() {
    document.querySelectorAll('.form-check-input').forEach(elem => elem.addEventListener('change', (event) => {
        // Select all elements with the same value field of the changed element
        // If question type is radio, just one element will be selected
        if (OPTION_TYPE == 'radio') {
            document.querySelectorAll(`input[value="${event.target.value}"]`).forEach((input) => {
                input.checked = true;
            });
        }
        // If question type is checkbox, all elements will be selected
        else {
            document.querySelectorAll(`input[value="${event.target.value}"]`).forEach((input) => {
                input.checked = event.target.checked;
            });
        }
    }));
}

function addMoreOptionsButtonListener() {
    document.querySelector('#moreOptions').addEventListener('click', (event) => {
        // Add more options to the main form
        var formId = MAIN_FORM_ID;
        var optionsName = OPTIONS_MAIN_FORM_NAME_ID;
        var numOption = howManyOptions(formId)+1;  // +1 because we are going to add a new option
        addMoreOptions(formId, optionsName, numOption);
        // For each tab, add more options
        var tabs = document.getElementById('tabList').hasChildNodes() == false ? 0 : document.getElementById('tabList').getElementsByTagName('li');
        for (var i = 0; i < tabs.length; i++) {
            var formId = 'tab' + tabs[i].getElementsByTagName('a')[0].id.slice(7);
            var optionsName = OPTIONS_FORM_NAME_ID + tabs[i].getElementsByTagName('a')[0].id.slice(7);
            addMoreOptions(formId, optionsName, numOption);
        }
    });
}

function addLessOptionsButtonListener() {
    document.querySelector('#lessOptions').addEventListener('click', (event) => {
        // Delete last option of the main form
        var formId = MAIN_FORM_ID;
        deleteLastOption(formId);
        // For each tab, delete last option
        var tabs = document.getElementById('tabList').hasChildNodes() == false ? 0 : document.getElementById('tabList').getElementsByTagName('li');
        for (var i = 0; i < tabs.length; i++) {
            var tabId = 'tab' + tabs[i].getElementsByTagName('a')[0].id.slice(7);
            deleteLastOption(tabId);
        }
    });
}

/***************
 ** Cath data **
 ***************/

function howManyEmpty(formId, elementType) {
    var form = document.getElementById(formId);
    var options = form.getElementsByTagName('input');
    options = Array.from(options).filter((elem) => elem.type == elementType);

    var counter = 0;
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked == true || options[i].value == '') {
            counter++;
            if (elementType == 'text') {
                options[i].classList.add('is-invalid');
            }
        }
        else {
            options[i].classList.remove('is-invalid');
        }
    }

    return counter;
}

function checkEmptyTopic() {
    var topic = document.getElementById('floatingTopic').value;
    if (topic == '') {
        missingFieldsAlert('Debes especificar un tema para la pregunta.');
        document.getElementById('floatingTopic').focus();
        // Make field invalid to show the user that it is required
        document.getElementById('floatingTopic').classList.add('is-invalid');
        return true;
    }
    else {
        document.getElementById('floatingTopic').classList.remove('is-invalid');
    }
    return false;
}


function checkEmptyFields(formId) {
    var form = document.getElementById(formId);

    // Check if the statement field is empty
    if (form[formId+'_statement'].value == '') {
        missingFieldsAlert('Debes especificar un enunciado para la pregunta.');
        // Set the focus on the statement field
        form[formId+'_statement'].focus();
        // Make field invalid to show the user that it is required
        form[formId+'_statement'].classList.add('is-invalid');
    }
    else {
        form[formId+'_statement'].classList.remove('is-invalid');
    }

    // Check if there is at least one option with a value
    if (howManyEmpty(formId, OPTION_TYPE) == 0) {
        missingFieldsAlert('Debes marcar al menos una opción.');
        return true;
    }

    // Check if there is at least one option with a value
    if (howManyEmpty(formId, 'text') > 0) {
        missingFieldsAlert('Debes completar todas las opciones.');
        return true;
    }

    return false;
}

function catchFormData(formId, optionsFormId) {
    var form = document.getElementById(formId);
    var formData = new FormData(form);
    var data = {};
    data.push
    data.name ="";
    data.statement = formData.get(formId+'_statement');
   
    var numOptions = howManyOptions(formId);
    var options = [];
    for (var i = 1; i <= numOptions; i++) {
        options.push(formData.get('inputOption'+i));
    }
    data.options = options;

    if (OPTION_TYPE == 'radio') {
        var radio = [];
        radio.push(parseInt(formData.get(optionsFormId).slice(-1)));
        data.answer = radio;
    }
    else {
        var checkboxes = [];
        var selectedOptions = formData.getAll(optionsFormId);
        for (var i = 0; i < selectedOptions.length; i++) {
            checkboxes.push(parseInt(selectedOptions[i].slice(-1)));
        }
        data.answer = checkboxes;
    }

    return data;
}

/***************
 ** Send data **
 ***************/

function sendFormData(data) {
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
    addForm(MAIN_FORM_ID, OPTIONS_MAIN_FORM_NAME_ID);

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
        var confirmSubmission = window.confirm("¿Está seguro de que desea enviar el formulario?");
        if (!confirmSubmission) {
            event.preventDefault();
            return;
        }
        else {    
            if (checkEmptyTopic() || checkEmptyFields(MAIN_FORM_ID)) {
                event.preventDefault();
                return;
            }
            submitData();            
        }
    });

    addOptionsListeners();
    changeOptionTypeListener();
});

