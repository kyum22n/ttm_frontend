<template>
  <div class="container my-5" v-if="post">
    <div class="row g-4">
      <!-- ===== 왼쪽: 이미지 슬라이드 ===== -->
      <div class="col-md-5">
        <div id="postCarousel" class="carousel slide shadow" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div
              v-for="(img, i) in post.images"
              :key="i"
              class="carousel-item"
              :class="{ active: i === 0 }"
            >
              <img :src="img" class="d-block w-100 rounded" alt="게시물 이미지" />
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#postCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#postCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>

      <!-- ===== 가운데: 게시글 + 댓글 ===== -->
      <div class="col-md-5">
        <!-- 게시글 카드 -->
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <!-- 작성자 정보 -->
            <div class="d-flex align-items-center mb-3">
              <img :src="post.authorImg" class="rounded-circle me-2" width="40" height="40" />
              <div>
                <strong>{{ post.authorName }}</strong>
                <div class="text-muted small">{{ post.createdAt }}</div>
              </div>
            </div>

            <!-- 본문 -->
            <p class="mb-2">{{ post.postContent }}</p>

            <!-- 태그 -->
            <div class="mb-3">
              <span v-for="(tag, i) in tags" :key="i" class="badge bg-primary me-1">
                {{ tag.tagName }}
              </span>
            </div>

            <!-- 좋아요 -->
            <div class="d-flex align-items-center">
              <button class="btn btn-outline-danger btn-sm me-2" @click="toggleLike">
                <i class="bi" :class="liked ? 'bi-heart-fill' : 'bi-heart'"></i>
              </button>
              <span>{{ post.postLikeCount }} Likes</span>
            </div>
          </div>
        </div>

        <!-- 댓글 카드 -->
        <div class="card shadow-sm">
          <div class="card-body">
            <!-- 댓글 작성 -->
            <div class="input-group mb-3">
              <input v-model="newComment" type="text" class="form-control" placeholder="댓글을 작성해주세요" />
              <button class="btn btn-outline-secondary" @click="addComment">작성</button>
            </div>

            <!-- 댓글 목록 -->
            <button @click="reviewCreate()">리뷰 쓰기(임시위치)</button>
            <ul class="list-group list-group-flush">
              <li
                v-for="(c, i) in comments"
                :key="i"
                class="list-group-item d-flex align-items-start"
              >
                <img :src="c.profileImg || 'https://placekitten.com/32/32'" class="rounded-circle me-2" width="32" height="32" />
                <div>
                  <strong>{{ c.cwriter }}</strong>: {{ c.commentContent }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- ===== 오른쪽: 작성자 프로필 + 피드 ===== -->
      <div class="col-md-2">
        <div class="card shadow-sm text-center">
          <div class="card-body">
            <img :src="post.authorImg" class="rounded-circle mb-2" width="60" height="60" />
            <h6 class="card-title">{{ post.authorName }}</h6>
            <router-link :to="`/Profile/OtherProfile/${post.postUserId}`" class="btn btn-outline-dark btn-sm mb-3">프로필 놀러가기</router-link>

            <hr />
            <h6 class="fw-bold mb-2">작성자 피드</h6>
            <div class="d-flex flex-column gap-2">
              <img
                v-for="(img, i) in post.authorFeed || []"
                :key="i"
                :src="img"
                class="img-thumbnail"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

// 임시 리뷰쓰기 기능 임포트
import reviewApi from '@/apis/reviewApi'

const store = useStore();
const route = useRoute();

const liked = ref(false);
const newComment = ref("");
const userId = 1;

const post = computed(() => store.state.post.detail);
const comments = computed(() => store.state.post.comments);
const tags = computed(() => store.state.post.tags);

onMounted(() => {
  const id = route.params.id;
  if (id) {
    store.dispatch("post/fetchDetail", id);
  }
});

async function toggleLike() {
  if (!post.value) return;
  if (!liked.value) {
    await store.dispatch("post/likePost", { userId, postId: post.value.postId });
  } else {
    await store.dispatch("post/likePostCancel", { userId, postId: post.value.postId });
  }
  liked.value = !liked.value;
}

async function addComment() {
  if (!newComment.value.trim()) return;
  const payload = {
    cpostId: post.value.postId,
    cwriter: 1, // TODO: 로그인 사용자 ID
    commentContent: newComment.value,
  };
  await store.dispatch("post/writeComment", payload);
  newComment.value = "";
}
////////////////////////////////////////////////////////////////////////////////////////////
// 리뷰 작성 스크립트(임시 위치)

// 이미 위에 있음 임시라서 주석처리
// const store = useStore()

// 로그인 유저의 writerId (로그인 복구 로직은 네가 기존에 넣어둔 loadAuthFromStorage 사용)
const writerId = computed(() => Number(store.state.user?.userId) || null)

// 예: 대상 유저(프로필 주인) 아이디 — 라우터/상태에서 가져오면 좋음. 일단 데모값:
const targetId = computed(() => 2) // TODO: 실제 대상 유저 ID로 치환

// 예: 어떤 산책 건에 대한 리뷰인지 선택된 값 (둘 중 하나만 채워야 함)
const selectedPostId = 1           // 그룹산책 리뷰면 postId 사용
const selectedRequestOneId = null     // 1:1 산책이면 requestOneId 사용

// 예: 선택된 리뷰 태그 ID (서버가 검증)
const selectedReviewTagId = 2         // 데모: '친절' 같은 의미의 id라고 가정

async function reviewCreate() {
  try {
    // 클라 검증 (서버도 검증하지만, 사용자 UX 위해 미리 체크)
    if (!writerId.value) throw new Error('로그인이 필요합니다.')
    if (!targetId.value) throw new Error('대상 유저가 없습니다.')
    if (!selectedPostId && !selectedRequestOneId) {
      throw new Error('postId 또는 requestOneId 중 하나는 필수입니다.')
    }
    if (writerId.value === Number(targetId.value)) {
      throw new Error('본인에게 리뷰를 작성할 수 없습니다.')
    }
    if (!selectedReviewTagId) {
      throw new Error('reviewTagId는 필수입니다.')
    }

    const payload = {
      writerId: writerId.value,
      targetId: Number(targetId.value),
      postId: selectedPostId,                 // 그룹 산책이면 숫자, 아니면 null
      requestOneId: selectedRequestOneId,     // 1:1 산책이면 숫자, 아니면 null
      reviewTagId: selectedReviewTagId,
    }

    const { data } = await reviewApi.createReview(payload)
    // data = { result: "success", review: { ...저장된 리뷰... } }

    // 성공 후 UI 처리 (알림/리스트 갱신)
    alert('리뷰가 등록되었습니다.')
    // 방금 대상 유저의 받은 리뷰를 다시 불러와 태그 박스도 갱신
    await store.dispatch('review/fetchReceived', payload.targetId)

  } catch (e) {
    const msg = e?.response?.data?.message || e.message || '리뷰 작성 실패'
    alert(msg)
  }
}



</script>
