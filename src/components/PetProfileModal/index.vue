<template>
  <div class="modal fade" id="petProfileModal" tabindex="-1" aria-hidden="true" ref="modalEl">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3" style="border-radius:15px; border:2px solid #7a5a3a;">
        
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="fw-bold m-0" style="color:#7a5a3a;">
            ID: {{ pet?.userLoginId }}
          </h5>
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="closeModal">닫기</button>
        </div>

        <div class="d-flex gap-3">
          <img
            :src="pet?.imageUrl"
            alt="pet"
            class="rounded-circle border"
            style="width:100px; height:100px; object-fit:cover;"
          />
          <div class="d-flex flex-column justify-content-center small">
            <p class="mb-1"><strong>{{ pet?.petName }}</strong></p>
            <p class="mb-1">품종: {{ pet?.petBreed }}</p>
            <p class="mb-1">성별: {{ pet?.petGender }}</p>
            <p class="mb-1">출생일: {{ pet?.birthDate }}</p>
            <p class="mb-1">몸무게: {{ pet?.weight }}kg</p>
            <p class="mb-1">지역: {{ pet?.address }}</p>
          </div>
        </div>

        <div class="mt-3 p-3" style="background:#fff; border-radius:10px; box-shadow:3px 3px 0 #7a5a3a;">
          <p class="m-0 text-center" style="white-space:pre-line;">
            {{ pet?.intro }}
          </p>
        </div>

        <!-- ✅ 버튼 영역 -->
        <div class="mt-3 text-center">
          <button
            v-if="isOwner"
            class="btn btn-primary btn-sm"
            @click="editPet"
          >
            ✏️ 편집
          </button>
          <button
            v-else
            class="btn btn-success btn-sm"
            @click="requestChat"
          >
            💬 채팅 신청
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import * as bootstrap from "bootstrap";

const props = defineProps({
  pet: { type: Object, default: null },
  show: { type: Boolean, default: false },
  currentUserId: { type: Number, required: true }, // 로그인한 내 유저 ID
});

const modalEl = ref(null);
let modalInstance = null;

watch(
  () => props.show,
  (newVal) => {
    if (!modalInstance && modalEl.value) {
      modalInstance = new bootstrap.Modal(modalEl.value);
    }
    if (newVal) modalInstance?.show();
    else modalInstance?.hide();
  }
);

const emit = defineEmits(["update:show", "edit", "chat"]);

function closeModal() {
  emit("update:show", false);
}

// ✅ 내 펫인지 판단
const isOwner = computed(() => props.pet && props.pet.petUserId === props.currentUserId);

// 버튼 이벤트
function editPet() {
  emit("edit", props.pet);
  closeModal();
}
function requestChat() {
  emit("chat", props.pet);
  closeModal();
}
</script>
