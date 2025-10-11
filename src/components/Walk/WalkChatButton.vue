<template>
  <button
    class="btn btn-outline-primary btn-sm"
    :disabled="disabled"
    @click="requestChat"
  >
    <span v-if="!loading">{{ label }}</span>
    <span v-else>요청 중...</span>
  </button>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ensureRoom } from "@/apis/chatApi";

const props = defineProps({
  /** 상대 유저 ID (필수) */
  targetUserId: { type: Number, required: true },
  /** 버튼 라벨 */
  label: { type: String, default: "채팅" },
});

const emit = defineEmits(["requested", "opened"]);

const store = useStore();
const router = useRouter();

const meId = computed(() => Number(store.getters.getUser?.userId || 0));
const isLogin = computed(() => store.getters.isLogin);
const otherId = computed(() => Number(props.targetUserId || 0));

const loading = ref(false);

const disabled = computed(() => {
  if (loading.value) return true;
  if (!Number.isInteger(otherId.value) || otherId.value <= 0) return true;
  if (Number.isInteger(meId.value) && meId.value > 0 && meId.value === otherId.value) return true;
  return false;
});

async function requestChat() {
  if (!isLogin.value || !Number.isInteger(meId.value) || meId.value <= 0) {
    alert("로그인이 필요합니다.");
    return;
  }
  if (!Number.isInteger(otherId.value) || otherId.value <= 0) {
    alert("상대 정보를 확인할 수 없습니다.");
    return;
  }
  if (meId.value === otherId.value) {
    alert("본인에게는 요청할 수 없습니다.");
    return;
  }

  loading.value = true;
  try {
    const { data } = await ensureRoom({
      userA: meId.value,
      userB: otherId.value,
      requestedBy: meId.value,
    });
    const room = data?.room;
    if (!room?.chatroomId) throw new Error("roomId missing");

    emit("requested", room);

    if (room.chatroomStatus === "A") {
      emit("opened", room);
      router.push({ path: "/message/detail", query: { roomId: room.chatroomId } });
    } else {
      alert("채팅 요청을 보냈습니다. 상대가 승인하면 이용할 수 있어요.");
    }
  } catch (e) {
    const msg = e?.response?.data?.message || e?.message || "채팅 요청에 실패했습니다.";
    console.error("WalkChatButton requestChat error:", e);
    alert(msg);
  } finally {
    loading.value = false;
  }
}
</script>
