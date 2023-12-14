document.addEventListener('DOMContentLoaded', function() {
    // Add event listerner to dropdown button
    document.getElementById('dropdown-button').addEventListener('click', function (event) {
        event.preventDefault();

        document.getElementById('dropdown-button').classList.toggle('collapsed');
        // Change aria-expanded attribute of dropdown button
        if (document.getElementById('dropdown-button').getAttribute('aria-expanded') == 'true') {
            document.getElementById('dropdown-button').setAttribute('aria-expanded', 'false');
        } else {
            document.getElementById('dropdown-button').setAttribute('aria-expanded', 'true');
        }

        // document.getElementById('navbarColor01')
        // Change class collapse for collapsing in the element with id navbarColor01
        document.getElementById('navbarColor01').classList.toggle('collapse');
        document.getElementById('navbarColor01').classList.toggle('collapsing');
        // Add to the atribute style the property height
        document.getElementById('navbarColor01').style.height = '120px';
        
        document.getElementById('navbarColor01').classList.toggle('collapse');
        document.getElementById('navbarColor01').classList.toggle('show');        
    });
});