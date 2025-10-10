<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const store = useStore();
const router = useRouter();
const route = useRoute();

// props로 전달될 수도 있음 (선택사항)
const props = defineProps({
  petData: { type: Object, default: null },
});

const previewUrl = ref(null);
const pet = ref({
  petId: null,
  petUserId: store.state.user.userId,
  petName: "",
  petBirthDay: "",
  petBreed: "",
  petWeight: 0,
  petGender: "M",
  petDesc: "",
  petAttach: null,
});

function onSelectImage(e) {
  const file = e.target.files[0];
  if (file) {
    pet.value.petAttach = file;
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = URL.createObjectURL(file);
  }
}

onMounted(async () => {
  // ✅ 1️⃣ props로 직접 전달된 petData가 있으면 그대로 세팅
  if (props.petData) {
    Object.assign(pet.value, props.petData);
    if (pet.value.petId) {
      previewUrl.value = `/pet/image/${pet.value.petId}?v=${Date.now()}`;
    }
    return;
  }

  // ✅ 2️⃣ 없으면 route.params.petId로 API 요청
  const petId = route.params.petId;
  if (!petId) {
    alert("잘못된 접근입니다.");
    router.push(`/Profile/${store.state.user.userId}`);
    return;
  }

  try {
    const res = await axios.get("/pet/find", { params: { petId } });
    const data = res.data.pet;
    Object.assign(pet.value, data);
    if (data.petId) {
      previewUrl.value = `/pet/image/${data.petId}?v=${Date.now()}`;
    }
  } catch (err) {
    console.error("펫 정보 불러오기 실패:", err);
    alert("펫 정보를 불러오는 중 오류가 발생했습니다.");
    router.push(`/Profile/${store.state.user.userId}`);
  }
});

async function submit() {
  try {
    const formData = new FormData();
    for (const key in pet.value) {
      if (pet.value[key] != null) formData.append(key, pet.value[key]);
    }

    const res = await axios.put("/pet/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data && res.data.petId) {
      alert("반려견 정보가 수정되었습니다!");
      router.push(`/Profile/${store.state.user.userId}`);
    } else {
      alert("수정 실패. 다시 시도해주세요.");
    }
  } catch (err) {
    console.error("펫 수정 실패:", err);
    alert("업데이트 중 오류가 발생했습니다.");
  }
}

function goBack() {
  router.push(`/Profile/${store.state.user.userId}`);
}
</script>
