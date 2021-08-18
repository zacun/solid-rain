export default {
  connectUser(state, isConnected) {
    state.isConnected = isConnected;
  },
  setTtl(state, ttl) {
    state.ttl = ttl;
  },
  setZrr(state, coordinates) {
    state.zrr = coordinates;
  },
  setPlayer(state, player) {
    state.player = player;
  },
  setPlayerTtl(state, ttl) {
    state.player.ttl = ttl;
  },
  setPlayerPosition(state, position) {
    state.player.position = position;
  },
  setMeteor(state, meteor) {
    state.meteorites[meteor.id] = meteor;
  },
  setOtherPlayer(state, otherPlayer) {
    if (state.player.id !== otherPlayer.id) {
      state.otherPlayers[otherPlayer.id] = {
        id: otherPlayer.id,
        login: otherPlayer.login,
        image: otherPlayer.image,
        position: otherPlayer.position,
      };
    }
  },
};
