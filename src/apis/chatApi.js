// src/api/chatApi.js
import apiRequest from "@/api/apiRequest";

// 내가 참여 중인 방 목록 (백엔드: GET /chat/rooms/my?userId=)
export function listRooms({ userId }) {
  return apiRequest("get", "/chat/rooms/my", null, { userId });
}

// 1:1 방 보장(없으면 생성) (백엔드: POST /chat/rooms/ensure?userA=&userB=&requestedBy=)
export function ensureRoom({ userA, userB, requestedBy }) {
  return apiRequest("post", "/chat/rooms/ensure", null, { userA, userB, requestedBy });
}

// 방 정보 (백엔드: GET /chat/rooms/{roomId}/info?userId=)
export function getRoomInfo(roomId, userId) {
  return apiRequest("get", `/chat/rooms/${roomId}/info`, null, { userId });
}

// 방 승인 (백엔드: PUT /chat/rooms/{roomId}/approve?by=)
export function approveRoom(roomId, by) {
  return apiRequest("put", `/chat/rooms/${roomId}/approve`, null, { by });
}

// 방 거절/닫기 (백엔드: PUT /chat/rooms/{roomId}/reject?by=)
export function rejectRoom(roomId, by) {
  return apiRequest("put", `/chat/rooms/${roomId}/reject`, null, { by });
}

// 메시지 페이지 조회 (백엔드: GET /chat/rooms/{roomId}/messages?userId=&beforeMessageId=&limit=)
export function getMessages(roomId, { userId, beforeMessageId, limit = 50 } = {}) {
  const params = { userId, limit };
  if (beforeMessageId != null) params.beforeMessageId = beforeMessageId;
  return apiRequest("get", `/chat/rooms/${roomId}/messages`, null, params);
}

// 읽음 처리 (백엔드: PUT /chat/rooms/{roomId}/read, body: { userId, upToMessageId })
export function markRead(roomId, { userId, upToMessageId = null }) {
  return apiRequest("put", `/chat/rooms/${roomId}/read`, { userId, upToMessageId });
}

// (선택) STOMP용 엔드포인트/토픽은 컨트롤러 주석대로 사용
export function sseUrl() {
  return `/chat/stream`;
}

export function wsUrl() {
  const proto = location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://${location.host}/chat/ws`;
}

export default {
  listRooms,
  ensureRoom,
  getRoomInfo,
  approveRoom,
  rejectRoom,
  getMessages,
  markRead,
  sseUrl,
  wsUrl,
};
