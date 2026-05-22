<script setup>
import { Icon } from '@iconify/vue';
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import { useEventStore } from '@/stores/useEventStore';

const userStore = useUserStore();
const eventStore = useEventStore();

// 基準日期 (預設為今天)
const currentDate = ref(new Date());

// 星期名稱
const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

/**
 * 計算當前基準日所在周的所有日期 (週日到週六)
 */
const weekDates = computed(() => {
  const dates = [];
  const baseDate = new Date(currentDate.value);
  // 取得本周週日
  const first = baseDate.getDate() - baseDate.getDay();
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(baseDate.getFullYear(), baseDate.getMonth(), first + i);
    dates.push(day);
  }
  return dates;
});

/**
 * 格式化顯示月份
 */
const displayMonth = computed(() => {
  return (currentDate.value.getMonth() + 1) + '月';
});

/**
 * 判斷是否為今天
 */
const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

/**
 * 格式化日期為 YYYY-MM-DD (本地時間)
 */
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 切換功能
const prevWeek = () => {
  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() - 7);
  currentDate.value = newDate;
};

const nextWeek = () => {
  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() + 7);
  currentDate.value = newDate;
};

const goToToday = () => {
  currentDate.value = new Date();
};

const emit = defineEmits(['close']);
const closeCalendar = () => {
  emit('close');
};

/**
 * 取得收藏活動並轉換為日曆格式
 */
const calendarEvents = computed(() => {
  if (!userStore.currentUser) return [];

  const favoriteIds = userStore.currentUser.favoriteEvents || [];
  const favoriteEvents = eventStore.events.filter(e => favoriteIds.includes(e.id));
  
  const results = [];

  favoriteEvents.forEach(event => {
    // 判斷是否為區間活動 (如展覽)
    if (event.majorCategory === '藝文展覽') {
      results.push({
        id: `deadline-${event.id}`,
        title: event.title,
        date: event.endDate,
        isDeadline: true,
        showSeatStatus: false
      });
    } else {
      // 一般場次活動
      event.sessions.forEach(session => {
        results.push({
          id: `session-${event.id}-${session.date}-${session.time}`,
          title: event.title,
          date: session.date,
          time: session.time,
          isDeadline: false,
          showSeatStatus: true
        });
      });
    }
  });

  return results;
});

/**
 * 將活動分配到對應日期的欄位
 */
const getEventsForDay = (date) => {
  const dateString = formatDate(date);
  return calendarEvents.value.filter(e => e.date === dateString);
};
</script>

<template>
  <div class="calendar-view rounded-4 p-4 shadow-sm">
    <!-- Header -->
    <div class="calendar-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-4 col-12">
          <h2 class="calendar-title m-0">收藏行事曆</h2>
        </div>
        <div class="col-3 col-md-4 text-center">
          <span class="month-display">{{ displayMonth }}</span>
        </div>
        <div class="col-9 col-md-4 d-flex justify-content-end gap-2 align-items-center">
          <button class="btn btn-outline-secondary btn-nav-circle" @click="prevWeek" aria-label="上周">
            <Icon icon="ph:caret-left" width="20" height="20" />
          </button>
          <button class="btn btn-outline-secondary btn-today" @click="goToToday">今天</button>
          <button class="btn btn-outline-secondary btn-nav-circle" @click="nextWeek" aria-label="下周">
            <Icon icon="ph:caret-right" width="20" height="20" />
          </button>
          <!-- <button class="btn btn-link p-0 text-dark ms-2" @click="closeCalendar" aria-label="收合">
            <Icon icon="ph:caret-down" width="24" height="24" />
          </button> -->
        </div>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-container bg-white rounded-3 border">
      <!-- Weekday Labels -->
      <div class="weekday-header d-flex border-bottom">
        <div v-for="day in days" :key="day" class="weekday-cell text-center py-2">
          {{ day }}
        </div>
      </div>

      <!-- Dates Row -->
      <div class="dates-row d-flex">
        <div v-for="date in weekDates" :key="date" class="date-cell d-flex p-2">
          <div class="date-number" :class="{ 'is-today': isToday(date) }">
            {{ date.getDate() }}
          </div>
        </div>
      </div>

      <!-- Events Grid -->
      <div class="events-grid d-flex">
        <div v-for="(date, index) in weekDates" :key="index" class="day-column p-1">
          <div class="events-stack d-flex flex-column gap-1">
            <div 
              v-for="event in getEventsForDay(date)" 
              :key="event.id"
              class="event-card d-flex align-items-center px-2 py-1 rounded-2"
              :class="{ 'is-deadline': event.isDeadline }"
            >
              <div v-if="event.isDeadline" class="badge-deadline me-1">截止</div>
              <span v-else class="event-time me-1">{{ event.time }}</span>
              
              <span class="event-title text-truncate" :title="event.title">{{ event.title }}</span>
              
              <Icon v-if="event.showSeatStatus" icon="ph:users" width="14" height="14" class="ms-1 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.calendar-view {
  background-color: var(--background-default-tertiary);
  border: 1px solid var(--border-default-default);
}

.calendar-title {
  font-family: var(--sds-typography-family-sans, "Noto Sans TC", sans-serif);
  font-weight: 700;
  font-size: 24px;
}

.month-display {
  font-size: 24px;
}

.btn-nav-circle {
  width: 32px;
  height: 32px;
  padding: 0;
}

.btn-today {
  height: 32px;
  padding: 0 16px;
}

.calendar-container {
  width: 100%;
  overflow: hidden;
}

.weekday-cell, .date-cell, .day-column {
  width: 14.285%;
  flex: 0 0 14.285%;
  min-width: 0;
  border-right: 1px solid var(--border-default-default);
  &:last-child { border-right: none; }
}

// 平板：顯示 4 天，其餘可橫向滑動
@media (max-width: 768px) {
  .calendar-container {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .weekday-cell, .date-cell, .day-column {
    width: 25%;
    flex: 0 0 25%;
  }
}

// 手機：顯示 2 天，其餘可橫向滑動
@media (max-width: 576px) {
  .weekday-cell, .date-cell, .day-column {
    width: 50%;
    flex: 0 0 50%;
  }
}

.weekday-header {
  background-color: var(--background-default-default);
  .weekday-cell {
    font-size: 14px;
    color: var(--text-default-secondary);
  }
}

.date-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--text-default-secondary);

  &.is-today {
    background-color: var(--background-brand-default);
    color: var(--text-brand-on-brand);
    border-radius: 50%;
    font-weight: 700;
  }
}

.day-column {
  min-height: 200px;
  background-color: var(--background-default-default);
}

.event-card {
  background-color: rgba(254, 233, 231, 0.6);
  height: 36px;
  font-size: 12px;
  color: black;
  cursor: pointer;
  overflow: hidden; // 確保內容不溢出
  
  &:hover {
    background-color: rgba(254, 233, 231, 0.8);
  }
}
.event-time {
  font-family: "Inter", sans-serif;
  flex-shrink: 0;
  font-size: .75rem;
  transform: translateY(1px); // 視覺補償：向下微調以對齊中文中心
}

.event-title {
  flex-grow: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  translate: 0 0.2em; // 視覺補償：解決 Noto Sans TC 偏上的問題
}

.badge-deadline {
  background-color: var(--background-danger-secondary);
  padding: 2px 8px;
  border-radius: 1000px;
  font-size: .75rem;
  flex-shrink: 0;
  line-height: 1;
  display: flex;
  align-items: center;
  transform: translateY(1px); // 視覺補償
}
</style>
