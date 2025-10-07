<template>
  <div style="max-width:900px;margin:0 auto;padding:16px">
    <ChatRoom :baseUrl="BASE_URL" :roomId="roomId" :myUserId="myUserId" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ChatRoom from '@/components/Chat/ChatRoom.vue'

// 백엔드 주소 (환경에 맞춰 조정)
const BASE_URL = (import.meta?.env?.VITE_API_BASE) || process.env.VUE_APP_API_BASE || 'http://localhost:8080'

// roomId는 쿼리(roomId)에서 가져오고, 없으면 URL 마지막 조각이나 5
const roomId = computed(() => {
  const q = new URLSearchParams(window.location.search)
  return Number(q.get('roomId') || (window.location.pathname.split('/').pop() || 5))
})

// 사용자 유저 ID (현재는 테스트값 2; 로그인 값으로 교체 가능)
const myUserId = computed(() => 2)
</script>
