<script setup>
/**
 * myBookingCardProps - 訂票卡片屬性介面
 */
defineProps({
  date: {
    type: String,
    default: '2026/3/28 (六) 10:00'
  },
  location: {
    type: String,
    default: '衛武營國家藝術文化中心'
  },
  stock: {
    type: [Number, String],
    default: 253
  },
  price: {
    type: String,
    default: '750 、 1,000'
  }
})

const emit = defineEmits(['buy'])
</script>

<template>
  <div class="booking-card">
    <div class="booking-card__body">
      <div class="booking-card__info-group">
        <div class="booking-card__info-item">
          <p class="booking-card__text booking-card__text--large">{{ date }}</p>
        </div>
        <div class="booking-card__info-item">
          <p class="booking-card__text booking-card__text--large">{{ location }}</p>
        </div>
      </div>
      <div class="booking-card__detail-group">
        <p class="booking-card__text">剩：{{ stock }}</p>
        <p class="booking-card__text">票價：{{ price }}</p>
      </div>
    </div>

    <button class="btn btn-primary rounded-2">購買</button>

  </div>
</template>

<style lang="scss" scoped>
//@use "@/assets/styles/tokens/_semantic.scss" as tokens;
@import "@/assets/styles/tokens/_primitive.scss"; // 確保基礎變數先載入
@import "@/assets/styles/tokens/_semantic.scss";

.booking-card {
  background-color: #fff; // 基礎設定為純白背景
  border: 1px solid #eee; // 基礎設定為較淺的邊框
  border-radius: $border-radius-md;
  padding: 12px 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s ease; // 確保所有變化都具有流暢轉場
  cursor: pointer;

  &:hover {
    transform: translateY(-3px); // 懸浮時向上浮動 3px
    box-shadow: var(--bs-shadow-lg); // 增加 Bootstrap 大陰影
    background-color: $gray-50; // 懸浮時背景設為 $gray-50
    border-color: transparent; // 隱藏邊框以凸顯陰影效果
    border: 1px solid $gray-300 !important;
  }

  &__body {
    display: flex;
    flex-direction: column;
    justify-content: center; // 確保文字垂直置中
    gap: 16px;
    padding: 12px 0;
  }

  &__info-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__info-item {
    display: flex;
    align-items: center;
  }

  &__detail-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__text {
    margin: 0;
    font-family: 'Roboto', 'Noto Sans JP', sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #000;

    &--large {
      font-size: 16px;
      line-height: 1.2;
      color: var(--text-default-default);
    }
  }

  // 確保購買按鈕不受外層 hover 背景影響
  .btn-primary {
    z-index: 1;
  }
}
</style>