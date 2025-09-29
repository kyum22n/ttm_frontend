<template>
  <div class="walk-detail-container">
    <!-- 상단 네비 -->
    <header class="top-bar">
      <input type="text" class="search-input" placeholder="해시태그 또는 아이디 검색" />
      <div class="logo">나와 <span class="paw">🐾</span> 산책가개</div>
      <div class="user-info">
        <div class="notify">🔔<span class="badge">1</span></div>
        <span class="username">TWOTWO_MOM</span>
        <img src="@/assets/default-profile.png" alt="프로필" class="user-img" />
      </div>
    </header>

    <main class="content">
      <!-- 왼쪽: 메인 이미지 -->
      <div class="left-panel">
        <img :src="mainImage" alt="산책 이미지" class="main-photo" />
      </div>

      <!-- 중앙: 모집글 -->
      <div class="center-panel">
        <div class="post-card">
          <div class="post-header">
            <img src="@/assets/cat.png" alt="작성자" class="post-profile" />
            <div class="post-info">
              <div class="username">LOKI_YA</div>
              <div class="time">2시간 전</div>
            </div>
            <span class="status-badge">산책 모집중</span>
          </div>

          <p class="post-content">
            서울 강서구 식물원에서 산책하실 분 구해여
          </p>

          <button class="apply-btn">산책 신청 🐾</button>

          <div class="tags">
            <span>#길냥이</span>
            <span>#츄르</span>
            <span>#삼색이</span>
            <span>#ㅇㅇ</span>
          </div>

          <div class="likes">❤️ Likes 19,867</div>
        </div>

        <!-- 댓글 작성 -->
        <div class="comment-input">
          <input v-model="newComment" type="text" placeholder="댓글을 작성해주세요" />
          <button @click="addComment">작성 🐾</button>
        </div>

        <!-- 댓글 리스트 -->
        <div class="comments">
          <div v-for="(c, i) in comments" :key="i" class="comment-item">
            <img :src="c.avatar" class="comment-avatar" />
            <div>
              <strong>{{ c.user }}</strong>: {{ c.text }}
            </div>
          </div>
        </div>
      </div>

      <!-- 오른쪽: 작성자 + 인원 목록 -->
      <div class="right-panel">
        <div class="author-card">
          <img src="@/assets/cat.png" alt="작성자" class="author-photo" />
          <p class="author-name">LOKI_YA 님의 게시물</p>
          <button class="profile-btn">프로필 보러가기</button>
          <div class="author-posts">
            <img v-for="(img, i) in previewImages" :key="i" :src="img" class="preview-img" />
          </div>
        </div>

        <div class="member-list">
          <h3>인원 목록 (5명)</h3>
          <ul>
            <li v-for="(m, i) in members" :key="i">
              <img :src="m.avatar" class="member-avatar" />
              <span>{{ m.name }}</span>
              <span v-if="m.isHost" class="host-label">(작성자)</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

const mainImage = ref("https://placekitten.com/500/500");
const newComment = ref("");
const comments = ref([
  { user: "SucHea", text: "제 마음을 녹여내리는 눈이에요 너무 이뻐요", avatar: "https://placekitten.com/100/100" },
  { user: "James", text: "BEAUTIFUL😍", avatar: "https://placekitten.com/101/100" },
]);

const previewImages = ref([
  "https://placekitten.com/150/150",
  "https://placekitten.com/151/150",
  "https://placekitten.com/152/150",
]);

const members = ref([
  { name: "LABR_4E", avatar: "https://place-puppy.com/50x50", isHost: true },
  { name: "LABR_4E", avatar: "https://place-puppy.com/51x50", isHost: false },
  { name: "LABR_4E", avatar: "https://place-puppy.com/52x50", isHost: false },
  { name: "LABR_4E", avatar: "https://place-puppy.com/53x50", isHost: false },
  { name: "LABR_4E", avatar: "https://place-puppy.com/54x50", isHost: false },
]);

function addComment() {
  if (newComment.value.trim() === "") return;
  comments.value.push({
    user: "나",
    text: newComment.value,
    avatar: "@/assets/default-profile.png",
  });
  newComment.value = "";
}
</script>

<style scoped>
.walk-detail-container {
  background: #fcfbf8;
  min-height: 100vh;
  font-family: "Noto Sans KR", sans-serif;
}

/* 상단 네비 */
.top-bar {
  background: #6b4a2b;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
}

.search-input {
  width: 280px;
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  outline: none;
}

.logo {
  font-weight: bold;
  font-size: 1.2rem;
}

.paw {
  font-size: 1.3rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.notify {
  position: relative;
}

.badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: red;
  color: #fff;
  font-size: 0.7rem;
  border-radius: 50%;
  padding: 2px 5px;
}

/* 메인 레이아웃 */
.content {
  display: flex;
  padding: 40px;
  gap: 30px;
}

/* 왼쪽 */
.left-panel {
  flex: 1;
}

.main-photo {
  width: 100%;
  border-radius: 12px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
}

/* 중앙 */
.center-panel {
  flex: 2;
}

.post-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.post-profile {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}

.post-info {
  flex: 1;
}

.status-badge {
  background: #fce9b6;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #6b4a2b;
}

.post-content {
  margin: 12px 0;
}

.apply-btn {
  background: #6b4a2b;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  margin-bottom: 12px;
  cursor: pointer;
}

.apply-btn:hover {
  background: #56351f;
}

.tags {
  margin-bottom: 10px;
}

.tags span {
  margin-right: 6px;
  color: #3b82f6;
  font-size: 0.9rem;
}

.likes {
  font-size: 0.9rem;
  color: #d33;
  margin-top: 8px;
}

/* 댓글 */
.comment-input {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.comment-input input {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.comment-input button {
  padding: 8px 14px;
  background: #fce9b6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.comment-input button:hover {
  background: #fbdc89;
}

.comments {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.comment-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

/* 오른쪽 */
.right-panel {
  flex: 1;
}

.author-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.author-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.profile-btn {
  margin-top: 10px;
  padding: 6px 14px;
  border: 1px solid #6b4a2b;
  border-radius: 6px;
  background: #fff;
  color: #6b4a2b;
  cursor: pointer;
}

.author-posts {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
}

.preview-img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

/* 인원 목록 */
.member-list {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.member-list h3 {
  margin-bottom: 10px;
  color: #6b4a2b;
}

.member-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.member-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.member-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.host-label {
  font-size: 0.8rem;
  color: #6b4a2b;
  margin-left: 4px;
}
</style>
