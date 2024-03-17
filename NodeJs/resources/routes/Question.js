var express = require('express');

var router = express.Router();

router.get('/Question', function (req, res) {
    res.render("Question", {
        name: "Pregunta"
    });
});

module.exports = router;