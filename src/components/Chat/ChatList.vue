<!-- src/components/Chat/ChatList.vue -->
<template>
  <div class="list-wrap">
    <div class="list-header">
      <h3 class="title">내 채팅방</h3>
      <button class="btn" :disabled="loading" @click="fetchRooms">
        새로고침
      </button>
    </div>

    <div v-if="errorMsg" class="alert">
      <div class="alert-title">목록을 불러오지 못했습니다.</div>
      <div class="alert-body">{{ errorMsg }}</div>
    </div>

    <div v-else-if="!isLogin || myUserId <= 0" class="hint">
      채팅 목록을 보려면 로그인하세요.
    </div>

    <div v-else-if="loading" class="hint">불러오는 중…</div>

    <div v-else-if="rooms.length === 0" class="hint">채팅방이 없습니다.</div>

    <ul v-else class="room-list">
      <li
        v-for="r in rooms"
        :key="r.chatroomId"
        class="room-item"
        @click="goRoom(r.chatroomId)"
      >
        <div class="room-left">
          <img
            class="avatar"
            :src="r.partnerAvatar || FALLBACK_AVATAR"
            alt="상대 프로필"
          />

          <div class="room-texts">
            <div class="room-title">
              <span class="partner">
                {{ r.partnerPetName || "USER" }}
                <span> - </span>
                <small class="pid">(#{{ r.partnerId }})</small>
              </span>

              <span
                class="status"
                :class="r.chatroomStatus === 'A' ? 'ok' : 'pend'"
              >
                {{ r.chatroomStatus === "A" ? "승인됨" : "대기" }}
              </span>
            </div>

            <div class="room-sub">최근: {{ r.lastPreview || "-" }}</div>

            <div
              v-if="r.chatroomStatus === 'P' && r.requestedBy !== myUserId"
              class="action-row"
              @click.stop
            >
              <button
                class="btn-approve"
                :disabled="acting.has(r.chatroomId)"
                @click="approve(r)"
              >
                {{ acting.has(r.chatroomId) ? "승인 중…" : "승인" }}
              </button>
              <button
                class="btn-reject"
                :disabled="acting.has(r.chatroomId)"
                @click="reject(r)"
              >
                {{ acting.has(r.chatroomId) ? "거절 중…" : "거절" }}
              </button>
            </div>
          </div>
        </div>

        <div class="room-right" v-if="r.unreadCount > 0">
          <span class="badge">{{ r.unreadCount }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import { approveRoom, rejectRoom } from "@/apis/chatApi";

const store = useStore();
const router = useRouter();

const isLogin = computed(() => store.getters.isLogin);
const myUserId = computed(() => Number(store.getters.getUser?.userId || 0));

const loading = ref(false);
const errorMsg = ref("");
const rooms = ref([]);

const acting = ref(new Set());

const avatarCache = new Map();
const petNameCache = new Map();

const FALLBACK_AVATAR = "https://placehold.co/80x80?text=USER";

async function fetchJSON(url, config) {
  const res = await axios.get(url, config);
  return res.data;
}

async function fetchPartnerMeta(userId) {
  const cachedAvatar = avatarCache.get(userId);
  const cachedPetName = petNameCache.get(userId);
  if (cachedAvatar !== undefined || cachedPetName !== undefined) {
    return { avatar: cachedAvatar || "", petName: cachedPetName || "" };
  }

  let avatar = "";
  let petName = "";
  try {
    const { data: fp } = await axios.get(`/pet/${userId}/first-pet`);
    petName = fp?.petName || "";
    if (fp?.imageUrl) {
      const path = fp.imageUrl.startsWith("/")
        ? fp.imageUrl
        : `/${fp.imageUrl}`;
      avatar = axios.defaults.baseURL.replace(/\/$/, "") + path;
    }
  } catch {
    // no-op
  }

  avatarCache.set(userId, avatar);
  petNameCache.set(userId, petName);
  return { avatar, petName };
}

async function fetchRooms() {
  if (
    !isLogin.value ||
    !Number.isInteger(myUserId.value) ||
    myUserId.value <= 0
  ) {
    rooms.value = [];
    return;
  }
  loading.value = true;
  errorMsg.value = "";
  try {
    const data = await fetchJSON("/chat/rooms/my", {
      params: { userId: myUserId.value },
    });
    const list = Array.isArray(data) ? data : data?.rooms || [];

    const base = list.map((r) => {
      const partnerId =
        myUserId.value === r.chatuser1Id ? r.chatuser2Id : r.chatuser1Id;
      const lastPreview = r.lastPreview || r.lastMessage || "";
      const unreadCount = r.unreadCount || 0;
      return { ...r, partnerId, lastPreview, unreadCount };
    });

    const enriched = await Promise.all(
      base.map(async (r) => {
        try {
          const meta = await fetchPartnerMeta(r.partnerId);
          return {
            ...r,
            partnerPetName: meta.petName,
            partnerAvatar: meta.avatar,
          };
        } catch {
          return { ...r };
        }
      })
    );

    rooms.value = enriched;
  } catch (e) {
    errorMsg.value =
      e?.response?.data?.message || e?.message || "알 수 없는 오류";
  } finally {
    loading.value = false;
  }
}

function goRoom(roomId) {
  router.push({ path: "/message/detail", query: { roomId } });
}

async function approve(r) {
  if (acting.value.has(r.chatroomId)) return;
  acting.value.add(r.chatroomId);
  try {
    await approveRoom(r.chatroomId, myUserId.value);
    r.chatroomStatus = "A";
  } catch (e) {
    console.error(e);
    alert("승인에 실패했습니다.");
  } finally {
    acting.value.delete(r.chatroomId);
  }
}

async function reject(r) {
  if (acting.value.has(r.chatroomId)) return;
  acting.value.add(r.chatroomId);
  try {
    await rejectRoom(r.chatroomId, myUserId.value);
    r.chatroomStatus = "D";
  } catch (e) {
    console.error(e);
    alert("거절에 실패했습니다.");
  } finally {
    acting.value.delete(r.chatroomId);
  }
}

onMounted(() => {
  fetchRooms();
});
</script>

<style scoped>
.list-wrap {
  padding: 12px;
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}
.btn {
  border: 1px solid #888;
  background: #fff;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
}

.alert {
  background: #ffecec;
  border: 1px solid #ffb3b3;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}
.alert-title {
  font-weight: 700;
  margin-bottom: 4px;
}
.hint {
  color: #666;
  padding: 8px;
}

.room-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.room-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  background: #fff;
}
.room-item:hover {
  border-color: #ccc;
  background: #fafafa;
}

.room-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #eee;
}

.room-texts {
  display: flex;
  flex-direction: column;
}
.room-title {
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}
.partner {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}
.pid {
  color: #888;
  font-weight: 500;
}
.status {
  font-size: 0.8rem;
  border-radius: 6px;
  padding: 2px 6px;
  border: 1px solid #ddd;
}
.status.ok {
  background: #ecfff0;
  border-color: #b6efc5;
}
.status.pend {
  background: #fff8e6;
  border-color: #ffe2a9;
}
.room-sub {
  color: #666;
  font-size: 0.9rem;
  margin-top: 2px;
}

.action-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.btn-approve {
  padding: 4px 8px;
  border: 1px solid #2ecc71;
  background: #ecfff6;
  border-radius: 6px;
  cursor: pointer;
}
.btn-reject {
  padding: 4px 8px;
  border: 1px solid #e74c3c;
  background: #fff0f0;
  border-radius: 6px;
  cursor: pointer;
}

.room-right {
  margin-left: 10px;
}
.badge {
  background: #e74c3c;
  color: #fff;
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 0.8rem;
}
</style>
