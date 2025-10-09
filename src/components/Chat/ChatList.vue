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
      <li
        v-for="r in rooms"
        :key="r.chatroomId"
        class="room-item"
        @click="goRoom(r.chatroomId)"
      >
        <div class="room-left">
          <!-- [추가] 상대 아바타 -->
          <img
            class="avatar"
            :src="r.partnerAvatar || FALLBACK_AVATAR"
            alt="상대 프로필"
          />

          <div class="room-texts">
            <div class="room-title">
              <!-- [변경] 상대 표시 -->
              <span class="partner">
                {{ r.partnerName || ('user#' + r.partnerId) }}
                <small class="pid">(#{{ r.partnerId }})</small>
              </span>

              <span class="status" :class="r.chatroomStatus === 'A' ? 'ok' : 'pend'">
                {{ r.chatroomStatus === 'A' ? '승인됨' : '대기' }}
              </span>
            </div>

            <div class="room-sub">
              최근: {{ r.lastPreview || '-' }}
            </div>
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

const loading   = ref(false)
const errorMsg  = ref('')
const rooms     = ref([])

/** [추가] 파트너 메타 캐시 (중복 호출 방지) */
const userNameCache   = new Map()   // userId -> string (loginId or name)
const avatarUrlCache  = new Map()   // userId -> string (absolute URL)

/** [추가] 폴백 이미지 */
const FALLBACK_AVATAR = 'https://placehold.co/80x80?text=USER'

/** 안전한 fetch 래퍼 */
async function getJSON(url) {
  const res = await fetch(url)
  const text = await res.text()
  if (!res.ok) {
    // 콘솔에 디버그 찍어줌
    console.error('[ChatList:getJSON] URL:', url)
    console.error('[ChatList:getJSON] HTTP', res.status, 'BODY:', text)
    const err = new Error(`HTTP ${res.status}`)
    try { err.body = JSON.parse(text) } catch { err.body = text }
    err.status = res.status
    throw err
  }
  return text ? JSON.parse(text) : null
}

/** [추가] 상대 메타(이름/아바타) 병렬 조회 + 캐시 */
async function fetchPartnerMeta(userId) {
  // 캐시 사용
  const cachedName   = userNameCache.get(userId)
  const cachedAvatar = avatarUrlCache.get(userId)
  if (cachedName || cachedAvatar) {
    return {
      name: cachedName || '',
      avatar: cachedAvatar || ''
    }
  }

  // 1) 사용자 식별용 텍스트 (loginId, name 등)
  // 프로젝트 상황에 따라 다음 중 가능한 엔드포인트를 사용:
  // - /api/users/{userId}  → { userLoginId, userName, ... }
  // - 없다면 userId만 보여주도록 폴백
  let name = ''
  try {
    const u = await getJSON(`${BASE_URL}/api/users/${userId}`)
    name = u?.userLoginId || u?.userName || ''
  } catch {
    name = ''
  }

  // 2) 아바타: 유저의 첫 번째 펫 이미지
  //   /pet/{userId}/first-pet → { petId } 또는 204
  //   /pet/image/{petId}      → 실제 이미지 스트림 (절대 URL로 사용)
  let avatar = ''
  try {
    const fp = await getJSON(`${BASE_URL}/pet/${userId}/first-pet`)
    const petId = fp?.petId
    if (petId) {
      avatar = `${BASE_URL}/pet/image/${petId}`
    }
  } catch {
    avatar = ''
  }

  // 캐시에 저장
  userNameCache.set(userId, name)
  avatarUrlCache.set(userId, avatar)

  return { name, avatar }
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

    // 응답 포맷 지원: { rooms:[...] } 또는 rooms 배열
    const list = Array.isArray(data) ? data : (data?.rooms || [])

    // 먼저 partnerId 등 1차 가공
    const base = list.map(r => {
      const partnerId   = (myUserId.value === r.chatuser1Id) ? r.chatuser2Id : r.chatuser1Id
      const lastPreview = r.lastPreview || r.lastMessage || ''
      const unreadCount = r.unreadCount || 0
      return { ...r, partnerId, lastPreview, unreadCount }
    })

    // 파트너 메타(이름/아바타) 병렬 조회
    const enriched = await Promise.all(
      base.map(async r => {
        try {
          const meta = await fetchPartnerMeta(r.partnerId)
          return {
            ...r,
            partnerName: meta.name,
            partnerAvatar: meta.avatar
          }
        } catch {
          // 실패해도 목록은 보여줌(폴백 처리)
          return {
            ...r,
            partnerName: r.partnerName || '',
            partnerAvatar: r.partnerAvatar || ''
          }
        }
      })
    )

    rooms.value = enriched
  } catch (e) {
    errorMsg.value = (e?.body?.message) || (e?.message) || '알 수 없는 오류'
  } finally {
    loading.value = false
  }
}

/** 방 이동 */
function goRoom(roomId) {
  router.push({ path: '/message/detail', query: { roomId } })
}

/** mounted */
onMounted(async () => {
  try {
    await fetchRooms()
  } catch (e) {
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  background: #fff;
}
.room-item:hover { border-color: #ccc; background: #fafafa; }

.room-left { display: flex; align-items: center; gap: 10px; }
.avatar {
  width: 44px; height: 44px; border-radius: 50%;
  object-fit: cover; border: 2px solid #eee;
}

.room-texts { display: flex; flex-direction: column; }
.room-title { font-weight: 700; display: flex; align-items: center; gap: 8px; }
.partner { display: inline-flex; align-items: baseline; gap: 6px; }
.pid { color: #888; font-weight: 500; }
.status { font-size: .8rem; border-radius: 6px; padding: 2px 6px; border: 1px solid #ddd; }
.status.ok   { background: #ecfff0; border-color: #b6efc5; }
.status.pend { background: #fff8e6; border-color: #ffe2a9; }
.room-sub { color: #666; font-size: .9rem; margin-top: 2px; }

.room-right { margin-left: 10px; }
.badge { background: #e74c3c; color: #fff; border-radius: 999px; padding: 4px 8px; font-size: .8rem; }
</style>
