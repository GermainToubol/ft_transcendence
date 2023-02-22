import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import AuthCallback from '../views/AuthCallback.vue'
import Account from '../views/Account.vue'
import ManageGame from '../views/ManageGame.vue'
import Spec from '../views/Spec.vue'
import store from '../store'
import Chat from '../views/Chat.vue'
import Friends from '../views/Friends.vue'
import User from '../views/User.vue'
import Game from '../views/Game.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresLogin: true,
      hideNav: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresLogin: false,
      hideNav: true
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      requiresLogin: false,
      hideNav: false
    }
  },
  {
    path: '/auth_callback',
    name: 'AuthCallback',
    component: AuthCallback,
    meta: {
      requiresLogin: false,
      hideNav: true
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: {
      requiresLogin: true,
      hideNav: false
    }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    meta: {
      requiresLogin: true,
      hideNav: false
    }
  },
  {
    path: '/friends',
    name: 'Friends',
    component: Friends,
    meta: {
      requiresLogin: true,
      hideNav: false
    }
  },
  {
    path: '/user',
    name: 'User',
    component: User,
    meta: {
      requiresLogin: true,
      hideNav: false
    }
  },
  {
    path: '/game',
    name: 'ManageGame',
    component: ManageGame,
    meta: {
      requiresLogin: true,
      hideNav: false
    }
  },
  {
    path: '/play',
    name: 'Game',
    component: Game,
    meta: {
      requiresLogin: true,
      hideNav: false
    }
  },
  {
    path: '/spec',
    name: 'Spec',
    component: Spec,
    meta: {
      requiresLogin: true,
      hideNav: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresLogin === false) {
    return next()
  }

  if (from.name !== 'AuthCallback') {
    await store.dispatch('validateToken')
  }
  if (store.getters.isAuthenticated === false) {
    await store.dispatch('logout')
    return next('/login')
  }

  return next()
})

export default router
