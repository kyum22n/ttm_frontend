<template>
  <div class="main-container">
    <!-- 상단 네비 -->
    <header class="top-bar">
      <input type="text" class="search-input" placeholder="해시태그 또는 아이디 검색" />
      <!-- <div class="logo">나와 <span class="paw">🐾</span> 산책가개</div> -->
      <router-link to="/Post/MainFeed" class="logo"> 나와 <span class="paw">🐾</span> 산책가개 </router-link>
      <div class="user-info">
        <div class="notify">🔔<span class="badge">1</span></div>
        <span class="username">TWOTWO_MOM</span>
        <img src="@/assets/default-profile.png" alt="프로필" class="user-img" />
        <div v-if="store.state.user.userLoginId">
          <span class="me-3">User: {{ $store.state.user.userLoginId }}</span>
          <button class="btn btn-info btn-sm" @click="handleLogout">로그아웃</button>
        </div>
        <div v-if="store.state.loginId === ''">
          <router-link to="/Register/Pet">회원가입</router-link>
        </div>
      </div>
    </header>

    <!-- 히어로 배너 -->
    <section class="hero">
      <div class="hero-text">
        <h1>나와 산책가개</h1>
        <p>
          믿을 수 있는 이웃과 함께하는 산책 <br />
          우리 아이의 이웃 친구, 나와 산책은 이웃과 만나는 공간,<br />
          반려견과 반려묘를 통한 커뮤니티가 됩니다.
        </p>
      </div>
      <img :src="heroImage" alt="히어로" class="hero-img" />
    </section>

    <!-- 메인 콘텐츠 -->
    <main class="content">
      <!-- 왼쪽: 피드 -->
      <div class="feed-section">
        <!-- 스토리 아바타 -->
        <div class="stories">
          <div v-for="(story, i) in stories" :key="i" class="story">
            <img :src="story.img" />
            <p>{{ story.name }}</p>
          </div>
        </div>

        <!-- 카드 피드 -->
        <div class="feed-grid">
          <div v-for="(post, i) in posts" :key="i" class="feed-card">
            <img :src="post.img" class="feed-img" />
            <p class="feed-title">{{ post.title }}</p>
            <div class="tags">
              <span v-for="(t, j) in post.tags" :key="j">{{ t }}</span>
            </div>
            <div class="likes">♡ {{ post.likes }}</div>
          </div>
        </div>
      </div>

      <!-- 오른쪽: 필터 -->
      <aside class="filter-section">
        <button class="write-btn">✍️ 글쓰기</button>

        <div class="filter-box">
          <h3>필터</h3>
          <input type="text" placeholder="제목 검색" />
          <input type="text" placeholder="사용자 검색" />

          <h4>카테고리</h4>
          <div class="checkbox-group">
            <label><input type="checkbox" /> 분양</label>
            <label><input type="checkbox" /> 산책</label>
            <label><input type="checkbox" /> 자랑</label>
          </div>

          <h4>지역</h4>
          <div class="checkbox-group">
            <label><input type="checkbox" /> 서울</label>
            <label><input type="checkbox" /> 경기</label>
            <label><input type="checkbox" /> 인천</label>
          </div>

          <button class="apply-btn">적용</button>
          <button class="reset-btn">초기화</button>
        </div>
      </aside>
    </main>

    <!-- 푸터 -->
    <footer class="footer">
      <div class="footer-left">🐱</div>
      <div class="footer-info">
        산책 매칭 플랫폼 "나와 산책가개"<br />
        고객센터 0000-0000 | 사업자등록번호 000-00-00000
      </div>
      <div class="footer-right">🐶</div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const heroImage = ref("https://placekitten.com/400/300");

const stories = ref([
  { name: "TwoTwo", img: "https://placekitten.com/100/100" },
  { name: "Husky", img: "https://placekitten.com/101/100" },
  { name: "Pitbull", img: "https://placekitten.com/102/100" },
]);

const posts = ref([
  {
    title: "냥생이란",
    img: "https://placekitten.com/400/250",
    tags: ["#강아지", "#분양"],
    likes: 718,
  },
  {
    title: "오늘도 나와 함께 해주는..",
    img: "https://place-puppy.com/400x250",
    tags: ["#귀염", "#추억"],
    likes: 718,
  },
]);
</script>

<style scoped>
.main-container {
  position: relative;
  width: 1920px;
  height: 3486px;
  margin: 0 auto;
  background: #fcfbf8;
  font-family: "Noto Sans KR", sans-serif;
  overflow: hidden;
}

/* 상단 네비 */
.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 80px; /* 적절한 높이 고정 */
  background: #6b4a2b;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-sizing: border-box;
  z-index: 100;
}

.search-input {
  width: 280px;
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  outline: none;
}

.logo {
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
  text-decoration: none;
}

/* 마우스 올릴때 */
/* .logo:hover {
  color: #56351f;
} */

/* 유저 정보 영역 */
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

/* 히어로 */
.hero {
  position: absolute;
  top: 100px; /* 상단바 아래 위치 */
  left: 40px;
  right: 40px;
  height: 300px; /* 원하는 높이 고정 */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero-text h1 {
  font-size: 2rem;
  color: #6b4a2b;
}

.hero-text p {
  margin-top: 10px;
  color: #555;
}

.hero-img {
  border-radius: 12px;
  width: 300px;
}

/* 메인 콘텐츠 */
.content {
  position: absolute;
  top: 420px; /* hero 아래 위치 조정 */
  left: 40px;
  right: 40px;
  bottom: 150px; /* footer 공간 제외 */
  display: flex;
  gap: 30px;
  overflow: auto; /* 내부 스크롤 가능 */
}

.feed-section {
  flex: 3;
}

.stories {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.story {
  text-align: center;
}

.story img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #ff4b6e;
}

.feed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.feed-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 12px;
}

.feed-img {
  width: 100%;
  border-radius: 12px;
}

.feed-title {
  margin: 10px 0;
}

.tags span {
  margin-right: 6px;
  font-size: 0.85rem;
  color: #3b82f6;
}

.likes {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #d33;
}

/* 필터 영역 */
.filter-section {
  flex: 1;
}

.write-btn {
  width: 100%;
  padding: 10px;
  background: #6b4a2b;
  border: none;
  color: white;
  border-radius: 6px;
  margin-bottom: 20px;
}

.filter-box {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.apply-btn,
.reset-btn {
  margin-top: 10px;
  padding: 8px;
  width: 100%;
  border: none;
  border-radius: 6px;
}

.apply-btn {
  background: #6b4a2b;
  color: white;
}

.reset-btn {
  background: #eee;
}

/* 푸터 */
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 1920px;
  height: 120px; /* 고정 높이 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f7f7;
  padding: 20px 40px;
  box-sizing: border-box;
  color: #444;
}

.footer-info {
  text-align: center;
  font-size: 0.85rem;
}
</style>
