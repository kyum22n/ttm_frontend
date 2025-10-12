<!-- src/components/Walk/GroupParticipantsModal.vue -->
<template>
  <div v-if="modelValue" class="gp-backdrop" @click.self="close">
    <div class="gp-card">
      <div class="gp-header">
        <h5 class="m-0">신청 내역</h5>
        
      </div>

      <div class="gp-body">
        <div v-if="errorMsg" class="alert alert-danger py-2 px-3 mb-3">
          <strong>ERROR</strong><br />
          <span>{{ errorMsg }}</span>
        </div>
        <div v-else-if="hint" class="alert alert-warning py-2 px-3 mb-3">
          {{ hint }}
        </div>

        <!-- 탭 -->
        <ul class="nav nav-tabs mb-3">
          <li class="nav-item">
            <button class="nav-link" :class="{ active: tab==='pending' }" @click="tab='pending'">
              대기 목록
              <span class="badge text-bg-secondary ms-1">{{ pending.length }}</span>
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: tab==='approved' }" @click="tab='approved'">
              승인 목록
              <span class="badge text-bg-secondary ms-1">{{ approved.length }}</span>
            </button>
          </li>
          <li class="ms-auto nav-item">
            <button class="btn btn-sm btn-outline-secondary" :disabled="loading" @click="load">
              새로고침
            </button>
          </li>
        </ul>

        <!-- 로딩 -->
        <div v-if="loading" class="text-center text-muted py-4">불러오는 중…</div>

        <!-- 대기 목록 -->
        <div v-else-if="tab==='pending'">
          <div v-if="pending.length === 0" class="text-center text-muted py-4">대기 중인 신청이 없습니다.</div>
          <ul v-else class="list-group">
            <li
              v-for="p in pending"
              :key="`${p.postId}-${p.userId}`"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div class="d-flex align-items-center gap-3">
                <img class="gp-avatar" :src="(metaMap.get(p.userId)?.avatar) || FALLBACK_AVATAR" alt="상대 프로필" />
                <div class="gp-texts">
                  <div class="gp-title">
                    <span class="gp-partner">
                      {{ metaMap.get(p.userId)?.petName || 'USER' }}
                      <span> - </span>
                      <small class="gp-id">(#{{ p.userId }})</small>
                    </span>
                    <span class="gp-status pend">신청됨</span>
                  </div>
                  <div class="text-muted small">신청 시간: {{ fmt(p.createdAt) }}</div>
                </div>
              </div>

              <div class="d-flex align-items-center gap-2" @click.stop>
                <template v-if="canModerate">
                  <button class="btn btn-sm btn-success"
                          :disabled="acting.has(keyOf(p))"
                          @click="approve(p)">
                    {{ acting.has(keyOf(p)) ? '승인 중…' : '승인' }}
                  </button>
                  <button class="btn btn-sm btn-outline-danger"
                          :disabled="acting.has(keyOf(p))"
                          @click="reject(p)">
                    {{ acting.has(keyOf(p)) ? '거절 중…' : '거절' }}
                  </button>
                </template>
                <WalkChatButton :target-user-id="p.userId" label="채팅" />
              </div>
            </li>
          </ul>
        </div>

        <!-- 승인 목록 -->
        <div v-else>
          <div v-if="approved.length === 0" class="text-center text-muted py-4">승인된 참가자가 없습니다.</div>
          <ul v-else class="list-group">
            <li
              v-for="a in approved"
              :key="`${a.postId}-${a.userId}`"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div class="d-flex align-items-center gap-3">
                <img class="gp-avatar" :src="(metaMap.get(a.userId)?.avatar) || FALLBACK_AVATAR" alt="상대 프로필" />
                <div class="gp-texts">
                  <div class="gp-title">
                    <span class="gp-partner">
                      {{ metaMap.get(a.userId)?.petName || 'USER' }}
                      <span> - </span>
                      <small class="gp-id">(#{{ a.userId }})</small>
                    </span>
                    <span class="gp-status ok">수락됨</span>
                  </div>
                  <div class="text-muted small">
                    승인 시간: {{ fmt(a.updatedAt || a.createdAt) }}
                  </div>
                </div>
              </div>

              <div class="d-flex align-items-center gap-2" @click.stop>
                <WalkChatButton :target-user-id="a.userId" label="채팅" />
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 하단 닫기 버튼 제거됨 -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useStore } from "vuex"
import axios from "axios"
import WalkChatButton from "@/components/Walk/WalkChatButton.vue"

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  postId:     { type: Number,  required: true },
  isOwner:    { type: Boolean, default: false },
})
const emit = defineEmits(["update:modelValue"])

