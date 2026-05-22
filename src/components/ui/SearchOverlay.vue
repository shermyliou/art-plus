<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'search']);

const overlayRef = ref(null);
const searchQuery = ref('');

const suggestedEvents = [
  "國家交響樂團《古典音樂之夜》2026",
  "果陀劇場《解憂雜貨店》2026歡迎再次來信！",
  "宇宙舞蹈者"
];

const suggestedSearches = [
  "爵士劇場",
  "星際音樂家",
  "親子 週末"
];

const searchHistory = [
  { text: "奇異果劇團", time: "11:32" },
  { text: "埃及", time: "12:27" },
  { text: "人間條件", time: "15:02" }
];

const handleClickOutside = (event) => {
  if (overlayRef.value && !overlayRef.value.contains(event.target)) {
    // Check if the click was on the toggle button to avoid double toggle
    const searchWrapper = document.querySelector('.search-wrapper');
    if (searchWrapper && searchWrapper.contains(event.target)) {
      return;
    }
    emit('close');
  }
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value);
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<template>
  <div class="search-overlay-container" ref="overlayRef">
    <!-- Dropdown Content -->
    <div class="search-dropdown-content p-3 shadow">
      <!-- Suggested Events -->
      <div class="search-section mb-3">
        <div class="section-title mb-2">建議活動</div>
        <div v-for="(event, index) in suggestedEvents" :key="'event-' + index" class="search-item d-flex align-items-center justify-content-between py-2">
          <div class="d-flex align-items-center gap-3">
            <Icon icon="ph:arrow-up-right" class="item-icon" />
            <span class="item-text">{{ event }}</span>
          </div>
        </div>
      </div>

      <!-- Suggested Searches -->
      <div class="search-section mb-3">
        <div class="section-title mb-2">建議搜尋</div>
        <div v-for="(search, index) in suggestedSearches" :key="'suggested-' + index" class="search-item d-flex align-items-center justify-content-between py-2">
          <div class="d-flex align-items-center gap-3">
            <Icon icon="ph:magnifying-glass" class="item-icon" />
            <span class="item-text">{{ search }}</span>
          </div>
        </div>
      </div>

      <!-- Search History -->
      <div class="search-section">
        <div class="section-title mb-2">搜尋紀錄</div>
        <div v-for="(history, index) in searchHistory" :key="'history-' + index" class="search-item d-flex align-items-center justify-content-between py-2">
          <div class="d-flex align-items-center gap-3">
            <Icon icon="ph:history" class="item-icon" />
            <span class="item-text">{{ history.text }}</span>
          </div>
          <span class="history-time">{{ history.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-overlay-container {
  position: fixed;
  top: var(--component-navbar-height);
  right: 60px; // matches navbar padding at ≥1200px
  width: 600px;
  z-index: 2050;
  display: flex;
  flex-direction: column;

  @media (max-width: 1400px) {
    width: 500px;
  }

  @media (max-width: 1200px) {
    right: 20px; // matches navbar padding at <1200px
  }

  @media (max-width: 992px) {
    width: 400px;
  }

  @media (max-width: 768px) {
    right: 0;
    left: 0;
    width: calc(100vw - 16px);
    border-radius: 0;
  }
}

.search-expanded-bar {
  background-color: var(--background-brand-secondary);
  border-radius: var(--border-radius-3);
  padding: 8px;
  width: 100%;
}

.search-input-inner {
  background-color: transparent;
  border: 1px solid var(--border-brand-default);
  border-radius: var(--border-radius-pill);
  height: 40px;
}

.search-input-field {
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
  color: var(--text-default-default);
  &::placeholder {
    color: var(--text-default-tertiary);
  }
}

.search-icon {
  font-size: 24px;
  color: var(--icon-default-default);
}

.btn-search {
  background-color: transparent;
  border: 1px solid var(--border-brand-secondary);
  border-radius: var(--border-radius-pill);
  font-weight: bold;
  font-size: 14px;
  color: var(--text-brand-on-brand-secondary);
  white-space: nowrap;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 1.68px;
  
  &:hover {
    background-color: var(--background-brand-secondary-hover);
    color: white;
  }
}

.search-dropdown-content {
  background-color: var(--background-default-default);
  border-radius: var(--border-radius-1);
  @media (max-width: 768px) {
    border-radius: 0;
  }
}

.section-title {
  font-size: 14px;
  color: var(--text-default-secondary);
  letter-spacing: 0.14px;
}

.search-item {
  cursor: pointer;
  &:hover {
    background-color: var(--background-default-default-hover);
    border-radius: 8px;
  }
}

.item-icon {
  font-size: 20px;
  color: var(--icon-default-default);
}

.item-text {
  font-size: 16px;
  color: var(--text-default-default);
  letter-spacing: 0.16px;
}

.history-time {
  font-size: 14px;
  color: var(--text-default-default);
  font-family: 'Quattrocento Sans', sans-serif;
}
</style>
