<template>
  <div class="chat-container">
    <!-- 제목 -->
    <h2 class="title">메세지</h2>

    <!-- 채팅 메시지 영역 -->
    <div class="chat-box">
      <template v-for="(msg, i) in messages" :key="i">
        <!-- 상대방 메시지 -->
        <div v-if="msg.sender === 'other'" class="chat-row left">
          <img v-if="msg.img" :src="msg.img" alt="profile" class="avatar" />
          <div class="bubble-box">
            <div class="name">{{ msg.name }}</div>
            <div class="bubble">{{ msg.text }}</div>
          </div>
        </div>

        <!-- 내 메시지 -->
        <div v-else class="chat-row right">
          <div class="bubble-box">
            <div class="name">{{ msg.name }}</div>
            <div class="bubble">{{ msg.text }}</div>
          </div>
          <img v-if="msg.img" :src="msg.img" alt="profile" class="avatar" />
        </div>
      </template>
    </div>

    <!-- 입력 칸 -->
    <div class="input-box">
      <input
        type="text"
        v-model="newMessage"
        placeholder="메세지를 입력하세요..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">보내기</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const messages = ref([
  {
    sender: "other",
    name: "Labrador",
    text: "다른 강아지 냄새 맡으면서 산책하고 싶다멍!",
    img: "https://placedog.net/100/100?id=1",
  },
  {
    sender: "me",
    name: "나",
    text: "좋아요! 같이 산책가요 🐾",
    img: "https://placekitten.com/100/100",
  },
]);

const newMessage = ref("");

// 메시지 전송
const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  messages.value.push({
    sender: "me",
    name: "나",
    text: newMessage.value,
    img: "https://placekitten.com/100/100", // 내 프로필 이미지
  });
  newMessage.value = "";
};
</script>

<style scoped>
.chat-container {
  background: #fff;
  border: 2px solid #6b4a2b;
  border-radius: 12px;
  padding: 20px;
  max-width: 950px;
  margin: 20px auto;
  font-family: "Noto Sans KR", sans-serif;
  display: flex;
  flex-direction: column;
  height: 600px;
}

/* 제목 */
.title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 16px;
  color: #6b4a2b;
}

/* 채팅 메시지 영역 */
.chat-box {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 12px;
  background: #fafafa;
  border-radius: 8px;
}

/* 채팅 줄 */
.chat-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
}
.chat-row.right {
  justify-content: flex-end;
  text-align: right;
}
.chat-row.left {
  justify-content: flex-start;
  text-align: left;
}

/* 아바타 */
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #e170ff;
  object-fit: cover;
}

/* 이름 + 말풍선 */
.bubble-box {
  max-width: 60%;
}
.name {
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 4px;
}
.bubble {
  background: #fff;
  border-radius: 16px;
  padding: 10px 16px;
  border: 2px solid #c8a47e;
  box-shadow: 3px 3px 0 #6b4a2b;
  font-size: 0.95rem;
}

/* 입력 칸 */
.input-box {
  display: flex;
  gap: 8px;
}
.input-box input {
  flex: 1;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  outline: none;
}
.input-box button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #6b4a2b;
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;
}
</style>
