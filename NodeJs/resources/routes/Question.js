// MultiLingQuiz is part of Segimundo Ferrairó García.

// Segimundo Ferrairó García is free software: you can redistribute it and/or modify it under the terms 
// of the GNU General Public License as published by the Free Software Foundation, 
// either version 3 of the License, or (at your option) any later version.

// Segimundo Ferrairó García is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
// without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License along with Segimundo Ferrairó García. 
// If not, see <https://www.gnu.org/licenses/>.


var express = require('express');

var router = express.Router();

router.get('/Question', function (req, res) {
    res.render("Question", {
        name: "Pregunta"
    });
});

module.exports = router;