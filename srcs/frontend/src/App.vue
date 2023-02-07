<template>
  <q-layout view="lHh Lpr lFf" class="bg-app">
    <q-header v-if="!$route.meta.hideNav">
      <q-toolbar class="text-white">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        />
        <q-toolbar-title>
          Transcendence
        </q-toolbar-title>
        <q-item clickable>
         <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
        </q-avatar>
        <q-menu secondary transition-show="scale" transition-hide="scale">
          <q-list>
            <q-item to="/account" clickable v-close-popup>
              <q-item-section>Account</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="logout">
              <q-item-section>Logout</q-item-section>
            </q-item>
            <q-separator />
          </q-list>
        </q-menu>
        </q-item>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="!$route.meta.hideNav"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      secondary
    >
      <q-list v-if="!$route.meta.hideNav">
        <q-item-label header>Menu</q-item-label>
        <q-item clickable tag="a" target="_blank">
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Chat</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/game">
          <q-item-section avatar>
            <q-icon name="sports_esports" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Pong</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="app">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { ref } from 'vue'
import store from './store'
import router from '@/router'
import { useQuasar } from 'quasar'

export default {
  name: 'LayoutDefault',
  components: {
  },
  setup () {
    const $q = useQuasar()
    // $q.secondary.set(true)
    return {
      leftDrawerOpen: ref(false)
    }
  },
  methods: {
    async logout () {
      await store.dispatch('logout')
      router.push('/login')
    }
  }
}
</script>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
}

.bg-app {
  background: #222831;
}
</style>
