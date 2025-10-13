<template>
  <div v-if="modelValue" class="sg-backdrop" @click.self="close">
    <div class="sg-card">
      <button class="btn-close sg-close" @click="close" aria-label="Close" />

      <div class="sg-header">
        <h5 class="m-0">스티커 남기기</h5>
        <div class="small text-muted">
          완료된 산책의 승인 참가자에게 스티커를 하나씩 보내세요.
        </div>
      </div>

      <div class="sg-body">
        <div v-if="errorMsg" class="alert alert-danger py-2 px-3 mb-3">
          {{ errorMsg }}
        </div>

        <!-- 스티커 선택 -->
        <div class="mb-3">
          <div class="d-flex align-items-center justify-content-between">
            <strong>스티커 선택</strong>
            <div class="d-flex align-items-center gap-2 small text-muted">
              <img
                v-if="currentTag?.src"
                :src="currentTag.src"
                class="sg-tag-preview"
                alt="선택 스티커"
              />
              <span>선택: {{ currentTag?.label || "-" }}</span>
            </div>
          </div>

          <div class="sg-tags">
            <button
              v-for="t in TAGS"
              :key="t.id"
              class="sg-tag"
              :class="{ active: chosenTagId === t.id }"
              @click="chosenTagId = t.id"
            >
              <img :src="t.src" class="sg-tag-img" :alt="t.label" />
              <div class="sg-tag-label">{{ t.label }}</div>
            </button>
          </div>
        </div>

        <hr class="my-3" />

        <!-- 대상자 목록 -->
        <div class="d-flex align-items-center justify-content-between mb-2">
          <strong>대상자 ({{ filteredTargets.length }})</strong>
          <button
            class="btn btn-sm btn-outline-secondary"
            :disabled="loading"
            @click="load"
          >
            새로고침
          </button>
        </div>

        <div v-if="loading" class="text-center text-muted py-4">
          불러오는 중…
        </div>
        <div
          v-else-if="filteredTargets.length === 0"
          class="text-center text-muted py-4"
        >
          보낼 대상이 없습니다.
        </div>

        <ul v-else class="list-group">
          <li
            v-for="p in filteredTargets"
            :key="p.userId"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="d-flex align-items-center gap-3">
              <img
                :src="metaMap.get(p.userId)?.avatar || FALLBACK_AVATAR"
                class="sg-avatar"
                alt="상대 프로필"
              />
              <div class="d-flex flex-column">
                <div class="fw-bold">
                  {{ metaMap.get(p.userId)?.petName || "USER" }}
                  <small class="text-muted">(#{{ p.userId }})</small>
                </div>
                <div class="small text-muted">
                  {{
                    p.given
                      ? "이미 스티커를 보냈습니다."
                      : "아직 보낸 기록이 없습니다."
                  }}
                </div>
              </div>
            </div>

            <div class="d-flex align-items-center gap-2">
              <button
                class="btn btn-sm btn-success"
                :disabled="p.given || sending.has(p.userId) || !chosenTagId"
                @click="sendOne(p)"
              >
                {{ sending.has(p.userId) ? "전송 중…" : "보내기" }}
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div class="sg-footer">
        <button class="btn btn-secondary" @click="close">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, computed, watch } from "vue";
import reviewApi from "@/apis/reviewApi";

// ⬇️ 스티커 이미지 import (Vite 기준)
import S01 from "@/assets/Stickers/01.png";
import S02 from "@/assets/Stickers/02.png";
import S03 from "@/assets/Stickers/03.png";
import S04 from "@/assets/Stickers/04.png";
import S05 from "@/assets/Stickers/05.png";
import S06 from "@/assets/Stickers/06.png";
import S07 from "@/assets/Stickers/07.png";
import S08 from "@/assets/Stickers/08.png";
import S09 from "@/assets/Stickers/09.png";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  postId: { type: Number, required: true },
});
const emit = defineEmits(["update:modelValue"]);

const user = JSON.parse(localStorage.getItem("user") || "{}");
const myUserId = Number(user?.userId || 0);

const loading = ref(false);
const errorMsg = ref("");
const approved = ref([]);
const metaMap = ref(new Map());
const sending = ref(new Set());

const FALLBACK_AVATAR = "https://placehold.co/44x44?text=USER";

