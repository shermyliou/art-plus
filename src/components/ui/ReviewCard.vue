<script setup>
import { Icon } from '@iconify/vue'

/**
 * myReviewCardProps - 評論卡片屬性介面
 */
defineProps({
  userName: {
    type: String,
    default: 'Diana Campos'
  },
  userAvatar: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: '2026/5/29'
  },
  score: {
    type: Number,
    default: 4.3
  },
  comment: {
    type: String,
    default: ''
  }
})

const DEFAULT_AVATAR = '/images/avatars/default-avatar.avif';

const handleAvatarError = (event) => {
  event.target.src = DEFAULT_AVATAR;
};
</script>

<template>
  <div class="review-card">
    <div class="review-card__header">
      <div class="review-card__user">
        <div class="review-card__avatar">
          <img 
            v-if="userAvatar" 
            :src="userAvatar" 
            :alt="userName" 
            @error="handleAvatarError"
          />
          <div v-else class="review-card__avatar-placeholder">
            <Icon icon="ph:user" />
          </div>
        </div>
        <span class="review-card__username">{{ userName }}</span>
      </div>
      <span class="review-card__date">{{ date }}</span>
    </div>
    <div class="review-card__body">
      <div class="review-card__rating d-flex">
        <span class="review-card__score">{{ score }}</span>
        <div class="review-card__stars">
          <Icon 
            v-for="i in 5" 
            :key="i"
            :icon="i <= Math.floor(score) ? 'ph:star-fill' : (i - score < 1 ? 'ph:star-half-fill' : 'ph:star')" 
            class="review-card__star-icon"
          />
        </div>
      </div>
      <p v-if="comment" class="review-card__comment">{{ comment }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/styles/tokens/_primitive.scss" as *;

.review-card {
  background-color: var(--gray-0);
  border: 1px solid var(--border-default-default);
  border-radius: var(--border-radius-md);
  padding: 16px 32px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 21px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: var(--border-radius-pill);
    overflow: hidden;
    background-color: var(--background-default-secondary);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__avatar-placeholder {
    font-size: 24px;
    color: var(--icon-default-secondary);
  }

  &__username {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: var(--text-default-default);
  }

  &__date {
    font-family: var(--sds-typography-family-sans), 'Noto Sans TC', sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 1.5;
    color: var(--text-default-tertiary);
    letter-spacing: 1px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 45px;
  }

  &__score {
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 20px;
    line-height: 1.5;
    color: #000;
  }

  &__stars {
    display: flex;
    align-items: center;
  }

  &__star-icon {
    font-size: 24px;
    //color: var(--icon-default-tertiary);
    color: $yellow-400;
  }

  &__comment {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-default-default);
    word-break: break-word;
  }
}
</style>