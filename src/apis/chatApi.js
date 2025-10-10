// src/apis/chatApi.js
// 전역 axios(baseURL, Authorization 인터셉터) 설정이 이미 되어 있다는 가정
import axios from "axios";

// 내가 참여 중인 방 목록 (GET /chat/rooms/my?userId=)
export function listRooms({ userId }) {
  return axios.get("/chat/rooms/my", { params: { userId } });
}

// 1:1 방 보장(없으면 생성) (POST /chat/rooms/ensure?userA=&userB=&requestedBy=)
export function ensureRoom({ userA, userB, requestedBy }) {
  return axios.post("/chat/rooms/ensure", null, {
    params: { userA, userB, requestedBy },
  });
}

// 방 정보 (GET /chat/rooms/{roomId}/info?userId=)
export function getRoomInfo(roomId, userId) {
  return axios.get(`/chat/rooms/${roomId}/info`, { params: { userId } });
}

// 방 승인 (PUT /chat/rooms/{roomId}/approve?by=)
export function approveRoom(roomId, by) {
  return axios.put(`/chat/rooms/${roomId}/approve`, null, { params: { by } });
}

// 방 거절/닫기 (PUT /chat/rooms/{roomId}/reject?by=)
export function rejectRoom(roomId, by) {
  return axios.put(`/chat/rooms/${roomId}/reject`, null, { params: { by } });
}

// 메시지 페이지 조회 (GET /chat/rooms/{roomId}/messages?userId=&beforeMessageId=&limit=)
export function getMessages(roomId, { userId, beforeMessageId, limit = 50 } = {}) {
  const params = { userId, limit };
  if (beforeMessageId != null) params.beforeMessageId = beforeMessageId;
  return axios.get(`/chat/rooms/${roomId}/messages`, { params });
}

// 읽음 처리 (PUT /chat/rooms/{roomId}/read, body: { userId, upToMessageId })
export function markRead(roomId, { userId, upToMessageId = null }) {
  return axios.put(`/chat/rooms/${roomId}/read`, { userId, upToMessageId });
}

export default {
  listRooms,
  ensureRoom,
  getRoomInfo,
  approveRoom,
  rejectRoom,
  getMessages,
  markRead,
};
