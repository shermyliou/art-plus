<script setup>
import HorizontalEventCard from '@/components/ui/HorizontalEventCard.vue';
import CalendarView from '@/components/ui/CalendarView.vue';
import FilterSidebar from '@/components/ui/FilterSidebar.vue';
import { Icon } from '@iconify/vue';
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useEventStore } from '@/stores/useEventStore';

const eventStore = useEventStore();
const route = useRoute();
const searchQuery = ref(route.query.q || '');
const showCalendar = ref(false);

watch(() => route.query.q, (newVal) => {
  searchQuery.value = newVal || '';
});

watch(searchQuery, (newVal) => {
  document.title = newVal ? `${newVal}｜Arts+搜尋結果` : 'Arts+搜尋結果';
}, { immediate: true });

const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value;
};

const tabs = computed(() => [
  { name: "全部", badgeCount: eventStore.events.length },
  { name: "藝文展覽", badgeCount: eventStore.events.filter(e => e.majorCategory === '藝文展覽').length },
  { name: "藝文演出", badgeCount: eventStore.events.filter(e => e.majorCategory === '藝文演出').length },
  { name: "藝文體驗", badgeCount: eventStore.events.filter(e => e.majorCategory === '藝文體驗').length },
  { name: "藝文講座", badgeCount: eventStore.events.filter(e => e.majorCategory === '藝文講座').length },
  { name: "藝文小旅遊", badgeCount: eventStore.events.filter(e => e.majorCategory === '藝文小旅遊').length },
  { name: "線上展覽", badgeCount: eventStore.events.filter(e => e.majorCategory === '線上展覽').length },
]);

const activeTab = ref("全部");
const sidebarFilters = ref(null);

const handleFilterUpdate = (filters) => {
  sidebarFilters.value = filters;
};

const filteredEvents = computed(() => {
  let results = eventStore.events;

  // 1. Top Tab Filter (Major Category)
  if (activeTab.value !== '全部') {
    results = results.filter(e => e.majorCategory === activeTab.value);
  }

  // 2. Search Query Filter
  if (searchQuery.value) {
    results = results.filter(e => e.title.includes(searchQuery.value));
  }

  // 3. Sidebar Filters
  if (sidebarFilters.value) {
    const { dateRange, cities, categories, excludeTickets, features } = sidebarFilters.value;

    // Date Range Filter
    if (dateRange.start && dateRange.end) {
      results = results.filter(e => {
        const eStart = new Date(e.startDate);
        const eEnd = new Date(e.endDate);
        return eStart <= dateRange.end && eEnd >= dateRange.start;
      });
    } else if (dateRange.start) {
      // Only start date selected (selecting range in progress)
      results = results.filter(e => {
        const eEnd = new Date(e.endDate);
        return eEnd >= dateRange.start;
      });
    }

    // City Filter
    if (cities && !cities.includes('全部')) {
      results = results.filter(e => {
        // e.city might be "臺北市、新北市"
        const eventCities = e.city.split('、');
        return eventCities.some(c => cities.includes(c));
      });
    }

    // Category Filters (Sub-categories from Sidebar)
    const { exhibition, traditional, drama, dance, music } = categories;
    const hasCategoryFilter = [exhibition, traditional, drama, dance, music].some(arr => arr.length > 0);

    if (hasCategoryFilter) {
      results = results.filter(e => {
        // 展覽類型 (藝文展覽)
        if (exhibition.length > 0 && e.majorCategory === '藝文展覽') {
          if (exhibition.includes('全部')) return true;
          return exhibition.includes(e.category);
        }

        // 藝文演出系列
        if (e.majorCategory === '藝文演出') {
          // 傳統表演藝術
          if (traditional.length > 0 && (e.category === '傳統藝術' || e.category === '戲曲' || traditional.includes(e.category))) {
            if (traditional.includes('全部')) return true;
            return traditional.includes(e.category);
          }
          // 戲劇
          if (drama.length > 0 && (e.category === '戲劇' || drama.includes(e.category))) {
            if (drama.includes('全部')) return true;
            return drama.includes(e.category);
          }
          // 舞蹈
          if (dance.length > 0 && (e.category === '舞蹈' || dance.includes(e.category))) {
            if (dance.includes('全部')) return true;
            return dance.includes(e.category);
          }
          // 音樂
          if (music.length > 0 && (e.category === '音樂' || music.includes(e.category))) {
            if (music.includes('全部')) return true;
            return music.includes(e.category);
          }
        }

        return false;
      });
    }
    
    // Exclude Ticket Status
    if (excludeTickets.length > 0) {
      if (excludeTickets.includes('排除已售完')) {
        results = results.filter(e => e.ticketStatus !== '已售完');
      }
      // Note: Student and Accessibility ticket exclusion would require more data in events.json
    }
  }

  // 4. Sorting
  const sorted = [...results];
  if (currentSort.value === '日期：近到遠') {
    sorted.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  } else if (currentSort.value === '日期：遠到近') {
    sorted.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  } else if (currentSort.value === '價格：低到高') {
    sorted.sort((a, b) => a.price.min - b.price.min);
  } else if (currentSort.value === '價格：高到低') {
    sorted.sort((a, b) => b.price.max - a.price.max);
  }

  return sorted;
});

