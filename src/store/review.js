import postApi from "@/apis/postApi";

const post = ({
  namespaced: true,

  state: {
    pageNo: 1,
    list: [],
    pager: null,
    detail: null,
    comments: [],
    tags: [],
    error: null,
    loadingList: false,
    loadingDetail: false,
  },

  getters: {
    getPageNo:     (s) => s.pageNo,
    getList:       (s) => s.list,
    getPager:      (s) => s.pager,
    getDetail:     (s) => s.detail,
    getComments:   (s) => s.comments,
    getTags:       (s) => s.tags,
    getError:      (s) => s.error,
    isLoadingList: (s) => s.loadingList,
    isLoadingDetail:(s) => s.loadingDetail,
  },

  mutations: {
    setPageNo(s, v){ s.pageNo = v; },
    setList(s, { posts = [], pager = null } = {}) { s.list = posts; s.pager = pager; },
    setDetail(s, { post = null, comments = [], tags = [] } = {}) {
      s.detail = post; s.comments = comments; if (tags?.length) s.tags = tags;
    },
    setTags(s, tags = []) { s.tags = tags; },
    setError(s, e){ s.error = typeof e === 'string' ? e : (e?.message || 'Unknown error'); },
    setLoadingList(s, v){ s.loadingList = v; },
    setLoadingDetail(s, v){ s.loadingDetail = v; },
  },

  actions: {
    // 목록
    async fetchList({ commit }, pageNo = 1) {
      commit("setPageNo", pageNo);
      commit("setLoadingList", true);
      commit("setError", null);
      try {
        const res = await postApi.getPostList(pageNo);
        // 백엔드가 { posts, pager } 형태라고 가정
        commit("setList", res.data);
        return res.data; // ⬅ 컴포넌트에서 이어받아 사용 가능
      } catch (err) {
        commit("setError", err?.response?.data?.message || '목록 조회 실패');
        throw err; // ⬅ 실패를 상위로 전달
      } finally {
        commit("setLoadingList", false);
      }
    },

    // 상세
    async fetchDetail({ commit }, postId) {
      commit("setLoadingDetail", true);
      commit("setError", null);
      try {
        const res = await postApi.postRead(postId);
        commit("setDetail", res.data);
        return res.data;
      } catch (err) {
        commit("setError", err?.response?.data?.message || '상세 조회 실패');
        throw err;
      } finally {
        commit("setLoadingDetail", false);
      }
    },

    // 작성
    async create({ dispatch }, formData) {
      const res = await postApi.postWrite(formData);
      const id = res.data?.postId;
      if (id) await dispatch("fetchDetail", id);
      return res.data;
    },

    // 수정
    async update({ dispatch }, { formData, imageMode = "append" }) {
      const res = await postApi.postUpdate(formData, imageMode);
      const id = res.data?.post?.postId || formData.get("postId");
      if (id) await dispatch("fetchDetail", Number(id));
      return res.data;
    },

    // 삭제
    async remove({ dispatch, state }, postId) {
      await postApi.postDelete(postId);
      return dispatch("fetchList", state.pageNo);
    },

    // 태그
    async fetchTags({ commit }) {
      const res = await postApi.getTagList();
      commit("setTags", res.data?.tags || []);
      return res.data?.tags || [];
    },

    async addTags(_, { postId, tagIds = [] }) {
      return Promise.all(tagIds.map(tagId => postApi.addPostTag({ postId, tagId })));
    },
    async deleteTags(_, { postId, tagIds = [] }) {
      return Promise.all(tagIds.map(tagId => postApi.deletePostTag({ postId, tagId })));
    },

    // 댓글
    async writeComment({ dispatch }, fd) {
      const postId = Number(fd.get("postId"));
      await postApi.commentWrite(fd);
      return dispatch("fetchDetail", postId);
    },
    async updateComment({ dispatch }, fd) {
      const postId = Number(fd.get("postId"));
      await postApi.commentUpdate(fd);
      return dispatch("fetchDetail", postId);
    },
    async deleteComment({ dispatch }, { commentId, postId }) {
      await postApi.commentDelete(commentId);
      return dispatch("fetchDetail", postId);
    },
  },
});

export default post;