<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps({
  noHover: {
    type: Boolean,
    default: false
  }
});

/**
 * @typedef {Object} myNavItem
 * @property {string} name - 導航名稱
 * @property {string} icon - Iconify 圖標代碼
 * @property {string} path - 路由路徑
 */

/** @type {myNavItem[]} */
const navItems = [
  { name: '首頁', icon: 'ph:house-line', path: '/' },
  { name: '會員中心', icon: 'ph:user', path: '/profile' },
  { name: '藝文足跡', icon: 'ph:sneaker-move', path: '/footprint' },
  { name: '地點蒐藏', icon: 'ph:heart', path: '/favorites' },
  { name: '瀏覽紀錄', icon: 'ph:clock-counter-clockwise', path: '/history' },
];

const activePath = ref('/');
const isHovered = ref(false);

/**
 * 處理導航點擊事件，切換目前選中狀態
 * @param {string} path 
 */
const handleNavClick = (path) => {
  activePath.value = path;
};

</script>

<template>
  <aside 
    class="sidebar-container d-flex flex-column border-end"
    :class="{ 'expanded': isHovered }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- 導航選單區域 -->
    <nav class="nav-menu flex-grow-1 py-5 px-3">
      <ul class="nav vstack gap-3">
        <template v-for="(item, index) in navItems" :key="item.path">
    
        <div v-if="index === 3" style="height: 1px; background-color: #999; opacity: 0.5; margin: 4px 8px;"></div>

        <li class="nav-item">
        <div
        class="nav-link d-flex align-items-center py-2 px-2"
        :class="{ 
          'active': activePath === item.path,
          'justify-content-center': !isHovered,
          'gap-3': isHovered,
          'no-hover': props.noHover,
        }"
        style="cursor: pointer;"
        @click="handleNavClick(item.path)">
        <Icon :icon="item.icon" width="30" height="30" />
        <span v-if="isHovered" class="nav-label fw-normal text-nowrap">{{ item.name }}</span>
      </div>
    </li>

  </template>
</ul>

      <!-- 分隔線 -->
      <div class="sidebar-divider my-4 mx-2"></div>
     

      <!-- 歷史紀錄區域 -->
      <div class="history-section d-flex flex-column gap-4 align-items-center mt-2">
        <!-- 單一歷史紀錄 -->
        <div class="history-item d-flex flex-column align-items-center gap-2">
          <div 
            class="history-image-placeholder rounded-3 bg-gray-300"
            :class="isHovered ? 'size-large' : 'size-small'"
          ></div>
          <p class="history-title mb-0 text-center" :class="{ 'expanded-text': isHovered }">
            大院子藝文展場
          </p>
        </div>

        <!-- 多個同地區歷史紀錄 -->
        <div class="history-item d-flex flex-column align-items-center gap-2">
          <div 
            class="multi-history-wrapper position-relative"
            :class="isHovered ? 'size-large' : 'size-small'"
          >
            <div class="history-image-placeholder rounded-3 bg-gray-300 second-layer"></div>
            <div class="history-image-placeholder rounded-3 bg-gray-300 first-layer border border-white border-2">
               <!-- Badge count -->
               <div class="history-badge position-absolute bottom-0 end-0 p-1 me-1 mb-1">
                 <span class="badge-text">2</span>
               </div>
            </div>
          </div>
          <p class="history-title mb-0 text-center" :class="{ 'expanded-text': isHovered }">
            臺北
          </p>
        </div>
      </div>
    </nav>
  </aside>
</template>

<style scoped lang="scss">
.sidebar-container {
  position: absolute;
  left: 0;
  top:0;
  width: 62px;
  height: 100%;
  background-color: var(--background-default-secondary);
  border-color: var(--border-default-default) !important;
  transition: width 0.3s ease;
  z-index: 1000;
  overflow-x: hidden;

  &.expanded {
    width: 240px;
    padding-left: 12px;
    padding-right: 12px;
  }

  .nav-link {
    color: var(--text-brand-default);
    border-radius: var(--border-radius-sm);
    transition: all 0.2s ease;
    height: 48px;
    border: none !important; // 徹底去掉所有邊框

    &:hover {
      background-color: var(--background-default-default-hover);
      .nav-label {
      font-weight: 700 !important;
     }
    }

    &.active {
      background-color: transparent; 
      color: var(--text-brand-default);
      border: none !important;
    }
    
    &.no-hover {
    border: none !important;
    box-shadow: none !important;
    outline: none !important;

    &.hover {
      background-color: transparent !important;
      border: none !important;
      .nav-label {
        font-weight: 700 !important; 
       }
     }
  
    &:focus {
      border: none !important;
      box-shadow: none !important;
      outline: none !important;
    }

    &:active {
      border: none !important;
      box-shadow: none !important;
      outline: none !important;
    }
   }
    
  }

  .nav-label {
    font-size: 20px;
    letter-spacing: 0.2px;
  }

  .sidebar-divider {
    height: 1px;
    background-color:var(--gray-600);
    opacity: 0.5;
    margin: 8px 8px;
  }

  .history-section {
    width: 100%;
  }

  .history-image-placeholder {
    background-color: #d9d9d9;
    
    &.size-small {
      width: 48px;
      height: 48px;
    }

    &.size-large {
      width: 130px;
      height: 130px;
    }
  }

  .history-title {
    font-size: 16px;
    color: var(--text-default-default);
    letter-spacing: 0.48px;
    max-width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.expanded-text {
      font-size: 20px;
      max-width: 180px;
      letter-spacing: 0.6px;
    }
  }

  .multi-history-wrapper {
    &.size-small {
      width: 48px;
      height: 48px;
      .first-layer { width: 44px; height: 44px; position: absolute; left: 0; top: 0; }
      .second-layer { width: 44px; height: 44px; position: absolute; left: 4px; top: 4px; }
      .badge-text { font-size: 12px; }
    }

    &.size-large {
      width: 140px;
      height: 140px;
      .first-layer { width: 130px; height: 130px; position: absolute; left: 0; top: 0; }
      .second-layer { width: 130px; height: 130px; position: absolute; left: 10px; top: 10px; }
      .badge-text { font-size: 20px; }
    }
  }

  .history-badge {
    color: var(--text-default-default);
  }
}
</style>
