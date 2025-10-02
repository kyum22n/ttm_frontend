<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import axios from "axios";

const route = useRoute();
const store = useStore();
const profile = ref(null);
const defaultAvatar = "https://placehold.co/88x88";

const isMyProfile = computed(() => {
  return store.state.user?.userId?.toString() === route.params.userId?.toString();
});

onMounted(async () => {
  const userId = route.params.userId;

  if (isMyProfile.value) {
    // 👉 내 프로필이면 store에서 가져오기
    const u = store.state.user;
    profile.value = {
      id: u.userLoginId,
      avatar: u.profileImage || "",
      bio: u.userBio || "소개글이 아직 없습니다.",
      stats: [
        { label: "게시물", value: u.postCount || 0 },
        { label: "팔로워", value: u.followerCount || 0 },
        { label: "팔로잉", value: u.followingCount || 0 },
      ],
    };
  } else {
    // 👉 다른 사람 프로필이면 API로 가져오기
    try {
      const { data } = await axios.get(`/api/users/${userId}`);
      profile.value = {
        id: data.userLoginId,
        avatar: data.profileImage || "",
        bio: data.userBio || "소개글이 아직 없습니다.",
        stats: [
          { label: "게시물", value: data.postCount },
          { label: "팔로워", value: data.followerCount },
          { label: "팔로잉", value: data.followingCount },
        ],
      };
    } catch (err) {
      console.error("프로필 불러오기 실패", err);
    }
  }
});
</script>
