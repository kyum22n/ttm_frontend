<!-- src/components/common/ModalBase.vue -->
<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click="onOverlay">
      <div class="modal-panel" role="dialog" aria-modal="true" @click.stop>
        <header class="modal-header">
          <slot name="title"><h3 class="modal-title">제목</h3></slot>
          <button class="modal-close" @click="close" aria-label="닫기">×</button>
        </header>

        <section class="modal-body">
          <slot />
        </section>

        <footer v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  closeOnOverlay: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
function onOverlay() {
  if (props.closeOnOverlay) close()
}

function onKey(e) {
  if (e.key === 'Escape') close()
}

onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  display: grid; place-items: center;
  z-index: 1000;
}
.modal-panel {
  width: min(900px, 96vw);
  max-height: 86vh;
  background: #fff; border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.2);
  overflow: hidden; display: flex; flex-direction: column;
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 16px; border-bottom: 1px solid #eee;
}
.modal-title { margin: 0; font-weight: 700; font-size: 1.1rem; }
.modal-close { border: 0; background: transparent; font-size: 24px; cursor: pointer; }
.modal-body { padding: 0; overflow: auto; }
.modal-footer { padding: 12px 16px; border-top: 1px solid #eee; }
</style>
