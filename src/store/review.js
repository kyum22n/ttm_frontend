// src/store/modules/review.js
import reviewApi from '@/apis/reviewApi'

const review = ({
  namespaced: true,

  state: {
    list: [],        // 받은 리뷰 목록
    count: 0,        // 리뷰 개수
    message: '',     // 서버 메시지
    loading: false,  // 로딩 상태
    error: null,     // 에러 메시지
    tags: [],        // 리뷰 태그 목록 (고정값)
  },

  getters: {
    reviews: function (state) { return state.list },
    count:   function (state) { return state.count },
    message: function (state) { return state.message },
    loading: function (state) { return state.loading },
    error:   function (state) { return state.error },
    tags:    function (state) { return state.tags },
  },

  mutations: {
    setLoading: function (state, value) {
      state.loading = value
    },

    setError: function (state, error) {
      state.error = error
    },

    setData: function (state, payload) {
      // payload가 없을 수도 있으므로 안전하게 처리
      if (!payload) {
        state.list = []
        state.count = 0
        state.message = ''
        return
      }

      if (Array.isArray(payload.reviews)) {
        state.list = payload.reviews
      } else {
        state.list = []
      }

      if (typeof payload.count === 'number') {
        state.count = payload.count
      } else {
        state.count = 0
      }

      if (typeof payload.message === 'string') {
        state.message = payload.message
      } else {
        state.message = ''
      }
    },

    addReview: function (state, newReview) {
      if (newReview) {
        state.list.unshift(newReview)
        state.count = state.count + 1
      }
    },

    setTags: function (state, tags) {
      if (Array.isArray(tags)) {
        state.tags = tags
      } else {
        state.tags = []
      }
    },

    clear: function (state) {
      state.list = []
      state.count = 0
      state.message = ''
      state.error = null
    },
  },

  actions: {
    /** 받은 리뷰 전체 조회 */
    async fetchReceived({ commit }, userId) {
      commit('setLoading', true)
      commit('setError', null)

      try {
        const res = await reviewApi.getReceivedReviews(userId)
        let body = {}

        if (res && res.data) {
          body = res.data
        }

        let reviews = []
        if (body && Array.isArray(body.data)) {
          reviews = body.data
        }

        let count = 0
        if (body && typeof body.count === 'number') {
          count = body.count
        } else if (reviews && Array.isArray(reviews)) {
          count = reviews.length
        }

        let message = ''
        if (body && typeof body.message === 'string') {
          message = body.message
        }

        commit('setData', { reviews: reviews, count: count, message: message })

        return { reviews: reviews, count: count, message: message }

      } catch (e) {
        let msg = '리뷰 조회 실패'

        if (e && e.response && e.response.data && e.response.data.message) {
          msg = e.response.data.message
        }

        commit('setError', msg)
        throw e

      } finally {
        commit('setLoading', false)
      }
    },

    /** 리뷰 작성 (단일 태그) */
    async create({ commit }, reviewData) {
      commit('setLoading', true)
      commit('setError', null)

      try {
        const res = await reviewApi.createReview(reviewData)

        let newReview = null
        if (res && res.data && res.data.review) {
          newReview = res.data.review
        }

        if (newReview) {
          commit('addReview', newReview)
        }

        return newReview

      } catch (e) {
        let msg = '리뷰 등록 실패'

        if (e && e.response && e.response.data && e.response.data.message) {
          msg = e.response.data.message
        }

        commit('setError', msg)
        throw e

      } finally {
        commit('setLoading', false)
      }
    },

    /** 리뷰 태그 목록 조회 (고정값) */
    async fetchTags({ commit }) {
      commit('setLoading', true)
      commit('setError', null)

      try {
        const res = await reviewApi.getReviewTags()
        let tags = []

        if (res && res.data && Array.isArray(res.data.tags)) {
          tags = res.data.tags
        }

        commit('setTags', tags)
        return tags

      } catch (e) {
        let msg = '리뷰 태그 조회 실패'

        if (e && e.response && e.response.data && e.response.data.message) {
          msg = e.response.data.message
        }

        commit('setError', msg)
        throw e

      } finally {
        commit('setLoading', false)
      }
    },
  },
})

export default review
