<!-- components/HashtagDisplayBox.vue -->
<template>
  <div class="tagbox card border-2 rounded-4">
    <div v-if="title" class="card-header bg-transparent border-0 pt-3 pb-0">
      <strong class="text-brown">{{ title }}</strong>
    </div>

    <div class="card-body py-3">
      <div class="d-flex flex-wrap gap-2">
        <span
          v-for="(t, i) in visibleTags"
          :key="i"
          class="badge"
          :class="pill ? 'rounded-pill tag-pill' : 'tag-chip'"
          role="button"
          @click="handleSelect(t)"
          :aria-label="`태그 ${t}`"
        >
          {{ prefix ? (t.startsWith('#') || t.startsWith('@') ? t : prefix + t) : t }}
        </span>

        <!-- 더보기 토글 -->
        <button
          v-if="canToggle"
          class="btn btn-sm btn-outline-secondary rounded-pill"
          @click="expanded = !expanded"
        >
          {{ expanded ? '접기' : `+${tags.length - maxVisible} 더보기` }}
        </button>

        <!-- 비어있을 때 -->
        <span v-if="!tags?.length" class="text-muted small">표시할 태그가 없습니다.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits, ref } from 'vue'

const props = defineProps({
  /** ['#강아지','산책','@Loki'] 같은 배열 */
  tags: { type: Array, default: () => [] },
  title: { type: String, default: '' },
  /** 처음에 보여줄 개수 (넘으면 더보기 버튼 노출) */
  maxVisible: { type: Number, default: 8 },
  /** pill 형태로 표시할지 여부 */
  pill: { type: Boolean, default: true },
  /** 자동 접두어: '#' 또는 '@' (없으면 원본 그대로) */
  prefix: { type: String, default: '#' },
  /** 태그 클릭을 상호작용으로 쓸 거면 true */
  clickable: { type: Boolean, default: true },
})

const emit = defineEmits(['select'])
const expanded = ref(false)

const canToggle = computed(() => props.tags.length > props.maxVisible)
const visibleTags = computed(() =>
  expanded.value || !canToggle.value ? props.tags : props.tags.slice(0, props.maxVisible)
)

function handleSelect(tag) {
  if (!props.clickable) return
  emit('select', tag)
}
</script>

<style scoped>
:root { --brown:#6b3f2a; --chip-bg:#fff7ee; --chip-bd:#e9dfcf; }
.tagbox { border-color: var(--brown); }
.text-brown { color: var(--brown); }

.tag-pill {
  background: var(--chip-bg);
  border: 1px solid var(--chip-bd);
  color: #5a4638;
  padding: .5rem .75rem;
  font-weight: 600;
}
.tag-chip {
  background: var(--chip-bg);
  border: 1px solid var(--chip-bd);
  color: #5a4638;
  border-radius: .75rem;
  padding: .4rem .6rem;
  font-weight: 600;
}
.badge:hover { filter: brightness(.98); }
</style>




