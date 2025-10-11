
<template>
  <button
  class="btn btn-primary"
  :disabled="disabled"
  @click="apply"
>
  {{ loading ? "신청 중..." : (requested ? requestedLabel : label) }}
</button>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import walkApi from "@/apis/walkApi";

const props = defineProps({
  receiveUserId: { type: Number, required: true },
  label: { type: String, default: "산책신청+" },
  requestedLabel: { type: String, default: "산책 요청됨" }, // ← 추가
});

const emit = defineEmits(["requested"]);

const store = useStore();
const router = useRouter();
const route = useRoute();

const loading = ref(false);
const requested = ref(false);




const disabled = computed(() => {
  const me = store.state.user?.userId;
  return loading.value || requested.value || me === props.receiveUserId;
});


// 추가: 현재 로그인 유저가 대상에게 이미 신청했는지 서버에서 확인
async function checkAlreadyRequested() {
  const me = store.state.user?.userId;
  const target = props.receiveUserId;
  if (!store.getters.isLogin || !me || !target) {
    requested.value = false;
    return;
  }
  try {
    const res = await walkApi.getOneOnOneRequests(me);
    // 백엔드 응답: 200일 때 { walkRequestList: [...] }, 404일 때 message
    const list = res?.data?.walkRequestList || [];
    requested.value = list.some((w) => {
      const rstatus = w.rstatus ?? w.rStatus; // 컬럼명 혼용 대응
      const ended = w.walkEndedAt ?? w.walkended_at;
      const sameTarget = Number(w.receiveUserId) === Number(target);
      const active = rstatus === "P" || (rstatus === "A" && !ended);
      return sameTarget && active;
    });
  } catch (e) {
    // 404(없음)는 중복 아님으로 처리
    if (e?.response?.status === 404) {
      requested.value = false;
    } else {
      console.error("중복 신청 체크 실패:", e);
      requested.value = false;
    }
  }
}

// 추가: 마운트/대상 변경 시 중복 여부 갱신
onMounted(checkAlreadyRequested);
watch(() => props.receiveUserId, checkAlreadyRequested);



// 교체: 신청 성공 후 requested = true 설정
async function apply() {
  const me = store.state.user?.userId;

  if (!store.getters.isLogin || !me) {
    router.push({ path: "/Login", query: { redirect: route.fullPath } });
    return;
  }
  if (me === props.receiveUserId) {
    alert("본인에게는 신청할 수 없습니다.");
    return;
  }
  if (requested.value) {
    alert("이미 산책을 신청했습니다.");
    return;
  }

  loading.value = true;
  try {
    await walkApi.applyOneOnOne({
      requestUserId: me,
      receiveUserId: props.receiveUserId,
    });
    requested.value = true;     // ← 성공 시 즉시 상태 반영
    alert("산책 신청이 완료되었습니다.");
    emit("requested");
  } catch (e) {
    const msg =
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      "신청 처리 중 오류가 발생했습니다.";
    alert(msg);
  } finally {
    loading.value = false;
  }
}
</script>
