<!-- src/components/Walk/WalkListModal.vue -->
<template>
  <div v-if="modelValue" class="modal-backdrop" @click.self="close">
    <div class="modal-card">
      <div class="modal-header">
        <h5 class="m-0">산책 신청 내역</h5>
        <button type="button" class="btn-close" @click="close" />
      </div>

      <div class="modal-body">
        <!-- 탭 -->
        <ul class="nav nav-tabs mb-3">
          <li class="nav-item">
            <button class="nav-link" :class="{ active: tab === 'received' }" @click="tab = 'received'">받은 신청</button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: tab === 'sent' }" @click="tab = 'sent'">내가 신청</button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: tab === 'group' }" @click="tab = 'group'">그룹 신청</button>
          </li>
          <li class="ms-auto nav-item">
            <button class="btn btn-sm btn-outline-secondary" :disabled="loading" @click="loadAll">새로고침</button>
          </li>
        </ul>

        <!-- 로딩 -->
        <div v-if="loading" class="text-center text-muted py-4">불러오는 중...</div>

        <!-- 받은 신청 -->
        <div v-else-if="tab === 'received'">
          <div v-if="received.length === 0" class="text-center text-muted py-4">받은 신청이 없습니다.</div>
          <ul v-else class="list-group">
            <li
              v-for="w in received"
              :key="w.requestOneId"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div class="d-flex align-items-center gap-3">
                <img class="avatar" :src="(metaMap.get(w.requestUserId)?.avatar) || FALLBACK_AVATAR" alt="상대 프로필" />
                <div class="room-texts">
                  <div class="room-title">
                    <span class="partner">
                      {{ metaMap.get(w.requestUserId)?.petName || 'USER' }}
                      <span> - </span>
                      <small class="pid">(#{{ w.requestUserId }})</small>
                    </span>
                    <span
                      class="status"
                      :class="(w.rstatus || 'P').toUpperCase() === 'A' ? 'ok' : ((w.rstatus || 'P').toUpperCase() === 'R' ? 'rej' : 'pend')"
                    >{{ statusLabel(w.rstatus) }}</span>
                  </div>
                  <div class="room-sub small text-muted">신청일: {{ fmt(w.createdAt) }}</div>
                </div>
              </div>

              <div class="d-flex align-items-center gap-2">
                <template v-if="(w.rstatus || 'P').toUpperCase() === 'P'">
                  <button class="btn btn-sm btn-success" @click="accept(w)" :disabled="actingId === w.requestOneId || loading">수락</button>
                  <button class="btn btn-sm btn-outline-danger" @click="reject(w)" :disabled="actingId === w.requestOneId || loading">거절</button>
                </template>
                <template v-else>
                  <span
                    class="badge"
                    :class="{
                      'bg-success': (w.rstatus || 'P').toUpperCase() === 'A',
                      'bg-secondary': (w.rstatus || 'P').toUpperCase() === 'R'
                    }"
                  >{{ (w.rstatus || 'P').toUpperCase() === 'A' ? '수락됨' : '거절됨' }}</span>
                </template>

                <!-- 채팅 버튼 (상대 = 신청자) -->
                <WalkChatButton :target-user-id="w.requestUserId" label="채팅" />
              </div>
            </li>
          </ul>
        </div>

        <!-- 내가 신청 -->
        <div v-else-if="tab === 'sent'">
          <div v-if="sent.length === 0" class="text-center text-muted py-4">내가 신청한 내역이 없습니다.</div>
          <ul v-else class="list-group">
            <li
              v-for="w in sent"
              :key="w.requestOneId"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div class="d-flex align-items-center gap-3">
                <img class="avatar" :src="(metaMap.get(w.receiveUserId)?.avatar) || FALLBACK_AVATAR" alt="상대 프로필" />
                <div class="room-texts">
                  <div class="room-title">
                    <span class="partner">
                      {{ metaMap.get(w.receiveUserId)?.petName || 'USER' }}
                      <span> - </span>
                      <small class="pid">(#{{ w.receiveUserId }})</small>
                    </span>
                    <span
                      class="status"
                      :class="(w.rstatus || 'P').toUpperCase() === 'A' ? 'ok' : ((w.rstatus || 'P').toUpperCase() === 'R' ? 'rej' : 'pend')"
                    >{{ statusLabel(w.rstatus) }}</span>
                  </div>
                  <div class="room-sub small text-muted">신청일: {{ fmt(w.createdAt) }}</div>
                </div>
              </div>

              <div class="d-flex align-items-center gap-2">
                <WalkChatButton :target-user-id="w.receiveUserId" label="채팅" />
              </div>
            </li>
          </ul>
        </div>

        <!-- 그룹 신청 -->
        <div v-else>
          <div v-if="groups.length === 0" class="text-center text-muted py-4">그룹 산책 신청이 없습니다.</div>
          <ul v-else class="list-group">
            <li
              v-for="g in groups"
              :key="g.requestId ?? g.postId ?? `${g.postId}-row`"
              class="list-group-item d-flex justify-content-between align-items-center clickable"
              @click="goPost(g.postId)"
            >
              <div class="d-flex align-items-center gap-3">
                <img
                  class="avatar"
                  :src="(metaMap.get(ownerMap.get(g.postId))?.avatar) || FALLBACK_AVATAR"
                  alt="작성자 프로필"
                />
                <div class="room-texts">
                  <div class="room-title">
                    <span class="partner">
                      {{ metaMap.get(ownerMap.get(g.postId))?.petName || 'USER' }}
                      <span> - </span>
                      <small class="pid">(#{{ ownerMap.get(g.postId) || '-' }})</small>
                    </span>

                    <!-- 상태/라벨 -->
                    <template v-if="isMyPost(g.postId)">
                      <span class="status mine">내가 시작한 산책</span>
                    </template>
                    <template v-else>
                      <span class="status" :class="partBadgeClass(g.applyStatus)">
                        {{ partStatusLabel(g.applyStatus) }}
                      </span>
                    </template>
                  </div>

                  <div class="room-sub small text-muted">
                    글번호: {{ g.postId }} · 신청일: {{ fmt(g.createdAt) }}
                  </div>
                </div>
              </div>

              <i class="bi bi-people"></i>
            </li>
          </ul>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="close">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"
import axios from "axios"
import walkApi from "@/apis/walkApi"
import WalkChatButton from "@/components/Walk/WalkChatButton.vue"

/** v-model */
const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit  = defineEmits(["update:modelValue"])

/** 상태 */
const store = useStore()
const router = useRouter()
const tab = ref("received")
const loading = ref(false)
const actingId = ref(null)

const myUserId = computed(() => Number(store.state.user?.userId || 0))

const received = ref([]) // walkReceiveList
const sent     = ref([]) // walkRequestList
const groups   = ref([]) // participate rows

// 상대 메타 캐시 & 렌더 맵
const metaCache = new Map() // userId -> { avatar, petName }
const metaMap   = ref(new Map())

// 그룹글 작성자 캐시 (postId -> ownerUserId)
const postOwnerCache = new Map()
const ownerMap = ref(new Map())

const FALLBACK_AVATAR = "https://placehold.co/64x64?text=USER"

/** 유틸 */
function close() { emit("update:modelValue", false) }
function fmt(iso) { return iso ? new Date(iso).toLocaleString() : "" }
function statusLabel(s) {
  switch ((s || "P").toUpperCase()) {
    case "A": return "승인"
    case "R": return "거절"
    default:  return "대기"
  }
}

/** 그룹 상태 라벨/클래스 (요청사항 반영) */
function partStatusLabel(s) {
  switch ((s || "P").toUpperCase()) {
    case "A": return "수락됨"
    case "R": return "거절됨"
    case "C": return "취소됨"
    default:  return "신청됨" // P
  }
}
function partBadgeClass(s) {
  const v = (s || "P").toUpperCase()
  if (v === "A") return "ok"
  if (v === "R" || v === "C") return "rej"
  return "pend"
}

/** 내 글인지 */
function isMyPost(postId) {
  const owner = ownerMap.value.get(postId)
  return owner && myUserId.value === Number(owner)
}

/** 라우팅 */
function goPost(postId) {
  if (!postId) return
  router.push(`/post/${postId}`)
}

/** (공통) 첫 펫 기준으로 메타 가져오기 */
async function fetchUserMeta(userId) {
  if (!userId) return null
  if (metaCache.has(userId)) return metaCache.get(userId)

  let petName = ""
  let avatar  = ""
  try {
    const petsRes = await axios.get("/pet/find-allpetbyuser", { params: { petUserId: userId } })
    const pets = Array.isArray(petsRes?.data) ? petsRes.data : []
    if (pets.length > 0) {
      pets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      const main = pets[0]
      petName = main?.petName || ""
      if (main?.petId) avatar = axios.defaults.baseURL.replace(/\/$/, '') + `/pet/image/${main.petId}`
    }
  } catch { /* no-op */ }

  const meta = { petName, avatar }
  metaCache.set(userId, meta)
  return meta
}

/** postId -> 글 작성자 userId */
async function fetchPostOwnerUserId(postId) {
  if (!postId) return null
  if (postOwnerCache.has(postId)) return postOwnerCache.get(postId)

  try {
    const { data } = await axios.get("/post/detail", { params: { postId } })
    const uid = data?.post?.postUserId || null
    postOwnerCache.set(postId, uid)
    return uid
  } catch {
    postOwnerCache.set(postId, null)
    return null
  }
}

/** 그룹 탭: 작성자 맵 채우기 */
async function ensureGroupOwners() {
  const pids = [...new Set(groups.value.map(g => g.postId).filter(Boolean))]
  const updates = new Map(ownerMap.value)
  await Promise.all(pids.map(async (pid) => {
    if (!updates.has(pid)) {
      const uid = await fetchPostOwnerUserId(pid)
      updates.set(pid, uid)
    }
  }))
  ownerMap.value = updates
}

/** 필요한 유저 메타 채우기 */
async function enrichMetaForLists() {
  const oppReceived = [...new Set(received.value.map(w => w.requestUserId).filter(Boolean))]
  const oppSent     = [...new Set(sent.value.map(w => w.receiveUserId).filter(Boolean))]
  const ownerIds    = [...new Set(Array.from(ownerMap.value.values()).filter(Boolean))]
  const all = [...new Set([...oppReceived, ...oppSent, ...ownerIds])]

  const updates = new Map(metaMap.value)
  await Promise.all(all.map(async (uid) => {
    if (!updates.has(uid)) {
      const meta = await fetchUserMeta(uid)
      updates.set(uid, meta || { petName: "", avatar: "" })
    }
  }))
  metaMap.value = updates
}

/** 목록 로드 */
async function loadAll() {
  const me = store.state.user?.userId
  if (!me) return
  loading.value = true
  try {
    const [rec, sen, grp] = await Promise.allSettled([
      walkApi.getReceivedRequests(me),
      walkApi.getOneOnOneRequests(me),
      walkApi.getGroupRequests(me),
    ])
    received.value = rec.status === "fulfilled" ? (rec.value?.data?.walkReceiveList || []) : []
    sent.value     = sen.status   === "fulfilled" ? (sen.value?.data?.walkRequestList || []) : []
    groups.value   = grp.status   === "fulfilled" ? (grp.value?.data?.list || grp.value?.data || []) : []

    await ensureGroupOwners()
    await enrichMetaForLists()
  } finally {
    loading.value = false
  }
}

/** 수락/거절 */
async function accept(w) {
  const me = store.state.user?.userId
  if (!me) return
  actingId.value = w.requestOneId
  try {
    await walkApi.updateWalkStatus(w.requestOneId, "A", me)
    w.rstatus = "A"
  } catch (e) {
    const msg = e?.response?.data?.message || e?.response?.data?.error || "처리 중 오류가 발생했습니다."
    alert(msg)
  } finally {
    actingId.value = null
  }
}
async function reject(w) {
  const me = store.state.user?.userId
  if (!me) return
  actingId.value = w.requestOneId
  try {
    await walkApi.updateWalkStatus(w.requestOneId, "R", me)
    w.rstatus = "R"
  } catch (e) {
    const msg = e?.response?.data?.message || e?.response?.data?.error || "처리 중 오류가 발생했습니다."
    alert(msg)
  } finally {
    actingId.value = null
  }
}

/** 열릴 때마다 새로 로드 */
watch(() => props.modelValue, (v) => { if (v) loadAll() })
</script>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: grid; place-items: center; z-index: 2000; }
.modal-card { width: min(780px, 92vw); background: #fff; border-radius: .5rem; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,.2); }
.modal-header, .modal-footer { padding: .75rem 1rem; background: #f8f9fa; }
.modal-body { padding: 1rem; max-height: 70vh; overflow: auto; }

.avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #eee; }
.room-texts { display: flex; flex-direction: column; }
.room-title { font-weight: 700; display: flex; align-items: center; gap: 8px; }
.partner { display: inline-flex; align-items: baseline; gap: 6px; }
.pid { color: #888; font-weight: 500; }
.status { font-size: .8rem; border-radius: 6px; padding: 2px 6px; border: 1px solid #ddd; }
.status.ok   { background: #ecfff0; border-color: #b6efc5; }
.status.pend { background: #fff8e6; border-color: #ffe2a9; }
.status.rej  { background: #fff0f0; border-color: #f3b0b0; }
.status.mine { background: #e7f1ff; border-color: #b8d6ff; } /* 내가 시작한 산책 */
.room-sub { color: #666; font-size: .9rem; margin-top: 2px; }

.clickable { cursor: pointer; }
.clickable:hover { background: #fafafa; }
</style>
