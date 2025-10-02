<!-- ProfilePage.vue -->
<template>
  <div class="container py-4">
    <!-- 프로필 헤더 -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row align-items-center g-3">
          <div class="col-auto">
            <img :src="profile.avatar" class="rounded-circle object-cover" width="88" height="88" alt="avatar" />
          </div>
          <div class="col">
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <h5 class="mb-0">ID: {{ profile.id }}</h5>
              <span class="text-muted small">·</span>
              <button class="btn btn-sm btn-outline-secondary">설정</button>
            </div>

            <ul class="list-inline text-muted small mb-2 mt-2">
              <li class="list-inline-item" v-for="(s, i) in profile.stats" :key="i">
                <span class="me-1">{{ s.label }}</span
                ><strong class="text-dark">{{ s.value }}</strong>
              </li>
            </ul>

            <div class="row g-3">
              <div class="col-lg-8">
                <div class="p-3 bg-light rounded">
                  <p class="mb-0 small">{{ profile.bio }}</p>
                </div>
              </div>
              <div class="col-lg-2 text-lg-end">
                <button class="btn btn-primary">산책신청+</button>
              </div>
              <div class="col-lg-2 ">
                <button class="btn btn-primary">메세지 목록</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 하이라이트/펫 썸네일 -->
    <div class="d-flex align-items-center gap-4 mb-4 flex-wrap">
      <!-- Add Pets 버튼 -->
      <button class="btn btn-outline-secondary btn-sm">Add Pets</button>

      <!-- 하이라이트 리스트 -->
      <div v-for="h in highlights2" :key="h.id" class="text-center" @click="openPetModal(h)" style="cursor: pointer">
        <div class="story-ring mx-auto mb-1">
          <img :src="h.img" alt="" class="rounded-circle object-cover" />
        </div>
        <div class="small text-muted">{{ h.name }}</div>
      </div>
    </div>

    <!-- 모달 컴포넌트 -->
    <PetProfileModal
      :pet="selectedPet"
      :show="showModal"
      :currentUserId="currentUserId"
      @update:show="showModal = $event"
      @edit="handleEdit"
      @chat="handleChat"
    />

    <!-- 콘텐츠 + 사이드바 -->
    <div class="row g-4">
      <div class="col-lg-8">
        <!-- 필터 탭 -->
        <ul class="nav nav-pills mb-3">
          <li v-for="t in tabs" :key="t.key" class="nav-item">
            <button class="nav-link" :class="{ active: activeTab === t.key }" @click="activeTab = t.key">
              {{ t.label }}
            </button>
          </li>
        </ul>

        <!-- 카드 그리드 -->
        <div class="row g-3">
          <div v-for="post in filteredPosts" :key="post.id" class="col-md-6">
            <div class="card h-100 shadow-sm border-0">
              <div class="ratio ratio-4x3">
                <img :src="post.img" class="card-img-top object-cover" alt="" />
              </div>
              <div class="card-body">
                <div class="small text-muted mb-1">{{ post.subtitle }}</div>
                <h6 class="card-title mb-1">{{ post.title }}</h6>
                <p class="card-text text-muted small mb-0">{{ post.desc }}</p>
              </div>
              <div class="card-footer bg-white d-flex justify-content-between align-items-center">
                <span class="small text-muted">{{ post.time }}</span>
                <button class="btn btn-sm btn-outline-secondary">♥ {{ post.likes }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <nav class="mt-4">
          <ul class="pagination pagination-sm">
            <li class="page-item" :class="{ disabled: page === 1 }">
              <button class="page-link" @click="page--" :disabled="page === 1">Prev</button>
            </li>
            <li class="page-item" v-for="n in totalPages" :key="n" :class="{ active: page === n }">
              <button class="page-link" @click="page = n">{{ n }}</button>
            </li>
            <li class="page-item" :class="{ disabled: page === totalPages }">
              <button class="page-link" @click="page++" :disabled="page === totalPages">Next</button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- 사이드바 -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <strong>필터</strong>
              <button class="btn btn-sm btn-outline-secondary" @click="resetFilters">초기화</button>
            </div>

            <!-- 검색 -->
            <div class="mb-3">
              <label class="form-label small">검색</label>
              <input v-model="filters.q" type="search" class="form-control form-control-sm" placeholder="키워드..." />
            </div>

            <!-- 카테고리 -->
            <div class="mb-3">
              <label class="form-label small">종류</label>
              <div class="d-flex flex-wrap gap-2">
                <div v-for="c in categories" :key="c" class="form-check">
                  <input class="form-check-input" type="checkbox" :id="`cat-${c}`" :value="c" v-model="filters.cats" />
                  <label class="form-check-label small" :for="`cat-${c}`">{{ c }}</label>
                </div>
              </div>
            </div>

            <!-- 정렬 -->
            <div class="mb-2">
              <label class="form-label small">정렬</label>
              <select v-model="filters.sort" class="form-select form-select-sm">
                <option value="latest">최신순</option>
                <option value="likes">좋아요순</option>
              </select>
            </div>

            <button class="btn btn-dark w-100 btn-sm mt-2" @click="applyFilters">적용</button>
          </div>
        </div>

        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <!-- 해시태그 박스 -->
            <div class="card border-0 shadow-sm mb-3">
              <div class="card-body">
                <HashtagDisplayBox title="해시태그" :tags="tags" :max-visible="10" prefix="#" pill clickable @select="onSelect" />
              </div>
            </div>

            <strong class="d-block mb-2">통계</strong>
            <div class="d-flex justify-content-between small text-muted">
              <span>게시물</span><span>{{ posts.length }}</span>
            </div>
            <div class="d-flex justify-content-between small text-muted">
              <span>좋아요 합계</span><span>{{ totalLikes }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HashtagDisplayBox from "../../../components/reviewDisplayBox.vue";
import { computed, reactive, ref } from "vue";

//

const tags = ["강아지", "산책", "주말번개", "@Loki", "댕댕이", "고양이", "서울", "송파", "러프", "카페", "사진", "훈련"];
function onSelect(tag) {
  // 조회용이어도 클릭 시 검색/필터 연동 가능
  // router.push({ name: 'search', query: { tag } })
  console.log("select:", tag);
}

//

const profile = reactive({
  id: "TWOTWO_MOM",
  avatar: "https://picsum.photos/seed/dog1/200/200",
  bio: "반려견/반려묘와 함께하는 기록장입니다. 산책 메이트 구해요!",
  stats: [
    { label: "게시물", value: 128 },
    { label: "팔로워", value: 912 },
    { label: "팔로잉", value: 180 },
  ],
});

const highlights = [
  { id: 1, name: "Siberian Husky", img: "https://picsum.photos/seed/h1/120/120" },
  { id: 2, name: "Poodle", img: "https://picsum.photos/seed/h2/120/120" },
  { id: 3, name: "German Shepherd", img: "https://picsum.photos/seed/h3/120/120" },
  { id: 4, name: "Pug", img: "https://picsum.photos/seed/h4/120/120" },
  { id: 5, name: "Tortoise", img: "https://picsum.photos/seed/h5/120/120" },
  { id: 6, name: "Loki", img: "https://picsum.photos/seed/h6/120/120" },
];

const tabs = [
  { key: "all", label: "전체" },
  { key: "story", label: "스토리" },
  { key: "group", label: "그룹산책" },
  { key: "feed", label: "피드" },
];
const activeTab = ref("all");

const categories = ["강아지", "고양이", "일상", "산책", "모임"];

// 더미 포스트
const posts = reactive([
  {
    id: 1,
    type: "feed",
    cats: ["강아지", "산책"],
    img: "https://picsum.photos/seed/p1/600/400",
    title: "주말에 강변 산책",
    subtitle: "러프에게 행복한 날",
    desc: "가을바람과 함께 산책했어요.",
    likes: 718,
    time: "1시간 전",
  },
  {
    id: 2,
    type: "story",
    cats: ["강아지"],
    img: "https://picsum.photos/seed/p2/600/400",
    title: "오늘의 놀이",
    subtitle: "소파 위에서",
    desc: "간식 숨바꼭질!",
    likes: 423,
    time: "2시간 전",
  },
  {
    id: 3,
    type: "group",
    cats: ["산책", "모임"],
    img: "https://picsum.photos/seed/p3/600/400",
    title: "그룹 워크 모집",
    subtitle: "한강공원",
    desc: "내일 아침 9시",
    likes: 220,
    time: "어제",
  },
  {
    id: 4,
    type: "feed",
    cats: ["고양이", "일상"],
    img: "https://picsum.photos/seed/p4/600/400",
    title: "고양이 졸림",
    subtitle: "집사일기",
    desc: "햇살 맛집 창가",
    likes: 91,
    time: "2일 전",
  },
  {
    id: 5,
    type: "feed",
    cats: ["강아지"],
    img: "https://picsum.photos/seed/p5/600/400",
    title: "낮잠 타임",
    subtitle: "러프",
    desc: "푹 쉬는 중",
    likes: 310,
    time: "3일 전",
  },
  {
    id: 6,
    type: "group",
    cats: ["모임"],
    img: "https://picsum.photos/seed/p6/600/400",
    title: "주말 번개 산책",
    subtitle: "잠실",
    desc: "참가자 5/8",
    likes: 150,
    time: "3일 전",
  },
]);

// 필터 상태
const filters = reactive({
  q: "",
  cats: [],
  sort: "latest",
});
const page = ref(1);
const pageSize = 6;

const filteredPosts = computed(() => {
  let list = posts
    .filter((p) => (activeTab.value === "all" ? true : p.type === activeTab.value))
    .filter((p) => (filters.cats.length ? filters.cats.some((c) => p.cats.includes(c)) : true))
    .filter((p) => (filters.q ? (p.title + p.subtitle + p.desc).includes(filters.q) : true));

  if (filters.sort === "likes") {
    list = [...list].sort((a, b) => b.likes - a.likes);
  }
  // 간단 페이지네이션 (데모)
  const start = (page.value - 1) * pageSize;
  return list.slice(start, start + pageSize);
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(posts.filter((p) => (activeTab.value === "all" ? true : p.type === activeTab.value)).length / pageSize))
);

const totalLikes = computed(() => posts.reduce((acc, p) => acc + p.likes, 0));

function resetFilters() {
  filters.q = "";
  filters.cats = [];
  filters.sort = "latest";
}
function applyFilters() {
  page.value = 1;
}
import PetProfileModal from "@/components/PetProfileModal";

// 하이라이트 데이터 예시
const highlights2 = [
  {
    id: 1,
    name: "뽀삐",
    img: "https://via.placeholder.com/80",
    petUserId: 1,
    userLoginId: "userA",
    petName: "뽀삐",
    petBreed: "말티즈",
    petGender: "여",
    birthDate: "2023-01-01",
    weight: 3.2,
    address: "서울",
    intro: "안녕하세요~",
    imageUrl: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    name: "콩이",
    img: "https://via.placeholder.com/80",
    petUserId: 2,
    userLoginId: "userB",
    petName: "콩이",
    petBreed: "푸들",
    petGender: "남",
    birthDate: "2022-06-10",
    weight: 4.5,
    address: "부산",
    intro: "콩이입니다.",
    imageUrl: "https://via.placeholder.com/100",
  },
];

const selectedPet = ref(null);
const showModal = ref(false);
const currentUserId = 1; // 로그인한 내 유저 ID

// 클릭 시 모달 열기
function openPetModal(pet) {
  selectedPet.value = pet;
  showModal.value = true;
}

// 모달 이벤트
function handleEdit(pet) {
  console.log("편집:", pet);
}
function handleChat(pet) {
  console.log("채팅 신청:", pet);
}
</script>

<style scoped>
.object-cover {
  object-fit: cover;
}

/* 하이라이트 링 */
.story-ring {
  width: 64px;
  height: 64px;
  padding: 3px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff6ea8, #f7b2d9, #fcd5e8);
  display: grid;
  place-items: center;
}

.story-ring img {
  width: 100%;
  height: 100%;
}

/* 부트스트랩 ratio가 4x3만 제공되진 않아서 카드 이미지 고정용 */
.ratio-4x3 {
  aspect-ratio: 4 / 3;
}
</style>
