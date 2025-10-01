<template>
  <div class="container py-5">
    <button class="btn btn-primary" @click="showModal = true">산책 신청 보기</button>

    <WalkApplicantsModal
      v-model="showModal"
      :items="dummyItems"
      @open="(postId, item) => console.log('open', postId, item)"
      @cancel="(postId, item) => console.log('cancel', postId, item)"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import WalkApplicantsModal from "./WalkApplicantsModal";

const showModal = ref(false);
const dummyItems = [
  {
    id: 1,
    name: "멍멍이",
    avatar: "",
    ageYears: 2,
    gender: "M",
    weightKg: 5,
    location: "서울",
    userIdStr: "u123",
    postId: 1001,
    message: "같이 산책해요!",
    status: "APPLY",
  },
];
</script>
