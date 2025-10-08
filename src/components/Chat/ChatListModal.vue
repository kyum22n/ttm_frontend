<!-- src/components/Chat/ChatListModal.vue -->
<template>
  <ModalBase v-model="open">
    <template #title>
      <h3 class="modal-title">내 채팅 목록</h3>
    </template>

    <!-- 채팅 목록 본체 -->
    <ChatList />
  </ModalBase>
</template>

<script setup>
import { computed } from 'vue'
import ModalBase from '@/components/Common/ModalBase.vue'
import ChatList from '@/components/Chat/ChatList.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const open = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})
</script>
