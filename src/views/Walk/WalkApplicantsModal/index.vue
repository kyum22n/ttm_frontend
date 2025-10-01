<!-- components/WalkApplicantsModal.vue -->
<template>
  <div class="modal fade" tabindex="-1" ref="modalEl" aria-labelledby="walkApplicantsTitle" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content border-3 rounded-4 walk-frame">
        <div class="modal-header border-0">
          <div class="text-center w-100">
            <div class="paw fs-3">🐾</div>
            <h5 id="walkApplicantsTitle" class="fw-bold text-brown mb-0">산책 신청 목록</h5>
          </div>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <div class="modal-body pt-0">
          <div v-if="items.length" class="vstack gap-4">
            <WalkApplicantItem
              v-for="a in items"
              :key="a.id"
              v-bind="a"
              @open="(postId) => $emit('open', postId, a)"
              @cancel="(postId) => $emit('cancel', postId, a)"
            />
          </div>
          <div v-else class="text-center text-muted py-5">신청 내역이 없습니다.</div>
        </div>

        <div class="modal-footer border-0">
          <button class="btn btn-outline-secondary" @click="close">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import WalkApplicantItem from './WalkApplicantItem.vue'

const props = defineProps({
  /** v-model 로 열고 닫기 */
  modelValue: { type: Boolean, default: false },
  /**
   * items 형식 예시:
   * [{ id, avatar, name, ageYears, gender, weightKg, location, userIdStr, postId, message, status }]
   * status: 'APPLY' | 'ACCEPT' | 'REJECT' | 'DONE'
   */
  items: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue', 'open', 'cancel'])

const modalEl = ref(null)
let instance = null

onMounted(async () => {
  const bs = (await import('bootstrap')).default // ESM 번들 환경이면 자동 트리 셰이킹
  const Modal = bs?.Modal || (await import('bootstrap/js/dist/modal')).default
  instance = new Modal(modalEl.value, { backdrop: true })
  modalEl.value.addEventListener('hidden.bs.modal', () => emit('update:modelValue', false))
  if (props.modelValue) instance.show()
})

onBeforeUnmount(() => { instance?.dispose?.() })

watch(() => props.modelValue, v => v ? instance?.show() : instance?.hide())

function close() { instance?.hide() }
</script>

<style scoped>
:root { --brown:#6b3f2a; --shadow:#caa27a33; }
.walk-frame { border-color: var(--brown); box-shadow: 10px 10px 0 var(--shadow); }
.text-brown { color: var(--brown); }
.paw { line-height: 1; }
</style>
