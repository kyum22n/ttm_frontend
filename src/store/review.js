import reviewApi from '@/apis/reviewApi'

const review = ({
  namespaced: true,

  state: {
    list: [],        // 리뷰 배열
    count: 0,
    message: '',
    loading: false,
    error: null,
    tags: [],        // (옵션) 태그 전용 API 쓸 때
  },

  getters: {
    reviews: (s) => s.list,
    count:   (s) => s.count,
    message: (s) => s.message,
    loading: (s) => s.loading,
    error:   (s) => s.error,
    tags:    (s) => s.tags,
  },

  mutations: {
    setLoading(s, v){ s.loading = v },
    setError(s, e){ s.error = e },
    setData(s, { reviews = [], count = 0, message = '' } = {}) {
      s.list = reviews; s.count = count; s.message = message;
    },
    setTags(s, tags = []) { s.tags = tags },
    clear(s){ s.list = []; s.count = 0; s.message = ''; s.error = null },
  },

  actions: {
    // 받은 리뷰 전체 조회
    async fetchReceived({ commit }, userId) {
      commit('setLoading', true); commit('setError', null);
      try {
        const res = await reviewApi.getReceivedReviews(userId)
        const body = res.data ?? {}
        const reviews = Array.isArray(body.data) ? body.data : []
        const count   = typeof body.count === 'number' ? body.count : reviews.length
        const message = body.message ?? ''
        commit('setData', { reviews, count, message })
        return { reviews, count, message }
      } catch (e) {
        const msg = e?.response?.data?.message || '리뷰 조회 실패'
        commit('setError', msg)
        throw e
      } finally {
        commit('setLoading', false)
      }
    },

    // (옵션) 태그만 조회하는 전용 API 있을 때
    async fetchTags({ commit }, userId) {
      const res = await reviewApi.getReceivedReviewTags(userId)
      const tags = Array.isArray(res.data?.tags) ? res.data.tags : []
      commit('setTags', tags)
      return tags
    },
  },
})

export default review;