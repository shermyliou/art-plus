<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useEventStore } from '@/stores/useEventStore';
import EventNavTabs from '@/components/ui/EventNavTabs.vue';
import VenueSelector from '@/components/ui/VenueSelector.vue';
import ReviewCard from '@/components/ui/ReviewCard.vue';
import EventCard from '@/components/ui/EventCard.vue';

const route = useRoute();
const eventStore = useEventStore();
const eventId = parseInt(route.params.id);

const event = computed(() => eventStore.events.find(e => e.id === eventId));

const coverImage = computed(() =>
  event.value?.coverImage || event.value?.image || '/images/event-dog.jpeg'
);
const organizer = computed(() => event.value?.organizer || {});
const sessions = computed(() => event.value?.sessions || []);
const accessibilityFeatures = computed(() => event.value?.accessibilityFeatures || []);

const dateRange = computed(() => {
  if (!event.value?.startDate) return '';
  const fmt = d => d.replace(/-/g, '/');
  const s = event.value.startDate;
  const e = event.value.endDate;
  return s === e ? fmt(s) : `${fmt(s)} - ${fmt(e)}`;
});

const activeTab = ref('購票資訊');
const tabs = [
  { name: '購票資訊', id: '#booking' },
  { name: '活動資訊', id: '#info' },
  { name: '藝文地圖', id: '#map' },
  { name: '重要須知', id: '#notice' },
  { name: '心得評論', id: '#review' },
];

// 從 sessions 提取唯一場館清單
const venueOptions = computed(() => {
  const seen = new Set();
  return sessions.value
    .filter(s => { const has = seen.has(s.venue); seen.add(s.venue); return !has; })
    .map(s => ({ id: s.venue, name: s.venue }));
});

const selectedVenue = ref('');
watch(venueOptions, opts => {
  if (opts.length && !selectedVenue.value) selectedVenue.value = opts[0].id;
}, { immediate: true });

const filteredSessions = computed(() =>
  selectedVenue.value
    ? sessions.value.filter(s => s.venue === selectedVenue.value)
    : sessions.value
);

const reviews = computed(() => {
  const cmts = event.value?.comments || [];
  if (cmts.length) {
    return cmts.map(c => ({
      id: c.id,
      name: c.user,
      score: c.rating || 4.0,
      text: c.content || '',
      date: c.date || ''
    }));
  }
  return [
    { id: 1, name: 'Diana Campos', score: 4.3, text: '', date: '2026/04/20' },
    { id: 2, name: '路人甲', score: 5.0, text: '如果我能解開謎團，這是不是表示，我可以完成任何計劃？我有能力達成任何理想？當世界簡化為公式，勇氣是唯一的未知數。', date: '2026/04/21' },
    { id: 3, name: 'Lee', score: 3.5, text: '場地稍微有點小。', date: '2026/04/22' }
  ];
});

const relatedEvents = computed(() =>
  eventStore.events.filter(e => e.id !== eventId).slice(0, 3)
);

const showFullSummary = ref(false);

const openNoticeId = ref(null);
const toggleNotice = id => {
  openNoticeId.value = openNoticeId.value === id ? null : id;
};

const notices = [
  {
    id: 1,
    title: '購票注意事項',
    content: '請於購票完成後保留電子票券，入場前出示票券 QR Code 以供驗票。本活動不接受現場補票，請提前購票。每筆訂單最多購買 4 張，如需洽購大量票券，請聯絡主辦單位。'
  },
  {
    id: 2,
    title: '演出注意事項',
    content: '演出開始後謝絕遲到入場，請提前 15 分鐘抵達場地完成入場手續。演出中全程禁止拍照、攝影及錄音，請配合遵守場館規定。請勿攜帶外食進入觀眾席，並關閉手機或調至靜音模式。'
  },
  {
    id: 3,
    title: '退換票說明',
    content: '本活動票券一經售出，恕不退換。如遇不可抗力因素（主辦方公告）致演出取消或延期，將依主辦規定辦理退票事宜。請妥善保管票券，遺失恕不補發。'
  },
  {
    id: 4,
    title: '場館相關規定',
    content: '本場館全面禁菸（含電子菸）。請勿攜帶寵物（導盲犬除外）。場館備有寄物服務，大型行李請於入場前寄放。輪椅使用者請提前致電場館確認無障礙動線。'
  }
];

