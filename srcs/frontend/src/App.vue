<!-- <script lang="ts">
     import { RouterLink, RouterView } from 'vue-router'
     import router from '@/router';
     import axios from 'axios';
     import { BACK_SERVER } from './config';

     export default {
     created() {
     window.addEventListener('beforeunload', () => {
     axios.get(
     `${BACK_SERVER}/auth/logout`,
     {
     headers: {
     Authorization: `Bearer ${localStorage.token}`,
     }
     })
     }, false)
     },
     }

     </script> -->

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
          <img :src='avatar'>
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
        <q-item clickable tag="a" to="/chat">
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
        <q-item clickable to="/friends">
          <q-item-section avatar>
            <q-icon name="supervised_user_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Friends</q-item-label>
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
      leftDrawerOpen: ref(false),
      store: store
    }
  },
  computed: {
    avatar (): string {
      return this.store.state.avatar
    }
  },
  methods: {
    async logout () {
      await store.dispatch('logout')
      router.push('/login')
    }
  },
  created () {
    window.addEventListener('beforeunload', () => {
      store.dispatch('logout')
    }, false)
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
