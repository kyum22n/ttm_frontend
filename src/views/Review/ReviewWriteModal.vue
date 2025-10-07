<template>
  <div
    class="modal fade"
    tabindex="-1"
    ref="modalEl"
    aria-labelledby="reviewWriteTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border border-3 rounded-4">
        <!-- ===== Header ===== -->
        <div class="modal-header border-0">
          <div class="w-100 text-center">
            <div class="fs-3">🐾</div>
            <h5 id="reviewWriteTitle" class="fw-bold text-dark mb-0">리뷰 남기기</h5>
          </div>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <!-- ===== Body ===== -->
        <div class="modal-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-secondary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div v-else>
            <!-- 태그 목록 -->
            <div class="mb-3">
              <label for="tagList" class="form-label fw-semibold">리뷰 태그 선택</label>

              <div id="tagList" class="d-flex flex-column gap-2">
                <div
                  v-for="t in tags"
                  :key="t.reviewTagId"
                  class="form-check"
                >
                  <input
                    class="form-check-input"
                    type="radio"
                    name="reviewTag"
                    :id="'tag_' + t.reviewTagId"
                    :value="t.reviewTagId"
                    v-model="selectedTagId"
                  />
                  <label class="form-check-label" :for="'tag_' + t.reviewTagId">
                    {{ t.tagName }}
                  </label>
                </div>
              </div>
            </div>

            <!-- 에러 메시지 -->
            <div v-if="error" class="alert alert-danger py-2">
              {{ error }}
            </div>

            <!-- 제출 버튼 -->
            <div class="text-end">
              <button
                type="button"
                class="btn btn-primary"
                :disabled="!selectedTagId || submitting"
                @click="submitReview"
              >
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ submitting ? '등록 중...' : '리뷰 남기기' }}
              </button>
            </div>
          </div>
        </div>

        <!-- ===== Footer ===== -->
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-outline-secondary" @click="close">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  writerId: { type: Number, required: true },
  targetId: { type: Number, required: true },
  postId: { type: Number, default: null },
  requestOneId: { type: Number, default: null },
})
const emit = defineEmits(['update:modelValue', 'submitted'])

const store = useStore()

const modalEl = ref(null)
let instance = null

const tags = computed(function () {
  return store.getters['review/tags']
})

const loading = computed(function () {
  return store.getters['review/loading']
})

const error = computed(function () {
  return store.getters['review/error']
})

const selectedTagId = ref(null)
const submitting = ref(false)

// ====== Modal Mount ======
onMounted(async function () {
  const bs = (await import('bootstrap')).default
  const Modal = bs ? bs.Modal : (await import('bootstrap/js/dist/modal')).default
  instance = new Modal(modalEl.value, { backdrop: true })

  modalEl.value.addEventListener('hidden.bs.modal', function () {
    emit('update:modelValue', false)
  })

  if (props.modelValue === true) {
    instance.show()
  }

  await store.dispatch('review/fetchTags')
})

onBeforeUnmount(function () {
  if (instance && instance.dispose) {
    instance.dispose()
  }
})

watch(
  function () {
    return props.modelValue
  },
  function (value) {
    if (value === true && instance) {
      instance.show()
    } else if (value === false && instance) {
      instance.hide()
    }
  }
)

// ====== Methods ======
function close() {
  if (instance) {
    instance.hide()
  }
}

async function submitReview() {
  if (!selectedTagId.value) {
    return
  }

  submitting.value = true

  try {
    const reviewData = {
      writerId: props.writerId,
      targetId: props.targetId,
      postId: props.postId,
      requestOneId: props.requestOneId,
      reviewTagId: selectedTagId.value,
    }

    await store.dispatch('review/create', reviewData)

    emit('submitted', reviewData)
    close()
  } catch (e) {
    console.error('리뷰 등록 실패:', e)
  } finally {
    submitting.value = false
  }
}
</script>
