<!-- src/components/Chat/ChatRequestButton.vue -->
<template>
  <button class="btn btn-outline-primary" :disabled="loading" @click="requestChat">
    <span v-if="!loading">채팅 요청</span>
    <span v-else>요청 중...</span>
  </button>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import apiRequest from '@/apis/apiRequest' // JWT 자동 첨부

// 백엔드 주소
const BASE_URL =
  (import.meta?.env?.VITE_API_BASE) ||
  process.env.VUE_APP_API_BASE ||
  'http://localhost:8080'

const store = useStore()
const route = useRoute()
const router = useRouter()

// prop 또는 라우터 param/query에서 상대 유저 ID 가져오기
const props = defineProps({
  otherUserId: { type: Number, required: false }
})

const isLogin = computed(() => store.getters.isLogin)
const meId     = computed(() => Number(store.getters.getUser?.userId || 0))
const otherId  = computed(() => {
  const id = props.otherUserId ?? Number(route.params.userId || route.query.userId)
  return Number(id || 0)
})

const loading = ref(false)

async function requestChat() {
  if (!isLogin.value || !Number.isInteger(meId.value) || meId.value <= 0) {
    alert('로그인이 필요합니다.'); return
  }
  if (!Number.isInteger(otherId.value) || otherId.value <= 0) {
    alert('상대 정보를 확인할 수 없습니다.'); return
  }
  if (meId.value === otherId.value) {
    alert('본인에게는 요청할 수 없습니다.'); return
  }

  loading.value = true
  try {
    // POST /chat/rooms/ensure?userA=..&userB=..&requestedBy=..
    const res = await apiRequest(
      'post',
      `${BASE_URL}/chat/rooms/ensure`,
      null,
      { userA: meId.value, userB: otherId.value, requestedBy: meId.value }
    )
    const data = res?.data || {}
    const room = data.room
    if (!room?.chatroomId) throw new Error('roomId missing')

    if (room.chatroomStatus === 'A') {
      router.push({ path: '/message/detail', query: { roomId: room.chatroomId } })
    } else {
      alert('채팅 요청을 보냈습니다. 상대가 승인하면 이용할 수 있어요.')
    }
  } catch (e) {
    const status = e?.response?.status
    const msg = e?.response?.data?.message || e?.message || '채팅 요청에 실패했습니다.'
    console.error('requestChat error:', status, e)
    alert(msg)
  } finally {
    loading.value = false
  }
}
</script>
