// src/store/post.js
import postApi from "@/apis/postApi";

const post = {
  namespaced: true,

  state: {
    pageNo: 1,
    list: [],
    pager: null,
    detail: null, // {postId, postTitle, ...}
    comments: [],
    tags: [],
    likes: {}, // 좋아요 상태
  },

  getters: {
    getPageNo(state) {
      return state.pageNo;
    },
    getList(state) {
      return state.list;
    },
    getPager(state) {
      return state.pager;
    },
    getDetail(state) {
      return state.detail;
    },
    getComments(state) {
      return state.comments;
    },
    getTags(state) {
      return state.tags;
    },
    getLikes(state) {
      return state.likes;
    },
  },

  mutations: {
    setPageNo(state, v) {
      state.pageNo = v;
    },
    setList(state, payload) {
      if (!payload) {
        state.list = [];
        state.pager = null;
      } else {
        state.list = payload.posts ? payload.posts : [];
        state.pager = payload.pager ? payload.pager : null;
      }
    },
    setDetail(state, payload) {
      if (!payload) {
        state.detail = null;
        state.comments = [];
        state.tags = [];
      } else {
        state.detail = payload.post ? payload.post : null;
        state.comments = payload.comments ? payload.comments : [];
        state.tags =
          payload.tags && payload.tags.length > 0 ? payload.tags : [];

        state.detail.images = payload.images || [];
      }
    },
    setTags(state, tags) {
      state.tags = tags || [];
    },
    setLikes(state, { postId, likes }) {
      state.likes = likes;
    },
    updatePostLikes(state, { postId, likeCount }) {
      // detail 업데이트
      if (state.detail && state.detail.postId === postId) {
        state.detail.postLikeCount = likeCount;
      }

      // 목록 업데이트
      const target = state.loist.find((p) => p.postId === postId);
      if (target) {
        target.postLikeCount = likeCount;
      }
    },
  },

  actions: {
    // 목록
    async fetchList(context, pageNo = 1) {
      context.commit("setPageNo", pageNo);
      const res = await postApi.getPostList(pageNo);

      const postsWithImages = res.data.posts.map((post) => ({
        ...post,
        thumbnailUrl: `http://localhost:8080/post/image/${post.postId}`,
      }));

      context.commit("setList", {
        posts: postsWithImages,
        pager: res.data.pager,
      });
    },

    // 사용자 게시물 목록
    async fetchUserPostList(context, { userId }) {
      const res = await postApi.getUserPost(userId);

      const postsWithImages = res.data.posts.map((post) => ({
        ...post,
        thumbnailUrl: `http://localhost:8080/post/image/${post.postId}`,
      }));

      context.commit("setList", { posts: postsWithImages, pager: null });
    },

    // 상세
    async fetchDetail(context, postId) {
      const res = await postApi.postDetail(postId);
      context.commit("setDetail", res.data);
    },

    // 작성
    async create(context, post) {
      const res = await postApi.postWrite(post);
      if (res.data && res.data.postId) {
        await context.dispatch("fetchDetail", res.data.postId);
        return res.data;
      }
    },

    // 수정
    async update(context, payload) {
      const res = await postApi.postUpdate(payload.formData, payload.imageMode);
      let id = null;
      if (res.data && res.data.post && res.data.post.postId) {
        id = res.data.post.postId;
      } else {
        id = payload.formData.get("postId");
      }
      if (id) {
        await context.dispatch("fetchDetail", Number(id));
      }
    },

    // 삭제
    async remove(context, postId) {
      await postApi.postDelete(postId);
      await context.dispatch("fetchList", context.state.pageNo);
    },

    // 태그 전체 조회
    async fetchTags(context) {
      const res = await postApi.getTagList();
      if (res.data && res.data.tags) {
        context.commit("setTags", res.data.tags);
      }
    },

    // 태그 연결
    addTags(context, payload) {
      const promises = payload.tagIds.map((tagId) =>
        postApi.addPostTag({ postId: payload.postId, tagId })
      );
      return Promise.all(promises);
    },

    // 태그 삭제
    deleteTags(context, payload) {
      const promises = payload.tagIds.map((tagId) =>
        postApi.deletePostTag({ postId: payload.postId, tagId })
      );
      return Promise.all(promises);
    },

    // 댓글 작성
    async writeComment(context, payload) {
      await postApi.commentWrite(payload);
      await context.dispatch("fetchDetail", payload.cpostId);
    },

    // 댓글 수정
    async updateComment(context, payload) {
      await postApi.commentUpdate(payload);
      await context.dispatch("fetchDetail", payload.cpostId);
    },

    // 댓글 삭제
    async deleteComment(context, payload) {
      await postApi.commentDelete(payload.commentId);
      await context.dispatch("fetchDetail", payload.postId);
    },

    // 좋아요 등록
    async likePost(context, { userId, postId }) {
      const res = await postApi.postLike(userId, postId);
      if (res.data.result === "success") {
        let newCount = 0;
        if (
          context.state.detail &&
          context.state.detail.postLikeCount != null
        ) {
          newCount = context.state.detail.postLikeCount + 1;
        } else {
          newCount = 1;
        }
        context.commit("updatePostLikes", { postId, likeCount: newCount });
      }
    },

    // 좋아요 취소
    async likePostCancel(context, { userId, postId }) {
      const res = await postApi.postLikeCancel(userId, postId);
      if (res.data.result === "success") {
        let newCount = 0;
        if (
          context.state.detail &&
          context.state.detail.postLikeCount != null
        ) {
          newCount = context.state.detail.postLikeCount - 1;

          if (newCount < 0) {
            newCount = 0;
          }
        } else {
          newCount = 0;
        }
        context.commit("updatePostLikes", { postId, likeCount: newCount });
      }
    },

    // 그룹 산책 모집글 신청 / 승인 / 거절 등
    async groupwalkStatus(context, { status, participate }) {
      return await postApi.groupwalkStatus(status, participate);
    },

    // 그룹 산책 모집/신청 상태
    async groupwalkMarkNow(context, { postId, code }) {
      return await postApi.groupwalkMarkNow(postId, code);
    },
  },
};

export default post;
