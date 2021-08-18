<template>
  <section id="home">
    <div id="rules-container">
      <h1>Solid Rain</h1>
      <div class="card">
        <h2>Histoire</h2>
        <p>
          Dans un futur plus ou moins lointain, la Terre est frappée par une
          pluie de météorites faites de différents métaux actuellement inconnus
          sur terre. Ces météorites, de formes et de tailles étrangement
          similaires, atterrissent au sol avec une régularité étonnante.
          Pourtant, les métaux qu’elles contiennent ne sont pas toujours les
          mêmes…
        </p>
        <p>
          Les derniers survivants (humains ou non) ont muté et leurs organismes
          sont devenus dépendants à l’un de ces métaux, le plus fréquent,
          baptisé « Astra-Z ». Pendant un délai appelé « Temps de Tranquillité
          et de Liberté » (TTL), ils sont délivrés de tout besoin physiologique
          et peuvent faire ce que bon leur semble.
        </p>
      </div>
      <div class="card">
        <h2>Règles</h2>
        <p>
          Vous êtes propulsé au sein d'une ZRR (Zone Rectangulaire de
          Ressources) dans laquelle tombe des météorites.<br />
          Récoltez les métaux présents dans ces météorites pour augmenter votre
          TTL ou mieux : guérir de votre dépendance à l'Astra-Z.<br />
          Mais attention, il existe trois types de métaux :
        </p>
        <ul>
          <li>
            <span>Astra-Z : </span>permet d'augmenter votre TTL et d'ainsi
            rester en vie.
          </li>
          <li>
            <span>Astra-X : </span>permet de vous guérir de votre dépendance à
            l'Astra-Z.
          </li>
          <li>
            <span>Bêta-X : </span>vous tue immédiatement dans d'atroces
            souffrances.
          </li>
        </ul>
        <p>
          Vous avez en votre possession un dispositif permettant de détecter si
          une météorite contient de l'Astra-Z ou un autre de ces métaux.<br />En
          revanche, vous ne savez pas si l'autre métal est de l'Astra-X ou du
          Bêta-X.<br />Ruse et rapidité seront vos meilleurs alliés pour
          survivre à la Solid Rain !
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Home",
  beforeMount() {
    document.title = "Solid Rain - Accueil";
  },
};
</script>

<style scoped>
#home {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#rules-container {
  margin: 0 1rem;
}
h1 {
  text-align: center;
  font-size: 2rem;
  color: #42b983;
  text-shadow: 2px 2px 2px gray;
}
h2 {
  text-align: center;
  font-size: 1.5rem;
  color: #42b983;
  text-decoration: underline;
}
.card {
  border-radius: 15px;
  border-top: 1px solid #42b983;
  border-left: 1px solid #42b983;
  padding: 0.5rem;
  margin: 1rem 0;
  box-shadow: 2px 2px 2px #42b983;
  text-align: justify;
  max-width: 50rem;
}
ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}
ul span {
  font-weight: bold;
}
</style>
