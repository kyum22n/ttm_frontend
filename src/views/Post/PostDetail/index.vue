<template>
  <div class="container-fluid py-5" style="
      background-color:#faf8f5;

      /* 브랜드 색상 세트 */
      --bs-primary:#6f5034;
      --bs-primary-rgb:111,80,52;

      /* 링크, 글자 */
      --bs-link-color:#6f5034;
      --bs-link-hover-color:#5b432c;

      /* 버튼 */
      --bs-btn-bg:#6f5034;
      --bs-btn-border-color:#6f5034;
      --bs-btn-hover-bg:#5b432c;
      --bs-btn-hover-border-color:#5b432c;
      --bs-btn-active-bg:#4d3826;
      --bs-btn-active-border-color:#4d3826;
      --bs-btn-active-color:#fff;
      --bs-btn-focus-shadow-rgb:111,80,52;

      /* 뱃지/페이지네이션 공용 */
      --bs-pagination-color:#6f5034;
      --bs-pagination-hover-color:#5b432c;
      --bs-pagination-active-bg:#6f5034;
      --bs-pagination-active-border-color:#6f5034;
      --bs-pagination-focus-box-shadow:0 0 0 .25rem rgba(111,80,52,.25);
    ">
    <div class="container my-5" v-if="post">
      <div class="row g-4">
        <!-- ===== 왼쪽: 이미지 슬라이드 ===== -->
        <div class="col-md-5">
          <div v-if="post.images && post.images.length" id="postCarousel" class="carousel slide shadow"
            data-bs-ride="carousel">
            <div class="carousel-inner">
              <div v-for="(img, i) in post.images" :key="i" class="carousel-item" :class="{ active: i === 0 }">
                <img :src="`http://localhost:8080${img}`" class="d-block w-100 rounded" alt="게시물 이미지" />
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#postCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#postCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>
          </div>

          <div v-else class="border rounded text-center p-5 bg-light text-muted">
            이미지가 없습니다.
          </div>
        </div>

        <!-- ===== 가운데: 게시글 + 댓글 ===== -->
        <div class="col-md-5">
          <div class="card shadow-sm mb-3">
            <div class="card-body">
              <!-- 작성자 프로필 -->
              <div class="d-flex align-items-center mb-3">
                <img :src="authorProfileImg" class="rounded-circle me-2" width="40" height="40" />
                <div>
                  <strong>{{ authorName }}</strong>
                  <div class="text-muted small">{{ formatDate(post.createdAt) }}</div>
                </div>
              </div>

              <!-- 게시글 내용 -->
              <p class="mb-3">{{ post.postContent }}</p>

              <!-- 태그 -->
              <div class="mb-3">
                <span v-for="(tag, i) in tags" :key="i" class="badge bg-primary me-1">
                  {{ tag.tagName }}
                </span>
              </div>

              <!-- 좋아요 -->
              <div class="d-flex align-items-center mb-3">
                <button class="btn btn-outline-danger btn-sm me-2" @click="toggleLike">
                  <i class="bi" :class="liked ? 'bi-heart-fill' : 'bi-heart'"></i>
                </button>
                <span>{{ post.postLikeCount }} Likes</span>
              </div>

              <!-- 수정 버튼 (작성자 && 일반글만) -->
              <div v-if="isAuthor && !isRecruitment" class="text-end mt-3">
                <router-link :to="`/post/update/${post.postId}`" class="btn btn-outline-secondary btn-sm">
                  ✏️ 수정하기
                </router-link>
              </div>

              <!-- 산책 모집글 버튼 -->
              <div class="mt-3 text-end">
                <!-- 신청자 -->
                <button v-if="isRecruitment && !isAuthor" class="btn btn-success btn-sm" :disabled="isApplying"
                  @click="applyGroupWalk">
                  <i class="bi bi-person-plus"></i>
                  {{ isApplying ? "신청 완료" : "신청하기" }}
                </button>

                <!-- 모집자 -->
                <div v-if="isRecruitment && isAuthor" class="mt-3 text-end">
                  <!-- ✅ 신청 내역 보기 -->
                  <button class="btn btn-outline-primary btn-sm" @click="showParticipants = true">
                    <i class="bi bi-people"></i> 신청 내역 보기
                  </button>
                  <!-- 모집 마감 버튼 -->
                  <button v-if="!isClosing && !isStarted && !isCompleted" class="btn btn-warning btn-sm"
                    @click="closeRecruitment">
                    <i class="bi bi-flag-fill"></i>모집 마감하기
                  </button>

                  <!-- 산책 시작 버튼 -->
                  <button v-else-if="isClosing && !isStarted && !isCompleted" class="btn btn-success btn-sm"
                    @click="startWalk">
                    <i class="bi bi-play-fill"></i> 산책 시작하기
                  </button>

                  <!-- 산책 완료 버튼 -->
                  <button v-else-if="isStarted && !isCompleted" class="btn btn-danger btn-sm" @click="completeWalk">
                    <i class="bi bi-check-circle-fill"></i> 산책 완료하기
                  </button>

                  <!-- 완료 후 상태 -->
                  <button v-else class="btn btn-secondary btn-sm" disabled>
                    <i class="bi bi-check-all"></i> 산책 완료됨
                  </button>
                </div>
              </div>

              <!-- ✅ 모달 추가 -->
              <GroupParticipantsModal v-if="post" v-model="showParticipants" :post-id="post.postId"
                :is-author="isAuthor" />

            </div>
          </div>

          <!-- 댓글 -->
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="input-group mb-3">
                <input v-model="newComment" type="text" class="form-control" placeholder="댓글을 작성해주세요" />
                <button class="btn btn-outline-secondary" @click="addComment">
                  작성
                </button>
              </div>

              <ul class="list-group list-group-flush">
                <!-- 🟢 로딩 중일 때 -->
                <li v-if="loadingComments" class="list-group-item text-center text-muted py-3">
                  <div class="spinner-border spinner-border-sm text-secondary me-2"></div>
                  댓글 불러오는 중...
                </li>

                <!-- 댓글 리스트 -->
                <li v-else v-for="(c, i) in commentsWithProfiles" :key="i"
                  class="list-group-item d-flex align-items-start">
                  <img :src="c.profileImage || 'https://placekitten.com/32/32'" class="rounded-circle me-2" width="32"
                    height="32" alt="댓글 작성자" style="object-fit: cover;" />
                  <div>
                    <strong>{{ c.userLoginId || c.cwriter }}</strong>:
                    {{ c.commentContent }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- ===== 오른쪽: 작성자 프로필 ===== -->
        <div class="col-md-2">
          <div class="card shadow-sm text-center">
            <div class="card-body">
              <img :src="authorProfileImg" class="rounded-circle mb-2" width="60" height="60" />
              <h6 class="card-title">{{ authorName }}</h6>

              <router-link :to="`/mypage/${post.postUserId}`" class="btn btn-outline-dark btn-sm mb-3">
                프로필 놀러가기
              </router-link>

              <!-- 작성자 게시물 썸네일 -->
              <div v-if="authorPosts.length">
                <div v-for="p in authorPosts.slice(0, 3)" :key="p.postId" class="mb-2">
                  <img :src="p.thumbnailUrl" class="rounded shadow-sm w-100" role="button"
                    @click="$router.push(`/post/${p.postId}`)" />
                </div>
              </div>
              <div v-else class="text-muted small">게시물이 없습니다</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import userApi from "@/apis/userApi";

// 그룹 산책 신청 관리 버튼 모달
import GroupParticipantsModal from "@/components/Walk/GroupParticipantsModal.vue";
const showParticipants = ref(false);

const store = useStore();
const route = useRoute();
const router = useRouter();

const user = JSON.parse(localStorage.getItem("user") || "{}");
const userId = user.userId || null; // 로그인 사용자 userID 받아오기
const post = computed(() => store.state.post.detail);
const comments = computed(() => store.state.post.comments);
const tags = computed(() => store.state.post.tags);

const liked = ref(false);
const newComment = ref("");
const authorProfileImg = ref("https://placekitten.com/60/60");
const authorName = ref("익명");
const authorPosts = ref([]);

// 글 작성자(또는 그룹 산책 모집자) 구분
const isAuthor = computed(() => post.value && post.value.postUserId === userId);
const isRecruitment = computed(() => post.value && post.value.isRequest === "Y");

// 모집 상태 또는 신청 상태
const isApplying = ref(false);
const isClosing = ref(false);

// 그룹 산책 진행 상태
const isStarted = ref(false);
const isCompleted = ref(false);

const commentsWithProfiles = ref([]); // 댓글 + 작성자 프로필 통합 리스트
const loadingComments = ref(false); // 🟢 로딩 상태 추가

// 날짜 포맷
function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("ko-KR");
}

