<template>
  <div
    class="modal fade"
    id="petProfileModal"
    tabindex="-1"
    aria-hidden="true"
    ref="modalEl"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div
        class="modal-content p-3"
        style="border-radius: 15px; border: 2px solid #7a5a3a"
      >
        <!-- 헤더 -->
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="fw-bold m-0" style="color: #7a5a3a">
            ID: {{ pet?.userLoginId }}
          </h5>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="closeModal"
          >
            닫기
          </button>
        </div>

        <!-- 프로필 -->
        <div class="d-flex gap-3">
          <img
            :src="getPetImageUrl(pet)"
            alt="pet"
            class="rounded-circle border"
            style="width: 100px; height: 100px; object-fit: cover"
          />

          <div
            class="d-flex flex-column justify-content-center small flex-grow-1"
          >
            <p class="mb-1">
              <strong>{{ pet?.petName }}</strong>
            </p>
            <p class="mb-1">이름: {{ pet?.petName }}</p>
            <p class="mb-1">품종: {{ pet?.petBreed }}</p>
            <p class="mb-1">성별: {{ pet?.petGender }}</p>
            <p class="mb-1">출생일: {{ displayBirthDay }}</p>
            <p class="mb-1">몸무게: {{ pet?.petWeight }}kg</p>
            <p class="mb-1">지역: {{ pet?.userAddress }}</p>
          </div>

          <!-- 좋아요 -->
          <div class="text-center">
            <button
              class="btn btn-link p-0"
              @click="toggleLike"
              :disabled="isOwner"
            >
              <i
                class="bi"
                :class="
                  isLiked
                    ? 'bi-heart-fill text-danger'
                    : 'bi-heart text-secondary'
                "
                style="font-size: 1.4rem"
              ></i>
            </button>
            <p class="small mb-0">{{ likeCount }}</p>
          </div>
        </div>

        <!-- 소개글 -->
        <div
          class="mt-3 p-3"
          style="
            background: #fff;
            border-radius: 10px;
            box-shadow: 3px 3px 0 #7a5a3a;
          "
        >
          <p class="m-0 text-center" style="white-space: pre-line">
            {{ pet?.petDesc || "소개글이 없습니다." }}
          </p>
        </div>

        <!-- 버튼 -->
        <div class="mt-3 text-center">
          <button
            v-if="isOwner"
            class="btn btn-primary btn-sm"
            @click="editPet"
          >
            ✏️ 편집
          </button>
          <button v-else class="btn btn-success btn-sm" @click="requestChat">
            💬 채팅 신청
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import * as bootstrap from "bootstrap";

const props = defineProps({
  pet: { type: Object, default: null },
  show: { type: Boolean, default: false },
  currentUserId: { type: Number, required: true },
});

const emit = defineEmits(["update:show", "edit", "chat"]);

const store = useStore();
const modalEl = ref(null);
let modalInstance = null;

// 로컬 상태
const isLiked = ref(false);
const likeCount = ref(0);

function getPetImageUrl(pet) {
  if (!pet || !pet.petId) {
    return "https://via.placeholder.com/100?text=No+Image";
  }
  return `/pet/image/${pet.petId}`;
}

// ✅ 모달 인스턴스 초기화 (단 한 번만)
const onModalHidden = () => {
  emit("update:show", false);
};

onMounted(() => {
  if (modalEl.value) {
    modalInstance = new bootstrap.Modal(modalEl.value);
    modalEl.value.addEventListener("hidden.bs.modal", onModalHidden);
  }
});

onBeforeUnmount(() => {
  if (modalEl.value) {
    modalEl.value.removeEventListener("hidden.bs.modal", onModalHidden);
  }
});

watch(
  () => props.show,
  async (newVal) => {
    if (!modalInstance && modalEl.value) {
      modalInstance = new bootstrap.Modal(modalEl.value);
    }

    if (newVal) {
      modalInstance?.show();

      likeCount.value = props.pet?.petLikeCount || 0;

      try {
        const result = await store.dispatch("pet/fetchPetLikeStatus", {
          userId: props.currentUserId,
          petId: props.pet.petId,
        });
        isLiked.value = result;
      } catch (e) {
        console.error("좋아요 상태 조회 실패:", e);
      }
    } else {
      modalInstance?.hide();
    }
  }
);

function closeModal() {
  emit("update:show", false);
}

const isOwner = computed(
  () => props.pet && props.pet.petUserId === props.currentUserId
);

async function toggleLike() {
  try {
    const res = await store.dispatch("pet/toggleLike", {
      userId: props.currentUserId,
      petId: props.pet.petId,
    });

    if (res?.data?.liked !== undefined) {
      isLiked.value = res.data.liked;
      likeCount.value += res.data.liked ? 1 : -1;
      if (likeCount.value < 0) likeCount.value = 0;
    }
  } catch (err) {
    console.error("좋아요 토글 실패:", err);
  }
}

function editPet() {
  emit("edit", props.pet);
  closeModal();
}

function requestChat() {
  emit("chat", props.pet);
  closeModal();
}

const displayBirthDay = computed(() => {
  if (!props.pet) return "정보 없음";
  const val = props.pet.petBirthDay;
  if (!val) return "정보 없음";

  // 날짜 문자열 포맷팅
  try {
    const d = new Date(val);
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return val; // 혹시 Date로 변환 안 되면 원본 그대로
  }
});

</script>

<style scoped>
.bi-heart,
.bi-heart-fill {
  transition: all 0.2s ease;
}
</style>
