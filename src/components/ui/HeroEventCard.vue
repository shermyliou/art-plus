<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  title: {
    type: String,
    default: '果陀劇場《深夜小狗神秘習題》'
  },
  category: {
    type: String,
    default: '戲劇'
  },
  rating: {
    type: String,
    default: '普遍級'
  },
  time: {
    type: String,
    default: '2026/5/29 (五) - 2026/8/2 (日)'
  },
  organizer: {
    type: String,
    default: '果陀百娛股份有限公司 (02)8772-1867'
  },
  score: {
    type: Number,
    default: 4.3
  },
  reviewCount: {
    type: Number,
    default: 16
  },
  organizerName: {
    type: String,
    default: '果陀劇團'
  },
  organizerAvatar: {
    type: String,
    default: ''
  },
  image: {
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
  <div class="hero-event-card">
    <div class="hero-event-card__header">
      <div class="hero-event-card__image-container">
        <img :src="image" :alt="title" class="hero-event-card__image" />
      </div>
    </div>
    <div class="hero-event-card__body">
      <div class="hero-event-card__content">
        <div class="hero-event-card__title-group">
          <h1 class="hero-event-card__title">{{ title }}</h1>
        </div>
        
        <div class="hero-event-card__info">
          <p>類別：{{ category }}</p>
          <p>分級：{{ rating }}</p>
          <p>時間：{{ time }}</p>
          <p>主辦：{{ organizer }}</p>
        </div>

        <div class="hero-event-card__rating">
          <span class="hero-event-card__score">{{ score }}</span>
          <div class="hero-event-card__stars">
            <Icon 
              v-for="i in 5" 
              :key="i"
              :icon="i <= Math.floor(score) ? 'ph:star-fill' : (i - score < 1 ? 'ph:star-half-fill' : 'ph:star')" 
              class="hero-event-card__star-icon"
            />
          </div>
          <span class="review-count">({{ reviewCount.toLocaleString() }})</span>
        </div>
      </div>

      <div class="hero-event-card__actions">
        <div class="btn btn-outline-secondary rounded-pill hero-event-card__organizer">
          <div class="hero-event-card__avatar">
            <img 
              :src="organizerAvatar" 
              :alt="organizerName" 
              v-if="organizerAvatar" 
              @error="handleAvatarError"
            />
            <div class="hero-event-card__avatar-placeholder" v-else>
              <Icon icon="ph:user" />
            </div>
          </div>
          <span class="hero-event-card__organizer-name">{{ organizerName }}</span>
        </div>
        
        <div class="hero-event-card__button-group">
          <button class="btn btn-outline-secondary rounded-pill hero-event-card__btn-favorite">
            <Icon icon="ph:heart-bold" width="24"  />
            <span>收藏</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/styles/tokens/_primitive.scss" as *;

.hero-event-card {
  position: relative;
  display: flex;
  gap: 32px;
  align-items: stretch;
  background: var(--background-default-default);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  padding: 16px 56px;
  width: 100%;
  margin: 0 auto;
  // border: 1px solid var(--border-default-default);

  &__header {
    width: 30%;
    max-width: 250px;
    flex-shrink: 0;
  }

  &__image-container {
    height: 100%;
    width: 100%;
    position: relative;
    padding: 16px 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: var(--spacing-component-l) var(--spacing-component-l);
    justify-content: space-between;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px 0px;
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.2;
    color: var(--text-default-default);
    margin: 0;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: var(--text-default-secondary);
    font-size: 16px;
    line-height: 1.5;

    p {
      margin: 0;
    }
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
    color: var(--text-default-default);
  }

  &__stars {
    display: flex;
    gap: 2px;
  }

  &__star-icon {
    font-size: 20px;
    //color: var(--icon-default-tertiary);
    color: $yellow-400;
  }

  .review-count {
    font-size: 16px;
    color: var(--text-default-secondary);
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
  }

  &__organizer {
    width: 100%;
    height: auto;
    padding: 16px 24px;
    gap: var(--spacing-component-m);
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
  }

  &__avatar {
    width: 24px;
    height: 24px;
    border-radius: var(--border-radius-pill);
    overflow: hidden;
    flex-shrink: 0;
    background: var(--background-default-secondary);
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
    font-size: 16px;
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__organizer-name {
    font-size: 16px;
    color: inherit;
  }

  &__button-group {
    width: 100%;
  }

  &__btn-favorite {
    width: 100%;
    height: 43px;
    font-weight: 700;
    font-size: 14px;
    padding: 0;
    gap: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>