const transportInfo = [
  {
    id: 1, icon: 'ph:train-simple',
    title: '捷運',
    content: '搭乘捷運至「中正紀念堂站」出口 2，步行約 8 分鐘可抵達。'
  },
  {
    id: 2, icon: 'ph:bus',
    title: '公車',
    content: '搭乘 0 東、5、15、22、38、244、252、294 路，於「中正紀念堂站」下車。'
  },
  {
    id: 3, icon: 'ph:car',
    title: '自行開車',
    content: '沿中山南路行駛，至愛國西路右轉後，依指示進入地下停車場。車位有限，建議搭乘大眾交通工具。'
  },
  {
    id: 4, icon: 'ph:bicycle',
    title: 'YouBike',
    content: '場館附近設有多處 YouBike 2.0 站點，可於官方 App 查詢即時車位狀況。'
  }
];

const newsItems = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80',
    title: '2026 春季巡迴正式開跑',
    excerpt: '本年度春季巡迴共計八個城市，三月份台北場次部分席次已告售罄，有意觀賞的觀眾請儘速購票。主辦方另公告將於台中、高雄增設加場。',
    author: '果陀劇場官方'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbdd4f1?auto=format&fit=crop&w=600&q=80',
    title: '學生票限時八折優惠',
    excerpt: '即日起至 4 月 30 日止，憑有效學生證件購票享八折優惠，每人限購 2 張。本優惠限指定座位區，售完為止，詳情請洽售票網站。',
    author: '藝術加編輯部'
  }
];

const formatDate = session => {
  const d = new Date(session.date);
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return `${session.date.replace(/-/g, '/')} (${days[d.getDay()]}) ${session.time}`;
};

const getTotalRemaining = session =>
  session.tickets.reduce((sum, t) => sum + (t.remaining || 0), 0);

const formatPrice = p => `NT$ ${p.toLocaleString()}`;
</script>

