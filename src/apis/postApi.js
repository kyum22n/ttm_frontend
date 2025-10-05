// src/api/postApi.js
import axios from "axios";

    /** =========================
     *  Posts
     *  ========================= */

    /** 전체 게시물 목록 (페이징) */
    function getPostList(pageNo = 1) {
        return axios.get("/post/list", { params: { pageNo } });
    }

    /** 사용자 게시물 목록 */    
    function getUserPost(userId) {
        return axios.get(`/post/${userId}/posts`);
    }

    /** 게시물 작성 (multipart/form-data) */
    function postWrite(post) {
        const formData = new FormData();

        // 일반 필드
        for (const key in post) {
            if (post[key] != null && key !== "postAttach" && key !== "postAttaches") {
                formData.append(key, post[key]);
            }
        }

        // 대표 이미지
        if (post.postAttach) {
            formData.append("postAttach", post.postAttach);
        }

        // 첨부 이미지 여러 장
        if (post.postAttaches && Array.isArray(post.postAttaches)) {
            post.postAttaches.forEach((file) => {
                if (file) formData.append("postAttaches", file);
            });
        }

        return axios.post("/post/write", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }

    /** 게시물 상세 */
    function postDetail(postId) {
        return axios.get("/post/detail", { params: { postId } });
    }
    
    /** 게시물 이미지 */
    function getPostImage(postId) {
        return `/post/image/${postId}`;
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

    /** 댓글 작성 */
    function commentWrite({ cpostId, cwriter, commentContent }) {
        return axios.post("/post/comment-write", {
            cpostId,
            cwriter,
            commentContent
        });
    }
    
    /** 댓글 수정 */
    function commentUpdate({ commentId, cpostId, cwriter, commentContent }) {
        return axios.put("/post/comment-update", {
            commentId,
            cpostId,
            cwriter,
            commentContent
        });
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
    function addPostTag({ postId, tagId }) {
        return axios.post("/post/add-tag", {
            postId, tagId
        });
    }
    
    /** 게시물 태그 삭제 (JSON) */
    function deletePostTag({ postId, tagId }) {
        return axios.delete("/post/delete-tag", { 
            data: { postId, tagId }
        });
    }
    
    /** =========================
     *  Likes
     *  ========================= */
    /** 좋아요 등록 */
    function postLike(userId, postId) {
        return axios.post("/like/post-like", null, {
            params: {userId, postId}
        });
    }

    /** 좋아요 취소 */
    function postLikeCancel(userId, postId) {
        return axios.delete("/like/post-like/cancel", {
            params: {userId, postId}
        });
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

    /** 산책 신청 처리 상태 변경*/
    function groupwalkStatus(status, participate) {
        return axios.post(`/post/groupwalk/${status}`, participate);
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
        return axios.put("/post/groupwalk/now", null, { 
            params: { postId, code }
        });
    }

export default {
    getPostList,
    getUserPost,
    postWrite,
    postDetail,
    getPostImage,
    postUpdate,
    postDelete,
    commentWrite,
    commentUpdate,
    commentDelete,
    getTagList,
    addPostTag,
    deletePostTag,
    postLike,
    postLikeCancel,
    groupwalkRecruitmentList,
    groupwalkEndedList,
    groupwalkStatus,
    groupwalkPendingParticipants,
    groupwalkApprovedParticipants,
    groupwalkMarkNow
};
