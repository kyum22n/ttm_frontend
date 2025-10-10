<template>
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
              <button v-if="isRecruitment && isAuthor" class="btn btn-warning btn-sm" :disabled="isClosing"
                @click="closeRecruitment">
                <i class="bi bi-flag-fill"></i>
                {{ isClosing ? "마감됨" : "모집 마감하기" }}
              </button>
            </div>


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
              <li v-for="(c, i) in comments" :key="i" class="list-group-item d-flex align-items-start">
                <img src="https://placekitten.com/32/32" class="rounded-circle me-2" width="32" height="32" />
                <div>
                  <strong>{{ c.cwriter }}</strong>:
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

            <router-link :to="`/Profile/OtherProfile/${post.postUserId}`" class="btn btn-outline-dark btn-sm mb-3">
              프로필 놀러가기
            </router-link>

            <!-- 작성자 게시물 썸네일 -->
            <div v-if="authorPosts.length">
              <div v-for="p in authorPosts.slice(0, 3)" :key="p.postId" class="mb-2">
                <img :src="p.thumbnailUrl" class="rounded shadow-sm w-100" role="button"
                  @click="$router.push(`/Post/PostDetail/${p.postId}`)" />
              </div>
            </div>
            <div v-else class="text-muted small">게시물이 없습니다</div>
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
import { useRouter } from "vue-router";
import userApi from "@/apis/userApi";

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

const isAuthor = computed(() => post.value && post.value.postUserId === userId);
const isRecruitment = computed(() => post.value && post.value.isRequest === "Y");
const isApplying = ref(false);
const isClosing = ref(false);

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

// 모집 마감
async function closeRecruitment() {
  await store.dispatch("post/groupwalkMarkNow", {
    postId: post.value.postId,
    code: 1,
  });
  isClosing.value = true;
}

</script>
