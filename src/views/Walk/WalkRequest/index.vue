<template>
  <div class="container py-4" style="max-width:640px">
    <h3 class="mb-3">🐾 1:1 산책 신청</h3>

    <!-- 대상 표시 & 신청 -->
    <div class="card border-0 shadow-sm mb-3">
      <div class="card-body d-flex justify-content-between align-items-center">
        <div>
          <div class="fw-semibold">
            대상 사용자 ID:
            <span class="text-primary">{{ receiveUserId || "-" }}</span>
          </div>
          <small class="text-muted">해당 사용자에게 1:1 산책 신청을 보냅니다.</small>
        </div>

        <button
          class="btn btn-primary"
          :disabled="!canApply || applying"
          @click="apply"
        >
          {{ applying ? "신청 중..." : "신청하기" }}
        </button>
      </div>
    </div>

    <div v-if="!receiveUserId" class="alert alert-warning">
      대상 사용자 ID가 없습니다. <code>?receiveUserId=상대ID</code> 쿼리를 전달해 주세요.
    </div>
    <div v-else-if="isMine" class="alert alert-secondary">
      자기 자신에게는 신청할 수 없습니다.
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

const store = useStore();
const route = useRoute();
const router = useRouter();

const meId = computed(() => Number(store.state.user?.userId || 0));
const receiveUserId = computed(() => Number(route.query.receiveUserId || 0));
const isMine = computed(
  () => meId.value > 0 && receiveUserId.value > 0 && meId.value === receiveUserId.value
);
const canApply = computed(
  () => store.getters.isLogin && receiveUserId.value > 0 && !isMine.value
);

const applying = ref(false);

async function apply() {
  if (!store.getters.isLogin) {
    router.push({ path: "/Login", query: { redirect: route.fullPath } });
    return;
  }
  if (!canApply.value) return;

  try {
    applying.value = true;
    const res = await store.dispatch("walk/apply", {
      requestUserId: meId.value,
      receiveUserId: receiveUserId.value,
    });

    if (res?.data?.result === "success") {
      alert("산책 신청을 전송했습니다.");
      // 필요하면 이전 화면으로: router.back();
    } else {
      alert(res?.data?.message || "신청 처리에 실패했습니다.");
    }
  } catch (e) {
    console.error("apply error:", e);
    alert("신청 중 오류가 발생했습니다.");
  } finally {
    applying.value = false;
  }
}

onMounted(() => {
  if (!store.getters.isLogin) {
    router.replace({ path: "/Login", query: { redirect: route.fullPath } });
  }
});
</script>

<style scoped>
/* 최소 스타일만 유지 */
</style>
