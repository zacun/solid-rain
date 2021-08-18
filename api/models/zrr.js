class ZRR {
    constructor(pt1, pt2) {
        this.pt1 = pt1;
        this.pt2 = pt2;
    };

    getPts = () => {
        return {pt1: this.pt1, pt2: this.pt2};
    };
};

module.exports = ZRR;