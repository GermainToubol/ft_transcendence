<template>
<div class="q-pa-md">
  <q-card flat bordered dark>
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>Played games</q-toolbar-title>
    </q-toolbar>
    <q-card-section v-if="history">
          <q-scroll-area style="height: 424px"
            :thumb-style="{
              right: '0px',
              borderRadius: '5px',
              width: '5px',
              opacity: '0.75'
            }"
            :content-style="{
              backgroundColor: 'rgba(0,0,0,0.02)',
              color: '#555'
            }"
            :content-active-style="{
              backgroundColor: '#eee',
              color: 'black'
            }">
            <q-list v-for="entry in history" :key="entry.opponentPseudo">
              <q-item v-if="entry.victory" class="bg-green-2 rounded-borders">
              <q-item-section avatar>
                <q-avatar>
                  <img :src='getAvatar(user.avatar)' />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>{{ user.pseudo }}</q-item-label>
              </q-item-section>
              <q-item-section class="text-center text-h6">
                <q-item-label>
                  {{ entry.playerOneScore }} - {{ entry.playerTwoScore }}
                </q-item-label>
                <q-item-label caption v-if="entry.hard == false">
                  Normal
                </q-item-label>
                <q-item-label caption v-else>
                  Difficult
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>{{ entry.opponentPseudo }}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-avatar>
                  <img :src='getAvatar(entry.opponentAvatar)' />
                </q-avatar>
              </q-item-section>
            </q-item>
            <q-item v-else class="bg-red-2 rounded-borders">
              <q-item-section avatar>
                <q-avatar>
                  <img :src='getAvatar(user.avatar)' />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>{{ user.pseudo }}</q-item-label>
              </q-item-section>
              <q-item-section class="text-center text-h6">
                <q-item-label>
                  {{ entry.playerOneScore }} - {{ entry.playerTwoScore }}
                </q-item-label>
                <q-item-label caption v-if="entry.hard == false">
                  Normal
                </q-item-label>
                <q-item-label caption v-else>
                  Difficult
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>{{ entry.opponentPseudo }}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-avatar>
                  <img :src='getAvatar(entry.opponentAvatar)' />
                </q-avatar>
              </q-item-section>
            </q-item>
            <q-separator spaced inset="item" />
          </q-list>
        </q-scroll-area>
        </q-card-section>
        <q-card-section v-else class="text-h6">
          This player has never played...
        </q-card-section>
  </q-card>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import store from '../store'
import { ref } from 'vue'
import { BACK_SERVER } from '@/config'
import type { historyType } from '../interfaces/history.type'

export default {
  name: 'History',
  setup () {
    return {
      store: store
    }
  },
  data () {
    return {
      user: null,
      avatar: 'http://sitedemonstre.e-monsite.com/medias/site/logos/39bpdyn_seirjfulq1azt-o0sgw.jpg',
      history: null as historyType[],
      winrate: 0
    }
  },
  async beforeMount (): Promise<void> {
    const pseudo = this.store.getters.getPseudo
    this.user = await axios.get(
      `${BACK_SERVER}/api/user/info/${pseudo}`,
      {
        headers: {
          Authorization: `Bearer ${store.state.token}`
        }
      }).then((t) => t.data)
    if (this.user) {
      if (this.user.avatar as number > 0) {
        this.avatar = `${BACK_SERVER}/api/local-files/${this.user.avatar}`
      }
      const ret = await axios.get(
      `${BACK_SERVER}/api/user/history/${pseudo}`,
      {
        headers: {
          Authorization: `Bearer ${store.state.token}`
        }
      }).then((t) => t.data)
	  if (ret.length > 0) {
        this.history = ret
      }
    }
  },
  methods: {
    getAvatar (id: number) {
      if (id !== 0) {
        return `${BACK_SERVER}/api/local-files/${id}`
      }
      return 'http://sitedemonstre.e-monsite.com/medias/site/logos/39bpdyn_seirjfulq1azt-o0sgw.jpg'
    }
  }
}
</script>
