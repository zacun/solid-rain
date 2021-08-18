<template>
  <nav id="nav">
    <router-link to="/">Accueil</router-link> |
    <router-link v-if="!isConnected" to="/login">Connexion</router-link>
    <span v-if="isConnected">
      <router-link to="/ui">Ma partie</router-link> |
    </span>
    <a href="#" v-if="isConnected" v-on:click="logout">Déconnexion</a>
  </nav>
  <main id="main">
    <router-view />
  </main>
  <footer id="footer">
    &copy; 2021 M1IF13 - Paulin BAT & Léo HENINI - Tous droits réservés
  </footer>
</template>

<script>
import * as api from "./api-client/game";
export default {
  methods: {
    logout: async function () {
      let status = await api.logout();
      if (status === 204) {
        this.$store.commit("connectUser", false);
        await this.$router.push("/");
      }
    },
  },
  beforeMount() {
    document.title = "Solid Rain - Accueil";
  },
  computed: {
    isConnected() {
      return this.$store.state.isConnected;
    },
  },
};
</script>

<style>
*,
::after,
::before {
  box-sizing: border-box;
}
body {
  margin: 0;
  min-height: 100vh;
  width: 100vw;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
#nav {
  background-color: #42b983;
  text-align: center;
  height: 4rem;
  vertical-align: middle;
  line-height: 4rem;
}
#nav a {
  font-weight: bold;
  color: #eeeded;
}
#nav a.router-link-exact-active {
  color: white;
}
#main {
  flex: 1;
}
#footer {
  font-size: 12px;
  background-color: #42b983;
  color: white;
  padding: 0.5rem;
}
</style>
