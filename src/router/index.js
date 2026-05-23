import { createRouter, createWebHashHistory } from 'vue-router'
import PublicLayout from '@/components/common/PublicLayout.vue'
import HomeView from '@/views/HomeView.vue'
import Search from '@/views/Search.vue'
import EventDetail from '@/views/EventDetail.vue'
import EventDetailV2 from '@/views/EventDetailV2.vue'
import OrganizerLayout from '@/components/common/OrganizerLayout.vue'
import EventEdit from '@/views/EventEdit.vue'
import BootstrapChecker from '@/views/BootstrapChecker.vue'
import map from '@/views/map.vue'

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: '',
        component: HomeView,
        name: 'home',
        meta: { title: '首頁｜Arts+' }
      },
      {
        path: 'search',
        component: Search,
        name: 'search',
        meta: { title: 'Arts+搜尋結果' } // Dynamic title will be handled in component or guard
      },
      {
        path: 'event/:id',
        component: EventDetail,
        name: 'event-detail',
        meta: { title: 'Arts+' } // Dynamic title
      },
      {
        path: 'event-v2/:id',
        component: EventDetailV2,
        name: 'event-detail-v2',
        meta: { title: 'Arts+' }
      },
      {
        path: 'bootstrap',
        component: BootstrapChecker,
        name: 'bootstrap-checker',
        meta: { title: 'Bootstrap檢查器｜Arts+' }
      },
    ]
  },
  {
    path: '/organizer',
    component: OrganizerLayout,
    children: [
      {
        path: '',
        component: EventEdit,
        name: 'event-edit',
        meta: { title: '編輯活動｜Arts+主辦方' } // Dynamic title
      },
    ]
  },
  {
    path: '/map',
    component: map,
    name: 'map',
    meta: { title: '藝文地圖｜Arts+' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.afterEach((to) => {
  const defaultTitle = 'Arts+'
  document.title = to.meta.title || defaultTitle
})

export default router