<script setup>
import { ref, computed, watch } from 'vue';
import { Icon } from '@iconify/vue';

const emit = defineEmits(['update:filters']);

/**
 * @typedef {Object} myFilterItem
 * @property {string} label - 篩選標籤名稱
 * @property {string} icon - Iconify 圖標代碼
 * @property {boolean} isOpen - 是否展開
 * @property {string[]} [selected] - 已選擇的選項
 * @property {Object[]} [options] - 選項清單
 */

/** @type {import('vue').Ref<myFilterItem[]>} */
const filters = ref([
  { label: '活動時間', icon: 'ph:calendar-blank', isOpen: true },
  { 
    label: '縣市', 
    icon: 'ph:map-pin', 
    isOpen: false,
    selected: ['全部'],
    options: [
      { label: '全部', type: 'item' },
      { label: '北部', type: 'region' },
      { label: '臺北市', type: 'item' },
      { label: '新北市', type: 'item' },
      { label: '基隆市', type: 'item' },
      { label: '桃園市', type: 'item' },
      { label: '新竹市', type: 'item' },
      { label: '新竹縣', type: 'item' },
      { label: '苗栗縣', type: 'item' },
      { label: '中部', type: 'region' },
      { label: '臺中市', type: 'item' },
      { label: '彰化縣', type: 'item' },
      { label: '南投縣', type: 'item' },
      { label: '雲林縣', type: 'item' },
      { label: '嘉義市', type: 'item' },
      { label: '嘉義縣', type: 'item' },
      { label: '南部', type: 'region' },
      { label: '臺南市', type: 'item' },
      { label: '高雄市', type: 'item' },
      { label: '屏東縣', type: 'item' },
      { label: '東部', type: 'region' },
      { label: '宜蘭縣', type: 'item' },
      { label: '花蓮縣', type: 'item' },
      { label: '臺東縣', type: 'item' },
      { label: '離島', type: 'region' },
      { label: '澎湖縣', type: 'item' },
      { label: '金門縣', type: 'item' },
      { label: '連江縣', type: 'item' },
    ]
  },
  { 
    label: '排除票種', 
    icon: 'ph:ticket', 
    isOpen: false,
    selected: [],
    options: [
      { label: '排除已售完', type: 'item' },
      { label: '排除無障礙票', type: 'item' },
      { label: '排除學生票', type: 'item' },
    ]
  },
  { 
    label: '親子與無障礙', 
    icon: 'ph:person-arms-spread', 
    isOpen: false,
    selected: [],
    options: [
      { label: '僅顯示全部符合的活動。建議出發前向場館確認。', type: 'instruction' },
      { label: '哺乳室', type: 'item' },
      { label: '兒童友善內容', type: 'item' },
      { label: '兒童友善高度', type: 'item' },
      { label: '電梯', type: 'item' },
      { label: '輪椅', type: 'item' },
      { label: '無障礙入口', type: 'item' },
      { label: '無障礙座位', type: 'item' },
      { label: '無障礙廁所', type: 'item' },
      { label: '無障礙停車場', type: 'item' },
      { label: '助聽系統', type: 'item' },
      { label: '手語導覽', type: 'item' },
      { label: '口述影像', type: 'item' },
      { label: '觸覺展示', type: 'item' },
    ]
  },
  { 
    label: '展覽類型', 
    icon: 'ph:palette', 
    isOpen: false,
    selected: [],
    options: [
      { label: '全部', type: 'item' },
      { label: '繪畫', type: 'item' },
      { label: '雕塑', type: 'item' },
      { label: '綜合媒材', type: 'item' },
      { label: '書法', type: 'item' },
      { label: '攝影', type: 'item' },
      { label: '設計', type: 'item' },
      { label: '歷史', type: 'item' },
      { label: '數位互動', type: 'item' },
    ]
  },
  { 
    label: '傳統表演藝術類型', 
    icon: 'ph:mask-happy', 
    isOpen: false,
    selected: [],
    options: [
      { label: '全部', type: 'item' },
      { label: '布袋戲', type: 'item' },
      { label: '戲曲', type: 'item' },
      { label: '歌仔戲', type: 'item' },
      { label: '曲藝／相聲', type: 'item' },
      { label: '客家戲', type: 'item' },
      { label: '國樂', type: 'item' },
    ]
  },
  { 
    label: '戲劇類型', 
    icon: 'ph:theater-masks', 
    isOpen: false,
    selected: [],
    options: [
      { label: '全部', type: 'item' },
      { label: '現代戲劇', type: 'item' },
      { label: '音樂劇', type: 'item' },
      { label: '脫口秀、漫才', type: 'item' },
      { label: '偶戲', type: 'item' },
      { label: '馬戲雜技', type: 'item' },
      { label: '歌劇', type: 'item' },
      { label: '肢體劇場', type: 'item' },
      { label: '物件劇場', type: 'item' },
      { label: '環境劇場', type: 'item' },
      { label: '其他戲劇節目', type: 'item' },
    ]
  },
  { 
    label: '舞蹈類型', 
    icon: 'ph:figure-simple-dancing', 
    isOpen: false,
    selected: [],
    options: [
      { label: '全部', type: 'item' },
      { label: '現代舞', type: 'item' },
      { label: '民族舞', type: 'item' },
      { label: '芭蕾舞', type: 'item' },
      { label: '街舞', type: 'item' },
      { label: '其他舞蹈節目', type: 'item' },
    ]
  },
  { 
    label: '音樂類型', 
    icon: 'ph:music-notes', 
    isOpen: false,
    selected: [],
    options: [
      { label: '全部', type: 'item' },
      { label: '流行音樂', type: 'item' },
      { label: '動漫／電影', type: 'item' },
      { label: '現代', type: 'item' },
      { label: '古典', type: 'item' },
      { label: '爵士', type: 'item' },
      { label: '打擊樂', type: 'item' },
      { label: '世界、民族', type: 'item' },
      { label: '其他音樂節目', type: 'item' },
      { label: '編制', type: 'region' },
      { label: '全部', type: 'item' },
      { label: '獨奏', type: 'item' },
      { label: '合奏', type: 'item' },
      { label: '樂團', type: 'item' },
      { label: '獨唱', type: 'item' },
      { label: '合唱', type: 'item' },
    ]
  },
]);

