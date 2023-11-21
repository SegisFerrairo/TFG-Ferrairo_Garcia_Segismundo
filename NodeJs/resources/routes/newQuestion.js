var express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
    res.render("newQuestion", {
        name: "Nueva Pregunta"
    });
});

module.exports = router;