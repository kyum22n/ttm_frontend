// src/store/post.js
import postApi from "@/apis/postApi";

const post = {
  namespaced: true,

  state: {
    pageNo: 1,
    list: [],
    pager: null,
    detail: null,   // {postId, postTitle, ...}
    comments: [],
    tags: [],
    error: null
  },

  getters: {
    getPageNo: function(state) {
      return state.pageNo;
    },
    getList: function(state) {
      return state.list;
    },
    getPager: function(state) {
      return state.pager;
    },
    getDetail: function(state) {
      return state.detail;
    },
    getComments: function(state) {
      return state.comments;
    },
    getTags: function(state) {
      return state.tags;
    },
    getError: function(state) {
      return state.error;
    }
  },

  mutations: {
    setPageNo: function(state, v) {
      state.pageNo = v;
    },
    setList: function(state, payload) {
      // payload가 없는 경우 대비
      if (!payload) {
        state.list = [];
        state.pager = null;
      } else {
        state.list = payload.posts ? payload.posts : [];
        state.pager = payload.pager ? payload.pager : null;
      }
    },
    setDetail: function(state, payload) {
      if (!payload) {
        state.detail = null;
        state.comments = [];
        state.tags = [];
      } else {
        state.detail = payload.post ? payload.post : null;
        state.comments = payload.comments ? payload.comments : [];
        if (payload.tags && payload.tags.length > 0) {
          state.tags = payload.tags;
        }
      }
    },
    setTags: function(state, tags) {
      if (!tags) {
        state.tags = [];
      } else {
        state.tags = tags;
      }
    },
    setError: function(state, e) {
      state.error = e;
    }
  },

  actions: {
    // 목록
    fetchList: function(context, pageNo) {
      if (!pageNo) {
        pageNo = 1;
      }
      context.commit("setPageNo", pageNo);

      return postApi.getPostList(pageNo)
        .then(function(res) {
          context.commit("setList", res.data);
        })
        .catch(function(err) {
          context.commit("setError", err);
        });
    },

    // 상세
    fetchDetail: function(context, postId) {
      return postApi.postDetail(postId)
        .then(function(res) {
          context.commit("setDetail", res.data);
        })
        .catch(function(err) {
          context.commit("setError", err);
        });
    },

    // 작성
    create: function(context, formData) {
      return postApi.postWrite(formData)
        .then(function(res) {
          if (res.data && res.data.postId) {
            return context.dispatch("fetchDetail", res.data.postId);
          }
        })
        .catch(function(err) {
          context.commit("setError", err);
        });
    },

    // 수정
    update: function(context, payload) {
      return postApi.postUpdate(payload.formData, payload.imageMode)
        .then(function(res) {
          var id = null;
          if (res.data && res.data.post && res.data.post.postId) {
            id = res.data.post.postId;
          } else {
            id = payload.formData.get("postId");
          }
          if (id) {
            return context.dispatch("fetchDetail", Number(id));
          }
        })
        .catch(function(err) {
          context.commit("setError", err);
        });
    },

    // 삭제
    remove: function(context, postId) {
      return postApi.postDelete(postId)
        .then(function() {
          return context.dispatch("fetchList", context.state.pageNo);
        })
        .catch(function(err) {
          context.commit("setError", err);
        });
    },

    // 태그 전체 조회
    fetchTags: function(context) {
      return postApi.getTagList()
        .then(function(res) {
          if (res.data && res.data.tags) {
            context.commit("setTags", res.data.tags);
          }
        })
        .catch(function(err) {
          context.commit("setError", err);
        });
    },

    // 태그 연결
    addTags: function(context, payload) {
      var promises = [];
      for (var i = 0; i < payload.tagIds.length; i++) {
        var tagId = payload.tagIds[i];
        promises.push(postApi.addPostTag({ postId: payload.postId, tagId: tagId }));
      }
      return Promise.all(promises);
    },

    // 태그 삭제
    deleteTags: function(context, payload) {
      var promises = [];
      for (var i = 0; i < payload.tagIds.length; i++) {
        var tagId = payload.tagIds[i];
        promises.push(postApi.deletePostTag({ postId: payload.postId, tagId: tagId }));
      }
      return Promise.all(promises);
    },

    // 댓글 작성
    writeComment: function(context, payload) {
      return postApi.commentWrite(payload)
        .then(function() {
          return context.dispatch("fetchDetail", payload.cpostId);
        })
        .catch(function(err) {
          context.commit("setError", err);
        });
    },

    // 댓글 수정
    updateComment: function(context, payload) {
      return postApi.commentUpdate(payload)
        .then(function() {
          return context.dispatch("fetchDetail", payload.cpostId);
        })
        .catch(function(err) {
          context.commit("setError", err);
        });
    },

    // 댓글 삭제
    deleteComment: function(context, payload) {
      return postApi.commentDelete(payload.commentId)
        .then(function() {
          return context.dispatch("fetchDetail", payload.postId);
        })
        .catch(function(err) {
          context.commit("setError", err);
        });
    }
  }
};

export default post;
