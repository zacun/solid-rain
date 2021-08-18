class Player {
    id = null;
    login = null;
    ttl = null;
    image = null;
    position = null;
    trophys = null;

    constructor(login, ttl) {
        this.login = login;
        this.ttl = ttl;
    };

    setId = id => { this.id = id; };
    setLogin = login => { this.login = login; };
    setTTL = ttl => { this.ttl = ttl; };
    setImage = image => { this.image = image; };
    setPosition = pos => { this.position = pos; };
    setTrophys = trophy => { this.trophys = trophy; }; // To be changed for several trophys

    getId = () =>  { return this.id; };
    getLogin = () => { return this.login; };
    getTTL = () => { return this.ttl; };
    getImage = () => { return this.image; };
    getPosition = () => { return this.position; };
    getTrophys = () => { return this.trophys; };

}

module.exports = Player;