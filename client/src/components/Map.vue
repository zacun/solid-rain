<template>
  <section>
    <div id="map" class="map"></div>
    <p class="legend">
      Le rectangle bleu correspond à la ZRR qui vous a été affectée. Restez à
      l'intérieur pour survivre !
    </p>
  </section>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { mapActions } from "vuex";
import { Icon } from "leaflet";

// This part resolves an issue where the markers would not appear in webpack
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// initialisation de la map
let lat = 45.782,
  lng = 4.8656,
  zoom = 19;
let mymap = {};

export default {
  name: "Map",
  data() {
    return {
      interval: null,
      intervalWatchPos: null,
      markers: [],
      zrr: null,
      leafLet: null,
    };
  },
  methods: {
    ...mapActions({
      setPlayer: "setPlayer",
      getServerGame: "getGame",
      setMeteor: "setMeteor",
    }),
    // Update markers on map
    updateInfos: function (L) {
      let players, meteors, zrr;
      zrr = this.storeZrr;
      players = this.storePlayers;
      meteors = this.storeMeteors;
      //Suppression des makers avant de les replacer
      if (this.$data.zrr || this.$data.markers.length > 0) {
        this.$data.zrr.remove();
        this.$data.markers.forEach((marker) => {
          marker.remove();
        });
      }
      //Affichage de la ZRR
      let rect = L.rectangle([zrr.pt1, zrr.pt2]);
      this.$data.zrr = rect;
      rect.addTo(mymap);
      //Affichage des joueurs
      for (let p in players) {
        if (
          players[p] &&
          players[p].position &&
          (players[p].ttl > 0 || players[p].ttl < 0)
        ) {
          let icon = new L.icon({
            iconUrl: players[p].image,
            iconSize: [40, 40],
          });
          let marker = L.marker(players[p].position, { icon: icon }).addTo(
            mymap
          );
          this.$data.markers.push(marker);
        }
      }
      //Affichage des météorites
      for (let m in meteors) {
        if (meteors[m] && meteors[m].impact && !meteors[m].hasBeenLooted) {
          let icon = new L.icon({
            iconUrl: require("@/assets/meteors-icon.jpg"),
            iconSize: [40, 40],
          });
          let marker = L.marker(meteors[m].impact, { icon: icon }).addTo(mymap);
          if (meteors[m].composition === "Astra-Z") marker.bindPopup("Astra-Z");
          else marker.bindPopup("Composition inconnue");
          this.$data.markers.push(marker);
        }
      }
    },
    // Update player's position
    updatePosition: async function () {
      let player =
        this.$store.state.player || JSON.parse(localStorage.getItem("player"));
      // Still playing (did not win or die)
      if (player.ttl > 0) {
        let isInside = this.isInsideZrr(
          this.$data.leafLet,
          this.$store.state.player
        );
        if (!isInside && isInside !== -1) {
          player.ttl = 0;
          await this.setPlayer({
            route: "default",
            player: player,
            data: player,
          });
          this.$emit("openmodal", {
            header: "Vous êtes mort !",
            body: "Aïe ! Vous êtes passés au-delà les limites de la ZRR !",
            headerClass: "error",
          });
        } else {
          this.checkDistanceMeteors();
        }
      }
    },
    isInsideZrr: function (leaflet) {
      if (!this.storeZrr) return -1; // ZRR not init in store
      let area = leaflet.latLngBounds(this.storeZrr.pt2, this.storeZrr.pt1);
      let latLng = leaflet.latLng(this.$store.state.player.position);
      return area.contains(latLng);
    },
    checkDistanceMeteors: function () {
      let player = this.$store.state.player;
      let meteors = this.storeMeteors;
      for (let m in meteors) {
        let distance = mymap.distance(
          meteors[m].impact,
          this.$store.state.player.position
        );
        if (distance <= 2) {
          if (!meteors[m].hasBeenLooted) {
            this.setMeteor({
              id: meteors[m].id,
              impact: meteors[m].impact,
              composition: meteors[m].composition,
              hasBeenLooted: true,
              timeLooted: new Date(),
              playerWhoLooted: this.$store.state.player.id,
            });
            if (meteors[m].composition === "Astra-Z") {
              let currentTtl = parseInt(this.$store.state.player.ttl, 10);
              player.ttl = currentTtl + 30;
              this.$emit("openmodal", {
                header: "Météorite pleine trouvée !",
                body: "Vous avez trouvé de l'Astra-Z. Votre TTL augmente !",
                headerClass: "success",
              });
            } else if (meteors[m].composition === "Astra-X") {
              player.ttl = -1;
              this.$emit("openmodal", {
                header: "Vous avez gagné !",
                body:
                  "Vous avez trouvé de l'Astra-X, vous n'êtes plus dépendant. Bravo !",
                headerClass: "success",
              });
            } else {
              player.ttl = 0;
              this.$emit("openmodal", {
                header: "Vous êtes mort !",
                body:
                  "Aïe ! La météorite contenait du Bêta-X. Vous avez perdu.",
                headerClass: "error",
              });
            }
            this.setPlayer({
              route: "default",
              player: player,
              data: player,
            });
          }
        }
      }
    },
  },
  async beforeMount() {
    // HERE is where to load Leaflet components!
    const L = await import("leaflet");
    this.$data.leafLet = L;
    // Procédure d'initialisation
    mymap = L.map("map", {
      center: [lat, lng],
      zoom: zoom,
    });
    // Création d'un "tile layer" (permet l'affichage sur la carte)
    L.tileLayer(
      "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=YOUR_TOKEN",
      {
        maxZoom: 22,
        minZoom: 1,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "YOUR_TOKEN",
      }
    ).addTo(mymap);

    // Ajout du marker Nautibus
    L.marker([45.78207, 4.86559]).addTo(mymap);
    //
    setTimeout(async () => {
      await this.getServerGame(this.$store.state.player);
      await this.updatePosition();
      this.updateInfos(this.$data.leafLet);
    }, 300);
    this.$data.intervalWatchPos = navigator.geolocation.watchPosition(
      async (pos) => {
        let position = [pos.coords.latitude, pos.coords.longitude];
        await this.setPlayer({
          route: "position",
          player: this.$store.state.player,
          data: position,
        });
        await this.updatePosition();
        this.updateInfos(this.$data.leafLet);
      },
      (error) => {
        console.log(error);
        this.fillModal({
          header: "Impossible de récupérer vos données GPS !",
          body: "Vos données GPS n'ont pas pu être récupérées.",
          headerClass: "error",
        });
      },
      {
        timeout: 60000,
        enableHighAccuracy: true,
      }
    );
    this.$data.interval = setInterval(() => {
      this.getServerGame(this.$store.state.player);
    }, 5000);
  },
  computed: {
    storeZrr() {
      return this.$store.state.zrr;
    },
    storeMeteors() {
      return this.$store.state.meteorites;
    },
    storePlayers() {
      return {
        player: this.$store.state.player,
        ...this.$store.state.otherPlayers,
      };
    },
  },
  unmounted() {
    clearInterval(this.$data.interval);
    navigator.geolocation.clearWatch(this.$data.intervalWatchPos);
  },
};
</script>

<style scoped>
.map {
  height: 400px;
  width: 100%;
  border: 1px solid;
}
.legend {
  font-size: 12px;
}
</style>
