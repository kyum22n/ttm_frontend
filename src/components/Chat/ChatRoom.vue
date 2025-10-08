<template>
  <div class="chat-container">
    <h2 class="title">
      메세지
      <span class="small" v-if="connected && allowed">· 연결됨</span>
      <span class="small" v-else-if="!checking && roomStatus==='P'">· 승인 대기</span>
      <span class="small" v-else-if="!checking && roomStatus!=='P'">· 입장 불가</span>
    </h2>

    <!-- 승인(A)일 때만 채팅 박스 렌더 -->
    <div v-if="allowed" class="chat-box" ref="listRef" @scroll="onScroll">
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

    <!-- 승인 대기 -->
    <div v-else-if="!checking && roomStatus === 'P'" class="pending-box">
      <p class="pending-title">승인 대기 중</p>
      <p class="pending-desc">상대가 채팅 요청을 승인하면 이용할 수 있어요.</p>
    </div>

    <!-- 입장 불가 -->
    <div v-else-if="!checking && roomStatus !== 'P'" class="pending-box">
      <p class="pending-title">입장할 수 없습니다</p>
      <p class="pending-desc">방이 없거나 권한이 없습니다.</p>
    </div>

    <!-- 입력 박스: 승인(A)일 때만 -->
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

// ✅ [추가] 부모가 계산해서 내려줄 내/상대 아바타 URL
const props = defineProps({
  baseUrl: { type: String, default: "http://localhost:8080" },
  roomId: { type: Number, required: true },
  myUserId: { type: Number, required: true },
  myAvatarUrl: { type: String, default: "" },     // ← 추가
  otherAvatarUrl: { type: String, default: "" },  // ← 추가
})

const messages = ref([]);
const newMessage = ref("");
const listRef = ref(null);
const connected = ref(false);
const canLoadMore = ref(true);
const loadingHistory = ref(false);
const oldestMessageId = ref(null);

const checking = ref(true);   // 승인 상태 확인 중
const allowed  = ref(false);  // 승인됨(A)일 때만 true
const roomStatus = ref(null); // 'A' | 'P' | 'B' | 'D' | 'X'

// STOMP 인스턴스
let stomp = null;

// ✅ [추가] 이미지가 없을 때 사용할 폴백
const FALLBACK_ME    = "https://placehold.co/100x100?text=ME"
const FALLBACK_OTHER = "https://placehold.co/100x100?text=USER"



function fmtTime(iso) {
  if (!iso) return "";
  try { return new Date(iso).toLocaleString(); } catch (e) { return iso; }
}


// ⬇️ [수정] 기존 placekitten/placedog 하드코딩 제거하고 props의 URL 사용
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
    // ✅ 내 메시지면 myAvatarUrl, 상대면 otherAvatarUrl 사용 (+ 폴백)
    img: mine ? (props.myAvatarUrl || FALLBACK_ME)
              : (props.otherAvatarUrl || FALLBACK_OTHER),
  }
}


function scrollToBottom() {
  const el = listRef.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}

async function getJSON(url) {
  const res = await fetch(url);
  let body = null;
  try { body = await res.json(); } catch { body = null; }
  if (!res.ok) {
    // 에러 객체에 상태/바디를 실어 올림
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

// 승인 상태 조회 (info만 신뢰)
async function checkApproved() {
  try {
    const info = await getJSON(`${props.baseUrl}/chat/rooms/${props.roomId}/info?userId=${props.myUserId}`);
    const st = info?.room?.chatroomStatus ?? null;
    roomStatus.value = st;
    allowed.value = (st === 'A');
  } catch (e) {
    allowed.value = false;
    // 기본은 입장 불가
    roomStatus.value = 'X';
    // 서버 코드 기준으로 세분화
    const code = e?.body?.code;
    if (code === 'NOT_APPROVED') {
      roomStatus.value = 'P';
    } else if (code === 'NOT_MEMBER') {
      roomStatus.value = 'X';
    } else if (e?.status === 404) {
      roomStatus.value = 'X';
    }
  } finally {
    checking.value = false;
  }
}

async function putJSON(url, body) {
  try {
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    // no-op: best-effort
  }
}

async function loadHistory(initial = false) {
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
    // 사용자 알림은 과도하게 띄우지 않음
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
  // WS
  if (stomp && connected.value) {
    try {
      stomp.publish({ destination: "/app/chat.read", body: JSON.stringify(payload) });
    } catch (e) {
      // no-op
    }
  }
  // REST 백업
  putJSON(`${props.baseUrl}/chat/rooms/${props.roomId}/read`, payload);
  // UI 즉시 반영(낙관적)
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
  // 전송 직전, 내가 본 마지막까지 읽음 처리
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
    debug: () => { /* no-op */ },
  });

  stomp.onConnect = () => {
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
      } catch (e) {
        // no-op: ignore malformed frame
      }
    });
    // 초기 히스토리
    loadHistory(true);
  };

  stomp.onStompError = () => { /* no-op */ };
  stomp.onWebSocketError = () => { /* no-op */ };

  try {
    stomp.activate();
  } catch (e) {
    // no-op: activation failed
  }
}

function disconnect() {
  try {
    if (stomp) stomp.deactivate();
  } catch (e) {
    // no-op: socket already closed
  }
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
