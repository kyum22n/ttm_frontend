// src/apis/walkApi.js
import axios from "axios";

/** =========================
 *  Walks (1:1 & Group)
 *  ========================= */

/** 1:1 산책 신청받은 목록 불러오기 */
function getReceivedRequests(userId) {
  return axios.get("/walk/apply/receive-list", {
    params: { receiveUserId: userId },
  });
}

/** 1:1 산책 신청한 목록 불러오기 */
function getOneOnOneRequests(userId) {
  return axios.get("/walk/apply/request-list", {
    params: { requestUserId: userId },
  });
}

/** 그룹 산책 신청한 목록 불러오기 
 * (※ 백엔드 엔드포인트에 맞게 수정 가능)
 */
function getGroupRequests(userId) {
  return axios.get("/post/groupwalk/request-list", {
    params: { userId },
  });
}



/** 1:1 완료된 산책 내역 불러오기 */
function getCompletedWalks(userId) {
  return axios.get("/walk/list", {
    params: { userId },
  });
}

/** 1:1 산책 신청 */
function applyOneOnOne(walk) {
  return axios.post("/walk/apply", walk);
}

/** 1:1 산책 상태 변경 (승인/거절 등) */
function updateWalkStatus(requestOneId, rstatus, receiveUserId) {
  return axios.put("/walk/apply/status", null, {
    params: { requestOneId, rstatus, receiveUserId },
  });
}

/** 1:1 산책 시작 */
function startWalk(requestOneId, userId) {
  return axios.put("/walk/start", null, {
    params: { requestOneId, userId },
  });
}

/** 1:1 산책 종료 */
function endWalk(requestOneId, userId) {
  return axios.put("/walk/end", null, {
    params: { requestOneId, userId },
  });
}

/** 1:1 산책 기록 삭제 */
function deleteWalk(requestOneId, userId) {
  return axios.delete("/walk/delete", {
    params: { requestOneId, userId },
  });
}

export default {
  getOneOnOneRequests,
  getGroupRequests,
  getReceivedRequests,
  getCompletedWalks,
  applyOneOnOne,
  updateWalkStatus,
  startWalk,
  endWalk,
  deleteWalk,
};
