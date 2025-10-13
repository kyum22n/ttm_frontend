<template>
  <div v-if="modelValue" class="sg-backdrop" @click.self="close">
    <div class="sg-card">
      <button
        class="btn-close sg-close"
        @click="close"
        aria-label="Close"
      ></button>

      <div class="sg-header">
        <h5 class="m-0">스티커 남기기</h5>
        <div class="small text-muted">
          완료된 1:1 산책의 상대에게 스티커를 보내세요. 스티커를 누르면 즉시
          전송됩니다.
        </div>
      </div>

      <div class="sg-body">
        <div v-if="errorMsg" class="alert alert-danger py-2 px-3 mb-3">
          {{ errorMsg }}
        </div>

        <div class="d-flex align-items-center gap-3 mb-3">
          <img
            :src="partnerMeta.avatar || FALLBACK_AVATAR"
            class="sg-avatar"
            alt="상대 프로필"
          />
          <div>
            <div class="fw-bold">
              {{ partnerMeta.petName || partnerName || "USER" }}
              <small class="text-muted">(#{{ partnerId }})</small>
            </div>
            <div class="small text-muted">
              요청ID: {{ requestOneId ? requestOneId : "-" }}
            </div>
          </div>
        </div>

        <div class="mb-2 d-flex align-items-center justify-content-between">
          <strong>스티커 선택</strong>
          <div class="d-flex align-items-center gap-2 small text-muted">
            <img
              v-if="currentTag && currentTag.src"
              :src="currentTag.src"
              class="sg-tag-preview"
              alt="선택 스티커"
            />
            <span>선택: {{ currentTag ? currentTag.label : "-" }}</span>
          </div>
        </div>

        <div class="sg-tags">
          <button
            v-for="t in TAGS"
            :key="t.id"
            class="sg-tag"
            :class="{ active: chosenTagId === t.id }"
            :disabled="sending || alreadyGiven"
            @click="chooseAndSend(t)"
          >
            <img :src="t.src" class="sg-tag-img" :alt="t.label" />
            <div class="sg-tag-label">{{ t.label }}</div>
          </button>
        </div>

        <div
          v-if="alreadyGiven && !errorMsg"
          class="alert alert-info py-2 px-3 mt-2"
        >
          이미 이 산책에 스티커를 보냈습니다.
        </div>
      </div>

      <div class="sg-footer">
        <button class="btn btn-secondary" @click="close" :disabled="sending">
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, computed, watch } from "vue";
import reviewApi from "@/apis/reviewApi";

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
  requestOneId: { type: Number, required: true },
  partnerId: { type: Number, required: true },
  partnerName: { type: String, default: "" },
  sendSticker: { type: Function, default: null }, // (payload)=>Promise<void>
});
const emit = defineEmits(["update:modelValue", "send", "sent", "error"]);

const user = JSON.parse(localStorage.getItem("user") || "{}");
const myUserId = Number(user?.userId || 0);

const sending = ref(false);
const errorMsg = ref("");
const alreadyGiven = ref(false);

const FALLBACK_AVATAR = "https://placehold.co/44x44?text=USER";
const partnerMeta = ref({ petName: "", avatar: "" });

async function loadPartnerMeta() {
  partnerMeta.value = { petName: "", avatar: "" };
  if (!props.partnerId) return;
  try {
    const { data } = await axios.get("/pet/find-allpetbyuser", {
      params: { petUserId: props.partnerId },
    });
    const pets = Array.isArray(data) ? data : [];
    if (pets.length > 0) {
      pets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const main = pets[0];
      partnerMeta.value = {
        petName: main?.petName || "",
        avatar: main?.petId
          ? axios.defaults.baseURL.replace(/\/$/, "") +
            `/pet/image/${main.petId}`
          : "",
      };
    }
  } catch {
    /* ignore */
  }
}

// 이미 보냈는지 확인(상대가 받은 리뷰 목록에서, 같은 requestOneId & writerId=나)
async function loadAlreadyGiven() {
  alreadyGiven.value = false;
  try {
    const res = await reviewApi.getReceivedReviews(props.partnerId);
    const arr = res?.data?.data || res?.data || [];
    alreadyGiven.value = arr.some(
      (r) =>
        Number(r?.requestOneId) === Number(props.requestOneId) &&
        Number(r?.writerId) === Number(myUserId)
    );
  } catch {
    /* ignore */
  }
}

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

function close() {
  emit("update:modelValue", false);
}

async function chooseAndSend(tag) {
  if (!tag || sending.value) return;
  if (alreadyGiven.value) {
    errorMsg.value = "이미 스티커를 보냈습니다.";
    return;
  }
  chosenTagId.value = tag.id;
  errorMsg.value = "";
  const payload = {
    requestOneId: props.requestOneId,
    toUserId: props.partnerId,
    reviewTagId: tag.id,
    fromUserId: myUserId,
  };
  try {
    sending.value = true;
    if (typeof props.sendSticker === "function") {
      await props.sendSticker(payload);
    } else {
      emit("send", payload);
    }
    emit("sent", payload);
    alreadyGiven.value = true;
    close();
  } catch (e) {
    const status = e?.response?.status;
    const rawMsg = e?.response?.data?.message || e?.message || "";
    const dupHint =
      /duplicate|unique|ORA-00001|already/i.test(rawMsg) || status === 409;
    const msg = dupHint
      ? "이미 스티커를 보냈습니다."
      : rawMsg || "스티커 전송 실패";
    errorMsg.value = msg;
    emit("error", msg);
  } finally {
    sending.value = false;
  }
}

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      errorMsg.value = "";
      chosenTagId.value = 1;
      Promise.all([loadPartnerMeta(), loadAlreadyGiven()]);
    }
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
  width: min(520px, 92vw);
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
  transition: transform 0.06s ease;
}
.sg-tag:hover {
  transform: translateY(-1px);
}
.sg-tag.active {
  border-color: #6f5034;
  box-shadow: 0 0 0 0.2rem rgba(111, 80, 52, 0.15);
}
.sg-tag:disabled {
  opacity: 0.6;
  cursor: default;
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
