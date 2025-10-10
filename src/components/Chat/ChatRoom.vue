<!-- src/components/Chat/ChatRoom.vue -->
<template>
  <div class="chat-container">
    <h2 class="title">
      메세지
      <span class="small" v-if="connected && allowed">· 연결됨</span>
      <span class="small" v-else-if="!checking && roomStatus==='P'">· 승인 대기</span>
      <span class="small" v-else-if="!checking && roomStatus!=='P'">· 입장 불가</span>
    </h2>

    <div v-if="allowed" class="chat-box" ref="listRef" @scroll="onScroll">
      <button
        v-show="canLoadMore"
        class="load-more"
        :disabled="loadingHistory"
        @click="loadHistory(false)"
      >
        ▲ 이전 대화 더 보기
      </button>

      <template v-for="(msg, i) in messages" :key="msg.messageId ?? i">
        <div v-if="msg.sender === 'other'" class="chat-row left">
          <img v-if="msg.img" :src="msg.img" alt="profile" class="avatar" />
          <div class="bubble-box">
            <div class="name">{{ msg.name }}</div>
            <div class="bubble">{{ msg.text }}</div>
            <div class="meta">
              <span>#{{ msg.messageId }}</span>
              <span>{{ fmtTime(msg.createdAt) }}</span>
              <span>{{ msg.isRead === 'Y' ? '읽음' : '안읽음' }}</span>
            </div>
          </div>
        </div>

        <div v-else class="chat-row right">
          <div class="bubble-box">
            <div class="name">{{ msg.name }}</div>
            <div class="bubble">{{ msg.text }}</div>
            <div class="meta">
              <span>#{{ msg.messageId }}</span>
              <span>{{ fmtTime(msg.createdAt) }}</span>
              <span>{{ msg.isRead === 'Y' ? '읽음' : '안읽음' }}</span>
            </div>
          </div>
          <img v-if="msg.img" :src="msg.img" alt="profile" class="avatar" />
        </div>
      </template>
    </div>

    <div v-else-if="!checking && roomStatus === 'P'" class="pending-box">
      <p class="pending-title">승인 대기 중</p>
      <p class="pending-desc">상대가 채팅 요청을 승인하면 이용할 수 있어요.</p>
    </div>

    <div v-else-if="!checking && roomStatus !== 'P'" class="pending-box">
      <p class="pending-title">입장할 수 없습니다</p>
      <p class="pending-desc">방이 없거나 권한이 없습니다.</p>
    </div>

    <div v-if="allowed" class="input-box">
      <input
        type="text"
        v-model="newMessage"
        placeholder="메세지를 입력하세요..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">보내기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import apiRequest from "@/apis/apiRequest"; // [CHANGED] JWT 자동 첨부 유틸

const props = defineProps({
  baseUrl: { type: String, default: "http://localhost:8080" },
  roomId: { type: Number, required: true },
  myUserId: { type: Number, required: true },
  myAvatarUrl: { type: String, default: "" },     // [INFO] 부모에서 주입
  otherAvatarUrl: { type: String, default: "" },  // [INFO] 부모에서 주입
})

const messages = ref([]);
const newMessage = ref("");
const listRef = ref(null);
const connected = ref(false);
const canLoadMore = ref(true);
const loadingHistory = ref(false);
const oldestMessageId = ref(null);

const checking = ref(true);
const allowed  = ref(false);
const roomStatus = ref(null);

let stomp = null;

const FALLBACK_ME    = "https://placehold.co/100x100?text=ME"
const FALLBACK_OTHER = "https://placehold.co/100x100?text=USER"

function fmtTime(iso) {
  if (!iso) return "";
  try { return new Date(iso).toLocaleString(); } catch (e) { return iso; }
}

function toViewMessage(m) {
  const mine = m.senderId === props.myUserId
  return {
    messageId: m.messageId,
    senderId: m.senderId,
    createdAt: m.createdAt,
    isRead: m.isRead,
    sender: mine ? "me" : "other",
    name: mine ? "나" : `상대(${m.senderId})`,
    text: m.message,
    img: mine ? (props.myAvatarUrl || FALLBACK_ME)
              : (props.otherAvatarUrl || FALLBACK_OTHER),
  }
}

