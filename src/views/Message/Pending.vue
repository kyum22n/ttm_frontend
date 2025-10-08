<template>
  <div class="wrap">
    <h2 class="title">채팅 요청 대기</h2>

    <p class="desc">방 번호: <b>{{ roomId }}</b></p>
    <p v-if="info">상태: <b>{{ info.chatroomStatus }}</b> · 요청자: <b>{{ info.requestedBy }}</b></p>

    <div class="actions">
      <button class="btn" :disabled="loading || !canDecide" @click="approve">승인</button>
      <button class="btn danger" :disabled="loading || !canDecide" @click="reject">거절</button>
    </div>

    <p v-if="!canDecide" class="hint">요청을 보낸 사용자는 승인/거절할 수 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const BASE = (import.meta?.env?.VITE_API_BASE) || process.env.VUE_APP_API_BASE || 'http://localhost:8080'
const me = 83 // 테스트 고정

const roomId = Number(new URLSearchParams(location.search).get('roomId') || 0)
const loading = ref(false)
const info = ref(null)

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

const canDecide = computed(() => {
  if (!info.value) return false
  const isMember = me === info.value.chatuser1Id || me === info.value.chatuser2Id
  return isMember && me !== info.value.requestedBy
})

async function loadInfo() {
  try {
    const data = await getJSON(`${BASE}/chat/rooms/${roomId}/info?userId=${me}`)
    info.value = data.room
    if (data.canChat) location.href = `/message/detail?roomId=${roomId}`
  } catch (e) {
    // 멤버면 항상 200이 오도록 백엔드 설정 권장
    // 불가피하게 403이면 summary 같은 보조 API를 두고 대체
    if (e.body?.room) info.value = e.body.room
  }
}

async function approve() {
  if (!canDecide.value) return
  loading.value = true
  try {
    await fetch(`${BASE}/chat/rooms/${roomId}/approve?by=${me}`, { method: 'PUT' })
    location.href = `/message/detail?roomId=${roomId}`
  } finally { loading.value = false }
}

async function reject() {
  if (!canDecide.value) return
  loading.value = true
  try {
    await fetch(`${BASE}/chat/rooms/${roomId}/reject?by=${me}`, { method: 'PUT' })
    alert('요청을 거절했어요.')
    location.href = '/message'
  } finally { loading.value = false }
}

onMounted(loadInfo)
</script>

<style scoped>
.wrap { max-width: 720px; margin: 40px auto; padding: 24px; border: 1px solid #ddd; border-radius: 12px; background: #fff; }
.title { margin: 0 0 12px; }
.desc { color: #555; }
.actions { display: flex; gap: 8px; margin: 16px 0; }
.btn { padding: 10px 16px; border: 1px solid #888; border-radius: 8px; background: #fff; cursor: pointer; }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn.danger { border-color: #d33; color: #d33; }
.hint { color: #777; font-size: .9rem; }
</style>
