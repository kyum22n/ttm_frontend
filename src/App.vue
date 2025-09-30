<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- 공통 헤더 -->
    <Header/>

    <!-- 메인 -->
    <div class="flex-grow-1 container-fluid">
      <div class="row">
        <div class="col-md-7 py-2">
          <RouterView/>
        </div>
      </div>
    </div>

    <!-- 공통 푸터 -->
    <Footer />
  </div >
</template>

<script setup>
import { useRoute } from "vue-router";
import Footer from './components/Footer';
import Header from './components/Header';
const route = useRoute();
</script>

<style>

</style>