function scrollToBottom() {
  const el = listRef.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}

// [CHANGED] fetch → apiRequest(get) 로 교체 (JWT 첨부)
async function checkApproved() {
  try {
    const res = await apiRequest(
      "get",
      `${props.baseUrl}/chat/rooms/${props.roomId}/info`,
      null,
      { userId: props.myUserId }
    );
    const info = res?.data;
    const st = info?.room?.chatroomStatus ?? null;
    roomStatus.value = st;
    allowed.value = (st === 'A');
  } catch (e) {
    allowed.value = false;
    roomStatus.value = 'X';
    const code = e?.response?.data?.code;
    if (code === 'NOT_APPROVED') {
      roomStatus.value = 'P';
    } else if (code === 'NOT_MEMBER') {
      roomStatus.value = 'X';
    } else if (e?.response?.status === 404) {
      roomStatus.value = 'X';
    }
  } finally {
    checking.value = false;
  }
}

// [CHANGED] fetch → apiRequest(put) 로 교체 (JWT 첨부)
async function putJSON(url, body) {
  try {
    await apiRequest("put", url, body, null);
  } catch (e) {
    /* no-op */
  }
}

// [CHANGED] fetch → apiRequest(get) 로 교체 (JWT 첨부)
async function loadHistory(initial = false) {
  if (loadingHistory.value) return;
  loadingHistory.value = true;
  try {
    const params = { userId: props.myUserId, limit: 30 };
    if (oldestMessageId.value) params.beforeMessageId = oldestMessageId.value;

    const res = await apiRequest(
      "get",
      `${props.baseUrl}/chat/rooms/${props.roomId}/messages`,
      null,
      params
    );
    const data = res?.data || {};
    const arr = (data.messages ?? []).map(toViewMessage);
    if (arr.length === 0) { canLoadMore.value = false; return; }

    if (initial) {
      messages.value = arr;
      oldestMessageId.value = arr[0].messageId;
      canLoadMore.value = true;
      await nextTick();
      scrollToBottom();
      if (messages.value.length) {
        markReadUpTo(messages.value[messages.value.length - 1].messageId);
      }
    } else {
      const el = listRef.value;
      const prevHeight = el?.scrollHeight ?? 0;
      messages.value = [...arr, ...messages.value];
      oldestMessageId.value = arr[0].messageId;
      await nextTick();
      if (el) el.scrollTop = el.scrollHeight - prevHeight;
    }
  } catch (e) {
    console.warn("히스토리 로드 실패", e);
  } finally {
    loadingHistory.value = false;
  }
}

function applyReadUpdate(upToId, readerId) {
  messages.value = messages.value.map(m => {
    if (m.senderId !== readerId && m.messageId <= upToId) {
      return { ...m, isRead: "Y" };
    }
    return m;
  });
}

function markReadUpTo(id) {
  if (!id) return;
  const payload = { roomId: props.roomId, userId: props.myUserId, upToMessageId: id };
  if (stomp && connected.value) {
    try {
      stomp.publish({ destination: "/app/chat.read", body: JSON.stringify(payload) });
    } catch (e) { /* no-op */ }
  }
  putJSON(`${props.baseUrl}/chat/rooms/${props.roomId}/read`, payload);
  applyReadUpdate(id, props.myUserId);
}

function onScroll() {
  const el = listRef.value;
  if (!el) return;
  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
  if (atBottom && messages.value.length) {
    const lastId = messages.value[messages.value.length - 1].messageId;
    markReadUpTo(lastId);
  }
}

function sendMessage() {
  const text = newMessage.value.trim();
  if (!text) return;
  if (!allowed.value) {
    alert("상대 승인 전이라 메시지를 보낼 수 없습니다.");
    return;
  }
  if (!stomp || !connected.value) {
    alert("연결되지 않았습니다.");
    return;
  }
  if (messages.value.length) {
    const lastId = messages.value[messages.value.length - 1].messageId;
    markReadUpTo(lastId);
  }
  const payload = { roomId: props.roomId, senderId: props.myUserId, message: text };
  try {
    stomp.publish({ destination: "/app/chat.send", body: JSON.stringify(payload) });
  } catch (e) {
    alert("메시지 전송 실패");
  }
  newMessage.value = "";
}

