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

// 백엔드 주소
const BASE_URL = (import.meta?.env?.VITE_API_BASE) || process.env.VUE_APP_API_BASE || 'http://localhost:8080'

const store = useStore()

// URL에서 roomId 뽑기 (쿼리 우선, 없으면 path 마지막 조각)
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

// 상대 아바타 URL만 별도로 채움
const otherAvatarUrl = ref('')

const loading = ref(true)
const roomStatus = ref(null)
const errorMsg = ref('')

// 공용 GET(JSON) 헬퍼
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


// 방 정보 가져와서 상태와 '상대 userId' 계산
async function fetchRoomInfo() {
  // /chat/rooms/{roomId}/info?userId=내ID
  const info = await getJSON(`${BASE_URL}/chat/rooms/${roomId.value}/info?userId=${myUserId.value}`)
  const room = info?.room
  roomStatus.value = room?.chatroomStatus ?? null
  if (!room) throw new Error('ROOM_NOT_FOUND')

  // 내가 u1이면 상대는 u2, 반대면 u1
  const otherId = (myUserId.value === room.chatuser1Id) ? room.chatuser2Id : room.chatuser1Id
  return { otherId }
}


onMounted(async () => {
  try {
    // 로그인/내ID 검증
    if (!isLogin.value || !Number.isInteger(myUserId.value) || myUserId.value <= 0) {
      errorMsg.value = '로그인이 필요합니다.'
      roomStatus.value = 'X'
      return
    }

    // 1) 방 상태/상대ID 확인
    const { otherId } = await fetchRoomInfo()

    // 2) 상대 아바타 URL 조회
    //    petApi.avatarUrlByUser는 /pet/{userId}/first-pet 호출 → { imageUrl } → 절대경로로 조합
    //    펫이 없으면 '' 반환 (ChatRoom에서 폴백 이미지가 보임)
    otherAvatarUrl.value = await petApi.avatarUrlByUser(otherId, BASE_URL)
  } catch (e) {
    // 서버가 code를 내려주면 해석
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












// // ✅ [수정] 기존 fetchRoomStatus → 상대 정보까지 로드
// async function fetchRoomStatusAndOther() {
//   // 1) 방 상태 조회
//   const info = await getJSON(`${BASE_URL}/chat/rooms/${roomId.value}/info?userId=${myUserId.value}`)
//   const room = info?.room
//   roomStatus.value = room?.chatroomStatus ?? null

//   // 2) 상대 유저 id 계산 (내가 u1이면 상대는 u2, 반대면 u1)
//   if (room && Number.isInteger(myUserId.value)) {
//     otherUserId.value = (myUserId.value === room.chatuser1Id) ? room.chatuser2Id : room.chatuser1Id
//   }

//   // 3) 상대 프로필 조회 → 아바타 URL 세팅
//   if (otherUserId.value != null) {
//     try {
//       // 엔드포인트는 프로젝트 규격에 맞게
//       const uRes = await axios.get(`${BASE_URL}/api/users/${otherUserId.value}`)
//       const profilePath = uRes?.data?.profileImage || ''

//       // 공개 이미지면 절대 URL로
//       otherAvatarUrl.value = profilePath ? `${BASE_URL}${profilePath}` : ''

//       // 이미지가 보호 리소스라면 위 한 줄 대신 아래 한 줄로 Blob URL 사용
//       // otherAvatarUrl.value = await toBlobUrl(profilePath)
//     } catch {
//       // 프로필이 없거나 실패 시 → ChatRoom에서 폴백 이미지가 적용됨
//       otherAvatarUrl.value = ''
//     }
//   }
// }




// onMounted(async () => {
//   try {
//     // 앱 부팅 시 main.js에서 이미 복원했지만, 혹시 초기 진입이라면 잠깐 기다려도 무방
//     if (!isLogin.value || !Number.isInteger(myUserId.value)) {
//       // 로그인 안 된 경우: 페이지 메시지 노출
//       return
//     }
//      await fetchRoomStatusAndOther()  
//   } catch (e) {
//     const code = e?.body?.code
//     if (code === 'NOT_MEMBER') {
//       roomStatus.value = 'X'
//       errorMsg.value = '이 방의 멤버가 아닙니다.'
//     } else if (code === 'NOT_APPROVED') {
//       roomStatus.value = 'P'
//       errorMsg.value = '승인 대기 중입니다.'
//     } else if (e?.status === 404) {
//       roomStatus.value = 'X'
//       errorMsg.value = '방을 찾을 수 없습니다.'
//     } else {
//       roomStatus.value = 'X'
//       errorMsg.value = `요청 실패: ${e?.status ?? ''}`
//     }
//   } finally {
//     loading.value = false
//   }
// })


</script>