// 스티커 태그 + 이미지
const TAGS = [
  { id: 1, label: "귀여운 녀석", src: S01 },
  { id: 2, label: "착한 녀석", src: S02 },
  { id: 3, label: "즐거운 녀석", src: S03 },
  { id: 4, label: "활기찬 녀석", src: S04 },
  { id: 5, label: "멋진 녀석", src: S05 },
  { id: 6, label: "텐션주의!", src: S06 },
  { id: 7, label: "조용한 녀석", src: S07 },
  { id: 8, label: "똑똑한 녀석", src: S08 },
  { id: 9, label: "도도한 녀석", src: S09 },
];
const chosenTagId = ref(1);
const currentTag = computed(() => TAGS.find((t) => t.id === chosenTagId.value));

const filteredTargets = computed(() =>
  approved.value.filter((p) => Number(p.userId) !== myUserId)
);

function close() {
  emit("update:modelValue", false);
}
function auth() {
  const jwt = localStorage.getItem("jwt");
  return jwt ? { Authorization: `Bearer ${jwt}` } : {};
}

async function load() {
  if (!props.postId || !myUserId) return;
  loading.value = true;
  errorMsg.value = "";
  try {
    // 승인된 참가자
    const { data } = await axios.get(
      `/post/groupwalk/${props.postId}/participants/approved`,
      { headers: auth() }
    );
    const list = data?.participants || [];

    // 참가자 메타 + 내가 이미 남긴 리뷰 여부
    const enriched = await Promise.all(
      list.map(async (p) => {
        // 메타 로드
        if (!metaMap.value.has(p.userId)) {
          try {
            const petsRes = await axios.get("/pet/find-allpetbyuser", {
              params: { petUserId: p.userId },
              headers: auth(),
            });
            const pets = Array.isArray(petsRes?.data) ? petsRes.data : [];
            let petName = "",
              avatar = "";
            if (pets.length > 0) {
              pets.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
              );
              const main = pets[0];
              petName = main?.petName || "";
              if (main?.petId)
                avatar =
                  axios.defaults.baseURL.replace(/\/$/, "") +
                  `/pet/image/${main.petId}`;
            }
            metaMap.value.set(p.userId, { petName, avatar });
          } catch {
            /* ignore */
          }
        }

        // 받은 리뷰 중 내가 postId로 남긴 기록 있는지
        let given = false;
        try {
          const rv = await reviewApi.getReceivedReviews(p.userId);
          const arr = rv?.data?.data || rv?.data || [];
          given = arr.some(
            (r) =>
              Number(r.postId) === Number(props.postId) &&
              Number(r.writerId) === myUserId
          );
        } catch {
          /* ignore */
        }

        return { ...p, given };
      })
    );

    approved.value = enriched;
  } catch (e) {
    errorMsg.value =
      e?.response?.data?.message || e?.message || "목록을 불러오지 못했습니다.";
    approved.value = [];
  } finally {
    loading.value = false;
  }
}

async function sendOne(target) {
  if (!chosenTagId.value || target.given) return;
  sending.value.add(target.userId);
  try {
    await reviewApi.createReview({
      postId: props.postId,
      writerId: myUserId,
      targetId: target.userId,
      reviewTagId: chosenTagId.value,
    });
    target.given = true;
  } catch (e) {
    const msg =
      e?.response?.data?.message || e?.message || "전송에 실패했습니다.";
    alert(msg);
  } finally {
    sending.value.delete(target.userId);
  }
}

watch(
  () => props.modelValue,
  (v) => {
    if (v) load();
  }
);
</script>

<style scoped>
.sg-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  z-index: 2200;
}
.sg-card {
  width: min(720px, 92vw);
  background: #fff;
  border-radius: 0.6rem;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  position: relative;
}
.sg-close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}
.sg-header,
.sg-footer {
  padding: 0.9rem 1rem;
  background: #f8f9fa;
}
.sg-body {
  padding: 1rem;
  max-height: 70vh;
  overflow: auto;
}

.sg-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #eee;
}

/* 스티커 선택 그리드 */
.sg-tags {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
  margin-top: 0.6rem;
}
.sg-tag {
  border: 1px solid #ddd;
  border-radius: 0.75rem;
  background: #fff;
  padding: 0.6rem 0.5rem;
  display: grid;
  place-items: center;
  cursor: pointer;
}
.sg-tag.active {
  border-color: #6f5034;
  box-shadow: 0 0 0 0.2rem rgba(111, 80, 52, 0.15);
}
.sg-tag-img {
  width: 56px;
  height: 56px;
  object-fit: contain;
}
.sg-tag-label {
  font-size: 0.85rem;
  margin-top: 0.35rem;
  color: #333;
  text-align: center;
}
.sg-tag-preview {
  width: 24px;
  height: 24px;
  object-fit: contain;
  border-radius: 4px;
}
</style>