// 좋아요
async function toggleLike() {
  console.log("좋아요 요청:", userId, post.value?.postId);
  if (!post.value?.postId) return;

  try {
    // store에서 처리 (유효성 검사까지 포함)
    const res = await store.dispatch("post/toggleLike", {
      userId,
      postId: post.value.postId,
    });

    if (res && typeof res.data.liked === "boolean") {
      liked.value = res.data.liked;
      // store가 이미 count 업데이트 처리함
    } else {
      console.warn("서버 응답 liked 값이 없음:", res?.data);
    }
  } catch (err) {
    console.error("좋아요 요청 오류:", err);
  }
}

onMounted(async () => {
  const id = Number(route.params.id);
  if (!id) return;

  // 1. 게시글 상세 불러오기
  await store.dispatch("post/fetchDetail", id);
  const currentPost = post.value;
  if (!currentPost) return;

  // 모집/신청/산책 상태
  const { wapplyEndedAt, walkStartedAt, walkEndedAt } = currentPost;
  isClosing.value = !!wapplyEndedAt;
  isStarted.value = !!walkStartedAt;
  isCompleted.value = !!walkEndedAt;

  const status = currentPost.walkStatus;
  console.log("현재 walkStatus: ", status);
  if (status === "C") isClosing.value = true;
  else if (status === "S") isStarted.value = true;
  else if (status === "E") isCompleted.value = true;

  // 2. 작성자 정보 불러오기 (userId 기반)
  try {
    const jwt = localStorage.getItem("jwt");
    const res = await userApi.userInfo(currentPost.postUserId, jwt);

    // 유저 정보와 프로필 이미지 데이터
    const userData = res.data.data;
    const profileImage = res.data.profileImage;

    // 로그인 아이디
    authorName.value = userData.userLoginId || `User#${currentPost.postUserId}`;

    // 프로필 이미지
    authorProfileImg.value = profileImage
      ? `http://localhost:8080${profileImage}`
      : "https://placekitten.com/60/60";
  } catch (e) {
    console.error("작성자 정보 불러오기 실패:", e);
  }

  // 3. 작성자 게시물 목록
  await store.dispatch("post/fetchUserPostList", {
    userId: currentPost.postUserId,
  });
  authorPosts.value = store.state.post.list || [];

  // 4. 로그인한 사용자 + postId 있을 때만 좋아요 상태 확인
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser.userId;
  if (userId && currentPost.postId) {
    try {
      const isLiked = await store.dispatch("post/fetchPostLikeStatus", {
        userId,
        postId: currentPost.postId,
      });
      liked.value = isLiked;
      console.log("초기 좋아요 상태:", isLiked);
    } catch (err) {
      console.error("좋아요 상태 확인 실패:", err.response?.data || err);
    }
  }

  // 신청 상태
  const participants = store.state.post.detail.participants || [];
  isApplying.value = participants.some(p => p.userId === userId);
});

