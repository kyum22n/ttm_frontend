<template>
  <!-- 부트스트랩 모달 -->
  <div
    class="modal fade"
    id="WalkListModal"
    tabindex="-1"
    aria-labelledby="WalkListModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content border border-2 border-dark rounded-3 p-3">
        <!-- 헤더 -->
        <div class="modal-header">
          <h5 class="modal-title fw-bold text-brown" id="WalkListModalLabel">
            🐾 산책 리스트
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <!-- 바디 -->
        <div class="modal-body">
          <div
            v-for="(Walk, i) in WalkList"
            :key="i"
            class="card mb-3 shadow-sm"
          >
            <div class="card-body d-flex justify-content-between align-items-center">
              <!-- 메시지 -->
              <p class="card-text mb-0 flex-grow-1 me-3">
                {{ Walk.message }}
              </p>

              <!-- 버튼 그룹 -->
              <div class="btn-group">
                <button class="btn btn-sm btn-dark">게시글 가기</button>
                <button
                  v-if="Walk.status === '신청중'"
                  class="btn btn-sm btn-warning"
                >
                  신청중
                </button>
                <button
                  v-else-if="Walk.status === '수락됨'"
                  class="btn btn-sm btn-success"
                >
                  수락됨
                </button>
                <button class="btn btn-sm btn-danger">신청 취소</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 푸터 -->
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as bootstrap from "bootstrap";

const route = useRoute();
const router = useRouter();

const WalkList = ref([
  { message: "서울 강서구 식물원에서 산책하실 분 구해요", status: "신청중" },
  { message: "서울 강서구 식물원에서 산책하실 분 구해요", status: "수락됨" },
  { message: "서울 강서구 식물원에서 산책하실 분 구해요", status: "신청중" },
]);

let modalInstance = null;

onMounted(() => {
  const modalEl = document.getElementById("WalkListModal");
  modalInstance = new bootstrap.Modal(modalEl);

  // URL이 /Walk/list라면 모달 자동 오픈
  if (route.path === "/Walk/list") {
    modalInstance.show();
  }

  // 모달 닫히면 / 로 이동
  modalEl.addEventListener("hidden.bs.modal", () => {
    if (route.path === "/Walk/list") {
      router.push("/");
    }
  });
});

// 라우터 변경 감시 → /Walk/list 진입하면 모달 열기
watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/Walk/list") {
      modalInstance?.show();
    }
  }
);
</script>

<style scoped>
.text-brown {
  color: #6b4a2b;
}

/* 카드 메시지 스타일 */
.card-text {
  font-size: 16px;
  color: #333;
}

/* 카드 박스 */
.card {
  border-radius: 12px;
}

/* 버튼 크기 */
.btn-group .btn-sm {
  width: 90px;
  height: 34px;
  font-size: 14px;
}
</style>
