<template>
  <div>
    <h1>
      <span>Pour accéder à votre partie,</span><br />
      Connectez-vous<br />
    </h1>
    <form id="loginForm" @submit.prevent="login">
      <div class="input-container">
        <input
          type="text"
          name="login"
          id="login"
          placeholder="Identifiant"
          v-model.trim="loginInput"
        />
      </div>
      <div class="input-container">
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Mot de passe"
          v-model.trim="passwordInput"
        />
      </div>
      <button type="submit">Se connecter</button>
    </form>
  </div>
</template>

<script>
import * as api from "../api-client/game";
document.title = "Solid Rain - Connexion";
export default {
  name: "Login",
  data() {
    return {
      loginInput: "",
      passwordInput: "",
    };
  },
  methods: {
    login: async function () {
      let login = await api.login(
        this.$data.loginInput,
        this.$data.passwordInput
      );
      if (login) {
        this.$store.commit("connectUser", true);
        this.$store.commit("setPlayer", { login: login });
        await this.$router.push("/ui");
      } else {
        console.log("login", login);
      }
    },
  },
  beforeMount() {
    document.title = "Solid Rain - Connexion";
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: 2rem;
  color: #42b983;
}
h1 span {
  font-size: 1rem;
}
form {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
}
::placeholder {
  color: white;
}
.input-container input {
  font-size: 14px;
  padding: 4px 0.5rem;
  background-color: #42b983;
  border: none;
  box-shadow: 2px 2px 1px lightgray;
  border-radius: 5px;
  color: white;
}
form button {
  margin: 1rem;
  font-size: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  box-shadow: 2px 2px 1px lightgray;
  border-radius: 5px;
  padding: 0.5rem;
  cursor: pointer;
}
</style>