<template>
  <div class="event-detail-v2">

    <!-- 橫幅圖 -->
    <div class="event-detail-v2__banner">
      <img :src="coverImage" :alt="event?.title" class="event-detail-v2__banner-img" />
    </div>

    <!-- 活動標題 + 操作列 (sticky) -->
    <div class="event-detail-v2__header">
      <div class="event-detail-v2__header-info">
        <span class="event-detail-v2__category-badge">{{ event?.category || '藝文演出' }}</span>
        <h1 class="event-detail-v2__title">{{ event?.title }}</h1>
      </div>
      <div class="event-detail-v2__header-actions">
        <p class="event-detail-v2__date-range">{{ dateRange }}</p>
        <div class="event-detail-v2__interaction">
          <button class="event-detail-v2__buy-btn">購買</button>
          <button class="event-detail-v2__save-btn" aria-label="收藏">
            <Icon icon="ph:heart" width="24" />
          </button>
        </div>
      </div>
    </div>

    <!-- 評分 + 主辦方 -->
    <div class="event-detail-v2__description">
      <div class="d-flex align-items-center gap-2">
        <Icon icon="ph:star-fill" class="text-warning" width="24" />
        <span class="fw-semibold fs-5">{{ event?.rating?.toFixed(1) }}</span>
        <span class="text-secondary">({{ event?.ratingCount }})</span>
      </div>
      <div class="d-flex align-items-center gap-2 ms-auto">
        <div class="event-detail-v2__organizer-avatar">
          <Icon icon="ph:user" width="20" />
        </div>
        <span class="text-secondary small">{{ organizer.name }}</span>
      </div>
    </div>

    <!-- 分頁導覽 (sticky)：直接放在大容器下，讓 nav-wrapper 的 containing block 夠高才能 sticky -->
    <EventNavTabs :tabs="tabs" v-model:activeTab="activeTab" />

    <!-- 雙欄主體：主內容 + 固定側欄 -->
    <div class="event-detail-v2__body">

      <!-- 主內容欄 -->
      <div class="event-detail-v2__main">

        <!-- 01 購票資訊 -->
        <section id="booking" class="event-section">
          <div class="event-section__header">
            <h2 class="event-section__title">購票資訊</h2>
            <button class="btn btn-outline-secondary btn-sm rounded-pill">前往訂票</button>
          </div>

          <div class="mb-4">
            <h3 class="event-section__subtitle">選擇場館</h3>
            <VenueSelector :venues="venueOptions" v-model="selectedVenue" />
          </div>

          <div>
            <h3 class="event-section__subtitle">選擇場次</h3>
            <div class="session-grid">
              <div
                v-for="session in filteredSessions"
                :key="session.id"
                class="session-card"
              >
                <div class="session-card__date">{{ formatDate(session) }}</div>
                <div class="session-card__venue">
                  <Icon icon="ph:map-pin" width="14" />
                  {{ session.venue }}
                </div>
                <div class="session-card__remaining">
                  <span class="session-card__remaining-label">剩</span>
                  <span class="session-card__remaining-count">{{ getTotalRemaining(session) }}</span>
                </div>
                <div class="session-card__prices">
                  <p class="session-card__prices-label">票價：</p>
                  <div class="d-flex flex-wrap gap-2">
                    <span
                      v-for="ticket in session.tickets"
                      :key="ticket.type"
                      class="badge bg-light text-dark border"
                    >
                      {{ ticket.type }} {{ formatPrice(ticket.price) }}
                    </span>
                  </div>
                </div>
                <button class="btn btn-primary w-100 rounded-2 mt-auto">購買</button>
              </div>
            </div>
          </div>
        </section>

        <!-- 02 活動資訊 -->
        <section id="info" class="event-section event-section--bordered">
          <div class="event-section__header">
            <h2 class="event-section__title">活動資訊</h2>
          </div>

          <!-- 最新消息 -->
          <div class="mb-5">
            <h3 class="event-section__subtitle">最新消息</h3>
            <div class="row g-3">
              <div v-for="item in newsItems" :key="item.id" class="col-sm-6">
                <div class="news-card">
                  <div class="news-card__image">
                    <img :src="item.image" :alt="item.title" />
                  </div>
                  <div class="news-card__body">
                    <h4 class="news-card__title">{{ item.title }}</h4>
                    <p class="news-card__excerpt">{{ item.excerpt }}</p>
                    <div class="news-card__author">
                      <div class="news-card__author-avatar">
                        <Icon icon="ph:user" width="14" />
                      </div>
                      <span>{{ item.author }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI 摘要 -->
          <div class="ai-summary mb-5">
            <div class="ai-summary__header">
              <span class="fw-semibold">AI 簡介摘要</span>
              <button
                class="btn btn-sm btn-outline-secondary rounded-pill"
                @click="showFullSummary = !showFullSummary"
              >
                {{ showFullSummary ? '收合' : '展開' }}
              </button>
            </div>
            <div class="ai-summary__body">
              <p>
                本次演出改編自暢銷推理小說，探討自閉症少年如何透過數學邏輯解謎、走入世界的勇氣之旅。
                <template v-if="showFullSummary">
                  結合現代劇場技術與多媒體動態投影，在舞台上重現小說中那道充滿謎題的夜晚，帶給觀眾前所未有的沉浸式劇場體驗。演員以精準的肢體語言詮釋角色的情感轉折，在笑聲與淚水交織中，帶領觀眾重新審視「正常」的定義。
                </template>
              </p>
            </div>
          </div>

          <!-- 節目介紹 -->
          <div class="mb-5">
            <h3 class="event-section__subtitle">節目介紹</h3>
            <p class="text-secondary lh-lg">
              《深夜小狗神秘習題》改編自英國作家馬克・哈頓的同名小說，是一齣充滿懸疑色彩的推理劇。故事主角克里斯多夫是一位患有亞斯伯格症的 15 歲男孩，他智識超群，對數學有著天生的感知，卻無法理解一般人的情緒與謊言。
            </p>
            <p class="text-secondary lh-lg">
              當他調查鄰居家的小狗死亡事件，這場看似單純的謎題，卻將他帶入了遠比死亡更加複雜的人心迷宮。果陀劇場以獨特的舞台語言和視覺設計，透過大量投影和音效，將克里斯多夫腦海中精密運算的世界具象化，創造出一場既詩意又震撼的劇場體驗。
            </p>
            <p class="text-secondary lh-lg">
              本劇曾在倫敦西區及百老匯大獲好評，由台灣知名導演重新詮釋，融入在地視角與文化元素，呈現截然不同的生命感受。
            </p>
          </div>

          <!-- 主辦方介紹 -->
          <div class="creator-section mb-5">
            <h3 class="event-section__subtitle">主辦方介紹</h3>
            <div class="creator-section__content">
              <p class="text-secondary lh-lg mb-3">
                果陀劇場成立於 1988 年，為台灣劇場界的重要推手之一，長期致力於將國際優秀劇目以華語呈現，並推動本土原創音樂劇的創作與發展。劇團以精湛演技、精緻製作聞名於兩岸三地，累積超過百齣大型製作，演出足跡遍及亞洲各城市。
              </p>
              <p class="text-secondary lh-lg mb-0">
                歷年代表作品包括音樂劇《我的大老婆》、《ART》、《天使不夜城》等，每年固定在國家劇院、城市舞台等頂級場館演出，深受觀眾喜愛。果陀以「讓劇場貼近每一個人」為使命，致力提供多元且高品質的舞台藝術體驗。
              </p>
            </div>
          </div>

          <!-- 活動背景 -->
          <div>
            <h3 class="event-section__subtitle">活動背景</h3>
            <p class="text-secondary lh-lg">
              本劇原著《深夜小狗神秘習題》出版於 2003 年，榮獲英國書商小說獎、英國文學協會圖書獎等多項大獎，全球銷量突破千萬冊，被翻譯成 44 種語言出版。舞台劇版本由英國國家劇院製作，首演後立即成為西區最熱門劇目之一，並多次赴紐約百老匯演出。
            </p>
          </div>
        </section>

      </div>

      <!-- 固定右側欄：場地小地圖 -->
      <aside class="event-detail-v2__sidebar">
        <div class="publish-sidebar">
          <p class="publish-sidebar__label">場地資訊</p>
          <div class="publish-sidebar__map-preview">
            <div class="publish-sidebar__map-inner">
              <Icon icon="ph:map-trifold" width="48" height="48" class="text-secondary opacity-50" />
              <span class="text-secondary small mt-2">{{ event?.venue }}</span>
            </div>
          </div>
          <router-link to="/map" class="btn btn-outline-secondary w-100 rounded-pill d-flex align-items-center justify-content-center gap-2">
            <Icon icon="ph:map-pin" width="16" />
            在地圖上查看
          </router-link>
        </div>
      </aside>

    </div>

    <!-- 全寬附加區塊 -->
    <div class="event-detail-v2__additional">

      <!-- 03 藝文地圖 -->
      <section id="map" class="event-section event-section--wide">
        <div class="event-section__header">
          <h2 class="event-section__title">藝文地圖</h2>
        </div>
        <div class="map-preview">
          <Icon icon="ph:map-trifold" width="64" height="64" class="text-secondary opacity-25" />
          <div class="map-preview__pin">
            <Icon icon="ph:map-pin-fill" class="text-danger" width="36" />
          </div>
          <p class="text-secondary mt-2">{{ event?.venue || '場館地圖' }}</p>
        </div>
        <div class="mt-5">
          <h3 class="event-section__subtitle">如何抵達</h3>
          <div class="transport-list">
            <div
              v-for="item in transportInfo"
              :key="item.id"
              class="transport-item"
            >
              <div class="transport-item__icon">
                <Icon :icon="item.icon" width="22" />
              </div>
              <div class="transport-item__content">
                <strong class="d-block mb-1">{{ item.title }}</strong>
                <p class="mb-0 text-secondary small">{{ item.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 04 無障礙空間 -->
      <section id="accessibility" class="event-section event-section--wide">
        <div class="event-section__header">
          <h2 class="event-section__title">無障礙空間</h2>
        </div>
        <div class="accessibility-list">
          <div
            v-for="feature in accessibilityFeatures"
            :key="feature"
            class="accessibility-item"
          >
            <Icon icon="ph:check-circle-fill" class="text-success" width="20" />
            <span>{{ feature }}</span>
          </div>
          <p v-if="!accessibilityFeatures.length" class="text-secondary">
            請洽主辦方確認無障礙設施詳情。
          </p>
        </div>
      </section>

      <!-- 重要須知 -->
      <section id="notice" class="event-section event-section--wide">
        <div class="event-section__header">
          <h2 class="event-section__title">重要須知</h2>
        </div>
        <div class="notice-accordion">
          <div
            v-for="notice in notices"
            :key="notice.id"
            class="notice-item"
          >
            <button
              class="notice-item__trigger"
              @click="toggleNotice(notice.id)"
              :aria-expanded="openNoticeId === notice.id"
            >
              <span>{{ notice.title }}</span>
              <Icon
                :icon="openNoticeId === notice.id ? 'ph:caret-up' : 'ph:caret-down'"
                width="18"
              />
            </button>
            <div v-if="openNoticeId === notice.id" class="notice-item__content">
              <p class="text-secondary lh-lg">{{ notice.content }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 05 心得評論 -->
      <section id="review" class="event-section event-section--wide">
        <div class="event-section__header">
          <h2 class="event-section__title">心得評論</h2>
        </div>
        <div class="d-flex flex-column gap-3">
          <ReviewCard
            v-for="item in reviews"
            :key="item.id"
            :userName="item.name"
            :score="item.score"
            :comment="item.text"
            :date="item.date"
          />
        </div>
        <button class="btn btn-primary rounded-2 w-100 mt-4 d-flex align-items-center justify-content-center gap-2">
          <Icon icon="ph:pencil-line-fill" width="20" />
          發表評論
        </button>
      </section>

      <!-- 06 推薦活動 -->
      <section id="related" class="event-section event-section--wide">
        <div class="event-section__header">
          <h2 class="event-section__title">推薦活動</h2>
        </div>
        <div class="row g-3">
          <div
            v-for="item in relatedEvents"
            :key="item.id"
            class="col-md-4"
          >
            <EventCard
              :title="item.title"
              :image="item.image"
              :time="item.startDate"
              :location="item.venue"
              :price="item.price?.min"
              :tag="item.category"
            />
          </div>
        </div>
      </section>

    </div>

  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/styles/tokens/_primitive.scss" as *;

.event-detail-v2 {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px 80px;

  // navbar (72px) + header (109px) = 181px：NavTabs 疊在 sticky 標題列下方
  :deep(.nav-wrapper) {
    top: calc(var(--size-component-navbar-height) + 109px) !important;
  }

  // --- 橫幅 ---
  &__banner {
    width: 100%;
    height: 377px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;

    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  // --- 標題列 (sticky) ---
  &__header {
    position: sticky;
    top: var(--size-component-navbar-height);
    z-index: 1025;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    padding: 12px 0;
    border-bottom: 1px solid var(--border-default-default);

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__header-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  &__category-badge {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    background: #fff;
    border: 1px solid var(--border-default-default);
    color: var(--text-default-default);
    font-size: 12px;
    font-weight: 400;
    line-height: 1.5;
    padding: 4px 12px;
    border-radius: 1000px;
    margin-bottom: 12px;
  }

  &__title {
    font-size: 36px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.36px;
    margin: 0;
    color: var(--text-default-default);
  }

  &__header-actions {
    flex-shrink: 0;
    width: 238px;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  &__date-range {
    font-size: 14px;
    color: var(--text-default-secondary);
    letter-spacing: 0.14px;
    line-height: 1.4;
    margin-bottom: 4px;
  }

  &__interaction {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 0;
  }

  &__buy-btn {
    flex: 1;
    height: 48px;
    background: $brand-700;
    color: $brand-50;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    font-size: 16px;
    letter-spacing: 1.92px;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.85;
    }
  }

  &__save-btn {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-default-default);
    transition: color 0.2s ease;
    padding: 0;

    &:hover {
      color: $brand-700;
    }
  }

  // --- 評分列 ---
  &__description {
    display: flex;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid var(--border-default-default);
  }

  &__organizer-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--background-default-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--icon-default-secondary);
  }

  // --- 雙欄主體 ---
  &__body {
    display: grid;
    grid-template-columns: 1fr 362px;
    gap: 24px;
    align-items: start;
    padding: 24px 0;

    @media (max-width: 1100px) {
      grid-template-columns: 1fr;
    }
  }

  // --- 固定右側欄 ---
  // navbar (72px) + header (109px) + navtabs (~80px) = 261px
  &__sidebar {
    position: sticky;
    top: calc(var(--size-component-navbar-height) + 109px + 80px);

    @media (max-width: 1100px) {
      display: none;
    }
  }

  // --- 全寬附加區 ---
  &__additional {
    border-top: 1px solid var(--border-default-default);
  }
}

// ── 通用 Section ──────────────────────────────────────────
.event-section {
  padding: 40px 60px;

  &--bordered {
    border-top: 1px solid var(--border-default-default);
  }

  &--wide {
    padding: 48px 60px;
    border-top: 1px solid var(--border-default-default);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    color: var(--text-default-default);
  }

  &__subtitle {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-default-secondary);
    margin-bottom: 12px;
  }
}

// ── 場次卡片格 ────────────────────────────────────────────
.session-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.session-card {
  border: 1px solid var(--border-default-default);
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  &__date {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-default-default);
  }

  &__venue {
    font-size: 13px;
    color: var(--text-default-secondary);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__remaining {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  &__remaining-label {
    font-size: 13px;
    color: var(--text-default-secondary);
  }

  &__remaining-count {
    font-size: 36px;
    font-weight: 700;
    font-family: 'Roboto', sans-serif;
    line-height: 1.1;
    color: var(--text-default-default);
  }

  &__prices {
    flex: 1;
  }

  &__prices-label {
    font-size: 13px;
    color: var(--text-default-secondary);
    margin-bottom: 8px;
  }
}

// ── 右側固定欄 ────────────────────────────────────────────
.publish-sidebar {
  border: 1px solid var(--border-default-default);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--background-default-default);

  &__label {
    font-size: 13px;
    color: var(--text-default-secondary);
    margin: 0;
  }

  &__map-preview {
    width: 100%;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    background: var(--background-default-secondary);
  }

  &__map-inner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

// ── 地圖區塊 ─────────────────────────────────────────────
.map-preview {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  background: var(--background-default-secondary);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__pin {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%);
  }
}

// ── 交通資訊 ─────────────────────────────────────────────
.transport-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-default-default);
  border-radius: 8px;
  overflow: hidden;
}

