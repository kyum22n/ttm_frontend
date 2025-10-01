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

const store = useStore();
const route = useRoute();

const liked = ref(false);
const newComment = ref("");

const post = computed(() => store.state.post.detail);
const comments = computed(() => store.state.post.comments);
const tags = computed(() => store.state.post.tags);

onMounted(() => {
  const id = route.params.id;
  if (id) {
    store.dispatch("post/fetchDetail", id);
  }
});

function toggleLike() {
  liked.value = !liked.value;
  // TODO: 백엔드 좋아요 API 연동 필요
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
</script>
