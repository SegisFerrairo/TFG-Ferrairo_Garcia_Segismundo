let counter = 0;

function openTab(tabId) {
    // Ocultar todos los elementos con la clase 'tab-content'
    var tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(function (tabContent) {
        tabContent.classList.add('hidden');
    });

    // Mostrar el contenido de la pestaña específica
    document.getElementById(tabId).classList.remove('hidden');
}

function closeTab(nextLinkTab, nextTab) {
    // Elimina el enlace de la pestaña
    var linkTabs = document.getElementById('linkTabs');
    var linkTab = document.getElementById(nextLinkTab);
    linkTabs.removeChild(linkTab);

    // Elimina el contenido de la pestaña
    var rightSpace = document.getElementById('right-space');
    var tabContent = document.getElementById(nextTab);
    rightSpace.removeChild(tabContent);
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
    newLink.href = "#";                
    newLink.textContent = newTabName;
    newLink.onclick = function(){openTab(nextTab)};      

        // Crea un nuevo elemento <span> para la "x"
    var closeLink = document.createElement('span');
        closeLink.textContent = "x";
        closeLink.classList.add('close-link');
        closeLink.onclick = function(event) {
            event.preventDefault();
            closeTab(nextLinkTab, nextTab);
    };

    var linkContainer = document.createElement('div');
    linkContainer.id = nextLinkTab;
    linkContainer.classList.add('link-container');
    
    linkContainer.appendChild(newLink);
    linkContainer.appendChild(closeLink);

    // Crea un nuevo elemento <div> con el nuevo id
    var newDiv = document.createElement('div');
    newDiv.id = nextTab;
    newDiv.classList.add('tab-content', 'hidden');

    // Agrega el nuevo contenido del div
    newDiv.innerHTML = '<h2>Contenido de la ' + newTabName + '</h2>' +
    '<p>Este es el contenido de la ' + newTabName.toLowerCase() + '.</p>';

    // Agrega el nuevo enlace y el nuevo div al DOM
    document.getElementById('linkTabs').appendChild(linkContainer);
    document.getElementById('right-space').appendChild(newDiv);

    // Muestra la nueva pestaña
    openTab(nextTab);
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
    
document.addEventListener("DOMContentLoaded", function() {
    var linkTabs = document.getElementById("linkTabs");

    // Función para ocultar/mostrar el nav según si tiene hijos o no
    function toggleNavDisplay() {
        !linkTabs.hasChildNodes() ? linkTabs.classList.add("hidden") : linkTabs.classList.remove("hidden");
    }

    // Configurar el MutationObserver con la función de retorno de llamada
    var observer = new MutationObserver(toggleNavDisplay);

    // Observar cambios en los hijos del nav
    var observerConfig = { childList: true };
    observer.observe(linkTabs, observerConfig);
});