// --- 活動時間 相關狀態 ---
const activeToggle = ref(null); // 'week', 'month', 'year'
const selectedStartDate = ref(null);
const selectedEndDate = ref(null);
const currentViewDate = ref(new Date());

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

const calendarDays = computed(() => {
  const year = currentViewDate.value.getFullYear();
  const month = currentViewDate.value.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const days = [];
  
  // 補足前一個月的天數
  const firstDayWeekday = firstDayOfMonth.getDay();
  for (let i = firstDayWeekday; i > 0; i--) {
    days.push({
      date: new Date(year, month, 1 - i),
      isCurrentMonth: false
    });
  }
  
  // 當前月的天數
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true
    });
  }
  
  // 補足後一個月的天數 (湊滿 42 天，即 6 週)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false
    });
  }
  
  return days;
});

const displayMonthYear = computed(() => {
  const year = currentViewDate.value.getFullYear();
  const month = currentViewDate.value.getMonth() + 1;
  return `${year}年 ${month}月`;
});

// --- 活動時間 邏輯 ---
const setToggleRange = (type) => {
  activeToggle.value = type;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  
  if (type === 'week') {
    end.setDate(start.getDate() + 7);
  } else if (type === 'month') {
    end.setMonth(start.getMonth() + 1);
  } else if (type === 'year') {
    end.setFullYear(start.getFullYear() + 1);
  }
  
  selectedStartDate.value = start;
  selectedEndDate.value = end;
};

const handleDateClick = (date) => {
  activeToggle.value = null; // 手動選擇時取消 toggle 狀態
  
  if (!selectedStartDate.value || (selectedStartDate.value && selectedEndDate.value)) {
    selectedStartDate.value = date;
    selectedEndDate.value = null;
  } else {
    if (date < selectedStartDate.value) {
      selectedEndDate.value = selectedStartDate.value;
      selectedStartDate.value = date;
    } else {
      selectedEndDate.value = date;
    }
  }
};

const isInRange = (date) => {
  if (!selectedStartDate.value || !selectedEndDate.value) return false;
  return date >= selectedStartDate.value && date <= selectedEndDate.value;
};

const isSelected = (date) => {
  return (selectedStartDate.value && date.getTime() === selectedStartDate.value.getTime()) ||
         (selectedEndDate.value && date.getTime() === selectedEndDate.value.getTime());
};

const prevMonth = () => {
  currentViewDate.value = new Date(currentViewDate.value.getFullYear(), currentViewDate.value.getMonth() - 1, 1);
};

const nextMonth = () => {
  currentViewDate.value = new Date(currentViewDate.value.getFullYear(), currentViewDate.value.getMonth() + 1, 1);
};

// --- 通用篩選 邏輯 ---
const toggleFilter = (index) => {
  filters.value[index].isOpen = !filters.value[index].isOpen;
};

const toggleOption = (filterIndex, option) => {
  const filter = filters.value[filterIndex];
  if (!filter.selected) return;

  const optionLabel = option.label;

  if (optionLabel === '全部') {
    if (filter.selected.includes('全部')) {
      filter.selected = [];
    } else {
      filter.selected = ['全部'];
    }
  } else {
    filter.selected = filter.selected.filter(item => item !== '全部');
    
    const index = filter.selected.indexOf(optionLabel);
    if (index > -1) {
      filter.selected.splice(index, 1);
    } else {
      filter.selected.push(optionLabel);
    }
    
    // Auto-select '全部' ONLY for specific filters that require it (like '縣市')
    if (filter.selected.length === 0 && filter.label === '縣市') {
      filter.selected = ['全部'];
    }
  }
};

