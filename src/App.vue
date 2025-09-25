<template>
  <router-view/>
	<nav>
    <router-link to="/">홈</router-link> |
    <router-link to="/Auth/Login">로그인</router-link> |
		<router-link to="/Auth/RegisterPet">회원가입</router-link>
  </nav>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
