<template>
  <div class="chat-container">
    <h2 class="title">메세지 <span class="small" v-if="connected">· 연결됨</span></h2>

    <div class="chat-box" ref="listRef" @scroll="onScroll">
      <button v-show="canLoadMore" class="load-more" :disabled="loadingHistory" @click="loadHistory(false)">
        ▲ 이전 대화 더 보기
      </button>

      <template v-for="(msg, i) in messages" :key="msg.messageId ?? i">
        <!-- 상대 -->
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
        <!-- 나 -->
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

    <div class="input-box">
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

const props = defineProps({
  baseUrl: { type: String, default: "http://localhost:8080" },
  roomId: { type: Number, required: true },
  myUserId: { type: Number, required: true },
});

const messages = ref([]);
const newMessage = ref("");
const listRef = ref(null);
const connected = ref(false);
const canLoadMore = ref(true);
const loadingHistory = ref(false);
const oldestMessageId = ref(null);

let stomp = null;

// 유저 펫 정보로 바꿀거
const ME_IMG = "https://placekitten.com/100/100";
const OTHER_IMG = "https://placedog.net/100/100?id=1";

function fmtTime(iso) {
  if (!iso) return "";
  try { return new Date(iso).toLocaleString(); } catch (e) { return iso; }
}

function toViewMessage(m) {
  const mine = m.senderId === props.myUserId;
  return {
    messageId: m.messageId,
    senderId: m.senderId,
    createdAt: m.createdAt,
    isRead: m.isRead,
    sender: mine ? "me" : "other",
    name: mine ? "나" : `상대(${m.senderId})`,
    text: m.message,
    img: mine ? ME_IMG : OTHER_IMG,
  };
}

function scrollToBottom() {
  const el = listRef.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
async function putJSON(url, body) {
  await fetch(url, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(body),
  });
}

async function loadHistory(initial=false){
  if (loadingHistory.value) return;
  loadingHistory.value = true;
  try {
    const params = new URLSearchParams({ userId: String(props.myUserId), limit: "30" });
    if (oldestMessageId.value) params.set("beforeMessageId", String(oldestMessageId.value));
    const url = `${props.baseUrl}/chat/rooms/${props.roomId}/messages?` + params.toString();

    const data = await getJSON(url);
    const arr = (data?.messages ?? []).map(toViewMessage);
    if (arr.length === 0) { canLoadMore.value = false; return; }

    if (initial) {
      // 초기: ASC 그대로 append 후 바닥으로
      messages.value = arr;
      oldestMessageId.value = arr[0].messageId;
      canLoadMore.value = true;
      await nextTick();
      scrollToBottom();
      // 입장하자마자 바닥이면 읽음 처리
      if (messages.value.length) {
        markReadUpTo(messages.value[messages.value.length - 1].messageId);
      }
    } else {
      // 더보기: 앞에 붙이고 스크롤 보정
      const el = listRef.value;
      const prevHeight = el?.scrollHeight ?? 0;
      messages.value = [...arr, ...messages.value];
      oldestMessageId.value = arr[0].messageId;
      await nextTick();
      if (el) el.scrollTop = el.scrollHeight - prevHeight;
    }
  } catch (e) {
    console.error("히스토리 실패", e);
    alert("히스토리 로드 실패");
  } finally {
    loadingHistory.value = false;
  }
}

function applyReadUpdate(upToId, readerId){
  messages.value = messages.value.map(m => {
    if (m.senderId !== readerId && m.messageId <= upToId) {
      return { ...m, isRead: "Y" };
    }
    return m;
  });
}

function markReadUpTo(id){
  if (!id) return;
  const payload = { roomId: props.roomId, userId: props.myUserId, upToMessageId: id };
  // WS
  if (stomp && connected.value) {
    stomp.publish({ destination: "/app/chat.read", body: JSON.stringify(payload) });
  }
  // REST 백업
  putJSON(`${props.baseUrl}/chat/rooms/${props.roomId}/read`, payload).catch(() => { /* ignore */ });
  // UI 즉시 반영(낙관적)
  applyReadUpdate(id, props.myUserId);
}

function onScroll(){
  const el = listRef.value;
  if (!el) return;
  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
  if (atBottom && messages.value.length){
    const lastId = messages.value[messages.value.length - 1].messageId;
    markReadUpTo(lastId);
  }
}

function sendMessage(){
  const text = newMessage.value.trim();
  if (!text) return;
  if (!stomp || !connected.value) {
    alert("연결되지 않았습니다."); return;
  }
  // 전송 직전, 내가 본 마지막까지 읽음 처리
  if (messages.value.length){
    const lastId = messages.value[messages.value.length - 1].messageId;
    markReadUpTo(lastId);
  }
  const payload = { roomId: props.roomId, senderId: props.myUserId, message: text };
  stomp.publish({ destination: "/app/chat.send", body: JSON.stringify(payload) });
  newMessage.value = "";
}

function connect(){
  const wsUrl = `${props.baseUrl.replace(/\/+$/,'')}/ws`;
  stomp = new Client({
    webSocketFactory: () => new SockJS(wsUrl),
    reconnectDelay: 3000,
    debug: () => {}, // 로그 끄기
  });
  stomp.onConnect = () => {
    connected.value = true;
    // 구독
    const topic = `/topic/chat.${props.roomId}`;
    stomp.subscribe(topic, async (frame) => {
      try{
        const data = JSON.parse(frame.body);
        if (data.type === "NEW_MESSAGE") {
          const vm = toViewMessage(data.message);
          messages.value.push(vm);
          await nextTick();
          scrollToBottom();
          // 상대 메시지면, 바닥 근처에서 자동 읽음 처리
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
      }catch(e){ /* ignore */ }
    });
    // 초기 히스토리
    loadHistory(true);
  };
  stomp.onStompError = (f) => { console.error("STOMP error", f); };
  stomp.onWebSocketError = (e) => { console.error("WS error", e); };
  stomp.activate();
}

function disconnect(){
  try{ if (stomp) stomp.deactivate(); }catch(e){ /* ignore */ }
  stomp = null;
}

onMounted(connect);
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
</style>
