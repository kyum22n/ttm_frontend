<!-- src/components/Chat/ChatList.vue -->
<template>
  <div class="list-wrap">
    <div class="list-header">
      <h3 class="title">내 채팅방</h3>
      <button class="btn" :disabled="loading" @click="fetchRooms">새로고침</button>
    </div>

    <!-- 에러 배너 -->
    <div v-if="errorMsg" class="alert">
      <div class="alert-title">목록을 불러오지 못했습니다.</div>
      <div class="alert-body">{{ errorMsg }}</div>
    </div>

    <!-- 로그인 필요 안내 -->
    <div v-else-if="!isLogin || myUserId <= 0" class="hint">
      채팅 목록을 보려면 로그인하세요.
    </div>

    <!-- 로딩 -->
    <div v-else-if="loading" class="hint">불러오는 중…</div>

    <!-- 비어있음 -->
    <div v-else-if="rooms.length === 0" class="hint">채팅방이 없습니다.</div>

    <!-- 목록 -->
    <ul v-else class="room-list">
      <li v-for="r in rooms" :key="r.chatroomId" class="room-item" @click="goRoom(r.chatroomId)">
        <div class="room-left">
          <div class="room-title">
            방 #{{ r.chatroomId }}
            <span class="status" :class="r.chatroomStatus === 'A' ? 'ok' : 'pend'">
              {{ r.chatroomStatus === 'A' ? '승인됨' : '대기' }}
            </span>
          </div>
          <div class="room-sub">
            상대: {{ r.partnerId }} · 최근: {{ r.lastPreview || '-' }}
          </div>
        </div>
        <div class="room-right" v-if="r.unreadCount > 0">
          <span class="badge">{{ r.unreadCount }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

/** 환경 설정 */
const BASE_URL =
  (import.meta?.env?.VITE_API_BASE) ||
  process.env.VUE_APP_API_BASE ||
  'http://localhost:8080'

/** Vuex / Router */
const store = useStore()
const router = useRouter()

/** 상태 */
const isLogin  = computed(() => store.getters.isLogin)
const myUserId = computed(() => Number(store.getters.getUser?.userId || 0))

const loading  = ref(false)
const errorMsg = ref('')
const rooms    = ref([])

/** 안전한 fetch 래퍼: URL/본문 로그로 문제 즉시 파악 */
async function getJSON(url) {
  try {
    const res  = await fetch(url)
    const text = await res.text()
    if (!res.ok) {
      console.error('[ChatList:getJSON] URL:', url)
      console.error('[ChatList:getJSON] HTTP', res.status, 'BODY:', text)
      const err = new Error(`HTTP ${res.status}`)
      try { err.body = JSON.parse(text) } catch { err.body = text }
      err.status = res.status
      throw err
    }
    return text ? JSON.parse(text) : null
  } catch (e) {
    console.error('[ChatList:getJSON] FETCH ERROR:', e)
    throw e
  }
}

/** 목록 로드 */
async function fetchRooms() {
  if (!isLogin.value || !Number.isInteger(myUserId.value) || myUserId.value <= 0) {
    rooms.value = []
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    // 백엔드 컨트롤러: GET /chat/rooms/my?userId=xxx
    const url  = `${BASE_URL}/chat/rooms/my?userId=${myUserId.value}`
    const data = await getJSON(url)

    // 응답 포맷: { result:'success', rooms:[...] } 또는 rooms 배열 (둘 다 지원)
    const list = Array.isArray(data) ? data : (data?.rooms || [])
    // 파트너/미리보기/미읽음 가공(백엔드에서 내려주면 그대로 사용)
    rooms.value = list.map(r => {
      const partnerId   = (myUserId.value === r.chatuser1Id) ? r.chatuser2Id : r.chatuser1Id
      const lastPreview = r.lastPreview || r.lastMessage || ''
      const unreadCount = r.unreadCount || 0
      return { ...r, partnerId, lastPreview, unreadCount }
    })
  } catch (e) {
    // 사용자 메시지
    errorMsg.value = (e?.body?.message) || (e?.message) || '알 수 없는 오류'
  } finally {
    loading.value = false
  }
}

/** 방 이동 */
function goRoom(roomId) {
  router.push({ path: '/message/detail', query: { roomId } })
}

/** mounted에서 예외 반드시 잡기 */
onMounted(async () => {
  try {
    await fetchRooms()
  } catch (e) {
    // 여기에 안 오도록 위에서 다 처리했지만, 혹시 모를 예외 방지
    console.error('[ChatList:onMounted] unhandled:', e)
    errorMsg.value = '초기 로딩 중 오류가 발생했습니다.'
  }
})
</script>

<style scoped>
.list-wrap { padding: 12px; }
.list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.title { margin: 0; font-size: 1.1rem; font-weight: 700; }
.btn { border: 1px solid #888; background: #fff; border-radius: 8px; padding: 6px 10px; cursor: pointer; }
.alert { background: #ffecec; border: 1px solid #ffb3b3; border-radius: 8px; padding: 10px; margin-bottom: 10px; }
.alert-title { font-weight: 700; margin-bottom: 4px; }
.hint { color: #666; padding: 8px; }
.room-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.room-item {
  display: flex; align-items: center; justify-content: space-between;
  border: 1px solid #eee; border-radius: 10px; padding: 10px 12px; cursor: pointer; background: #fff;
}
.room-item:hover { border-color: #ccc; background: #fafafa; }
.room-title { font-weight: 700; }
.status { margin-left: 6px; font-size: .8rem; border-radius: 6px; padding: 2px 6px; border: 1px solid #ddd; }
.status.ok   { background: #ecfff0; border-color: #b6efc5; }
.status.pend { background: #fff8e6; border-color: #ffe2a9; }
.room-sub { color: #666; font-size: .9rem; margin-top: 2px; }
.badge { background: #e74c3c; color: #fff; border-radius: 999px; padding: 4px 8px; font-size: .8rem; }
</style>
