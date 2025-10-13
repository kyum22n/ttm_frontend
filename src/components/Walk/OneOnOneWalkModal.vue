<template>
  <div v-if="modelValue" class="ooo-backdrop" @click.self="close">
    <div class="ooo-card">
      <div class="ooo-header">
        <h6 class="m-0">1:1 산책 진행</h6>
        <button type="button" class="btn-close" @click="close"></button>
      </div>

      <div class="ooo-body">
        <!-- 프로필/펫 메타 -->
        <div class="d-flex align-items-center gap-3 mb-3">
          <img class="avatar" :src="partnerMeta.avatar || FALLBACK_AVATAR" alt="상대 프로필" />
          <div class="room-texts">
            <div class="room-title">
              <span class="partner">
                {{ partnerMeta.petName || partnerName || 'USER' }}
                <span> - </span>
                <small class="pid">(#{{ partnerId }})</small>
              </span>
              <span
                class="status"
                :class="(rstatus || 'P').toUpperCase() === 'A' ? 'ok' : ((rstatus || 'P').toUpperCase() === 'R' ? 'rej' : 'pend')"
              >{{ rstatusLabel }}</span>
            </div>
            <div class="room-sub small text-muted">
              신청자:
              <span v-if="applicantId">#{{ applicantId }}</span>
              <span v-else>-</span>
              <span v-if="applicantId" class="ms-1 badge" :class="isApplicantMe ? 'bg-primary' : 'bg-secondary'">
                {{ isApplicantMe ? '내가 신청자' : '상대가 신청자' }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="errorMsg" class="alert alert-danger py-2 px-3">
          <strong>ERROR</strong><br />{{ errorMsg }}
        </div>

        <div class="border rounded p-3">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <div class="fw-bold">진행 상태</div>
              <div class="small text-muted">
                <template v-if="!currentReqId">승인된 1:1 산책 없음</template>
                <template v-else>{{ started ? (ended ? '산책 완료' : '산책 중') : '대기' }}</template>
              </div>
            </div>

            <div class="d-flex gap-2">
              <template v-if="ended">
                <button
                  class="btn btn-primary btn-sm"
                  @click="openStickerPicker"
                  :disabled="alreadyGiven"
                >
                  {{ alreadyGiven ? '스티커 보냄' : '스티커 남기기' }}
                </button>
              </template>
              <template v-else>
                <button
                  class="btn btn-success btn-sm"
                  :disabled="loading || !currentReqId || rstatus!=='A' || started"
                  @click="mark(2)"
                >
                  {{ loading && nextCode===2 ? '시작 중…' : '산책 시작' }}
                </button>

                <button
                  class="btn btn-danger btn-sm"
                  :disabled="loading || !currentReqId || rstatus!=='A' || !started || ended"
                  @click="mark(3)"
                >
                  {{ loading && nextCode===3 ? '종료 중…' : '산책 종료' }}
                </button>
              </template>
            </div>
          </div>

          <hr />
          <div class="small">
            <div>요청ID: {{ currentReqId ? currentReqId : '-' }}</div>
            <div>시작: {{ startedAt ? fmt(startedAt) : '-' }}</div>
            <div>종료: {{ endedAt ? fmt(endedAt) : '-' }}</div>
          </div>
        </div>

        <div v-if="hint" class="alert alert-warning py-2 px-3 mt-3">
          {{ hint }}
        </div>
      </div>
    </div>

    <!-- 스티커 모달 -->
    <StickerGiveOneOnOneModal
      v-model="showSticker"
      v-if="currentReqId && partnerId"
      v-bind:requestOneId="currentReqId"
      v-bind:partnerId="partnerId"
      v-bind:partnerName="partnerName"
      v-bind:sendSticker="sendSticker || internalSendSticker"
      @send="forwardSend"
      @sent="afterStickerSent"
      @error="onStickerError"
    ></StickerGiveOneOnOneModal>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue"
import axios from "axios"
import walkApi from "@/apis/walkApi"
import reviewApi from "@/apis/reviewApi"
import StickerGiveOneOnOneModal from "@/components/Review/StickerGiveOneOnOneModal.vue"

const props = defineProps({
  modelValue:   { type: Boolean, default: false },
  partnerId:    { type: Number,  required: true },
  partnerName:  { type: String,  default: "상대" },
  requestOneId: { type: Number,  default: null },
  sendSticker:  { type: Function, default: null },
})
const emit = defineEmits(["update:modelValue", "refreshed", "send-sticker", "sticker-sent"])

const loading      = ref(false)
const nextCode     = ref(null)
const errorMsg     = ref("")
const hint         = ref("")
const startedAt    = ref(null)
const endedAt      = ref(null)
const currentReqId = ref(null)
const rstatus      = ref(null)
const applicantId  = ref(null)

const showSticker  = ref(false)
const alreadyGiven = ref(false)

const started = computed(() => !!startedAt.value)
const ended   = computed(() => !!endedAt.value)
const rstatusLabel = computed(() => ({P:"대기",A:"승인",R:"거절",C:"완료"}[(rstatus.value||"").toUpperCase()] || "대기"))

const me = computed(() => {
  try { return Number(JSON.parse(localStorage.getItem("user") || "{}").userId) || 0 }
  catch { return 0 }
})
const isApplicantMe = computed(() => applicantId.value != null && applicantId.value === me.value)

/* 닫기 */
function close(){
  showSticker.value = false
  emit("update:modelValue", false)
}

/* 포맷터 */
function fmt(iso) {
  try {
    if (!iso) return "-"
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return String(iso ?? "-")
    return d.toLocaleString()
  } catch { return String(iso ?? "-") }
}

/* 프로필/펫 메타 */
const FALLBACK_AVATAR = "https://placehold.co/64x64?text=USER"
const partnerMeta = ref({ petName: "", avatar: "" })
async function loadPartnerMeta() {
  if (!props.partnerId) { partnerMeta.value = { petName:"", avatar:"" }; return }
  try {
    const { data } = await axios.get("/pet/find-allpetbyuser", { params: { petUserId: props.partnerId } })
    const pets = Array.isArray(data) ? data : []
      if (pets.length > 0) {
      pets.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
      const main = pets[0]
      partnerMeta.value = { petName: main?.petName || "", avatar: main?.petId ? axios.defaults.baseURL.replace(/\/$/, '') + `/pet/image/${main.petId}` : "" }
    } else {
      partnerMeta.value = { petName:"", avatar:"" }
    }
  } catch { partnerMeta.value = { petName:"", avatar:"" } }
}

/* 상태 조회 */
function pick(it, keys){ for (const k of keys) if (it?.[k] != null && String(it[k]).length > 0) return it[k]; return null }
function toMs(v){ const t = Date.parse(v); return isNaN(t) ? -1 : t }
function chooseApproved(cands){
  if (!cands.length) return null
  const live = cands.filter(it => !pick(it, ["walkEndedAt","endedAt","walkendedat","ended_at"]))
  const base = (live.length ? live : cands).slice()
  base.sort((a,b) => {
    const aKey = toMs(pick(a,["walkStartedAt","startedAt","createdAt"]))
    const bKey = toMs(pick(b,["walkStartedAt","startedAt","createdAt"]))
    return bKey - aKey
  })
  return base[0]
}
async function loadStatus(){
  const uid = me.value
  if (!uid) { hint.value = "로그인이 필요합니다."; return }
  errorMsg.value = ""; hint.value = ""

  const [req, recv] = await Promise.allSettled([
    walkApi.getOneOnOneRequests(uid),
    walkApi.getReceivedRequests(uid),
  ])
  const reqList  = req.status  === "fulfilled" ? (req.value?.data?.walkRequestList  ?? []) : []
  const recvList = recv.status === "fulfilled" ? (recv.value?.data?.walkReceiveList ?? []) : []

  let row = null
  if (props.requestOneId) {
    row = [...reqList, ...recvList].find(it => (it.requestOneId ?? it.id) === props.requestOneId)
  }
  if (!row) {
    const asRequester = reqList.filter(it => it.receiveUserId === props.partnerId && (it.rstatus || "P").toUpperCase() === "A")
    const asReceiver  = recvList.filter(it => it.requestUserId === props.partnerId && (it.rstatus || "P").toUpperCase() === "A")
    row = chooseApproved([...asRequester, ...asReceiver])
  }

  if (!row) {
    currentReqId.value = null; startedAt.value = null; endedAt.value = null; rstatus.value = null; applicantId.value = null
    hint.value = "상대와 승인된 1:1 산책이 없습니다."
    return
  }

  applicantId.value  = row.requestUserId
  rstatus.value      = row.rstatus
  currentReqId.value = row.requestOneId ?? row.id
  startedAt.value    = pick(row, ["walkStartedAt","startedAt","walkstartedat","started_at"])
  endedAt.value      = pick(row, ["walkEndedAt","endedAt","walkendedat","ended_at"])
}

// 내가 이미 스티커 보냈는지 확인 (상대의 받은 리뷰 목록에서)
async function loadAlreadyGiven() {
  alreadyGiven.value = false
  try {
    if (!props.partnerId || !currentReqId.value || !me.value) return
    const res = await reviewApi.getReceivedReviews(props.partnerId)
    const arr = res?.data?.data || res?.data || []
    alreadyGiven.value = arr.some(r =>
      Number(r?.requestOneId) === Number(currentReqId.value) &&
      Number(r?.writerId) === Number(me.value)
    )
  } catch { /* ignore */ }
}

/* 시작/종료 */
async function mark(code){
  if (!currentReqId.value) { hint.value = "승인된 1:1 산책이 없습니다."; return }
  if ((rstatus.value || "P").toUpperCase() !== "A") { hint.value = "승인된 산책만 시작/종료할 수 있습니다."; return }
  if (!me.value) { hint.value = "로그인이 필요합니다."; return }
  if (code === 2 && started.value) { hint.value = "이미 산책이 시작되었습니다."; return }
  if (code === 3 && (!started.value || ended.value)) { hint.value = "종료할 수 없는 상태입니다."; return }

  loading.value = true; errorMsg.value = ""; nextCode.value = code
  try{
    if (code === 2) await walkApi.startWalk(currentReqId.value, me.value)
    else            await walkApi.endWalk(currentReqId.value, me.value)
    await loadStatus()
    emit("refreshed")
  } catch(e){
    errorMsg.value = e?.response?.data?.message || e?.message || "처리에 실패했습니다."
  } finally{
    loading.value = false; nextCode.value = null
  }
}

/* 스티커 */
function openStickerPicker() { showSticker.value = true }
function forwardSend(payload) { emit("send-sticker", payload) }
function afterStickerSent(payload) {
  hint.value = "스티커를 보냈습니다."
  alreadyGiven.value = true
  emit("sticker-sent", payload)
}
function onStickerError(msg) { errorMsg.value = msg || "스티커 전송 실패" }

// 부모 콜백이 없을 때: reviewApi.createReview로 직접 호출 (requestOneId만 전송, postId 금지)
async function internalSendSticker({ requestOneId, toUserId, reviewTagId, fromUserId }) {
  await reviewApi.createReview({
    requestOneId,
    targetId: toUserId,
    reviewTagId,
    writerId: fromUserId || me.value,
  })
}

/* 모달 열릴 때 로드 */
watch(() => props.modelValue, async (v) => {
  if (v) {
    await Promise.all([ loadStatus(), loadPartnerMeta() ])
    await loadAlreadyGiven()
  }
})
</script>

<style scoped>
.ooo-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: grid; place-items: center; z-index: 2000; }
.ooo-card { width: min(560px, 92vw); background: #fff; border-radius: .5rem; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,.2); }
.ooo-header { padding: .75rem 1rem; background: #f8f9fa; display: flex; align-items: center; justify-content: space-between; }
.ooo-body { padding: 1rem; }

.avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #eee; }
.room-texts { display: flex; flex-direction: column; }
.room-title { font-weight: 700; display: flex; align-items: center; gap: 8px; }
.partner { display: inline-flex; align-items: baseline; gap: 6px; }
.pid { color: #888; font-weight: 500; }
.status { font-size: .8rem; border-radius: 6px; padding: 2px 6px; border: 1px solid #ddd; }
.status.ok   { background: #ecfff0; border-color: #b6efc5; }
.status.pend { background: #fff8e6; border-color: #ffe2a9; }
.status.rej  { background: #fff0f0; border-color: #f3b0b0; }
.room-sub { color: #666; font-size: .9rem; margin-top: 2px; }
</style>
