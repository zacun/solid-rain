const express = require('express');
const router = express.Router();
const axios = require('axios');

let authenticate = (req, res, next) => {
    let token;
    if (req.query.token) {
        token = req.query.token;
    } else {
        token = req.body.token;
    }
    if (token) {
        axios
        .get(`${global.apiPath}/authenticate`, {
            params: {
                origin: req.headers.origin,
                token: token,
            },
        })
        .then(response => {
            next();
        })
        .catch(err => { console.log(err); });
    } else {
        res.status(400).send("No token found.");
    }
};

// GET the whole game resources.
router.get('/game', (req, res) => {
    if (global._GAME) {
        res.status(200).send({"GAME": global._GAME});
    } else {
        res.sendStatus(204);
    }
});

// GET a player
router.get('/player/:login', authenticate, (req, res) => {
    let p = global._GAME.getPlayerByLogin(req.params.login);
    if (p != null) {
        res.status(200).send(p);
    } else {
        res.status(404).send("Cet utilisateur n'existe pas.");
    }
});

// Update a player
router.put('/player/:id', authenticate, (req, res) => {
    if (req.params.id && req.body.player) {
        global._GAME.updatePlayer(req.body.player);
        res.status(200).send({"GAME": global._GAME});
    } else {
        res.status(400).send("Données incoorectes.");
    }
});

// GET a meteor
router.get('/meteorite/:id', (req, res) => {
    let m = global._GAME.getMeteoriteById(req.params.id);
    if (m != null) {
        res.status(200).send(m);
    } else {
        res.status(404).send("Cette météoride n'existe pas.");
    }
});

// Update a meteor
router.put('/meteorite/:id', authenticate, (req, res) => {
    if (req.params.id && req.body.meteor) {
        global._GAME.updateMeteorite(req.body.meteor);
        res.status(200).send(req.body.meteor);
    } else {
        res.status(400).send("Données incoorectes.");
    }
});

// Update the player login
router.put('/player/:id/login', authenticate, (req, res) => {
    let id = req.params.id;
    let login = req.body.login;
    let name = req.body.name;
    if (id && login && name) {
        let user = {login: name, password: ""};
        axios
        .put(`${global.apiPath}/users/${login}`, user)
        .then(response => {
            if (response.status === 200) {
                global._GAME.getPlayerByLogin(id).login = name;
                res.status(200).send({"GAME": global._GAME});
            }
        })
        .catch(error => console.log(error));
    } else {
        res.status(400).send("Données incorrectes.");
    }
});

// Update the player position
router.put('/player/:id/position', authenticate, (req, res) => {
    let p = global._GAME.getPlayerByLogin(req.params.id);
    if (p != null) {
        if (req.body.position && req.body.position.length == 2) {
            p.position = req.body.position;
            res.status(200).send({"GAME": global._GAME});
        } else {
            res.status(400).send("La position doit être un tableau contenant une latitude et une longitude.");
        }
    } else {
        res.status(404).send("Le joueur n'existe pas.");
    }
});

// Update the player image
router.put('/player/:id/image', authenticate, (req, res) => {
    let id = req.params.id;
    let login = req.body.login;
    let image = req.body.image;
    if (id && login && image) {
        global._GAME.getPlayerByLogin(id).image = image;
        res.status(200).send({"GAME": global._GAME});
    } else {
        res.status(400).status("Url et/ou id incorrect.");
    }
});

module.exports = router;