// ===== 댓글 작성자 프로필 불러오기 (Promise.all 병렬 처리) =====
watch(
  comments,
  async (newComments) => {
    if (!newComments || newComments.length === 0) {
      commentsWithProfiles.value = [];
      return;
    }

    loadingComments.value = true; // 🟢 로딩 시작
    const jwt = localStorage.getItem("jwt");

    try {
      // 🟢 모든 userInfo 요청을 병렬로 처리
      const requests = newComments.map(async (c) => {
        try {
          const res = await userApi.userInfo(c.cwriter, jwt);
          const userData = res.data.data;
          const profileImage = res.data.profileImage;

          return {
            ...c,
            userLoginId: userData.userLoginId,
            profileImage: profileImage
              ? `http://localhost:8080${profileImage}`
              : "https://placekitten.com/32/32",
          };
        } catch (err) {
          console.error("댓글 작성자 정보 불러오기 실패:", err);
          return {
            ...c,
            userLoginId: `User#${c.cwriter}`,
            profileImage: "https://placekitten.com/32/32",
          };
        }
      });

      // 🟢 모든 요청 병렬 실행 후 결과 대입
      commentsWithProfiles.value = await Promise.all(requests);
    } catch (e) {
      console.error("댓글 전체 프로필 로딩 실패:", e);
      commentsWithProfiles.value = [];
    } finally {
      loadingComments.value = false; // 🟢 로딩 종료
    }
  },
  { immediate: true }
);

