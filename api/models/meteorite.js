class Meteorite {
    id = null;
    impact = null;
    composition = null;

    hasBeenLooted = false;
    timeLooted = null;
    playerWhoLooted = null;

    constructor(impact, composition) {
        this.impact = impact;
        this.composition = composition;
    };

    getId = () => { return this.id; };
    getPosition = () => { return this.impact; }
    getComposition = () => { return this.composition; };

    setId = (id) => { this.id = id; };
    setImpact = (pos) => { this.impact = pos; };
    setComposition = (comp) => { this.composition = comp; };
};

module.exports = Meteorite;