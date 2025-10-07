<template>
  <button class="btn btn-outline-primary" :disabled="loading" @click="requestChat">
    <span v-if="!loading">채팅 요청</span>
    <span v-else>요청 중...</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 백엔드 주소 (네 프로젝트 패턴과 동일)
const BASE_URL =
  (import.meta?.env?.VITE_API_BASE) ||
  process.env.VUE_APP_API_BASE ||
  'http://localhost:8080'

// 지금은 고정값(로그인 2 → 프로필 3)
// 나중에 props 로 바꾸거나 store에서 가져오면 됨
const ME = 83
const OTHER = 84

const router = useRouter()
const loading = ref(false)

async function requestChat() {
  if (loading.value) return
  loading.value = true
  try {
    const url = `${BASE_URL}/chat/rooms/ensure?userA=${ME}&userB=${OTHER}&requestedBy=${ME}`
    const res = await fetch(url, { method: 'POST' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const room = data?.room
    if (!room?.chatroomId) throw new Error('roomId missing')

    // ✅ 상태별 분기
    if (room.chatroomStatus === 'A') {
      // 이미 승인된 방이 있던 케이스 → 바로 입장
      await router.push({ path: '/message/detail', query: { roomId: room.chatroomId } })
    } else {
      // P(대기)면 라우팅하지 않고 안내만
      alert('채팅 요청을 보냈습니다. 상대가 승인하면 이용할 수 있어요.')
    }
  } catch (e) {
    console.error(e)
    alert('채팅 요청에 실패했습니다.')
  } finally {
    loading.value = false
  }
}
</script>