function connect() {
  const wsUrl = `${props.baseUrl.replace(/\/+$/, '')}/ws`;
  stomp = new Client({
    webSocketFactory: () => new SockJS(wsUrl),
    reconnectDelay: 3000,
    debug: () => { /* no-op */ }, // 빈 블록 대신 주석
  });

  stomp.onConnect = async () => {
    connected.value = true;
    const topic = `/topic/chat.${props.roomId}`;
    stomp.subscribe(topic, async (frame) => {
      try {
        const data = JSON.parse(frame.body);
        if (data.type === "NEW_MESSAGE") {
          const vm = toViewMessage(data.message);
          messages.value.push(vm);
          await nextTick();
          scrollToBottom();
          if (vm.sender !== "me") {
            const el = listRef.value;
            const nearBottom = el && (el.scrollTop + el.clientHeight >= el.scrollHeight - 40);
            if (nearBottom) markReadUpTo(vm.messageId);
          }
        } else if (data.type === "READ_UPDATE") {
          if (data.upToMessageId) {
            applyReadUpdate(Number(data.upToMessageId), Number(data.readerId));
          }
        }
      } catch (e) { /* no-op */ }
    });
    await loadHistory(true);
  };

  stomp.onStompError = () => { /* no-op */ };
  stomp.onWebSocketError = () => { /* no-op */ };

  try { stomp.activate(); } catch (e) { /* no-op */ }
}

function disconnect() {
  try { if (stomp) stomp.deactivate(); } catch (e) { /* no-op */ }
  stomp = null;
}

onMounted(async () => {
  await checkApproved();
  if (allowed.value) {
    connect();
  }
});
onBeforeUnmount(disconnect);
</script>

<style scoped>
.chat-container { background:#fff;border:2px solid #6b4a2b;border-radius:12px;padding:20px;max-width:950px;margin:20px auto;font-family:"Noto Sans KR",sans-serif;display:flex;flex-direction:column;height:600px }
.title { text-align:center;font-size:1.5rem;font-weight:bold;margin-bottom:16px;color:#6b4a2b }
.small { font-size:.9rem;color:#6b7280 }
.chat-box { flex:1;overflow-y:auto;padding:10px;margin-bottom:12px;background:#fafafa;border-radius:8px;display:flex;flex-direction:column;gap:12px }
.load-more { align-self:center;margin:4px 0 8px;padding:6px 10px;border:1px solid #c8a47e;background:#fff;border-radius:8px;cursor:pointer }
.chat-row { display:flex;align-items:flex-start;gap:12px }
.chat-row.right { justify-content:flex-end;text-align:right }
.chat-row.left { justify-content:flex-start;text-align:left }
.avatar { width:60px;height:60px;border-radius:50%;border:3px solid #e170ff;object-fit:cover }
.bubble-box { max-width:60% }
.name { font-size:.85rem;font-weight:bold;margin-bottom:4px }
.bubble { background:#fff;border-radius:16px;padding:10px 16px;border:2px solid #c8a47e;box-shadow:3px 3px 0 #6b4a2b;font-size:.95rem }
.meta { display:flex;gap:8px;align-items:center;margin-top:6px;font-size:12px;color:#6b7280 }
.input-box { display:flex;gap:8px }
.input-box input { flex:1;padding:10px;border:2px solid #ccc;border-radius:8px;outline:none }
.input-box button { padding:10px 16px;border:none;border-radius:8px;background:#6b4a2b;color:#fff;font-size:.95rem;cursor:pointer }
.pending-box { text-align:center;border:1px dashed #ccc;border-radius:8px;padding:24px;background:#fff }
.pending-title { font-weight:700;margin-bottom:6px }
.pending-desc { color:#666 }
</style>
