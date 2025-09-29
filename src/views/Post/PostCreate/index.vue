<template>
  <div class="walk-post-container">
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
      <!-- 왼쪽: 메인 이미지 & 해시태그 -->
      <div class="left-panel">
        <div class="main-image">
          <img :src="mainImage" alt="산책 이미지" />
        </div>
        <div class="hashtags">
          <input v-model="hashtags" type="text" placeholder="#강아지 #사랑 #웰시코기" />
          <button class="dropdown-btn">⬇</button>
        </div>

        <div class="action-btns">
          <button class="cancel-btn">산책글 등록 취소</button>
          <button class="submit-btn">산책글로 등록 🐾</button>
        </div>
      </div>

      <!-- 중앙: 게시물 카드 -->
      <div class="center-panel">
        <div class="post-card">
          <div class="post-header">
            <img src="@/assets/default-profile.png" alt="작성자" class="post-profile" />
            <div class="post-info">
              <div class="username">TWOTWO_MOM</div>
              <div class="time">12시간 전</div>
            </div>
            <button class="edit-btn">편집</button>
          </div>
          <p class="post-content">서울 대공원에서 산책하실분 구해여</p>

          <button class="status-btn">산책 마감</button>

          <div class="tags">
            <span v-for="tag in hashtagList" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <div class="likes">❤️ Likes 19,867</div>
        </div>

        <!-- 댓글 -->
        <div class="comment-section">
          <input type="text" placeholder="댓글을 작성해주세요" />
          <button class="comment-btn">댓글</button>
        </div>

        <div class="comments">
          <div v-for="(c, i) in comments" :key="i" class="comment-item">
            <img :src="c.avatar" class="comment-avatar" />
            <div>
              <strong>{{ c.user }}</strong>: {{ c.text }}
            </div>
          </div>
        </div>
      </div>

      <!-- 오른쪽: 업로드 + 인원목록 -->
      <div class="right-panel">
        <div class="upload-area">
          <button class="upload-btn">+</button>
          <div class="preview-list">
            <img v-for="(img, i) in previewImages" :key="i" :src="img" class="preview-img" />
          </div>
        </div>

        <div class="member-list">
          <h3>인원 목록 (5명)</h3>
          <ul>
            <li v-for="(m, i) in members" :key="i">
              <img :src="m.avatar" class="member-avatar" />
              {{ m.name }}
              <button v-if="!m.accepted" class="accept-btn">O</button>
              <button v-if="!m.accepted" class="reject-btn">X</button>
              <span v-if="m.accepted" class="accepted">(수락됨)</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const mainImage = ref("https://place-puppy.com/500x400");
const hashtags = ref("#강아지 #사랑 #웰시코기");
const comments = ref([
  { user: "SucHea", text: "제 마음을 녹여내리는 눈이에요 너무 이뻐요", avatar: "https://placekitten.com/100/100" },
  { user: "James", text: "BEAUTIFUL😍", avatar: "https://placekitten.com/101/100" }
]);
const previewImages = ref([
  "https://place-puppy.com/200x200",
  "https://place-puppy.com/201x200",
  "https://place-puppy.com/202x200",
  "https://place-puppy.com/203x200"
]);

const members = ref([
  { name: "LABR_4E", avatar: "https://place-puppy.com/50x50", accepted: false },
  { name: "LABR_4E", avatar: "https://place-puppy.com/51x50", accepted: false },
  { name: "LABR_4E", avatar: "https://place-puppy.com/52x50", accepted: true },
  { name: "LABR_4E", avatar: "https://place-puppy.com/53x50", accepted: false },
  { name: "LABR_4E", avatar: "https://place-puppy.com/54x50", accepted: false }
]);

const hashtagList = computed(() =>
  hashtags.value.split(" ").filter((tag) => tag.startsWith("#"))
);
</script>

<style scoped>
.walk-post-container {
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

.main-image img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
}

.hashtags {
  display: flex;
  align-items: center;
  margin: 12px 0;
}

.hashtags input {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
}

.dropdown-btn {
  margin-left: 6px;
  background: #6b4a2b;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
}

.action-btns {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cancel-btn {
  background: #f88;
  border: none;
  border-radius: 8px;
  padding: 10px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.submit-btn {
  background: #6b4a2b;
  border: none;
  border-radius: 8px;
  padding: 10px;
  color: white;
  font-weight: bold;
  cursor: pointer;
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

.edit-btn {
  background: #eee;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
}

.post-content {
  margin: 12px 0;
}

.status-btn {
  background: #fce9b6;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  margin-bottom: 12px;
}

.tags {
  margin-bottom: 10px;
}

.tag {
  margin-right: 6px;
  color: #3b82f6;
  font-size: 0.9rem;
}

.likes {
  font-size: 0.9rem;
  color: #d33;
}

/* 댓글 */
.comment-section {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.comment-section input {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.comment-btn {
  padding: 8px 12px;
  background: #fce9b6;
  border: none;
  border-radius: 6px;
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

.upload-area {
  margin-bottom: 20px;
}

.upload-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #6b4a2b;
  color: white;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  margin-bottom: 10px;
}

.preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-img {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  object-fit: cover;
}

.member-list {
  margin-top: 20px;
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

.accept-btn,
.reject-btn {
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-weight: bold;
  cursor: pointer;
}

.accept-btn {
  background: #8f8;
}

.reject-btn {
  background: #f88;
  color: white;
}

.accepted {
  color: green;
  font-size: 0.85rem;
}
</style>
