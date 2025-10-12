<template>
  <div v-if="show" class="swm-backdrop" @click.self="close">
    <div class="swm-card" role="dialog" aria-modal="true" aria-label="받은 스티커">
      <div class="swm-header">
        <strong>받은 스티커</strong>
        <button type="button" class="btn-close" aria-label="닫기" @click="close" />
      </div>

      <div class="swm-body">
        <div class="swm-canvas">
          <div v-if="loading" class="swm-state">불러오는 중…</div>
          <div v-else-if="error" class="swm-state text-danger">{{ error }}</div>

          <transition-group v-else name="pop" tag="div">
            <div
              v-for="s in positioned"
              :key="s._k"
              class="swm-sticker"
              :style="stickerStyle(s)"
              :title="s.label || '스티커'"
            >
              <img :src="s.img" alt="" class="swm-sticker-img" draggable="false" />
            </div>
          </transition-group>

          <div v-if="!loading && !error && positioned.length === 0" class="swm-state">
            받은 스티커가 없습니다.
          </div>
        </div>
      </div>

      <div class="swm-footer">
        <div class="d-flex w-100 align-items-center gap-2">
          <button class="btn btn-outline-secondary btn-sm" @click="shuffle" :disabled="loading">다시 섞기</button>
          <button class="btn btn-dark btn-sm ms-auto" @click="close">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ✅ webpack 환경용
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import reviewApi from "@/apis/reviewApi";

/** props
 * - show: 모달 열림
 * - targetId: 이 유저에게 달린(=받은) 리뷰 조회 (userId도 허용하되 targetId 우선)
 * - max: 최대 표시 개수
 */
const props = defineProps({
  show: { type: Boolean, default: false },
  targetId: { type: [Number, String], required: false },
  userId: { type: [Number, String], required: false },
  max: { type: Number, default: 20 },
});
const effectiveTargetId = computed(() => props.targetId ?? props.userId ?? null);

const emit = defineEmits(["update:show"]);
function close() { emit("update:show", false); }

/* ============ 1) 로컬 에셋 로딩 (require.context) ============ */
// 폴더: /src/assets/Stickers   파일명: 01.png, 02.png, ...
const req = require.context("@/assets/Stickers", false, /\.png$/);
const STICKER_MAP = {}; // { "01": resolvedUrl, ... }
req.keys().forEach((k) => {
  const code = k.replace("./", "").replace(".png", "");
  STICKER_MAP[code] = req(k);
});
function imageByTagId(tagId) {
  if (tagId == null) return null;
  const code = String(tagId).padStart(2, "0");
  return STICKER_MAP[code] || null;
}

/* ============ 2) 데이터 로드 (targetId → reviewTagId → 에셋) ============ */
const loading = ref(false);
const error = ref("");
const stickers = ref([]);     // [{ id, img, label? }]
const positioned = ref([]);
const seed = ref(0);

async function fetchStickers() {
  const tid = effectiveTargetId.value;
  if (!tid) return;
  loading.value = true;
  error.value = "";
  try {
    // 백엔드 계약: /review/users/{userId}/reviews → { result, message, count, data: Review[] }
    const res = await reviewApi.getReceivedReviews(tid);
    const list = Array.isArray(res?.data?.data) ? res.data.data : [];

    // (엔드포인트가 이미 targetId로 필터된 목록이지만) 혹시 몰라 한 번 더 체크
    const onlyMine = list.filter((r) => String(r?.targetId) === String(tid));

    // ✅ "스티커만": reviewTagId가 있어야 함 → 01.png 등으로 매핑
    const mapped = onlyMine
      .map((r, i) => {
        const img = imageByTagId(r?.reviewTagId);
        if (!img) return null;
        return {
          id: r.reviewId ?? i,
          img,
          label: "", // 필요시 r.tagName 같은 필드 쓰면 됨 (현재 계약엔 없음)
        };
      })
      .filter(Boolean)
      .slice(0, props.max);

    stickers.value = mapped;
  } catch (e) {
    console.error(e);
    error.value = "스티커를 불러오지 못했습니다.";
    stickers.value = [];
  } finally {
    loading.value = false;
  }
}

/* ============ 3) 랜덤 배치/애니메이션 ============ */
const rnd = (min, max) => Math.random() * (max - min) + min;
const rndInt = (min, max) => Math.floor(rnd(min, max));
function layout() {
  positioned.value = stickers.value.map((it, i) => ({
    ...it,
    top: `${rndInt(6, 86)}%`,
    left: `${rndInt(8, 92)}%`,
    rotate: `${rndInt(-25, 25)}deg`,
    delay: `${rnd(0, 0.8).toFixed(2)}s`,
    scale: Number(rnd(0.92, 1.12).toFixed(2)),
    z: rndInt(1, 200),
    _k: `${it.id}-${seed.value}-${i}`,
  }));
}
function shuffle() { seed.value++; layout(); }

/* ============ 4) 라이프사이클 ============ */
watch(() => props.show, async (v) => {
  if (v) { await fetchStickers(); layout(); }
});
watch(effectiveTargetId, async (v, ov) => {
  if (props.show && v !== ov) { await fetchStickers(); layout(); }
});
watch(stickers, () => { if (props.show) layout(); });

function onKey(e) { if (e.key === "Escape") close(); }
onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => window.removeEventListener("keydown", onKey));

const stickerStyle = (s) => ({
  top: s.top,
  left: s.left,
  transform: `translate(-50%, -50%) rotate(${s.rotate}) scale(${s.scale})`,
  zIndex: s.z,
  animationDelay: s.delay,
});
</script>

<style scoped>
.swm-backdrop { position: fixed; inset: 0; z-index: 1060; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; padding: 24px; }
.swm-card { width: min(1000px, 96vw); background: #fff; border-radius: 16px; box-shadow: 0 12px 40px rgba(0,0,0,.2); overflow: hidden; display: flex; flex-direction: column; }
.swm-header, .swm-footer { padding: 12px 16px; background: #f8f9fa; display: flex; align-items: center; }
.swm-header .btn-close { margin-left: auto; }
.swm-body { padding: 12px 12px 16px; }
.swm-canvas { position: relative; height: 540px; border-radius: 12px; background:
  radial-gradient(ellipse at 15% 8%, rgba(255,255,255,.4) 0%, rgba(255,255,255,0) 60%),
  repeating-linear-gradient(0deg, #f6f7f8, #f6f7f8 10px, #fbfbfb 10px, #fbfbfb 20px);
  overflow: hidden; }
.swm-state { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #6c757d; font-size: .95rem; }
.swm-sticker { position: absolute; width: 128px; height: 128px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 6px 10px rgba(0,0,0,.15)); animation: popIn .5s ease both; pointer-events: none; }
.swm-sticker-img { width: 100%; height: 100%; object-fit: contain; user-select: none; }
@keyframes popIn { 0% { opacity: 0; transform: translate(-50%, -35%) scale(.82) rotate(-6deg); } 60% { opacity: 1; transform: translate(-50%, -50%) scale(1.07) rotate(2deg); } 100% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(var(--rot, 0deg)); } }
.pop-enter-active, .pop-leave-active { transition: opacity .24s ease, transform .24s ease; }
.pop-enter-from { opacity: 0; transform: translate(-50%, -50%) scale(.92); }
.pop-leave-to   { opacity: 0; transform: translate(-50%, -50%) scale(.92); }
</style>
