<template>
  <section class="card">
    <h2>
      <img v-bind:src="storePlayer.image" alt="Icone du joueur" />
      <span>{{ storePlayer.login }}</span>
    </h2>
    <p class="ttl">
      <span>Votre TTL :</span>
      <span class="ttl-number">{{ storePlayer.ttl }}</span>
    </p>
    <div>
      <button class="button" v-on:click="updateLogin">Changer de pseudo</button>
      <button class="button" v-on:click="updateImage">Changer d'image</button>
    </div>
  </section>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "User",
  data() {
    return {
      player: null,
      interval: null,
    };
  },
  methods: {
    ...mapActions(["setPlayer"]),
    updateImage: function () {
      let image = window.prompt("Url de l'image : ");
      let player = JSON.parse(localStorage.getItem("player"));
      if (player.login && image && image.length > 0) {
        this.setPlayer({
          route: "image",
          player: player,
          data: image,
        });
      } else {
        console.log("Le login ou l'url est manquant.");
      }
    },
    updateLogin: function () {
      let player = JSON.parse(localStorage.getItem("player"));
      let name = window.prompt("Votre login :", player.login);
      if (name !== player.login && player && name && name.length > 0) {
        this.setPlayer({
          route: "login",
          player: player,
          data: name,
        });
      } else {
        console.log("Il n'y a rien à changer.");
      }
    },
    gameHasEndedNotification: function () {
      let title = "Partie terminée !";
      let options = {
        body: "Votre partie est terminée ! Merci d'avoir joué.",
      };
      new Notification(title, options);
    },
    decreaseTtl: async function () {
      let currenTtl = parseInt(this.storePlayer.ttl);
      if (currenTtl > 0) {
        let player = this.storePlayer;
        player.ttl = currenTtl - 1;
        await this.setPlayer({
          route: "default",
          player: player,
          data: player,
        });
      } else {
        clearInterval(this.$data.interval);
      }
    },
  },
  mounted() {
    this.$data.interval = setInterval(() => {
      this.decreaseTtl();
    }, 1000);
    let unwatch = this.$store.watch(
      () => this.storePlayer,
      (newVal) => {
        if (newVal.ttl <= 0) {
          Notification.requestPermission().then((res) => {
            if (res === "granted") this.gameHasEndedNotification();
          });
        }
        if (newVal.ttl === 0) {
          window.navigator.vibrate(1000);
          clearInterval(this.$data.interval);
          this.$emit("openmodal", {
            header: "Vous êtes mort !",
            body: "Aïe ! Vous avez épuisé votre TTL",
            headerClass: "error",
          });
          unwatch();
        }
        if (newVal.ttl === -1) {
          window.navigator.vibrate([100, 100, 100]);
          clearInterval(this.$data.interval);
          this.$emit("openmodal", {
            header: "Vous avez gagné",
            body: "Bravo ! Vous avez guéri de votre dépendance à l'Astra-Z !",
            headerClass: "success",
          });
          unwatch();
        }
      }
    );
  },
  computed: {
    storePlayer() {
      return this.$store.state.player;
    },
  },
  unmounted() {
    clearInterval(this.$data.interval);
  },
};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  border-top: 1px solid #42b983;
  border-left: 1px solid #42b983;
  padding: 0.5rem;
  margin: 0 1rem 1rem 1rem;
  box-shadow: 2px 2px 2px #42b983;
  max-width: 50rem;
}
h2 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.5rem;
  color: #42b983;
  text-decoration: underline;
}
h2 img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.button {
  margin: 0.5rem;
  font-size: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  box-shadow: 2px 2px 1px lightgray;
  border-radius: 5px;
  padding: 0.5rem;
  cursor: pointer;
}
.ttl {
  box-shadow: 1px 1px 5px gray inset;
  padding: 0.5rem;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ttl span {
  margin: 0 0.5rem;
}
.ttl-number {
  font-weight: bold;
  font-size: 1.5rem;
}
</style>
