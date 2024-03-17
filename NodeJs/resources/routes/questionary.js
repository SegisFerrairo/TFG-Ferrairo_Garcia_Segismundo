var express = require('express');

var router = express.Router();

router.get('/Questionary', function (req, res) {
    res.render("Questionary", {
        name: "Cuestionario"
    });
});

module.exports = router;