// --- 發送篩選更新 ---
const collectFilters = () => {
  const result = {
    dateRange: {
      start: selectedStartDate.value,
      end: selectedEndDate.value
    },
    cities: filters.value.find(f => f.label === '縣市')?.selected || ['全部'],
    excludeTickets: filters.value.find(f => f.label === '排除票種')?.selected || [],
    features: filters.value.find(f => f.label === '親子與無障礙')?.selected || [],
    categories: {
      exhibition: filters.value.find(f => f.label === '展覽類型')?.selected || ['全部'],
      traditional: filters.value.find(f => f.label === '傳統表演藝術類型')?.selected || ['全部'],
      drama: filters.value.find(f => f.label === '戲劇類型')?.selected || ['全部'],
      dance: filters.value.find(f => f.label === '舞蹈類型')?.selected || ['全部'],
      music: filters.value.find(f => f.label === '音樂類型')?.selected || ['全部'],
    }
  };
  emit('update:filters', result);
};

// 監聽所有變化
watch(filters, collectFilters, { deep: true });
watch([selectedStartDate, selectedEndDate], collectFilters);

// 初始發送
collectFilters();
</script>

<template>
  <aside class="filter-sidebar h-100 overflow-y-auto pt-3">
    <div v-for="(filter, index) in filters" :key="filter.label" class="filter-group">
      <div v-if="index > 0" class="filter-divider mx-3"></div>
      <button 
        class="filter-header w-100 d-flex align-items-center justify-content-between border-0 bg-transparent py-2 px-4"
        @click="toggleFilter(index)"
      >
        <div class="d-flex align-items-center gap-2">
          <span class="filter-label text-nowrap">{{ filter.label }}</span>
        </div>
        <Icon 
          :icon="filter.isOpen ? 'ph:caret-up' : 'ph:caret-down'" 
          width="20" 
          height="20" 
          class="arrow-icon" 
        />
      </button>

      <transition name="fade">
        <div v-if="filter.isOpen" class="filter-content ps-3 pe-2 pb-3">
          <!-- 活動時間 自定義 UI -->
          <template v-if="filter.label === '活動時間'">
            <div class="date-filter-container px-2">
              <div class="date-toggles d-flex gap-2 mb-3 flex-wrap">
                <button 
                  class="btn btn-outline-secondary flex-shrink-1 py-1 px-2 text-nowrap" 
                  :class="{ active: activeToggle === 'week' }"
                  @click="setToggleRange('week')"
                >一週內</button>
                <button 
                  class="btn btn-outline-secondary flex-shrink-1 py-1 px-2 text-nowrap" 
                  :class="{ active: activeToggle === 'month' }"
                  @click="setToggleRange('month')"
                >一個月內</button>
                <button 
                  class="btn btn-outline-secondary flex-shrink-1 py-1 px-2 text-nowrap" 
                  :class="{ active: activeToggle === 'year' }"
                  @click="setToggleRange('year')"
                >一年內</button>
              </div>

              <!-- Mini Calendar -->
              <div class="mini-calendar border rounded p-2">
                <div class="calendar-nav d-flex justify-content-between align-items-center mb-2">
                  <button class="btn btn-link p-0 text-dark" @click="prevMonth">
                    <Icon icon="ph:caret-left" />
                  </button>
                  <span class="calendar-month-year small fw-bold">{{ displayMonthYear }}</span>
                  <button class="btn btn-link p-0 text-dark" @click="nextMonth">
                    <Icon icon="ph:caret-right" />
                  </button>
                </div>
                <div class="calendar-grid">
                  <div class="calendar-weekdays d-flex">
                    <div v-for="day in weekDays" :key="day" class="weekday-cell text-center small text-muted">
                      {{ day }}
                    </div>
                  </div>
                  <div class="calendar-days d-flex flex-wrap">
                    <div 
                      v-for="(day, dIndex) in calendarDays" 
                      :key="dIndex" 
                      class="day-cell text-center small"
                      :class="{ 
                        'text-muted': !day.isCurrentMonth,
                        'is-selected': isSelected(day.date),
                        'is-in-range': isInRange(day.date),
                        'is-today': new Date().toDateString() === day.date.toDateString()
                      }"
                      @click="handleDateClick(day.date)"
                    >
                      {{ day.date.getDate() }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="selectedStartDate" class="selected-range-info mt-2 text-muted small">
                {{ selectedStartDate.toLocaleDateString() }} 
                <span v-if="selectedEndDate"> - {{ selectedEndDate.toLocaleDateString() }}</span>
              </div>
            </div>
          </template>

          <template v-else-if="filter.options">
            <div class="options-list d-flex flex-column">
              <div 
                v-for="(option, optIndex) in filter.options" 
                :key="`${option.label}-${optIndex}`"
                :class="[
                  'option-item d-flex align-items-center',
                  option.type === 'region' ? 'region-header' : '',
                  option.type === 'instruction' ? 'instruction-text' : '',
                  option.type === 'item' ? 'item-clickable' : ''
                ]"
                @click="option.type === 'item' ? toggleOption(index, option) : null"
              >
                <div v-if="option.type === 'item'" class="check-icon-wrapper d-flex align-items-center justify-content-center">
                  <Icon 
                    v-if="filter.selected.includes(option.label)" 
                    icon="ph:check" 
                    width="20" 
                    height="20" 
                  />
                </div>
                <div v-else-if="option.type === 'instruction'" class="check-icon-wrapper"></div>
                
                <span class="option-label">
                  <template v-if="option.type === 'instruction'">
                    僅顯示全部符合的活動。<br />建議出發前向場館確認。
                  </template>
                  <template v-else>
                    {{ option.label }}
                  </template>
                </span>
              </div>
            </div>
          </template>
        </div>
      </transition>
    </div>
  </aside>
