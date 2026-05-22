<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const overlayRef = ref(null);

const DEFAULT_AVATAR = '/images/avatars/default-avatar.avif';

const handleAvatarError = (event) => {
  event.target.src = DEFAULT_AVATAR;
};

const notifications = ref([
  {
    id: 1,
    user: "沐恩",
    avatar: "/images/char1.png",
    time: "10:54",
    content: "今天的表演跟表演介紹上說好的有出入 服務人員態度也很差",
    unread: true
  },
  {
    id: 2,
    user: "沐恩",
    avatar: "/images/char1.png",
    time: "10:54",
    content: "今天的表演跟表演介紹上說好的有出入 服務人員態度也很差",
    unread: true
  },
  {
    id: 3,
    user: "沐恩",
    avatar: "/images/char1.png",
    time: "10:54",
    content: "今天的表演跟表演介紹上說好的有出入 服務人員態度也很差",
    unread: true
  },
  {
    id: 4,
    user: "沐恩",
    avatar: "/images/char1.png",
    time: "10:54",
    content: "今天的表演跟表演介紹上說好的有出入 服務人員態度也很差",
    unread: true
  },
  {
    id: 5,
    user: "沐恩",
    avatar: "/images/char1.png",
    time: "10:54",
    content: "今天的表演跟表演介紹上說好的有出入 服務人員態度也很差",
    unread: true
  }
]);

const handleClickOutside = (event) => {
  if (overlayRef.value && !overlayRef.value.contains(event.target)) {
    // Avoid double toggle if clicking the bell icon
    const bellIcon = document.querySelector('.bell-trigger');
    if (bellIcon && bellIcon.contains(event.target)) {
      return;
    }
    emit('close');
  }
};

const markAllAsRead = () => {
  notifications.value = notifications.value.map(n => ({ ...n, unread: false }));
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<template>
  <div class="notification-overlay-container" ref="overlayRef">
    <div class="notification-card shadow border rounded-2">
      <div class="notification-header d-flex justify-content-between align-items-center px-4 py-3">
        <h3 class="m-0 title">通知</h3>
        <button class="btn-text-read p-0" @click="markAllAsRead">全部已讀</button>
      </div>

      <div class="notification-list">
        <div 
          v-for="item in notifications" 
          :key="item.id" 
          class="notification-item d-flex align-items-center px-4 py-3"
          :class="{ 'unread': item.unread }"
        >
          <div class="unread-dot-wrapper me-3">
            <div v-if="item.unread" class="unread-dot"></div>
          </div>
          <div class="avatar-wrapper me-3">
            <img 
              :src="item.avatar" 
              alt="avatar" 
              class="avatar-img" 
              @error="handleAvatarError"
            />
          </div>
          <div class="content-wrapper flex-grow-1 overflow-hidden">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="user-name">{{ item.user }}</span>
              <span class="notification-time">{{ item.time }}</span>
            </div>
            <p class="notification-content m-0 text-truncate">{{ item.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.notification-overlay-container {
  position: absolute;
  top: calc(100% + 20px);
  right: 0;
  width: 480px;
  z-index: 1050;

  @media (max-width: 576px) {
    width: calc(100vw - 40px);
    right: -10px;
  }
}

.notification-card {
  background-color: var(--background-default-default);
  overflow: hidden;
}

.notification-header {
  border-bottom: 1px solid var(--border-default-secondary);
  .title {
    font-size: 20px;
    font-weight: 400;
    color: #000;
  }
}

.btn-text-read {
  background: none;
  border: none;
  font-weight: bold;
  font-size: 16px;
  color: #77706a;
  letter-spacing: 1.92px;
  cursor: pointer;

  &:hover {
    color: var(--text-button-hover);
  }
}

.notification-list {
  max-height: 500px;
  overflow-y: auto;
}

.notification-item {
  border-bottom: 1px solid var(--border-default-default);
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--background-default-default-hover);
  }

  &:last-child {
    border-bottom: none;
  }
}

.unread-dot-wrapper {
  width: 12px;
  display: flex;
  justify-content: center;
}

.unread-dot {
  width: 12px;
  height: 12px;
  background-color: #8465ff;
  border-radius: 50%;
}

.avatar-wrapper {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 16px;
  color: #1e1e1e;
}

.notification-time {
  font-size: 16px;
  color: #8e8e93;
}

.notification-content {
  font-size: 16px;
  color: #8e8e93;
  letter-spacing: 0.16px;
}
</style>