// 🟢 라우트 변경 시 모든 상태 초기화
watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
      console.log("게시글 이동 감지:", oldId, "→", newId);

      // 이전 게시글 관련 상태 초기화
      commentsWithProfiles.value = [];
      newComment.value = "";
      liked.value = false;
      isApplying.value = false;
      isClosing.value = false;
      loadingComments.value = false;

      // 새 게시글 데이터 재요청
      await store.dispatch("post/fetchDetail", Number(newId));
    }
  }
);

// 🟢 컴포넌트 언마운트 시 클린업
onBeforeUnmount(() => {
  commentsWithProfiles.value = [];
  newComment.value = "";
  liked.value = false;
  isApplying.value = false;
  isClosing.value = false;
  loadingComments.value = false;
});

// 댓글 작성
async function addComment() {
  if (!newComment.value.trim()) return;
  const payload = {
    cpostId: post.value.postId,
    cwriter: userId,
    commentContent: newComment.value,
  };
  await store.dispatch("post/writeComment", payload);
  newComment.value = "";
}

// 모집글 신청
async function applyGroupWalk() {
  if (!userId) {
    alert("로그인이 필요한 서비스입니다.");
    router.push("/login");
    return;
  }

  const participate = {
    postId: post.value.postId,
    userId,
  };

  await store.dispatch("post/groupwalkStatus", {
    status: "P", // APPLY → P
    participate: { postId: post.value.postId, userId },
  });

  isApplying.value = true;
}

// 모집 마감 -> 산책 시작 -> 산책 완료
async function closeRecruitment() {
  try {
    await store.dispatch("post/groupwalkMarkNow", {
      postId: post.value.postId,
      code: 1, // 모집 마감
    });
    await store.dispatch("post/fetchDetail", post.value.postId);
    await nextTick(); // store 반영 후 읽기
    const current = post.value;
    isClosing.value = current.wapplyEndedAt != null ? true : false;
    isStarted.value = current.walkStartedAt != null ? true : false;
    isCompleted.value = current.walkEndedAt != null ? true : false;

  } catch (err) {
    console.log("모집 마감 실패", err);
  }
}

async function startWalk() {
  try {
    await store.dispatch("post/groupwalkMarkNow", {
      postId: post.value.postId,
      code: 2, // 산책 시작
    });
    await store.dispatch("post/fetchDetail", post.value.postId);
    await nextTick(); // store 반영 후 읽기
    const current = post.value;
    isClosing.value = current.wapplyEndedAt != null ? true : false;
    isStarted.value = current.walkStartedAt != null ? true : false;
    isCompleted.value = current.walkEndedAt != null ? true : false;

  } catch (err) {
    console.log("산책 완료 실패", err);
  }
}

async function completeWalk() {
  try {
    await store.dispatch("post/groupwalkMarkNow", {
      postId: post.value.postId,
      code: 3,  // 산책 완료
    });
    await store.dispatch("post/fetchDetail", post.value.postId);
    await nextTick(); // store 반영 후 읽기
    const current = post.value;
    isClosing.value = current.wapplyEndedAt != null ? true : false;
    isStarted.value = current.walkStartedAt != null ? true : false;
    isCompleted.value = current.walkEndedAt != null ? true : false;

  } catch (err) {
    console.log("산책 완료 실패", err);
  }
}
</script>