const store     = useStore()
const myUserId  = computed(() => Number(store.getters.getUser?.userId || 0))
const authorIdFromStore = computed(() => Number(store.state?.post?.detail?.postUserId || 0))
const canModerate = computed(() => {
  if (props.isOwner) return true
  if (!authorIdFromStore.value || !myUserId.value) return false
  return authorIdFromStore.value === myUserId.value
})

const tab       = ref("pending")
const loading   = ref(false)
const errorMsg  = ref("")
const hint      = ref("")
const pending   = ref([])
const approved  = ref([])

const acting    = ref(new Set())

const FALLBACK_AVATAR = "https://placehold.co/64x64?text=USER"

const metaCache = new Map()
const metaMap   = ref(new Map())

function close() { emit("update:modelValue", false) }
function keyOf(p) { return `${p.postId}-${p.userId}` }
function fmt(iso) { try { return iso ? new Date(iso).toLocaleString() : "" } catch { return String(iso || "") } }
function auth() {
  const token = localStorage.getItem("jwt")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function fetchUserMeta(userId) {
  if (!userId) return null
  if (metaCache.has(userId)) return metaCache.get(userId)
  let petName = "", avatar = ""
  try {
    const petsRes = await axios.get("/pet/find-allpetbyuser", { params: { petUserId: userId }, headers: auth() })
    const pets = Array.isArray(petsRes?.data) ? petsRes.data : []
    if (pets.length > 0) {
      pets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      const main = pets[0]
      petName = main?.petName || ""
      if (main?.petId) avatar = `/pet/image/${main.petId}`
    }
  } catch (e) {
    // intentionally ignored
  }
  const meta = { petName, avatar }
  metaCache.set(userId, meta)
  return meta
}

async function enrichMetaForLists() {
  const userIds = new Set([
    ...pending.value.map(x => x.userId),
    ...approved.value.map(x => x.userId),
  ])
  const updates = new Map(metaMap.value)
  await Promise.all([...userIds].map(async uid => {
    if (!updates.has(uid)) updates.set(uid, (await fetchUserMeta(uid)) || { petName: "", avatar: "" })
  }))
  metaMap.value = updates
}

async function load() {
  errorMsg.value = ""
  hint.value = ""
  if (!props.postId) { hint.value = "postId가 없습니다."; return }
  if (!myUserId.value) { hint.value = "로그인 정보가 없습니다."; return }

  loading.value = true
  try {
    const h = { headers: auth() }
    const safeGet = async (url) => {
      try { const res = await axios.get(url, h); return res?.data?.participants || [] }
      catch (e) {
        if (e?.response?.status === 404) return []
        throw e
      }
    }

    const [pList, aList] = await Promise.all([
      safeGet(`/post/groupwalk/${props.postId}/participants/pending`),
      safeGet(`/post/groupwalk/${props.postId}/participants/approved`),
    ])

    pending.value  = pList
    // 승인 목록: 본인 제외
    approved.value = aList.filter(v => v.userId !== myUserId.value)

    await enrichMetaForLists()
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || e?.message || "목록을 불러오지 못했습니다."
    pending.value  = []
    approved.value = []
  } finally {
    loading.value = false
  }
}

async function postStatus(status, participant) {
  const key = keyOf(participant)
  if (acting.value.has(key)) return
  acting.value.add(key)
  try {
    await axios.post(`/post/groupwalk/${status}`, {
      postId: participant.postId,
      userId: participant.userId,
    }, { headers: auth() })
    await load()
  } catch (e) {
    alert(e?.response?.data?.message || e?.message || "처리에 실패했습니다.")
  } finally {
    acting.value.delete(key)
  }
}

function approve(p) { if (canModerate.value) postStatus("A", p) }
function reject(p)  { if (canModerate.value) postStatus("R", p) }

watch(() => props.modelValue, (v) => { if (v) load() })
</script>

<style scoped>
.gp-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.5);
  display: grid; place-items: center;
  z-index: 2000;
}
.gp-card {
  width: min(760px, 92vw);
  background: #fff;
  border-radius: .5rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,.2);
}
.gp-header { padding: .75rem 1rem; background: #f8f9fa; }
.gp-body   { padding: 1rem; max-height: 70vh; overflow: auto; }

.gp-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #eee; }
.gp-texts  { display: flex; flex-direction: column; }
.gp-title  { font-weight: 700; display: flex; align-items: center; gap: 8px; }
.gp-partner{ display: inline-flex; align-items: baseline; gap: 6px; }
.gp-id     { color: #888; font-weight: 500; }
.gp-status { font-size: .8rem; border-radius: 6px; padding: 2px 6px; border: 1px solid #ddd; }
.gp-status.ok   { background: #ecfff0; border-color: #b6efc5; }
.gp-status.pend { background: #fff8e6; border-color: #ffe2a9; }
.gp-status.rej  { background: #fff0f0; border-color: #f3b0b0; }
</style>
