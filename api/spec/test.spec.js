const apiPath = 'http://localhost:3376';

const axios = require('axios');
const FormData = require("form-data");

describe("Test axios", () => {
    let server;
    beforeAll(() => {
        server = require("../index");
    });
    afterAll(() => {
        server.close();
    });
    it("POST /admin/zrr success", (done) => {
        axios({
            url: `${apiPath}/admin/zrr`,
            method: "POST",
            data: {pt1: [45.78, 4.86], pt2: [46.89, 5.69]}
        }).then(response => {
            expect(response.status).toBe(201);
            let game = response.data.GAME;
            expect(game.ZRR).toEqual({pt1: [45.78, 4.86], pt2: [46.89, 5.69]});
            done();
        });        
    });

    it("POST /admin/zrr fail", (done) => {
        axios({
            url: `${apiPath}/admin/zrr`,
            method: "POST",
            data: {pt1: [45.78, 4.86], pt2: []}
        }).catch(error => {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toBe("Deux points de coordonnées sont nécessaires.");
            done();
        });
    });

    it("POST /admin/ttl success", (done) => {
        axios({
            url: `${apiPath}/admin/ttl`,
            method: "POST",
            data: {ttl: 90}
        }).then(response => {
            expect(response.status).toBe(200);
            let game = response.data.GAME;
            expect(game.TTL).toBe(90);
            done();
        });
    });

    it("POST /admin/ttl fail", (done) => {
        axios({
            url: `${apiPath}/admin/ttl`,
            method: "POST",
            data: {ttl: -5}
        }).catch(error => {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toBe("TTL doit être supérieur à 0.");
            done();
        });
    });

    it("POST /admin/meteorite", (done) => {
        axios({
            url: `${apiPath}/admin/meteorite`,
            method: "POST",
            data: {composition: "Astra-Z", position: [45.2, 4.6]}
        }).then(response => {
            expect(response.status).toBe(201);
            let game = response.data.GAME;
            expect(game.nbMeteorites).toBe(1);
            expect(game.meteorites[0].impact).toEqual([ 45.2, 4.6 ]);
            expect(game.meteorites[0].composition).toBe('Astra-Z');
            done();
        });
    });

    it("POST admin/player/new", (done) => {
        axios({
            url: `${apiPath}/admin/player/new`,
            method: "POST",
            data: {login: "Leo"}
        }).then(response => {
            expect(response.status).toBe(201);
            let game = response.data.GAME;
            expect(game.players[1].login).toBe("Leo");
            done();
        });
    });

    it("GET resources/meteorite/:id", (done) => {
        axios({
            url: `${apiPath}/resources/meteorite/0`,
            method: "GET"
        }).then(response => {
            expect(response.status).toBe(200);
            let m = response.data;
            expect(m.composition).toBe("Astra-Z");
            expect(m.impact).toEqual([45.2, 4.6]);
            done();
        });
    });

    describe("Token required routes", () => {
        let token;
        let player;
        beforeAll(async () => {
            const form = new FormData();
            form.append("login", "Leo");
            form.append("password", "test");
            await axios
            .post("http://******/spring-boot/login", form, {
                headers: {
                    "Origin": apiPath,
                    ...form.getHeaders(),
                },
            })
            .then((res) => {
                token = res.headers.authorization;
            })
            .catch((error) => {
                console.log(error);
            });

            await axios({
                url: `${apiPath}/resources/player/Leo`,
                method: "GET",
                params: {
                    token: token,
                },
                headers: {
                    "Origin": apiPath,
                },
            })
            .then(response => {
                player = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
        });

        it("PUT resources/player/:id/position", (done) => {
            axios({
                url: `${apiPath}/resources/player/${player.login}/position`,
                method: "PUT",
                data: {
                    position: [48.2, 4.4],
                    login: player.login,
                    token: token,
                },
                headers: {
                    "Origin": apiPath,
                },
            }).then(response => {
                expect(response.status).toBe(200);
                let game = response.data.GAME;            
                expect(game.players[1].position).toEqual([48.2, 4.4]);
                done();
            });
        });
    
        it("PUT resources/player/:id/image", (done) => {
            axios({
                url: `${apiPath}/resources/player/${player.login}/image`,
                method: "PUT",
                data: {
                    image: "https://intra-science.anaisequey.com/images/stories/observations/bio-polaire%20(18).jpg",
                    login: player.login,
                    token: token,
                },
                headers: {
                    "Origin": apiPath,
                },
            }).then(response => {
                expect(response.status).toBe(200);
                let game = response.data.GAME;
                expect(game.players[1].image).toBe("https://intra-science.anaisequey.com/images/stories/observations/bio-polaire%20(18).jpg");
                done();
            });
        });
    
        it("PUT resources/player/:id/login", (done) => {
            axios({
                url: `${apiPath}/resources/player/${player.login}/login`,
                method: "PUT",
                data: {
                    login: player.login,
                    name: "Paulin",
                    token: token,
                },
                headers: {
                    "Origin": apiPath,
                },
            }).then(response => {
                expect(response.status).toBe(200);
                let game = response.data.GAME;
                expect(game.players[1].login).toBe("Paulin");
                done();
            });
        });
    
        it("GET resources/player/:login", (done) => {
            axios({
                url: `${apiPath}/resources/player/Paulin`,
                method: "GET",
                params: {
                    token: token,
                },
                headers: {
                    "Origin": apiPath,
                },
            }).then(response => {
                expect(response.status).toBe(200);
                let p = response.data;
                expect(p.login).toBe("Paulin");
                expect(p.position).toEqual([48.2, 4.4]);
                done();
            });
        });
    });
});