const FROM = 'es';

async function translate(text, from, to) {
    try {
        const response = await fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text, from: from, to: to })        
        });

        if (!response.ok) {
            throw new Error('Error al enviar los datos del formulario');
        }

        const responseData = await response.json();
        console.debug('Respuesta del servidor:', responseData);
        return responseData.text;
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
        throw error;
    }
}

function translateButtonListener() {
    document.getElementById("translate").addEventListener("click", async function() {
        var input = document.getElementById("input").value;
        var to = 'en';
        
        try {
            const translation = await translate(input, FROM, to);
            document.getElementById("output").value = translation;
        }
        catch (error) {
            console.error(error);
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    translateButtonListener();
});