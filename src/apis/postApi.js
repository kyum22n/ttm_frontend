// src/api/postApi.js
import axios from "axios";

/** =========================
 *  Posts
 *  ========================= */

/** 전체 게시물 목록 (페이징) */
function getPostList(pageNo = 1) {
  return axios.get("/post/list", { params: { pageNo } });
}

/** 게시물 작성 (multipart/form-data) */
function postWrite(formData) {
  // formData: postTitle, postContent, isRequest("Y"/"N"), postUserId,
  //           postAttach(대표 1장, 선택), postAttaches(여러 장)
  return axios.post("/post/write", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/** 게시물 상세 */
function postRead(postId) {
  return axios.get("/post/detail", { params: { postId } });
}

/** 게시물 수정 (imageMode: append | replace, multipart/form-data) */
function postUpdate(formData, imageMode = "append") {
  return axios.put("/post/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    params: { imageMode },
  });
}

/** 게시물 삭제 */
function postDelete(postId) {
  return axios.delete("/post/delete", { params: { postId } });
}

/** =========================
 *  Comments
 *  ========================= */

/** 댓글 작성 (폼 바인딩) */
function commentWrite(formData) {
  // formData: { postId, userId, commentContent, ... } DTO에 맞춰 세팅
  return axios.post("/post/comment-write", formData);
}

/** 댓글 수정 (폼 바인딩) */
function commentUpdate(formData) {
  // formData: { commentId, postId, userId, commentContent, ... }
  return axios.put("/post/comment-update", formData);
}

/** 댓글 삭제 */
function commentDelete(commentId) {
  return axios.delete("/post/comment-delete", { params: { commentId } });
}

/** =========================
 *  Tags
 *  ========================= */

/** 전체 태그 목록 */
function getTagList() {
  return axios.get("/post/tags");
}

/** 게시물에 태그 달기 (JSON) */
function addPostTag(postTag /* { postId, tagId } */) {
  return axios.post("/post/add-tag", postTag);
}

/** 게시물 태그 삭제 (JSON) */
function deletePostTag(postTag /* { postId, tagId } */) {
  return axios.delete("/post/delete-tag", { data: postTag });
}

/** =========================
 *  Group Walk
 *  ========================= */

/** 산책 모집글만 목록 */
function groupwalkRecruitmentList() {
  return axios.get("/post/groupwalk/recruitment-list");
}

/** 산책 완료된 글만 목록 */
function groupwalkEndedList() {
  return axios.get("/post/groupwalk/ended-list");
}

/** 산책 신청 (JSON) */
function groupwalkApply(participate /* { postId, userId, ... } */) {
  return axios.post("/post/groupwalk/apply", participate);
}

/** 승인 (JSON) */
function groupwalkApprove({ postId, userId }) {
  return axios.put("/post/groupwalk/approve", { postId, userId });
}

/** 거절 (JSON) */
function groupwalkReject({ postId, userId }) {
  return axios.put("/post/groupwalk/reject", { postId, userId });
}

/** 완료표시 (JSON) */
function groupwalkComplete({ postId, userId }) {
  return axios.put("/post/groupwalk/complete", { postId, userId });
}

/** 신청 취소 (JSON body) */
function groupwalkCancel({ postId, userId }) {
  return axios.delete("/post/groupwalk/cancel", { data: { postId, userId } });
}

/** 대기(P) 참가자 목록 */
function groupwalkPendingParticipants(postId) {
  return axios.get(`/post/groupwalk/${postId}/participants/pending`);
}

/** 승인(A) 참가자 목록 */
function groupwalkApprovedParticipants(postId) {
  return axios.get(`/post/groupwalk/${postId}/participants/approved`);
}

/** 상태 플래그(now) 변경 (code: 1=모집마감, 2=시작, 3=종료) */
function groupwalkMarkNow(postId, code) {
  return axios.put("/post/groupwalk/now", null, { params: { postId, code } });
}

/** =========================
 *  exports
 *  ========================= */
export default {
  // Posts
  getPostList,
  postWrite,
  postRead,
  postUpdate,
  postDelete,
  // Comments
  commentWrite,
  commentUpdate,
  commentDelete,
  // Tags
  getTagList,
  addPostTag,
  deletePostTag,
  // Group Walk
  groupwalkRecruitmentList,
  groupwalkEndedList,
  groupwalkApply,
  groupwalkApprove,
  groupwalkReject,
  groupwalkComplete,
  groupwalkCancel,
  groupwalkPendingParticipants,
  groupwalkApprovedParticipants,
  groupwalkMarkNow,
};
