import * as api from "../api-client/game";

export default {
  initPlayer: async ({ commit }, login) => {
    await api.getPlayer(login, (player) => {
      commit("setPlayer", player);
    });
  },
  setPlayer: async ({ commit }, { route, player, data }) => {
    api.setPlayer(route, player, data, (player) => {
      localStorage.setItem("player", JSON.stringify(player));
      commit("setPlayer", player);
    });
  },
  setMeteor: async ({ commit }, meteor) => {
    api.setMeteor(meteor, (meteor) => {
      commit("setMeteor", meteor);
    });
  },
  getGame: async ({ commit }, player) => {
    api.getGame((game) => {
      commit("setTtl", game.TTL);
      commit("setZrr", game.ZRR);
      let meteors = game.meteorites;
      let players = game.players;
      for (let m of meteors) {
        commit("setMeteor", m);
      }
      for (let p of players) {
        if (p.login === player.login) {
          localStorage.setItem("player", JSON.stringify(p));
          commit("setPlayer", p);
        } else {
          commit("setOtherPlayer", p);
        }
      }
    });
  },
};
