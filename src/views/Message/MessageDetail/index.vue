<template>
  <div style="max-width:900px;margin:0 auto;padding:16px">
    <div v-if="loading">불러오는 중…</div>

    <div v-else-if="roomStatus === 'A'">
      <ChatRoom :baseUrl="BASE_URL" :roomId="roomId" :myUserId="myUserId" />
    </div>

    <div v-else-if="roomStatus === 'P'">
      <div class="p-4 rounded border" style="background:#fff5e6;border-color:#ffd8a8">
        <h3 class="mb-2">승인 대기 중</h3>
        <p>상대가 채팅 요청을 승인하면 이용할 수 있어요.</p>
      </div>
    </div>

    <div v-else>
      <div class="p-4 rounded border" style="background:#ffecec;border-color:#ffb3b3">
        <h3 class="mb-2">입장할 수 없습니다</h3>
        <p>{{ errorMsg || '방이 없거나 권한이 없습니다.' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ChatRoom from '@/components/Chat/ChatRoom.vue'

const BASE_URL = (import.meta?.env?.VITE_API_BASE) || process.env.VUE_APP_API_BASE || 'http://localhost:8080'

const roomId = computed(() => {
  const q = new URLSearchParams(window.location.search)
  return Number(q.get('roomId') || (window.location.pathname.split('/').pop() || 0))
})

// 테스트용 고정(전역/스토어로 교체)
const myUserId = computed(() => 2)

const loading = ref(true)
const roomStatus = ref(null)
const errorMsg = ref('')

async function getJSON(url) {
  const res = await fetch(url)
  let body = null
  try { body = await res.json() } catch { body = null }
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`)
    err.status = res.status
    err.body = body
    throw err
  }
  return body
}

async function fetchRoomStatus() {
  try {
    const info = await getJSON(`${BASE_URL}/chat/rooms/${roomId.value}/info?userId=${myUserId.value}`)
    roomStatus.value = info?.room?.chatroomStatus ?? null
  } catch (e) {
    const code = e?.body?.code
    if (code === 'NOT_MEMBER') {
      roomStatus.value = 'X'
      errorMsg.value = '이 방의 멤버가 아닙니다.'
    } else if (code === 'NOT_APPROVED') {
      roomStatus.value = 'P'
      errorMsg.value = '승인 대기 중입니다.'
    } else if (e?.status === 404) {
      roomStatus.value = 'X'
      errorMsg.value = '방을 찾을 수 없습니다.'
    } else {
      roomStatus.value = 'X'
      errorMsg.value = `요청 실패: ${e?.status ?? ''}`
    }
  }
}

onMounted(async () => {
  try { await fetchRoomStatus() } finally { loading.value = false }
})
</script>
