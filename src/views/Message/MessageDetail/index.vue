<!-- src/views/message/MessageDetail.vue -->
<template>
  <div style="max-width:900px;margin:0 auto;padding:16px">
    <div v-if="loading">불러오는 중…</div>

    <div v-else-if="roomStatus === 'A'">
      <ChatRoom
        :baseUrl="BASE_URL"
        :roomId="roomId"
        :myUserId="myUserId"
        :myAvatarUrl="myAvatarUrl"
        :otherAvatarUrl="otherAvatarUrl"
      />
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
import { useStore } from 'vuex'
import ChatRoom from '@/components/Chat/ChatRoom.vue'
import petApi from '@/apis/petApi'
import apiRequest from '@/apis/apiRequest' // JWT 자동 첨부

// 백엔드 주소
const BASE_URL =
  (import.meta?.env?.VITE_API_BASE) ||
  process.env.VUE_APP_API_BASE ||
  'http://localhost:8080'

const store = useStore()

// URL에서 roomId 뽑기 (쿼리 우선, 없으면 path 마지막 조각)
const roomId = computed(() => {
  const q = new URLSearchParams(window.location.search)
  return Number(q.get('roomId') || (window.location.pathname.split('/').pop() || 0))
})

// 스토어에서 로그인/유저ID 가져오기
const isLogin  = computed(() => store.getters.isLogin)
const myUserId = computed(() => Number(store.getters.getUser?.userId || 0))

// 내 프로필 이미지 절대 URL
const myProfilePath = computed(() => store.getters.getUser?.profileImage || '')
const myAvatarUrl   = computed(() => {
  if (!myProfilePath.value) return ''
  const path = myProfilePath.value.startsWith('/') ? myProfilePath.value : `/${myProfilePath.value}`
  return `${BASE_URL}${path}`
})

// 상대 아바타 URL
const otherAvatarUrl = ref('')

const loading    = ref(true)
const roomStatus = ref(null) // 'A' | 'P' | 그외(X)
const errorMsg   = ref('')

// 공용 GET(JSON) → apiRequest 사용
async function getJSON(url, params) {
  const res = await apiRequest('get', url, null, params)
  return res?.data ?? null
}

// 방 정보 가져와서 상태와 '상대 userId' 계산
async function fetchRoomInfo() {
  const info = await getJSON(`${BASE_URL}/chat/rooms/${roomId.value}/info`, { userId: myUserId.value })
  const room = info?.room
  roomStatus.value = room?.chatroomStatus ?? null
  if (!room) throw new Error('ROOM_NOT_FOUND')

  // 내가 u1이면 상대는 u2, 반대면 u1
  const otherId = (myUserId.value === room.chatuser1Id) ? room.chatuser2Id : room.chatuser1Id
  return { otherId }
}

onMounted(async () => {
  try {
    if (!isLogin.value || !Number.isInteger(myUserId.value) || myUserId.value <= 0) {
      errorMsg.value = '로그인이 필요합니다.'
      roomStatus.value = 'X'
      return
    }

    // 1) 방 상태/상대ID 확인
    const { otherId } = await fetchRoomInfo()

    // 2) 상대 아바타 URL 조회 (없으면 '' → ChatRoom에서 폴백)
    otherAvatarUrl.value = await petApi.avatarUrlByUser(otherId, BASE_URL)
  } catch (e) {
    const code = e?.response?.data?.code || e?.body?.code
    const status = e?.response?.status || e?.status

    if (code === 'NOT_MEMBER') {
      roomStatus.value = 'X'
      errorMsg.value = '이 방의 멤버가 아닙니다.'
    } else if (code === 'NOT_APPROVED') {
      roomStatus.value = 'P'
      errorMsg.value = '승인 대기 중입니다.'
    } else if (status === 404) {
      roomStatus.value = 'X'
      errorMsg.value = '방을 찾을 수 없습니다.'
    } else {
      roomStatus.value = 'X'
      errorMsg.value = `요청 실패: ${status ?? ''}`
    }
  } finally {
    loading.value = false
  }
})
</script>
