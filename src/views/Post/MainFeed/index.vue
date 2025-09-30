<template>
  <div class="bg-light min-vh-100 d-flex flex-column">
    <!-- ===== 상단 네비 ===== -->
    <nav class="navbar navbar-expand-lg navbar-dark" style="background-color:#6b4a2b;">
      <div class="container-fluid">
        <!-- 검색창 -->
        <form class="d-flex me-3 flex-grow-1">
          <input class="form-control" type="search" placeholder="해시태그 또는 아이디 검색" />
        </form>

        <!-- 로고 -->
        <a class="navbar-brand fw-bold mx-3" href="#">나와 🐾 산책가개</a>

        <!-- 유저 영역 -->
        <div class="d-flex align-items-center">
          <div class="position-relative me-3">
            <span class="fs-5">🔔</span>
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              1
            </span>
          </div>
          <span class="me-2 fw-bold">TWOTWO_MOM</span>
          <img
            src="https://placekitten.com/50/50"
            class="rounded-circle border border-2 border-white"
            width="40"
            height="40"
          />
        </div>
      </div>
    </nav>

    <!-- ===== 히어로 + 사이드메뉴 ===== -->
    <section class="container-fluid bg-white py-5">
      <div class="row justify-content-center">
        <!-- 왼쪽 -->
        <div class="col-md-4 text-center text-md-start">
          <h1 class="fw-bold text-dark mb-3">나와 🐾 산책가개</h1>
          <p class="text-muted">
            믿을 수 있는 이웃과 함께하는 교류<br />
            우리 아이와 어울릴 친구, 나와 산책할 이웃을 쉽게 만나는 공간.<br />
            반려인들의 따뜻한 동네 커뮤니티가 열립니다.
          </p>
        </div>

        <!-- 중앙 이미지 -->
        <div class="col-md-5 text-center mb-3 mb-md-0">
          <img :src="heroImage" class="img-fluid rounded shadow" />
        </div>

        <!-- 오른쪽 사이드 메뉴 -->
        <div class="col-md-3">
          <div class="list-group shadow-sm">
            <a href="#" class="list-group-item list-group-item-action">내 프로필</a>
            <a href="#" class="list-group-item list-group-item-action">마이페이지</a>
            <a href="#" class="list-group-item list-group-item-action">내 산책 메이트</a>
            <a href="#" class="list-group-item list-group-item-action">좋아요 목록</a>
            <a href="#" class="list-group-item list-group-item-action">조회한 게시물</a>
            <a href="#" class="list-group-item list-group-item-action">설정</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 스토리 ===== -->
    <section class="container my-5">
      <div class="d-flex justify-content-center gap-4 flex-wrap">
        <div v-for="(story, i) in stories" :key="i" class="text-center">
          <img
            :src="story.img"
            class="rounded-circle border border-4"
            style="border-color:hotpink;"
            width="100"
            height="100"
          />
          <p class="mt-2 fw-semibold">{{ story.name }}</p>
        </div>
      </div>
    </section>

    <!-- ===== 메인 콘텐츠 (피드 + 필터) ===== -->
    <main class="container flex-grow-1 mb-5">
      <div class="row g-4">
        <!-- 피드 -->
        <div class="col-lg-9">
          <div class="row row-cols-1 row-cols-md-2 g-4">
            <div v-for="(post, i) in posts" :key="i" class="col">
              <div class="card h-100 shadow-sm">
                <img :src="post.img" class="card-img-top" />
                <div class="card-body">
                  <h5 class="card-title">{{ post.title }}</h5>
                  <div class="mb-2">
                    <span
                      v-for="(t, j) in post.tags"
                      :key="j"
                      class="badge bg-primary me-1"
                    >
                      {{ t }}
                    </span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">{{ post.author }}</small>
                    <span class="text-danger">♡ {{ post.likes }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 필터 -->
        <aside class="col-lg-3">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">필터</h5>
              <input type="text" class="form-control mb-2" placeholder="제목 검색" />
              <input type="text" class="form-control mb-3" placeholder="사용자 검색" />

              <h6 class="fw-bold">카테고리</h6>
              <div v-for="c in ['분양','산책','자랑']" :key="c" class="form-check">
                <input type="checkbox" class="form-check-input" :id="c" />
                <label class="form-check-label" :for="c">{{ c }}</label>
              </div>

              <h6 class="fw-bold mt-3">지역</h6>
              <div v-for="loc in ['서울','경기','인천']" :key="loc" class="form-check">
                <input type="checkbox" class="form-check-input" :id="loc" />
                <label class="form-check-label" :for="loc">{{ loc }}</label>
              </div>

              <h6 class="fw-bold mt-3">성별</h6>
              <div v-for="g in ['수컷','암컷']" :key="g" class="form-check">
                <input type="checkbox" class="form-check-input" :id="g" />
                <label class="form-check-label" :for="g">{{ g }}</label>
              </div>

              <div class="d-flex gap-2 mt-4">
                <button class="btn btn-dark w-50">적용</button>
                <button class="btn btn-secondary w-50">초기화</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <!-- ===== 푸터 ===== -->
    <footer class="bg-white border-top py-4 mt-auto">
      <div class="container d-flex justify-content-between align-items-center">
        <!-- 왼쪽 고양이 -->
        <img src="https://placekitten.com/80/80" class="img-fluid" width="60" />
        <!-- 회사 정보 -->
        <div class="text-center small text-muted">
          산책 매칭 플랫폼 "나와 산책가개"<br />
          고객센터 0000-0000 | 사업자등록번호 000-00-00000
        </div>
        <!-- 오른쪽 강아지 -->
        <img src="https://place-puppy.com/80x80" class="img-fluid" width="60" />
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";

const heroImage = ref("https://placekitten.com/600/300");

const stories = ref([
  { name: "TwoTwo", img: "https://placekitten.com/120/120" },
  { name: "Siberian Husky", img: "https://placekitten.com/121/120" },
  { name: "Pitbull", img: "https://placekitten.com/122/120" },
  { name: "German Shepard", img: "https://placekitten.com/123/120" },
  { name: "Pug", img: "https://placekitten.com/124/120" },
  { name: "Japanese Spitz", img: "https://placekitten.com/125/120" },
  { name: "Labrador", img: "https://placekitten.com/126/120" },
]);

const posts = ref([
  {
    title: "냥생이란",
    img: "https://placekitten.com/400/250",
    tags: ["#고양이", "#일상"],
    author: "관리자",
    likes: 718,
  },
  {
    title: "오늘도 나와 함께 해주는..",
    img: "https://place-puppy.com/400x250",
    tags: ["#강아지", "#추억"],
    author: "사용자1",
    likes: 512,
  },
  {
    title: "오늘의 베스트 하냥",
    img: "https://placekitten.com/401/250",
    tags: ["#냥스타", "#귀요미"],
    author: "사용자2",
    likes: 233,
  },
  {
    title: "오늘 산책 MVP는 나다 🐕",
    img: "https://place-puppy.com/401x250",
    tags: ["#산책", "#강아지"],
    author: "사용자3",
    likes: 821,
  },
  {
    title: "산책하고 툴툴이와 하늘이",
    img: "https://place-puppy.com/402x250",
    tags: ["#산책", "#강아지"],
    author: "사용자4",
    likes: 421,
  },
  {
    title: "오늘의 베스트 파트너",
    img: "https://placekitten.com/402/250",
    tags: ["#반려견", "#추억"],
    author: "사용자5",
    likes: 639,
  },
]);
</script>
