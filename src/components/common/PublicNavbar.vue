<script setup>
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import SearchOverlay from "@/components/ui/SearchOverlay.vue";
import NotificationOverlay from "@/components/ui/NotificationOverlay.vue";
import UserOverlay from "@/components/ui/UserOverlay.vue";

const router = useRouter();
const isSearchVisible = ref(false);
const isNotificationVisible = ref(false);
const isUserVisible = ref(false);

const searchQuery = ref("");
const searchInput = ref(null);

const handleSearch = (query) => {
  isSearchVisible.value = false;
  router.push({ path: '/search', query: { q: query || searchQuery.value } });
};

const expandSearch = async () => {
  isSearchVisible.value = true;
  await nextTick();
  if (searchInput.value) {
    searchInput.value.focus();
  }
};

const closeSearch = () => {
  isSearchVisible.value = false;
  searchQuery.value = "";
};

</script>

<template>
  <nav class="navbar navbar-expand-lg custom-navbar brand-50 fixed-top">
    <div class="container-fluid p-0 d-flex align-items-center position-relative h-100">
      <a class="navbar-brand me-md-auto me-0 animate-entrance" href="#" style="animation-delay: 0s">
        <img src="/images/ArtsPlusLogo.svg" alt="ArtsPlus" />
      </a>

      <div class="d-flex align-items-center gap-md-4 gap-0 ms-4 h-100">
        <div
          class="search-wrapper animate-entrance"
          style="animation-delay: 0.1s"
          :class="{ 'expanded': isSearchVisible }"
          @click="!isSearchVisible && expandSearch()"
        >
          <div class="search-bar-inner d-flex align-items-center gap-2 px-md-3 px-0">
            <button
              v-if="isSearchVisible"
              class="btn btn-close-search p-0 d-md-none"
              @click.stop="closeSearch"
            >
              <Icon icon="ph:caret-left" width="24px" />
            </button>

            <Icon icon="ph:magnifying-glass" class="search-icon" width="24px"/>

            <input
              v-if="isSearchVisible"
              v-model="searchQuery"
              type="text"
              placeholder="今天想看些什麼？"
              class="search-input-field flex-grow-1"
              @keyup.enter="handleSearch(searchQuery)"
              ref="searchInput"
            />
            <span v-else class="search-placeholder-text">搜尋</span>

            <button
              v-if="isSearchVisible"
              class="btn btn-search-trigger p-0 ms-2"
              @click.stop="handleSearch(searchQuery)"
            >
              搜尋
            </button>
          </div>
        </div>

        <Teleport to="body">
          <Transition name="fade-slide">
            <SearchOverlay
              v-if="isSearchVisible"
              @close="isSearchVisible = false"
              @search="handleSearch"
            />
          </Transition>
        </Teleport>

        <div class="navbar-actions">
          <div class="nav-item-icon animate-entrance" style="animation-delay: 0.2s">
            <Icon icon="ph:shopping-cart" />
          </div>
          <div class="nav-item-icon animate-entrance" style="animation-delay: 0.2s">
            <Icon icon="ph:ticket" />
          </div>
          
          <div class="nav-item-icon position-relative bell-trigger animate-entrance" style="animation-delay: 0.2s" @click="isNotificationVisible = !isNotificationVisible">
            <Transition name="icon-fade" mode="out-in">
              <Icon :key="isNotificationVisible" :icon="isNotificationVisible ? 'ph:bell-fill' : 'ph:bell'" />
            </Transition>
            
            <Transition name="fade-slide">
              <NotificationOverlay 
                v-if="isNotificationVisible" 
                @close="isNotificationVisible = false" 
              />
            </Transition>
          </div>

          <div class="nav-item-icon position-relative user-trigger animate-entrance" style="animation-delay: 0.2s" @click="isUserVisible = !isUserVisible">
            <Transition name="icon-fade" mode="out-in">
              <Icon :key="isUserVisible" :icon="isUserVisible ? 'ph:user-fill' : 'ph:user'" />
            </Transition>
            
            <Transition name="fade-slide">
              <UserOverlay 
                v-if="isUserVisible" 
                @close="isUserVisible = false" 
              />
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.custom-navbar {
  background-color: var(--background-brand-secondary);
  height: var(--component-navbar-height);
  border-bottom: 1px solid #eeeeee;
  padding: 0 60px !important;
  z-index: 2000;

  @media (max-width: 1200px) {
    padding: 0 20px !important;
  }
}

.navbar-brand img {
  height: 32px;

  @media (max-width: 768px) {
    height: 22px;
  }
}

.search-wrapper {
  border-radius: 50px;
  border: 1px solid var(--border-brand-default);
  width: 200px;
  height: 40px;
  display: flex;
  align-items: center;
  transition: width 0.3s ease, background-color 0.3s ease, left 0.3s ease, right 0.3s ease;
  overflow: hidden;
  cursor: pointer;
  background-color: transparent;

  &.expanded {
    width: 600px;
    background-color: var(--background-brand-secondary);
    cursor: default;

    @media (max-width: 1400px) {
      width: 500px;
    }

    @media (max-width: 992px) {
      width: 400px;
    }
  }

  @media (max-width: 1400px) {
    width: 150px;
  }

  @media (max-width: 768px) {
    width: 40px;
    border: none;
    justify-content: center;

    .search-placeholder-text {
      display: none;
    }

    &.expanded {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: var(--component-navbar-height);
      border-radius: 0;
      z-index: 2100;
      padding: 0 20px;
      background-color: var(--background-brand-secondary);
      border-bottom: 1px solid #eeeeee;

      .search-bar-inner {
        width: 100%;
        gap: 12px !important;
      }
    }
  }
}

.search-bar-inner {
  width: 100%;
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

.btn-search-trigger {
  font-weight: bold;
  font-size: 14px;
  color: var(--text-brand-on-brand-secondary);
  white-space: nowrap;
  letter-spacing: 1px;
  border: none;
  background: none;

  &:hover {
    color: var(--text-brand-default);
  }
}

.btn-close-search {
  border: none;
  background: none;
  color: var(--text-default-default);
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: -1;
}

.nav-item-icon {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 24px;
  color: #333333;
}

// Fade Slide Transition
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
