<template>
  <div class="profile-visit-container">
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

    <!-- 프로필 카드 -->
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
        <button class="block-btn">차단</button>
      </div>
    </section>

    <!-- 반려동물 리스트 -->
    <section class="pet-list">
      <div class="pet add-pet">
        <div class="circle">＋</div>
        <p>Add Pets</p>
      </div>
      <div v-for="(pet, i) in pets" :key="i" class="pet">
        <img :src="pet.img" class="pet-avatar" />
        <p>{{ pet.name }}</p>
      </div>
    </section>

    <!-- 메인 콘텐츠 -->
    <main class="content">
      <!-- 중앙: 게시물 피드 -->
      <section class="feed-section">
        <div class="feed-grid">
          <div v-for="(post, i) in posts" :key="i" class="feed-card">
            <img :src="post.img" class="feed-img" />
            <p class="feed-title">{{ post.title }}</p>
            <div class="hashtags">
              <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
            </div>
            <div class="likes">♡ {{ post.likes }}</div>
          </div>
        </div>
      </section>

      <!-- 오른쪽: 필터 -->
      <aside class="filter-section">
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
  id: "LOKI_YA",
  name: "LOKI",
  birth: "2016.02.09 (만 10세)",
  gender: "남",
  weight: "4kg",
  region: "서울 강남구",
  img: "https://placekitten.com/200/200",
  intro: `안녕! 나는 로키야 🐾
나이는 10살이고, 강남근처 햇빛 아래 낮잠 자는 걸 좋아해.
특기라면 사이드 포인트 젖히며 숨막힐 귀여움!`,
});

const pets = ref([
  { name: "Siberian Husky", img: "https://placedog.net/80/80?id=1" },
  { name: "Pitbull", img: "https://placedog.net/80/80?id=2" },
  { name: "German Shepard", img: "https://placedog.net/80/80?id=3" },
  { name: "Pug", img: "https://placedog.net/80/80?id=4" },
  { name: "TwoTwo", img: "https://placedog.net/80/80?id=5" },
  { name: "Loki", img: "https://placekitten.com/80/80" },
]);

const posts = ref([
  {
    title: "뒷골목에서 우리 로키 친구 만남",
    img: "https://placekitten.com/400/250",
    tags: ["길냥이", "하루", "관상묘"],
    likes: 718,
  },
  {
    title: "집사야 밥 해와라",
    img: "https://placekitten.com/401/250",
    tags: ["밥달라", "귀여움"],
    likes: 718,
  },
  {
    title: "장독대를 지키는 천사들",
    img: "https://placekitten.com/402/250",
    tags: ["고양이", "형제"],
    likes: 718,
  },
  {
    title: "낭생이란",
    img: "https://placekitten.com/403/250",
    tags: ["캣타워", "평화"],
    likes: 718,
  },
  {
    title: "러시안블루 '그레이야'",
    img: "https://placekitten.com/404/250",
    tags: ["러시안블루"],
    likes: 718,
  },
  {
    title: "오늘의 베스트 하품",
    img: "https://placekitten.com/405/250",
    tags: ["하품", "고양이"],
    likes: 718,
  },
]);
</script>

<style scoped>
.profile-visit-container {
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  gap: 20px;
}
.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.profile-info {
  list-style: none;
  padding: 0;
  margin: 0;
  line-height: 1.6;
}
.profile-intro {
  font-size: 0.9rem;
  color: #444;
  margin-bottom: 12px;
}
.block-btn {
  padding: 8px 14px;
  border: none;
  background: #c0392b;
  color: #fff;
  border-radius: 6px;
}

/* 반려동물 리스트 */
.pet-list {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 40px;
  margin-bottom: 20px;
}
.pet {
  text-align: center;
  font-size: 0.8rem;
}
.pet-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 3px solid #e17055;
}
.add-pet .circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #dfe6e9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

/* 콘텐츠 */
.content {
  display: flex;
  gap: 30px;
  padding: 20px 40px;
}

/* 피드 */
.feed-section {
  flex: 2;
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
.hashtags {
  font-size: 0.8rem;
  color: #555;
}
.tag {
  margin-right: 5px;
}
.likes {
  margin-top: 6px;
  color: #d33;
}

/* 필터 */
.filter-section {
  flex: 1;
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
