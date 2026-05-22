<script setup>
defineProps({
  title: String,
  time: String,
  location: String,
  price: Number,
  tag: String,
  image: String,
})
</script>

<template>
  <div class="event-card">
    <div class="event-card__image">
      <img :src="image" :alt="title" />
      <span v-if="tag" class="event-card__tag">{{ tag }}</span>
    </div>
    <div class="event-card__body">
      <h3 class="event-card__title">{{ title }}</h3>
      <ul class="event-card__meta">
        <li class="event-card__meta-item">
          <iconify-icon icon="ph:clock" />
          {{ time }}
        </li>
        <li class="event-card__meta-item">
          <iconify-icon icon="ph:map-pin" />
          {{ location }}
        </li>
        <li class="event-card__meta-item">
          <iconify-icon icon="ph:tag" />
          NT$ {{ price }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.event-card {
  min-width: var(--size-component-card-min-width);
  max-width: var(--size-component-card-max-width);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: var(--background-default-default);
  border: 1px solid var(--border-default-default);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.event-card__image {
  position: relative;
  aspect-ratio: 16 / 9;
}

.event-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-card__tag {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: var(--background-brand-default);
  color: var(--text-brand-on-brand);
  font-size: 0.75rem;
  padding: var(--spacing-component-s) var(--spacing-component-s);
  border-radius: var(--border-radius-pill);
}

.event-card__body {
  padding: var(--spacing-component-l) var(--spacing-component-l);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-component-xs);
}

.event-card__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-default-default);
  margin: 0;
}

.event-card__meta {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-component-xs);
}

.event-card__meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-component-xs);
  font-size: 0.875rem;
  color: var(--text-default-secondary);
}
</style>