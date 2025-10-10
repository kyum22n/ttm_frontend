// src/store/pet.js
import petApi from "@/apis/petApi";

const pet = {
  namespaced: true,

  state: {
    list: [],         // 반려견 목록
    detail: null,     // {petId, petName, ...}
    randomList: [],   // 메인 피드용 랜덤 반려견 목록
    likes: {},        // 좋아요 상태
  },

  getters: {
    getList(state) {
      return state.list;
    },
    getDetail(state) {
      return state.detail;
    },
    getRandomList(state) {
      return state.randomList;
    },
    getLikes(state) {
      return state.likes;
    },
  },

  mutations: {
    setList(state, payload) {
      if (!payload) {
        state.list = [];
      } else {
        state.list = payload.pets ? payload.pets : payload;
      }
    },
    setDetail(state, payload) {
      if (!payload) {
        state.detail = null;
      } else {
        state.detail = payload.pet ? payload.pet : payload;
      }
    },
    setRandomList(state, payload) {
      state.randomList = payload || [];
    },
    setLikes(state, { petId, likes }) {
      state.likes = likes;
    },
    updatePetLikes(state, { petId, likeCount }) {
      // detail 업데이트
      if (state.detail && state.detail.petId === petId) {
        state.detail.petLikeCount = likeCount;
      }

      // 목록 업데이트
      const target = state.list.find((p) => p.petId === petId);
      if (target) {
        target.petLikeCount = likeCount;
      }

      // 랜덤 리스트도 동기화
      const randomPet = state.randomList.find((p) => p.petId === petId);
      if (randomPet) {
        randomPet.petLikeCount = likeCount;
      }
    },
  },

  actions: {
    // 목록
    async fetchList(context, userId) {
      const res = await petApi.findAllByUser(userId);

      const petsWithImages = (res.data.pets || res.data || []).map((pet) => ({
        ...pet,
        imageUrl: `http://localhost:8080/pet/image/${pet.petId}`,
      }));

      context.commit("setList", { pets: petsWithImages });
    },

    // 특정 펫 상세
    async fetchDetail(context, petId) {
      const res = await petApi.petFind(petId);
      context.commit("setDetail", res.data);
    },

    // 등록
    async register(context, pet) {
      const res = await petApi.register(pet);
      if (res.data && res.data.result === "success") {
        await context.dispatch("fetchList", pet.petUserId);
      }
    },

    // 수정
    async update(context, pet) {
      const res = await petApi.update(pet);
      if (res.data && res.data.pet) {
        context.commit("setDetail", res.data.pet);
      }
      await context.dispatch("fetchList", pet.petUserId);
    },

    // 삭제
    async remove(context, petId) {
      await petApi.remove(petId);
      const userId = context.rootGetters.getUser.userId;
      await context.dispatch("fetchList", userId);
    },

    // 좋아요 등록/취소
    async toggleLike(context, { userId, petId }) {
      try {
        const res = await petApi.petLike(userId, petId);
        if (res.data.result === "success") {
          const liked = res.data.liked;
          let newCount = 0;

          if (context.state.detail && context.state.detail.petId === petId) {
            newCount = context.state.detail.petLikeCount ?? 0;
          } else {
            const target = context.state.list.find((p) => p.petId === petId);
            newCount = target?.petLikeCount ?? 0;
          }

          newCount += liked ? 1 : -1;
          if (newCount < 0) newCount = 0;

          context.commit("updatePetLikes", { petId, likeCount: newCount });

          return res;
        }
      } catch (err) {
          console.error("좋아요 토글 실패:", err);
      }
    },

    // 좋아요 상태 불러오기
    async fetchPetLikeStatus(context, { userId, petId }) {
      const res = await petApi.getPetLikeStatus(userId, petId);
      return res.data.isLiked; // true / false
    },

    // 랜덤 펫 목록
    async fetchRandomList(context, limit = 7) {
      const res = await petApi.getRandomList(limit);

      const petsWithImages = res.data.pets.map((pet) => ({
        ...pet,
        userId: pet.petUserId,
        imageUrl: `http://localhost:8080/pet/image/${pet.petId}`,
      }));

      context.commit("setRandomList", petsWithImages);
    },
  },
};

export default pet;
