
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'Login/:type?/:slug?',
        name: 'Login page',
        hide: true,
        component: () => import('pages/Login.vue'),
        meta: {
          icon: 'person',
          requiresAuth: true, //     <-+--- This is necessary in order to override in SideBar.vue
          hideWhenLoggedIn: true, // <-+
          permissions: ['read']
        }
      },
      {
        path: 'Main',
        name: 'Home',
        component: () => import('pages/Index.vue'),
        meta: {
          icon: 'home',
          requiresAuth: true,
          hideWhenLoggedIn: false,
          permissions: ['read']
        }
      },
      {
        path: 'Messages',
        name: 'DB Messages',
        component: () => import('pages/Messages.vue'),
        meta: {
          icon: 'fas fa-envelope-open-text',
          requiresAuth: true,
          hideWhenLoggedIn: false,
          permissions: ['read']
        }
      },
      {
        path: 'ManageAccount',
        name: 'Manage Account',
        component: () => import('pages/ManageAccount.vue'),
        meta: {
          icon: 'fas fa-user-secret',
          requiresAuth: true, //     <-+--- This is necessary in order to override in SideBar.vue
          hideWhenLoggedIn: true, // <-+
          permissions: ['read']
        }
      },
      {
        path: 'About',
        name: 'About this app',
        component: () => import('pages/About.vue'),
        meta: {
          icon: 'fas fa-question-circle',
          requiresAuth: false,
          hideWhenLoggedIn: false,
          permissions: ['read']
        }
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
