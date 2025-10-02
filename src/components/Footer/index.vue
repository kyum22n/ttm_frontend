<template>
  <footer class="bg-white border-top mt-auto">
    <!-- 상단 배너 영역 -->
    <div class="container-fluid py-3">
      <div class="d-flex justify-content-center align-items-center">
        <!-- 왼쪽 고양이 -->
        <img :src="catImg" alt="고양이" class="img-fluid me-3" style="max-width: 100px" />

        <!-- 배너 -->
        <div class="flex-grow-1 mx-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center">
              <img :src="adbanner" alt="배너 아이콘" class="ms-2" />
            </div>
          </div>
        </div>

        <!-- 오른쪽 강아지 -->
        <img :src="dogImg" alt="강아지" class="img-fluid me-3" style="max-width: 100px" />
      </div>
    </div>

    <!-- 회사 정보 -->
    <div class="container text-center small text-muted py-3 border-top">
      <p class="mb-1">산책 매칭 플랫폼 "나와, 산책가개"</p>
      <p class="mb-1">고객센터 0000-0000 | 사업자등록번호 000-00-00000</p>
      <p class="mb-0">
        대표 투투맘 | 주소 서울시 ○○구 ○○로 00길 00, 0층<br />
        ✉️ twotwomom@naver.com
      </p>
    </div>
  </footer>
</template>

<script setup>
// 로컬 에셋 불러오기
import catImg from "@/assets/cat.png";
import dogImg from "@/assets/dog.png";
import adbanner from "@/assets/adbanner.png";
</script>

<style scoped>
footer {
  width: 100%;
}

footer .container-fluid {
  padding-left: 1rem;
  padding-right: 1rem;
}

footer img {
  max-width: 10vw; /* 화면 크기에 따라 최대 너비 자동 조정 */
  height: auto;
}

footer .card img {
  max-width: 100%; /* 배너는 카드 안에서 꽉 차게 */
  height: auto;
}

@media (max-width: 768px) {
  footer .d-flex {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  footer img {
    max-width: 20vw;
  }
}
</style>
