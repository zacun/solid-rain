<template>
  <div id="ui">
    <Map v-on:openmodal="fillModal" id="map-component" />
    <User v-on:openmodal="fillModal" id="user-component" />
    <Modal v-if="showModal" @close="showModal = false">
      <template v-slot:header>
        <h1 v-bind:class="[modalHeaderClass]">{{ modalHeaderText }}</h1>
      </template>
      <template v-slot:body>
        <p>{{ modalBodyText }}</p>
      </template>
    </Modal>
  </div>
</template>

<script>
import Map from "../components/Map";
import User from "../components/User";
import { mapActions } from "vuex";
import Modal from "../components/Modal";

export default {
  name: "UserInterface",
  components: {
    Modal,
    Map,
    User,
  },
  data() {
    return {
      showModal: false,
      modalHeaderText: "",
      modalBodyText: "",
      modalHeaderClass: "",
    };
  },
  methods: {
    ...mapActions({
      initPlayer: "initPlayer",
      setPlayer: "setPlayer",
      getServerGame: "getGame",
    }),
    fillModal: function (modal) {
      this.$data.modalHeaderText = modal.header;
      this.$data.modalBodyText = modal.body;
      this.$data.modalHeaderClass = modal.headerClass;
      this.$data.showModal = true;
    },
    getGame: async function (player) {
      await this.getServerGame(player);
    },
  },
  beforeCreate() {
    if (!this.$store.state.isConnected) {
      this.$router.push("/login");
    }
  },
  async beforeMount() {
    document.title = "Solid Rain - Jeu";
    // Init player's data
    let login = this.$store.state.player.login || localStorage.getItem("login");
    await this.initPlayer(login);
    // Init game's data
    let player = this.$store.state.player || localStorage.getItem("player");
    await this.getGame(player);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        let position = [pos.coords.latitude, pos.coords.longitude];
        this.$store.commit("setPlayerPosition", position);
        this.setPlayer({
          route: "default",
          player: this.$store.state.player,
          data: this.$store.state.player,
        });
      },
      (error) => {
        console.log(error);
        this.fillModal({
          header: "Impossible de récupérer vos données GPS !",
          body: "Vos données GPS n'ont pas pu être récupérées.",
          headerClass: "error",
        });
        this.$router.push("/");
      },
      {
        timeout: 60000,
        enableHighAccuracy: true,
      }
    );
  },
};
</script>

<style scoped>
.error {
  color: #ff0303;
}
.success {
  color: #42b983;
}
#ui {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#map-component {
  width: 100vw;
}
</style>
