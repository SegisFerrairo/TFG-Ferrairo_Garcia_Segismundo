/*************
 ** Read DB **
 *************/

// Get the questions from the database
function getDBData() {
    fetch('/questionary/getQuestions', {
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
        console.log('Respuesta del servidor:', responseData);
    })
    .catch(error => {
        console.error('Error en la solicitud:', error.message);
    });
}


/****************
 ** DOM Loaded **
 ****************/

 document.addEventListener("DOMContentLoaded", function() {
    // add event listener to all buttons in the sidebar
    var buttons = document.querySelectorAll(".btn-toggle");
    buttons.forEach(function(element) {      
        element.addEventListener("click", function() {
            // Toggle the value of aria-expanded between true and false when clicked
            this.setAttribute("aria-expanded", this.getAttribute("aria-expanded") === "true" ? "false" : "true");            

            // Toggle class collapse from the div element, the next sibling of the button
            var div = this.nextElementSibling;
            div.classList.toggle("collapse");
        });
    });

    getDBData();
});