.transport-item {
  display: flex;
  gap: 16px;
  padding: 20px 24px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--border-default-default);
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: var(--background-brand-subtle, #f5f5f5);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--icon-brand-default);
  }

  &__content {
    flex: 1;
  }
}

// ── 無障礙空間 ───────────────────────────────────────────
.accessibility-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.accessibility-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--border-default-default);
  border-radius: 50px;
}

// ── 重要須知 accordion ───────────────────────────────────
.notice-accordion {
  border: 1px solid var(--border-default-default);
  border-radius: 8px;
  overflow: hidden;
}

.notice-item {
  &:not(:last-child) {
    border-bottom: 1px solid var(--border-default-default);
  }

  &__trigger {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    color: var(--text-default-default);
    transition: background 0.15s;

    &:hover {
      background: var(--background-default-secondary);
    }
  }

  &__content {
    padding: 0 24px 20px;

    p {
      margin: 0;
      line-height: 1.75;
    }
  }
}

// ── 最新消息卡片 ─────────────────────────────────────────
.news-card {
  border: 1px solid var(--border-default-default);
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;

  &__image {
    height: 180px;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    margin: 0;
    color: var(--text-default-default);
    line-height: 1.4;
  }

  &__excerpt {
    font-size: 13px;
    color: var(--text-default-secondary);
    line-height: 1.65;
    margin: 0;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text-default-secondary);
    margin-top: 4px;
  }

  &__author-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--background-default-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
}

// ── AI 摘要 ──────────────────────────────────────────────
.ai-summary {
  border: 1px solid var(--border-default-default);
  border-radius: 8px;
  overflow: hidden;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: var(--background-default-secondary);
    border-bottom: 1px solid var(--border-default-default);
  }

  &__body {
    padding: 16px;
    color: var(--text-default-secondary);
    line-height: 1.75;

    p {
      margin: 0;
    }
  }
}

// ── 主辦方介紹 ───────────────────────────────────────────
.creator-section {
  &__content {
    padding: 24px;
    background: var(--background-default-secondary);
    border-radius: 8px;
  }
}
</style>
