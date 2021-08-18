const express = require('express');
const router = express.Router();
const axios = require('axios');

const Game = require('../game');
const Player = require('../models/player');
const Zrr = require('../models/zrr');
const Meteorite = require('../models/meteorite');

router.post('/zrr', (req, res) => {
    if (req.body.pt1 && req.body.pt2 && req.body.pt1.length == 2 && req.body.pt2.length == 2) {
        let zrr = new Zrr(req.body.pt1, req.body.pt2);
        global._GAME = new Game(zrr, 0);
        res.status(201).send({"GAME": global._GAME});
    } else {
        res.status(400).send("Deux points de coordonnées sont nécessaires.")
    }
});

router.post('/ttl', (req, res) => {
    if (req.body.ttl && req.body.ttl > 0) {
        global._GAME.setTTL(req.body.ttl);
        res.status(200).send({"GAME": global._GAME});
    } else {
        res.status(400).send("TTL doit être supérieur à 0.");
    }
});

router.post('/player/new', (req, res) => {
    if (req.body.login && global._GAME) {
        let user = {login: req.body.login, password: "test"};
        axios
        .post(`${global.apiPath}/users`, user)
        .then(response => {
            if (response.status === 201) {
                let player = new Player(req.body.login, global._GAME.getTTL());
                player.image = "https://www.bouchara.com/media/catalog/product/cache/7122db7a163886b58932cc7256eedd49/0/8/08004802_2222_12_1.jpg"
                global._GAME.addPlayer(player);
                res.status(201).send({"GAME": global._GAME});
            }
        })
        .catch(error => console.log(error));
    } else {
        res.status(400).send("Aucun login n'a été envoyé.");
    }
});

router.post('/meteorite', (req, res) => {
    let meteorite = new Meteorite(req.body.position, req.body.composition);
    if (global._GAME.getMeteorites().length > 0) {
        global._GAME.addMeteorite(meteorite);
    } else {
        startGame(meteorite);
    }
    res.status(201).send({"GAME": global._GAME});
});

function startGame(meteorite) {
    global._GAME.addMeteorite(meteorite);
    let mockPlayer = new Player("prof", global._GAME.getTTL());
    mockPlayer.image = "https://www.bouchara.com/media/catalog/product/cache/7122db7a163886b58932cc7256eedd49/0/8/08004802_2222_12_1.jpg"
    global._GAME.addPlayer(mockPlayer);
}

module.exports = router;