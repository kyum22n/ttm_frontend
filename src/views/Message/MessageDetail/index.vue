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


const BASE_URL = (import.meta?.env?.VITE_API_BASE) || process.env.VUE_APP_API_BASE || 'http://localhost:8080'
const store = useStore()

const roomId = computed(() => {
  const q = new URLSearchParams(window.location.search)
  return Number(q.get('roomId') || (window.location.pathname.split('/').pop() || 0))
})

// 테스트용 고정(전역/스토어로 교체)
// const myUserId = computed(() => 83)

// 스토어에서 로그인/유저ID 가져오기
const isLogin = computed(() => store.getters.isLogin)
const myUserId = computed(() => Number(store.getters.getUser?.userId || 0))

// ✅ [추가] 내 프로필 이미지 경로를 절대 URL로 변환
const myProfilePath = computed(() => store.getters.getUser?.profileImage || '')
const myAvatarUrl   = computed(() => (myProfilePath.value ? `${BASE_URL}${myProfilePath.value}` : ''))


const loading = ref(true)
const roomStatus = ref(null)
const errorMsg = ref('')


// ✅ [추가] 상대 유저 id와 아바타 URL을 저장할 상태
const otherUserId     = ref(null)
const otherAvatarUrl  = ref('')


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


// async function fetchRoomStatus() {
//   const info = await getJSON(`${BASE_URL}/chat/rooms/${roomId.value}/info?userId=${myUserId.value}`)
//   roomStatus.value = info?.room?.chatroomStatus ?? null
// }


// ✅ [수정] 기존 fetchRoomStatus → 상대 정보까지 로드
async function fetchRoomStatusAndOther() {
  // 1) 방 상태 조회
  const info = await getJSON(`${BASE_URL}/chat/rooms/${roomId.value}/info?userId=${myUserId.value}`)
  const room = info?.room
  roomStatus.value = room?.chatroomStatus ?? null

  // 2) 상대 유저 id 계산 (내가 u1이면 상대는 u2, 반대면 u1)
  if (room && Number.isInteger(myUserId.value)) {
    otherUserId.value = (myUserId.value === room.chatuser1Id) ? room.chatuser2Id : room.chatuser1Id
  }

  // 3) 상대 프로필 이미지 로드 (엔드포인트는 프로젝트에 맞게 수정)
  if (otherUserId.value) {
    try {
      const u = await getJSON(`${BASE_URL}/api/users/${otherUserId.value}`)
      if (u?.profileImage) otherAvatarUrl.value = `${BASE_URL}${u.profileImage}`
    } catch {
      // 이미지 없으면 폴백 사용 (ChatRoom에서 처리)
    }
  }
}




onMounted(async () => {
  try {
    // 앱 부팅 시 main.js에서 이미 복원했지만, 혹시 초기 진입이라면 잠깐 기다려도 무방
    if (!isLogin.value || !Number.isInteger(myUserId.value)) {
      // 로그인 안 된 경우: 페이지 메시지 노출
      return
    }
     await fetchRoomStatusAndOther()  
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
  } finally {
    loading.value = false
  }
})


</script>
