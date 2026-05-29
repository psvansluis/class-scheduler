<template>
  <div id="app-container">
    <header>
      <h1>Declarative Class Scheduler</h1>
      <nav>
        <router-link to="/">Setup Constraints</router-link> |
        <router-link to="/result">View Schedule</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
#app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
}
nav {
  margin-bottom: 2rem;
}
nav a {
  margin: 0 0.5rem;
  text-decoration: none;
  color: #42b983;
}
nav a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
