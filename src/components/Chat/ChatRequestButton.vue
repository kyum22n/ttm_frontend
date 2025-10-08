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

// 백엔드 주소 (네 프로젝트 패턴과 동일)
const BASE_URL =
  (import.meta?.env?.VITE_API_BASE) ||
  process.env.VUE_APP_API_BASE ||
  'http://localhost:8080'

// 지금은 고정값(로그인 2 → 프로필 3)
// 나중에 props 로 바꾸거나 store에서 가져오면 됨
// const ME = 83
// const OTHER = 84

const store = useStore()
const route = useRoute()
const router = useRouter()


// prop으로 받을 수도 있고, 라우터에서 보조로 가져오게 처리
const props = defineProps({
  otherUserId: { type: Number, required: false }
})

const isLogin = computed(() => store.getters.isLogin)
const meId = computed(() => Number(store.getters.getUser?.userId || 0))
const otherId = computed(() => {
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
    const url = `${BASE_URL}/chat/rooms/ensure?userA=${meId.value}&userB=${otherId.value}&requestedBy=${meId.value}`
    const res = await fetch(url, { method: 'POST' })
    const text = await res.text()
    if (!res.ok) { console.error(text); throw new Error(`HTTP ${res.status}`) }
    const data = JSON.parse(text)
    const room = data?.room
    if (!room?.chatroomId) throw new Error('roomId missing')

    if (room.chatroomStatus === 'A') {
      router.push({ path: '/message/detail', query: { roomId: room.chatroomId } })
    } else {
      alert('채팅 요청을 보냈습니다. 상대가 승인하면 이용할 수 있어요.')
      // 대기 화면이 따로 있으면: router.push({ path:'/message/pending', query:{roomId:room.chatroomId} })
    }
  } catch (e) {
    alert('채팅 요청에 실패했습니다.')
  } finally {
    loading.value = false
  }
}

</script>