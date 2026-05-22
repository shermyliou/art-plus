<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useUserStore } from '@/stores/useUserStore';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const userStore = useUserStore();
const overlayRef = ref(null);

const DEFAULT_AVATAR = '/images/avatars/default-avatar.avif';

const handleAvatarError = (event) => {
  event.target.src = DEFAULT_AVATAR;
};

const accounts = computed(() => {
  return userStore.users
    .filter(u => [11, 22].includes(u.id))
    .map(u => ({
      id: u.id,
      name: u.nickname,
      avatar: u.avatar,
      org: u.role === 'organizer' ? '主辦單位' : '',
      type: u.role === 'organizer' ? 'organization' : 'personal'
    }));
});

const selectUser = (id) => {
  const user = userStore.users.find(u => u.id === id);
  if (user) {
    userStore.currentUser = { ...user };
  }
};

const handleClickOutside = (event) => {
  if (overlayRef.value && !overlayRef.value.contains(event.target)) {
    // Avoid double toggle if clicking the user icon
    const userTrigger = document.querySelector('.user-trigger');
    if (userTrigger && userTrigger.contains(event.target)) {
      return;
    }
    emit('close');
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
  <div class="user-overlay-container" ref="overlayRef">
    <div class="user-card p-2 shadow border rounded-2">
      <!-- Account List -->
      <div class="account-list mb-3">
        <div 
          v-for="account in accounts" 
          :key="account.id" 
          class="user-row d-flex align-items-center gap-3 p-2 mb-1"
          :class="{ active: userStore.currentUser?.id === account.id }"
          @click="selectUser(account.id)"
        >
          <div class="avatar-wrapper">
            <img 
              :src="account.avatar" 
              alt="avatar" 
              class="avatar-img" 
              @error="handleAvatarError"
            />
          </div>
          <div class="user-info">
            <div class="user-name text-nowrap">{{ account.name }}</div>
            <div v-if="account.org" class="user-org">{{ account.org }}</div>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <div class="btn btn-text ps-1">會員中心</div>
        <div class="btn btn-text ps-1" v-if="userStore.currentUser?.role === 'organizer'">主辦方後台</div>
      </div>
      <!-- Actions -->
      <div class="actions-row d-flex align-items-center justify-content-center">
        <button v-if="!userStore.isLoggedIn" class="btn btn-primary rounded-pill text-nowrap">登入</button>
        <button v-if="!userStore.isLoggedIn" class="btn btn-text text-nowrap">註冊</button>
        <button v-else class="btn btn-outline-secondary btn-rect text-nowrap w-100" @click="userStore.logout()">登出</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-overlay-container {
  position: absolute;
  top: calc(100% + 20px);
  right: 0;
  z-index: 1050;
}

.user-card {
  background-color: var(--background-default-default);
}

.user-row {
  cursor: pointer;
  border-radius: var(--border-radius-sm);
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--background-default-default-hover);
  }

  &.active{
    background-color: var(--background-default-secondary);
    border: 1px solid var(--border-default-secondary);
  }
}

.avatar-wrapper {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-size: 16px;
  color: #1e1e1e;
  line-height: 1.5;
}

.user-org {
  font-size: 14px;
  color: #8e8e93;
  line-height: 1.4;
}
</style>
