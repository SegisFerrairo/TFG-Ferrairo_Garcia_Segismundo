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
        var tabContents = document.getElementById('myTabContent').getElementsByTagName('div');
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

    // Crea un nuevo elemento <div> con el nuevo id
    var newDiv = document.createElement('div');
    newDiv.id = nextTab;
    newDiv.classList.add('tab-pane', 'fade');
    newDiv.setAttribute('role', 'tabpanel');

    // Agrega el nuevo contenido del div
    newDiv.innerHTML = '<h2>Contenido de la ' + newTabName + '</h2>' +
    '<p>Este es el contenido de la ' + newTabName.toLowerCase() + '.</p>';

    // Agrega el nuevo div al DOM    
    document.getElementById('myTabContent').appendChild(newDiv);

    // Muestra la nueva pestaña
    openTab(nextLinkTab, nextTab);
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