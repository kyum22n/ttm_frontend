<template>
  <!-- 전체 화면을 꽉 채우도록 -->
  <main class="bg-light min-vh-100 d-flex flex-column w-100">
    
    <!-- ===== 히어로 + 사이드메뉴 ===== -->
    <section class="container-fluid bg-white py-5">
      <div class="row justify-content-center">
        <!-- 왼쪽 -->
        <div class="col-md-4 text-center text-md-start">
          <img
            :src="logoBrown"
            alt="로고"
            class="img-fluid"
            style="max-width:300px;"
          />
          <p class="text-muted fs-5">
            믿을 수 있는 이웃과 함께하는 교류<br />
            우리 아이와 어울릴 친구, 나와 산책할 이웃을 쉽게 만나는 공간.<br />
            반려인들의 따뜻한 동네 커뮤니티가 열립니다.
          </p>
        </div>

        <!-- 중앙 이미지 -->
        <div class="col-md-5 text-center mb-3 mb-md-0">
          <img :src="heroImage" class="img-fluid rounded shadow w-100" style="max-height:500px;" />
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
    <section class="container-fluid my-5">
      <div class="d-flex justify-content-center gap-4 flex-wrap">
        <div v-for="(story, i) in stories" :key="i" class="text-center">
          <img
            :src="story.img"
            class="rounded-circle border border-4"
            style="border-color:hotpink;"
            width="120"
            height="120"
          />
          <p class="mt-2 fw-semibold fs-5">{{ story.name }}</p>
        </div>
      </div>
    </section>

    <!-- ===== 메인 콘텐츠 (피드 + 필터) ===== -->
    <main class="container-fluid flex-grow-1 mb-5">
      <div class="row g-4">
        <!-- 피드 -->
        <div class="col-lg-9">
          <div class="row row-cols-1 row-cols-md-2 g-4">
            <div v-for="(post, i) in posts" :key="i" class="col">
              <div class="card h-100 shadow-sm">
                <img :src="post.img" class="card-img-top" style="max-height:280px; object-fit:cover;" />
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
              <!-- ... (생략, 동일) -->
            </div>
          </div>
        </aside>
      </div>
    </main>
  </main>
</template>


<script setup>
import { ref } from "vue";
import logoBrown from "@/assets/logo_brown.png";

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
