<!-- WalkList.vue -->
<template>
  <div class="card border-0 shadow-sm walk-wrapper">
    <div class="card-body">
      <div class="text-center mb-3">
        <div class="paw mx-auto mb-1">🐾</div>
        <h5 class="mb-0 fw-bold text-brown">산책 리스트</h5>
      </div>

      <div class="vstack gap-4">
        <WalkListItem
          v-for="item in items"
          :key="item.id"
          :title="item.title"
          :status="item.status"
          :post-id="item.postId"
          @open="onOpen"
          @cancel="onCancel"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  /** [{ id, title, status:'APPLY|ACCEPT|REJECT|DONE', postId }] */
  items: { type: Array, default: () => [] },
})
const emit = defineEmits(['open', 'cancel'])

function onOpen(postId)   { emit('open', postId) }
function onCancel(postId) { emit('cancel', postId) }
</script>

<style scoped>
.walk-wrapper { border: 3px solid #6b3f2a; border-radius: 18px; }
.text-brown { color: #6b3f2a; }
.paw { font-size: 1.6rem; }
</style>
