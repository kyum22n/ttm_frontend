<template>
  <div class="container my-5">
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
              <img :src="post.author.profileImg" class="rounded-circle me-2" width="40" height="40" />
              <div>
                <strong>{{ post.author.name }}</strong>
                <div class="text-muted small">{{ post.time }}</div>
              </div>
            </div>

            <!-- 본문 -->
            <p class="mb-2">{{ post.content }}</p>

            <!-- 태그 -->
            <div class="mb-3">
              <span v-for="(tag, i) in post.tags" :key="i" class="badge bg-primary me-1">
                {{ tag }}
              </span>
            </div>

            <!-- 좋아요 -->
            <div class="d-flex align-items-center">
              <button class="btn btn-outline-danger btn-sm me-2" @click="toggleLike">
                <i class="bi" :class="liked ? 'bi-heart-fill' : 'bi-heart'"></i>
              </button>
              <span>{{ post.likes }} Likes</span>
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
                <img :src="c.profileImg" class="rounded-circle me-2" width="32" height="32" />
                <div>
                  <strong>{{ c.user }}</strong>: {{ c.text }}
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
            <!-- 작성자 프로필 -->
            <img :src="post.author.profileImg" class="rounded-circle mb-2" width="60" height="60" />
            <h6 class="card-title">{{ post.author.name }}</h6>
            <router-link to="/Profile" class="btn btn-outline-dark btn-sm mb-3">프로필 놀러가기</router-link>

            <hr />

            <!-- 작성자 피드 미리보기 -->
            <h6 class="fw-bold mb-2">작성자 피드</h6>
            <div class="d-flex flex-column gap-2">
              <img
                v-for="(img, i) in post.authorFeed"
                :key="i"
                :src="img"
                class="img-thumbnail"
                style="max-height: 80px; object-fit: cover;"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const liked = ref(false);
const newComment = ref("");
const comments = ref([
  { user: "SucHea", text: "저 눈 너무 이뻐요", profileImg: "https://placekitten.com/40/40" },
  { user: "Peter", text: "SO FUNNY LOL", profileImg: "https://placekitten.com/41/40" },
]);

const post = ref({
  images: [
    "https://placekitten.com/500/500",
    "https://placekitten.com/501/500",
    "https://placekitten.com/502/500",
  ],
  author: {
    name: "LOKI_YA",
    profileImg: "https://placekitten.com/60/60",
  },
  time: "2시간 전",
  content: "퇴근길에 우리 로키 친구 만남\n댓글 예쁘게 달아라",
  tags: ["#길냥이", "#츄르", "#삼색이", "#고양이"],
  likes: 19867,
  authorFeed: [
    "https://placekitten.com/200/200",
    "https://placekitten.com/201/200",
    "https://placekitten.com/202/200",
  ],
});

function toggleLike() {
  liked.value = !liked.value;
  post.value.likes += liked.value ? 1 : -1;
}

function addComment() {
  if (!newComment.value.trim()) return;
  comments.value.push({
    user: "나",
    text: newComment.value,
    profileImg: "https://placekitten.com/42/40",
  });
  newComment.value = "";
}
</script>
