function lastClicked() {
    var navLinks = document.getElementById('navbarColor01').getElementsByClassName('nav-link');

    // Check if the url matches a nav-link and add active class
    var currentPage = window.location.pathname;
    for (var i = 0; i < navLinks.length; i++) {
        if (navLinks[i].getAttribute('href') == currentPage) {
            var current = document.getElementsByClassName('active');
            if (current.length > 0) {
                current[0].classList.remove('active');
            }
            navLinks[i].classList.add('active');
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // Add event listerner to dropdown button
    document.getElementById('dropdown-button').addEventListener('click', function (event) {
        event.preventDefault();

        document.getElementById('dropdown-button').classList.toggle('collapsed');
        // Change aria-expanded attribute of dropdown button
        if (document.getElementById('dropdown-button').getAttribute('aria-expanded') == 'true') {
            document.getElementById('dropdown-button').setAttribute('aria-expanded', 'false');
            document.getElementById('navbarColor01').removeAttribute('style');
        } else {
            document.getElementById('dropdown-button').setAttribute('aria-expanded', 'true');
            document.getElementById('navbarColor01').style.height = '120px';
        }

        // document.getElementById('navbarColor01')
        // Change class collapse for collapsing in the element with id navbarColor01
        document.getElementById('navbarColor01').classList.toggle('collapse');
        document.getElementById('navbarColor01').classList.toggle('collapsing');
        
        
        document.getElementById('navbarColor01').classList.toggle('collapse');
        document.getElementById('navbarColor01').classList.toggle('show');        
    });
    // If navbarColor01 changes its width, remove style attribute
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991) {
            document.getElementById('navbarColor01').removeAttribute('style');
        }

    });

    lastClicked();
});