const sortOptions = ref([
  '日期：近到遠',
  '日期：遠到近',
  '價格：低到高',
  '價格：高到低',
  '最新'
]);

const currentSort = ref('日期：近到遠');

/**
 * 格式化價格範圍顯示
 * @param {Object} price 
 * @returns {String}
 */
const formatPrice = (price) => {
  if (!price) return '免費';
  if (price.min === 0 && price.max === 0) return '免費';
  return `NT$ ${price.min.toLocaleString()} - ${price.max.toLocaleString()}`;
};

/**
 * 格式化日期範圍顯示
 * @param {String} start 
 * @param {String} end 
 * @returns {String}
 */
const formatDateRange = (start, end) => {
  if (!start) return '';
  if (start === end) return start.replace(/-/g, '/');
  return `${start.replace(/-/g, '/')} - ${end.replace(/-/g, '/')}`;
};
</script>

<template>
  <div class="search-page-container d-flex position-relative">
    <!-- Left Sidebar: Filters -->
    <FilterSidebar class="sidebar" @update:filters="handleFilterUpdate"></FilterSidebar>

    <!-- Main Content Area -->
    <div class="search-content flex-grow-1 d-flex flex-column px-4 overflow-y-auto g-3 container-md ms-0">

      <!-- Fixed Header Section -->
      <div class="fixed-header-section w-100 d-flex flex-nowrap justify-content-between align-items-center sticky-top pt-4 pb-2">

        <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel">
          <div class="offcanvas-header border-bottom">
            <h5 class="offcanvas-title fw-bold" id="offcanvasExampleLabel">篩選器</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body p-0">
            <FilterSidebar @update:filters="handleFilterUpdate" />
          </div>
          <div class="p-3 border-top mt-auto d-md-none">
            <button type="button" class="btn btn-primary w-100 rounded-pill py-3" data-bs-dismiss="offcanvas">
              查看結果
            </button>
          </div>
        </div>

        <!-- Nav Tabs Section -->
        <ul class="nav nav-pills overflow-x-auto flex-shrink-1 nav-tabs-scroll">
          <li v-for="tab in tabs" :key="tab.name" class="nav-item">
            <a class="nav-link d-flex align-items-center justify-content-center gap-1"
              :class="{ active: activeTab === tab.name }" href="#" @click.prevent="activeTab = tab.name">
              <span class="tab-text">{{ tab.name }}</span>
              <span v-if="tab.badgeCount > 0" class="badge rounded-pill bg-danger">
                {{ tab.badgeCount }}
              </span>
            </a>
          </li>
        </ul>
        <!-- Filter/Sort Section -->
        <button class="btn btn-outline-secondary flex-shrink-0 text-nowrap sidebar-toggle" type="button" data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
          <Icon icon="ph:funnel" width="1em" height="1em" />
          <!-- 篩選 -->
        </button>
        <div class="flex-shrink-0 d-flex justify-content-end">
          <div class="dropdown">
            <button class="btn btn-outline-secondary bg-white btn-rect btn-sort-dropdown dropdown-toggle" type="button" id="sortDropdown"
              data-bs-toggle="dropdown" aria-expanded="false">
              <div class="sort-header d-flex">
                <div class="sort-title-area d-flex align-items-center">
                  <div class="sort-icon-wrapper">
                    <Icon icon="ph:sort-ascending" width="20" height="20" class="sort-icon" />
                  </div>
                  <span class="sort-text d-none d-md-block">排序</span>
                </div>
                <!-- <Icon icon="ph:caret-up" width="16" height="16" class="caret-icon" /> -->
              </div>
            </button>
            <ul class="dropdown-menu sort-dropdown-menu" aria-labelledby="sortDropdown">
              <li v-for="option in sortOptions" :key="option">
                <a class="dropdown-item" href="#" @click.prevent="currentSort = option"
                  :class="{ active: currentSort === option }">
                  {{ option }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="results-scroll-area d-flex flex-column">
        <div v-for="event in filteredEvents" :key="event.id">
          <HorizontalEventCard 
            :id="event.id"
            :title="event.title" 
            :category="event.category" 
            :rating="event.rating"
            :ticket-status="event.ticketStatus" 
            :time="formatDateRange(event.startDate, event.endDate)"
            :city="event.city"
            :location="event.venue" 
            :price-range="formatPrice(event.price)"
            :image="event.imageUrl" 
          />
        </div>
      </div>
    </div>

    <!-- Calendar Overlay (Fixed to screen) -->
    <Transition name="fade">
      <div v-if="showCalendar" class="calendar-overlay">
        <div class="container-sm me-0">
          <CalendarView @close="showCalendar = false" />
        </div>
      </div>
    </Transition>

    <!-- Floating Action Button (Fixed to screen) -->
    <button 
      class="btn-calendar-fab"
      @click="toggleCalendar"
      :aria-label="showCalendar ? '關閉行事曆' : '開啟行事曆'"
    >
      <Icon :icon="showCalendar ? 'ph:x' : 'ph:calendar-blank'" width="24" height="24" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.sidebar-toggle {
    display: none; 
    --bs-btn-padding-x: .6875rem;
  }

.fixed-header-section {
  gap: var(--main-gap-x);
  background-color: var(--background-default-default);
  z-index: 1020;
}

.nav-tabs-scroll {
  min-width: 0; // allows flex child to shrink below its content size so overflow-x-auto kicks in
  flex-wrap: nowrap;
}
  
@media (min-width: 769px) {
  .search-content {
    padding-left: 8px !important;
  }
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .sidebar-toggle {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .search-content {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }

  .btn-calendar-fab {
    bottom: 16px;
    right: 16px;
  }
}

  .custom-nav-pills>.nav-item>.nav-link.active {
    background-color: var(--background-brand-hover);
    color: var(--text-brand-on-brand);
  }

.search-page-container {
  height: calc(100dvh - var(--component-navbar-height)); // dvh accounts for mobile browser dynamic toolbars
  overflow: hidden;
}

.search-content {
  height: 100%;
  gap: var(--main-gap-y-large);
}

.results-scroll-area {
  gap: var(--main-gap-x);
  padding-bottom: 80px; // Space for the FAB
}

.calendar-overlay {
  position: absolute;
  bottom: 32px;
  left: 0;
  right: 0;
  z-index: 1040;
  padding: 0 24px;
  pointer-events: none;

  & > div {
    pointer-events: auto;
  }
}

.btn-calendar-fab {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--background-brand-default); // #211f1e
  color: var(--text-brand-on-brand);
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1050;
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover {
    background-color: var(--background-brand-hover);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
}

// Fade transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.winherit {
  width: inherit;
}

.sort-text {
  translate: 0 0.1em;
}

#offcanvasExample {
  &.show {
    padding-top: var(--component-navbar-height);
    width: auto;
  }
}
</style>

.dropdown-toggle {
  --bs-btn-padding-x: .6875rem;
}