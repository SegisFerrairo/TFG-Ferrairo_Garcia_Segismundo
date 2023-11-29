/***************
 ** Constants **
 ***************/
let counter = 0;

/***********
 ** Utils **
 ***********/

function openTab(nextLinkTab, nextTab) {
    var tabList = document.getElementById('tabList');

    var tabElement = document.getElementById(nextLinkTab);

    // si tabElement es null, es porque se ha hecho clic en el botón de cerrar pestaña
    if (tabElement != null) {
        //Eliminar la clase 'active' de todos los elementos <a> hijos de tabList
        var links = tabList.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            links[i].classList.remove('active');
            links[i].setAttribute('aria-selected', false);
            links[i].setAttribute('tabindex', -1);
        }

        // Agregar la clase 'active' al elemento <a> que se ha hecho clic
        tabElement.classList.add('active');
        // Cambiar la propiedad aria-selected a true
        tabElement.setAttribute('aria-selected', true);
        // Eliminal el atributo tabindex
        tabElement.removeAttribute('tabindex');

        // Eliminar la clase 'active' de todos los elementos <div> hijos de myTabContent
        var tabContents = document.getElementById('myTabContent').getElementsByTagName('form');
        for (var i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove('active', 'show');
        }

        // Agregar la clase 'active' al elemento <div> que se ha hecho clic
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

function addTab() {
    // Obtiene el nombre de la nueva pestaña
    var newTabName = document.getElementById('newTabName').value;
    document.getElementById('newTabName').value='';

    var nextNumTab = (counter + 1);
    counter++;

    var nextLinkTab = 'linkTab' + nextNumTab;
    
    var nextTab = 'tab' + nextNumTab;

    // Crea un nuevo elemento <a>
    var newLink = document.createElement('a');
    newLink.id = nextLinkTab;
    newLink.classList.add('nav-link');
    newLink.href = "#";                
    newLink.textContent = newTabName;
    newLink.setAttribute('role', 'tab');

    // añadir un event listener al botón de añadir pestaña
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

    // Crear el formulario de la nueva pestaña
    addForm(nextTab);

    openTab(nextLinkTab, nextTab);
}

function addForm(nextTab) {
    // Crear el formulario
    var formulario = document.createElement("form");
    formulario.id = nextTab;
    formulario.classList.add('tab-pane', 'fade');
    formulario.setAttribute('role', 'tabpanel');

    // Crear el fieldset
    var fieldset = document.createElement("fieldset");

    // Crear el div para el enunciado de la pregunta
    var divEnunciado = document.createElement("div");
    divEnunciado.className = "form-group";

    var labelEnunciado = document.createElement("label");
    labelEnunciado.className = "form-label mt-4";
    labelEnunciado.setAttribute("for", nextTab+"_statement");
    labelEnunciado.textContent = "Introduce el enunciado de tu pregunta:";

    var textareaEnunciado = document.createElement("textarea");
    textareaEnunciado.className = "form-control";
    textareaEnunciado.setAttribute("id", nextTab+"_statement");
    textareaEnunciado.setAttribute("rows", "3");

    divEnunciado.appendChild(labelEnunciado);
    divEnunciado.appendChild(textareaEnunciado);

    // Agregar el div de enunciado y las opciones al fieldset
    fieldset.appendChild(divEnunciado);

    // Crear las opciones de respuesta
    for (var i = 1; i <= 2; i++) {
      var divOpcion = document.createElement("div");
      divOpcion.className = "form-check";

      var inputRadio = document.createElement("input");
      inputRadio.className = "form-check-input";
      inputRadio.setAttribute("type", "radio");
      inputRadio.setAttribute("name", "optionsRadios");
      inputRadio.setAttribute("id", "optionRadio" + i);
      inputRadio.setAttribute("value", "option" + i);

      var inputRespuesta = document.createElement("input");
      inputRespuesta.className = "form-control form-control-sm";
      inputRespuesta.setAttribute("type", "text");
      inputRespuesta.setAttribute("placeholder", "Añade tu respuesta");
      inputRespuesta.setAttribute("for", "optionRadio" + i);

      divOpcion.appendChild(inputRadio);
      divOpcion.appendChild(inputRespuesta);

      fieldset.appendChild(divOpcion);
    }

    // Agregar el fieldset al formulario
    formulario.appendChild(fieldset);

    // Agrega el nuevo div al DOM    
    document.getElementById('myTabContent').appendChild(formulario);
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
    
/****************
 ** DOM Loaded **
 ****************/

document.addEventListener("DOMContentLoaded", function() {
    // añadir un event listener al botón de mostrar/ocultar idiomas
    document.getElementById('languages').addEventListener('click', showLangs);

    // añadir un event listener al botón de añadir pestaña
    document.getElementById('newTabName').nextElementSibling.addEventListener('click', addTab);
    // añadir un event listener al botón de añdir pestaña al pulsar enter
    document.getElementById('newTabName').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            addTab();
        }
    });

});