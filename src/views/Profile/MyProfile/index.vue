<template>
  <div class="mypage-container">
    <!-- 상단 네비 -->
    <header class="top-bar">
      <input type="text" class="search-input" placeholder="해시태그 또는 아이디 검색" />
      <div class="logo">나와 <span class="paw">🐾</span> 산책가개</div>
      <div class="user-info">
        <div class="notify">🔔<span class="badge">1</span></div>
        <span class="username">{{ profile.id }}</span>
        <img src="@/assets/default-profile.png" alt="프로필" class="user-img" />
      </div>
    </header>

    <!-- 프로필 카드 (상단) -->
    <section class="profile-card">
      <div class="profile-left">
        <img :src="profile.img" alt="프로필" class="profile-photo" />
      </div>

      <div class="profile-center">
        <p class="profile-id">ID: {{ profile.id }}</p>
        <ul class="profile-info">
          <li><strong>이름:</strong> {{ profile.name }}</li>
          <li><strong>생일:</strong> {{ profile.birth }}</li>
          <li><strong>성별:</strong> {{ profile.gender }}</li>
          <li><strong>몸무게:</strong> {{ profile.weight }}</li>
          <li><strong>지역:</strong> {{ profile.region }}</li>
        </ul>
      </div>

      <div class="profile-right">
        <p class="profile-intro">{{ profile.intro }}</p>
        <button class="logout-btn">LogOut</button>
      </div>
    </section>

    <!-- 메인 콘텐츠: 피드 + 필터 -->
    <main class="content">
      <!-- 중앙: 게시물 피드 -->
      <section class="feed-section">
        <div class="tabs">
          <button v-for="tab in tabs" :key="tab" :class="{active: activeTab===tab}" @click="activeTab=tab">
            {{ tab }}
          </button>
        </div>

        <div class="feed-grid">
          <div v-for="(post, i) in posts" :key="i" class="feed-card">
            <img :src="post.img" class="feed-img" />
            <p class="feed-title">{{ post.title }}</p>
            <div class="likes">♡ {{ post.likes }}</div>
          </div>
        </div>
      </section>

      <!-- 오른쪽: 필터 -->
      <aside class="filter-section">
        <button class="write-btn">✍️ 글쓰기</button>
        <div class="filter-box">
          <h3>필터</h3>
          <input type="text" placeholder="제목 검색" />
          <input type="text" placeholder="사용자 검색" />

          <h4>해시태그</h4>
          <div class="checkbox-group">
            <label><input type="checkbox" /> 산책</label>
            <label><input type="checkbox" /> 귀여움</label>
            <label><input type="checkbox" /> 자랑</label>
          </div>

          <h4>지역</h4>
          <div class="checkbox-group">
            <label><input type="checkbox" /> 서울</label>
            <label><input type="checkbox" /> 경기</label>
            <label><input type="checkbox" /> 부산</label>
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

const profile = ref({
  id: "TWOTWO_MOM",
  name: "TwoTwo",
  birth: "2016.02.02 (만 10세)",
  gender: "남",
  weight: "5kg",
  region: "서울 송파구",
  img: "https://place-puppy.com/200x200",
  intro: `안녕하세요 저는 투투예요 🐾
나이는 10살이고 강남과 산책을 정말 좋아해요.
특기라면 언제까지고 간식 찾기!
낮가리곤 좀 있지만, 친해지면 꼬리를 흔들면서 엄청 좋아한답니다.`,
});

const tabs = ref(["작성", "조회수", "좋아요순", "공개일자"]);
const activeTab = ref("작성");

const posts = ref([
  {
    title: "세상에서 가장 따뜻한 순간, 나와 함께라서 행복해",
    img: "https://place-puppy.com/400x250",
    likes: 718,
  },
  {
    title: "오늘도 나와 함께 해주는 🐶",
    img: "https://place-puppy.com/401x250",
    likes: 718,
  },
  {
    title: "작은 관심이 전하는 큰 위로",
    img: "https://placekitten.com/400/250",
    likes: 718,
  },
  {
    title: "오늘 산책의 MVP는 나다 🏆",
    img: "https://placekitten.com/401/250",
    likes: 718,
  },
]);
</script>

<style scoped>
.mypage-container {
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

/* 프로필 카드 */
.profile-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #fff;
  margin: 20px 40px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  gap: 20px;
}
.profile-left {
  flex: 1;
  text-align: center;
}
.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.profile-center {
  flex: 1;
}
.profile-id {
  font-weight: bold;
  margin-bottom: 8px;
}
.profile-info {
  list-style: none;
  padding: 0;
  margin: 0;
  line-height: 1.6;
}
.profile-right {
  flex: 2;
}
.profile-intro {
  font-size: 0.9rem;
  color: #444;
  margin-bottom: 12px;
}
.logout-btn {
  padding: 8px 14px;
  border: none;
  background: #6b4a2b;
  color: #fff;
  border-radius: 6px;
}

/* 메인 콘텐츠 */
.content {
  display: flex;
  gap: 30px;
  padding: 20px 40px;
}

/* 피드 */
.feed-section {
  flex: 2;
}
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.tabs button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
.tabs button.active {
  background: #6b4a2b;
  color: #fff;
}
.feed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}
.feed-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  padding: 12px;
}
.feed-img {
  width: 100%;
  border-radius: 12px;
}
.feed-title {
  margin: 10px 0;
}
.likes {
  margin-top: 6px;
  color: #d33;
}

/* 오른쪽 필터 */
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
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f7f7;
  padding: 20px 40px;
  margin-top: 40px;
  color: #444;
}
.footer-info {
  text-align: center;
  font-size: 0.85rem;
}
</style>
