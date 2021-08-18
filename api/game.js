class Game {
    ZRR = null;
    TTL = null;
    players = [];
    meteorites = [];
    nbMeteorites = 0;
    nbPlayers = 0;

    constructor(zrr, ttl) {
        this.ZRR = zrr;
        this.TTL = ttl;
    };

    getZRR = () => { return this.ZRR; };
    getTTL = () => { return this.TTL; };
    getPlayers = () => { return this.players; };
    getMeteorites = () => { return this.meteorites; };

    setZRR = zrr => { this.ZRR = zrr; };
    setTTL = ttl => { this.TTL = ttl; };

    addPlayer = player => { 
        player.setId(this.nbPlayers);
        this.players.push(player);
        this.nbPlayers++;
    };

    addMeteorite = meteorite => {
        meteorite.setId(this.nbMeteorites);
        this.meteorites.push(meteorite);
        this.nbMeteorites++;
    };

    updateMeteorite = meteor => {
        for (let i = 0; i < this.meteorites.length; i++) {
            if (this.meteorites[i].id == meteor.id) {
                this.meteorites[i] = meteor;
            }
        }
    };

    updatePlayer = player => {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].login == player.login) {
                this.players[i] = player;
            }
        }
    };

    getPlayerById = id => {
        let p = null;
        this.players.forEach(e => {
            if (e.id == id) p = e;
        });
        return p;
    };

    getPlayerByLogin = login => {
        let p = null;
        this.players.forEach(e => {
            if (e.login == login) p = e;
        });
        return p;
    };

    getMeteoriteById = id => {
        let m = null;
        this.meteorites.forEach(e => {
            if (e.getId() == id) m = e;
        });
        return m;
    };
}

module.exports = Game;