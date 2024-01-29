var express = require('express');

var router = express.Router();

router.get('/questionary', function (req, res) {
    res.render("questionary", {
        name: "Cuestionario"
    });
});

module.exports = router;