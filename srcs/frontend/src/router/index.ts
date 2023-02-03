import { createRouter, createWebHistory } from 'vue-router'
import useJwtStore from "../stores/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/callback',
      name: 'callback',
      component: () => import('../views/CallBackView.vue')
    },
    {
      path: '/login/2fa',
      name: '2fa',
      component: () => import('../views/2FAFormView.vue')
    },
	{
		path: '/2fa/generate',
		name: 'generate2fa',
		component: () => import('../views/2FAGenerateView.vue')
	},
	{
		path: '/2fa/enable',
		name: 'enable2fa',
		component: () => import('../views/2FAActivateView.vue')
	},
	{
		path: '/avatar',
		name: 'avatar',
		component: () => import('../views/AvatarView.vue')
	},
	{
		path: '/pseudo',
		name: 'pseudo',
		component: () => import('../views/PseudoView.vue')
	},
	{
		path: '/game',
		name: 'game',
		component: () => import('../views/Game.vue')
	},
	{
		path: '/logout',
		name: 'logout',
		component: () => import('../components/Auth/Logout.vue')
	},
	{
		path: '/rooms',
		name: 'rooms',
		component: () => import('../views/Rooms.vue')
	},
	{
		path: '/spec',
		name: 'spec',
		component: () => import('../views/Spec.vue')
	},
	{
		path: '/history',
		name: 'history',
		component: () => import('../views/History.vue')
	},
	{
		path: '/friends',
		name: 'friends',
		component: () => import('../views/Friends.vue')
	},
  ]
})

async function isAuthenticated(): Promise<boolean> {
	let jwtStore = useJwtStore();
	if (await jwtStore.validateToken(localStorage.token).then((t) => t)) {
		return true;
	}
	return false;
}

router.beforeEach(async (to, from) => {
	if (to.name === 'callback' || to.name === 'login' || to.name === '2fa' || to.name === 'logout')
		return
	const allowed = await isAuthenticated().then((t) => t);
	if (!allowed)
		return { name: 'login' };
})

export default router

