<!-- components/SideActionBox.vue -->
<template>
  <div class="sidebox p-3 text-center rounded-4">
    <div class="fw-bold mb-2">{{ title }}</div>
    <div class="vstack gap-2">
      <button class="btn btn-sm btn-outline-dark rounded-pill" @click="$emit('primary')">{{ primary }}</button>
      <button class="btn btn-sm btn-outline-secondary rounded-pill" @click="$emit('secondary')">{{ secondary }}</button>
    </div>
  </div>
</template>

<script setup>

// defineProps({
//   title: { type: String, required: true },
//   primary: { type: String, required: true },
//   secondary: { type: String, required: true },
// })
</script>

<style scoped>
.sidebox{
  background:#fff;
  border:2px solid var(--brown, #6b3f2a);
  box-shadow: 6px 6px 0 rgba(105,73,52,.12);
}
</style>
