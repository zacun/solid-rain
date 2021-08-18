import { createStore } from "vuex";
import mutations from "./mutations";
import actions from "./actions";

const store = createStore({
  state() {
    return {
      isConnected: false,
      ttl: null,
      zrr: {
        /*
        pt1: [x1, y1],
        pt2: [x2, y2],
         */
      },
      player: {
        /*
        id,
        login,
        image,
        position, // [x, y]
        ttl,
         */
      },
      meteorites: {
        /*
        id: {
          id,
          impact,
          composition,
          hasBeenLooted,
          timeLooted,
          playerWhoLooted
        }
        */
      },
      otherPlayers: {
        /*
        id: {
          id,
          login,
          image,
          position
        }
         */
      },
    };
  },
  mutations,
  actions,
});

export default store;
