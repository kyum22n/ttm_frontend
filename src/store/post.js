// src/store/modules/posts.js
import postApi from "@/apis/postApi";

const post = ({
  namespaced: true,

  state: {
    pageNo: 1,
    list: [],
    pager: null,
    detail: null,     // {postId, postTitle, ...}
    comments: [],     // 상세 댓글 목록
    tags: [],         // 전체 태그 목록(옵션)
    error: null,
  },

  getters: {
    getPageNo(state)       { return state.pageNo; },
    getList(state)         { return state.list; },
    getPager(state)        { return state.pager; },
    getDetail(state)       { return state.detail; },
    getComments(state)     { return state.comments; },
    getTags(state)         { return state.tags; },
    getError(state)        { return state.error; },
  },

  mutations: {
    setPageNo(state, v)          { state.pageNo = v; },
    setList(state, { posts = [], pager = null } = {}) {
      state.list  = posts;
      state.pager = pager;
    },
    setDetail(state, { post = null, comments = [], tags = [] } = {}) {
      state.detail   = post;
      state.comments = comments;
      // 상세 API가 tags를 주면 업데이트(옵션)
      if (tags && tags.length) state.tags = tags;
    },
    setTags(state, tags = [])    { state.tags = tags; },
    setError(state, e)           { state.error = e; },
  },

  actions: {
    // 목록
    fetchList({ commit }, pageNo = 1) {
      commit("setPageNo", pageNo);
      return postApi.getPostList(pageNo)
        .then(res => commit("setList", res.data))
        .catch(err => commit("setError", err));
    },

    // 상세
    fetchDetail({ commit }, postId) {
      return postApi.postRead(postId)
        .then(res => commit("setDetail", res.data))
        .catch(err => commit("setError", err));
    },

    // 작성 (FormData는 컴포넌트/상위에서 조립해서 넘겨줘)
    create({ dispatch }, formData) {
      return postApi.postWrite(formData)
        .then(res => {
          const id = res.data?.postId;
          if (id) return dispatch("fetchDetail", id);
        });
    },

    // 수정 (imageMode: 'append' | 'replace')
    update({ dispatch }, { formData, imageMode = "append" }) {
      return postApi.postUpdate(formData, imageMode)
        .then(res => {
          const id = res.data?.post?.postId || formData.get("postId");
          if (id) return dispatch("fetchDetail", Number(id));
        });
    },

    // 삭제
    remove({ dispatch, state }, postId) {
      return postApi.postDelete(postId)
        .then(() => dispatch("fetchList", state.pageNo));
    },

    // 전체 태그 조회
    fetchTags({ commit }) {
      return postApi.getTagList()
        .then(res => commit("setTags", res.data?.tags || []));
    },

    // 태그 연결/삭제 (JSON)
    addTags(_, { postId, tagIds = [] }) {
      return Promise.all(tagIds.map(tagId => postApi.addPostTag({ postId, tagId })));
    },
    deleteTags(_, { postId, tagIds = [] }) {
      return Promise.all(tagIds.map(tagId => postApi.deletePostTag({ postId, tagId })));
    },

    // 댓글 작성/수정/삭제 (폼 바인딩)
    writeComment({ dispatch }, fd /* FormData: postId, userId, commentContent... */) {
      const postId = Number(fd.get("postId"));
      return postApi.commentWrite(fd).then(() => dispatch("fetchDetail", postId));
    },
    updateComment({ dispatch }, fd /* FormData: commentId, postId ... */) {
      const postId = Number(fd.get("postId"));
      return postApi.commentUpdate(fd).then(() => dispatch("fetchDetail", postId));
    },
    deleteComment({ dispatch }, { commentId, postId }) {
      return postApi.commentDelete(commentId).then(() => dispatch("fetchDetail", postId));
    },
  },
});

export default post;
