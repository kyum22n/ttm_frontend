// src/store/walk.js
import walkApi from "@/apis/walkApi";

const walk = {
  namespaced: true,

  state: {
    oneOnOneList: [],
    receivedList: [],
    groupList: [],
    completedList: [],
  },

  getters: {
    getOneOnOneList(state) {
      return state.oneOnOneList;
    },
    getReceivedList(state) {
      return state.receivedList;
    },
    getGroupList(state) {
      return state.groupList;
    },
    getCompletedList(state) {
      return state.completedList;
    },
  },

  mutations: {
    setOneOnOneList(state, list) {
      state.oneOnOneList = list || [];
    },
    setReceivedList(state, list) {
      state.receivedList = list || [];
    },
    setGroupList(state, list) {
      state.groupList = list || [];
    },
    setCompletedList(state, list) {
      state.completedList = list || [];
    },
  },

  actions: {
    /** 내가 신청한 목록 + 그룹 신청 목록 */
    async fetchRequests(context, userId) {
      const [one, group] = await Promise.all([
        walkApi.getOneOnOneRequests(userId),
        walkApi.getGroupRequests(userId),
      ]);
      context.commit("setOneOnOneList", one.data.walkRequestList || []);
      context.commit("setGroupList", group.data.groupWalkRequestList || []);
    },

    /** 내가 받은 신청 목록 */
    async fetchReceived(context, userId) {
      const res = await walkApi.getReceivedRequests(userId);
      context.commit("setReceivedList", res.data.walkReceiveList || []);
    },

    /** 완료된 산책 목록 */
    async fetchCompleted(context, userId) {
      const res = await walkApi.getCompletedWalks(userId);
      context.commit("setCompletedList", res.data.walkList || []);
    },

    // 1:1 신청
    async apply(context, walkData) {
      return await walkApi.applyOneOnOne(walkData);
    },

    // 상태 변경 (승인/거절)
    async changeStatus(context, { requestOneId, rstatus, receiveUserId }) {
      return await walkApi.updateWalkStatus(
        requestOneId,
        rstatus,
        receiveUserId
      );
    },

    // 시작
    async start(context, { requestOneId, userId }) {
      return await walkApi.startWalk(requestOneId, userId);
    },

    // 종료
    async end(context, { requestOneId, userId }) {
      return await walkApi.endWalk(requestOneId, userId);
    },

    // 삭제
    async remove(context, { requestOneId, userId }) {
      return await walkApi.deleteWalk(requestOneId, userId);
    },
  },
};

export default walk;
