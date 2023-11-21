function openTab(tabId) {
    // Ocultar todos los elementos con la clase 'tab-content'
    var tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(function (tabContent) {
        tabContent.classList.add('hidden');
    });

    // Mostrar el contenido de la pestaña específica
    document.getElementById(tabId).classList.remove('hidden');
}
  
function agregarPestana() {
    // Obtiene el nombre de la nueva pestaña
    var nombreNuevaPestaña = document.getElementById('nombreNuevaPestaña').value;
    document.getElementById('nombreNuevaPestaña').value='';
    
    var nextTab = 'tab' + (document.getElementsByClassName('tab-content').length + 1);

    // Crea un nuevo elemento <a>
    var nuevoEnlace = document.createElement('a');
    nuevoEnlace.href = "#";
    nuevoEnlace.textContent = nombreNuevaPestaña;
    nuevoEnlace.onclick = function(){openTab(nextTab)};

    // Crea un nuevo elemento <div> con el nuevo id
    var nuevoDiv = document.createElement('div');
    nuevoDiv.id = 'tab' + (document.getElementsByClassName('tab-content').length + 1);
    nuevoDiv.classList.add('tab-content', 'hidden');

    // Agrega el nuevo contenido del div
    nuevoDiv.innerHTML = '<h2>Contenido de la ' + nombreNuevaPestaña + '</h2>' +
    '<p>Este es el contenido de la ' + nombreNuevaPestaña.toLowerCase() + '.</p>';

    // Agrega el nuevo enlace y el nuevo div al DOM
    document.getElementById('linkTabs').appendChild(nuevoEnlace);
    document.getElementById('right-space').appendChild(nuevoDiv);
}

function mostrarIdiomas() { 
    if (document.getElementById('right-space').classList.contains('visible')) {
        document.getElementById('idiomas').innerHTML="Ocultar idiomas";
        
        document.getElementById('right-space').classList.remove('visible');
        document.getElementById('right-space').classList.add('hidden');  
    }
    else {    
        document.getElementById('idiomas').innerHTML="Mostrar idiomas";
        document.getElementById('right-space').classList.remove('hidden');
        document.getElementById('right-space').classList.add('visible');       
    }
}

  