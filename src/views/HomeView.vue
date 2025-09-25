<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/나와 산책가개 logo_white.png" height="300" />
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/views/HomeView/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>