</template>

<style scoped lang="scss">
@use 'bootstrap' as *;

.filter-sidebar {
  width: 100%;
  max-width: var(--size-aside-left-max-width);
  padding: var(--spacing-component-s) var(--spacing-component-l);
  padding-bottom: 16px;
  top: var(--size-component-navbar-height);
  background-color: var(--background-default-default);
}

@include media-breakpoint-up(md) {
  .filter-sidebar {
    padding-left: 0;
    padding-right: 0;
  }
}

@include media-breakpoint-down(md) {
  .filter-sidebar {
    max-width: none;
    padding: 0;
  }
}

.filter-header {
  min-height: 48px;
  color: var(--text-default-default);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--background-default-secondary-hover) !important;
  }

  .filter-label {
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
  }

  .arrow-icon {
    color: var(--icon-default-default);
  }
}

.filter-divider {
  height: 1px;
  background-color: var(--border-default-secondary);
  opacity: 0.5;
}

.filter-content {
  .options-list {
    gap: 4px;
  }

  .option-item {
    padding: 4px 8px;
    border-radius: var(--border-radius-sm);
    min-height: 32px;

    .check-icon-wrapper {
      width: 24px;
      height: 24px;
      margin-right: 4px;
      flex-shrink: 0;
    }
  }

  .item-clickable {
    cursor: pointer;
    color: var(--text-default-default);

    &:hover {
      background-color: var(--background-default-secondary-hover);
    }

    .option-label {
      font-size: 16px;
      font-weight: 400;
      line-height: 1.5;
    }
  }

  .region-header, .instruction-text {
    color: var(--text-default-secondary);
    margin-top: 4px;
    .option-label {
      font-size: 14px;
      font-weight: 700;
      line-height: 1.4;
    }
  }
}

// --- Date Filter Styles ---
.date-toggles {
  .btn {
    font-size: 14px;
    border-color: var(--border-default-default);
    color: var(--text-default-default);

    &:hover, &.active {
      background-color: var(--background-brand-default);
      color: var(--text-brand-on-brand);
      border-color: var(--background-brand-default);
    }
  }
}

.mini-calendar {
  background-color: var(--background-default-default);
  
  .calendar-nav {
    .btn {
      text-decoration: none;
      color: var(--text-default-default);
    }
    .calendar-month-year {
      font-size: 14px;
      color: var(--text-default-default);
    }
  }

  .weekday-cell, .day-cell {
    width: 14.28%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    position: relative;
    z-index: 1;
  }

  .weekday-cell {
    color: var(--text-default-secondary);
    font-weight: 400;
  }

  .day-cell {
    color: var(--text-default-default);
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--background-default-secondary-hover);
    }

    &.text-muted {
      color: var(--text-default-tertiary);
    }

    &.is-today {
      &::after {
        content: '';
        position: absolute;
        width: 80%;
        height: 80%;
        border: 1px solid var(--border-brand-secondary);
        border-radius: 50%;
        pointer-events: none;
      }
    }

    &.is-selected {
      background-color: var(--background-brand-secondary-hover) !important;
      color: var(--text-brand-on-brand) !important;
      border-radius: 50%;
      z-index: 3;
    }

    &.is-in-range {
      background-color: #B4AAA1; // $brand-400 from Figma range middle
      color: var(--text-brand-on-brand) !important;
      border-radius: 0;
      z-index: 2;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
