import axios from "axios";

export async function login(_login, _password) {
  const form = new FormData();
  form.append("login", _login);
  form.append("password", _password);
  let response = await axios
    .post(`${process.env.VUE_APP_SPRING_API}/login`, form)
    .catch((error) => {
      console.log(error);
    });
  if (response) {
    const token = response.headers.authorization;
    localStorage.setItem("token", token);
    localStorage.setItem("login", _login);
    return _login;
  }
  return false;
}

export async function logout() {
  let status = 0;
  await axios
    .delete(`${process.env.VUE_APP_SPRING_API}/logout`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((res) => {
      status = res.status;
    })
    .catch((error) => {
      console.log(error);
    });
  return status;
}

export async function getPlayer(login, callback) {
  let token = localStorage.getItem("token");
  if (token) {
    await axios
      .get(`${process.env.VUE_APP_EXPRESS_API}/resources/player/${login}`, {
        params: {
          token: token,
        },
      })
      .then((res) => {
        localStorage.setItem("player", JSON.stringify(res.data));
        callback(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

let playerRoutes = (param) => {
  return {
    default: {
      url: `${process.env.VUE_APP_EXPRESS_API}/resources/player/${param}`,
      params: "player",
    },
    login: {
      url: `${process.env.VUE_APP_EXPRESS_API}/resources/player/${param}/login`,
      params: "name",
    },
    position: {
      url: `${process.env.VUE_APP_EXPRESS_API}/resources/player/${param}/position`,
      params: "position",
    },
    image: {
      url: `${process.env.VUE_APP_EXPRESS_API}/resources/player/${param}/image`,
      params: "image",
    },
  };
};

export function setPlayer(route, player, data, callback) {
  if (!route || !player) return false;
  axios
    .put(playerRoutes(player.login)[route].url, {
      [playerRoutes(player.login)[route].params]: data,
      login: player.login,
      token: localStorage.getItem("token"),
    })
    .then((res) => {
      let playerTemp;
      res.data.GAME.players.forEach((p) => {
        if (p.login === player.login) playerTemp = p;
      });
      localStorage.setItem("player", JSON.stringify(playerTemp));
      localStorage.setItem("login", playerTemp.login);
      callback(playerTemp);
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function getGame(callback) {
  let response = await axios
    .get(`${process.env.VUE_APP_EXPRESS_API}/resources/game`)
    .catch((error) => {
      console.log(error);
    });
  if (response && response.status !== 204) {
    localStorage.setItem("game", JSON.stringify(response.data.GAME));
    callback(response.data.GAME);
  }
}

export function setMeteor(meteor, callback) {
  axios
    .put(
      `${process.env.VUE_APP_EXPRESS_API}/resources/meteorite/${meteor.id}`,
      {
        meteor: meteor,
        token: localStorage.getItem("token"),
      }
    )
    .then((response) => {
      if (response.status === 200) callback(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
