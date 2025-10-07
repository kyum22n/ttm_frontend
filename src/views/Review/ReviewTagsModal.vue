<template>
  <div
    class="modal fade"
    tabindex="-1"
    ref="modalEl"
    aria-labelledby="reviewTagsTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content border border-3 rounded-4">
        <!-- ===== Header ===== -->
        <div class="modal-header border-0">
          <div class="w-100 text-center">
            <div class="fs-3">🐾</div>
            <h5 id="reviewTagsTitle" class="fw-bold text-dark mb-0">
              {{ headerTitle }}
            </h5>
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
            <!-- 리뷰 태그 목록 -->
            <div v-if="reviewTags.length > 0" class="d-flex flex-wrap gap-2 justify-content-start">
              <span
                v-for="(tag, i) in reviewTags"
                :key="i"
                class="badge bg-light text-dark border border-1"
              >
                {{ tag }}
              </span>
            </div>

            <div v-else class="text-center text-muted py-4">
              받은 리뷰 태그가 없습니다.
            </div>

            <!-- 에러 메시지 -->
            <div v-if="error" class="alert alert-danger mt-3 py-2">
              {{ error }}
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
  /** 리뷰 태그를 조회할 대상 유저 ID */
  userId: { type: Number, required: true },
  /** 모달 제목 (ex: "내가 받은 리뷰 태그", "이 사용자가 받은 리뷰 태그") */
  title: { type: String, default: '받은 리뷰 태그' },
})
const emit = defineEmits(['update:modelValue'])

const store = useStore()
const modalEl = ref(null)
let instance = null

const loading = computed(function () {
  return store.getters['review/loading']
})

const error = computed(function () {
  return store.getters['review/error']
})

const reviews = computed(function () {
  return store.getters['review/reviews']
})

const tags = computed(function () {
  return store.getters['review/tags']
})

const reviewTags = ref([])
const headerTitle = computed(function () {
  return props.title
})

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

  await loadData()
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
  async function (value) {
    if (value === true && instance) {
      instance.show()
      await loadData()
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

async function loadData() {
  reviewTags.value = []
  try {
    // 리뷰 태그 전체 목록
    await store.dispatch('review/fetchTags')
    // 대상 유저의 리뷰들
    await store.dispatch('review/fetchReceived', props.userId)

    const reviewList = store.getters['review/reviews']
    const tagList = store.getters['review/tags']

    const tagSet = new Set()

    for (let i = 0; i < reviewList.length; i++) {
      const reviewTagId = reviewList[i].reviewTagId
      for (let j = 0; j < tagList.length; j++) {
        if (tagList[j].reviewTagId === reviewTagId) {
          tagSet.add(tagList[j].tagName)
        }
      }
    }

    reviewTags.value = Array.from(tagSet)
  } catch (e) {
    console.error('리뷰 태그 조회 실패:', e)
  }
}
</script>
