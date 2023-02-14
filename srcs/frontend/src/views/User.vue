<template>
    <div v-if="!user" class="full-width row wrap justify-evenly items-start content-center q-gutter-y-md">
        <div class="col-xs-11 col-md-6 itemps-stretch q-gutter-md">
            <q-card class="column">
                <q-card-section class="bg-primary text-white text-h6 text-center">
                    No user specified...
                </q-card-section>
            </q-card>
        </div>
    </div>
    <div v-else class="full-width row wrap justify-evenly items-start content-center q-gutter-y-md">
    <div class="col-md-5 col-xs-11 q-gutter-md">
    <q-card class="column">
      <q-card-section class="bg-primary text-white text-h6">
        Player
      </q-card-section>
      <q-card-section>
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar size="100px">
                  <img :src='avatar' />
                  <q-badge v-if="user.status == 'online'" color="green" floating>Online</q-badge>
                  <q-badge v-if="user.status == 'offline'" color="red" floating>Offline</q-badge>
                  <q-badge v-if="user.status == 'playing'" color="orange" floating>Playing</q-badge>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h5">{{ user.pseudo }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
    </q-card>
      <q-card class="column">
        <q-card-section class="bg-primary text-white text-h6">
          Stats
        </q-card-section>
        <q-card-section v-if="history">
          <q-list>
            <q-item>
              <q-item-section>
                <q-circular-progress
                  show-value
                  font-size="12px"
                  :value=100
                  size="50px"
                  :thickness="0.22"
                  color="primary"
                  track-color="grey-3"
                  class="q-ma-md"
                >
                  {{ user.wins }}
                </q-circular-progress>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6">Victories</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-circular-progress v-if="winrate > 66"
                  show-value
                  font-size="12px"
                  :value="winrate"
                  size="50px"
                  :thickness="0.22"
                  color="green"
                  track-color="grey-3"
                  class="q-ma-md"
                >
                  {{ winrate }}%
                </q-circular-progress>
                <q-circular-progress v-else-if="winrate < 33"
                  show-value
                  font-size="12px"
                  :value="winrate"
                  size="50px"
                  :thickness="0.22"
                  color="red"
                  track-color="grey-3"
                  class="q-ma-md"
                >
                  {{ winrate }}%
                </q-circular-progress>
                <q-circular-progress v-else
                  show-value
                  font-size="12px"
                  :value="winrate"
                  size="50px"
                  :thickness="0.22"
                  color="orange"
                  track-color="grey-3"
                  class="q-ma-md"
                >
                  {{ winrate }}%
                </q-circular-progress>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6">Winrate</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section v-else class="text-h6">
          No stats to show
        </q-card-section>
      </q-card>
  </div>
  <div class="col-xs-11 col-md-6 itemps-stretch q-gutter-md">
      <q-card class="column">
        <q-card-section class="bg-primary text-white text-h6">
          Game history
        </q-card-section>
        <q-card-section v-if="history">
          <q-list v-for="entry in history" :key="entry.opponentPseudo">
            <q-item v-if="entry.victory" class="bg-green-2 rounded-borders">
              <q-item-section avatar>
                <q-avatar>
                  <img :src='store.getters.getAvatar' />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>{{ store.getters.getPseudo }}</q-item-label>
              </q-item-section>
              <q-item-section class="content-center text-h6">{{ entry.playerOneScore }} - {{ entry.playerTwoScore }}</q-item-section>
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
                  <img :src='store.getters.getAvatar' />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>{{ store.getters.getPseudo }}</q-item-label>
              </q-item-section>
              <q-item-section class="content-center text-h6">{{ entry.playerOneScore }} - {{ entry.playerTwoScore }}</q-item-section>
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
        </q-card-section>
        <q-card-section v-else class="text-h6">
          This player has never played...
        </q-card-section>
      </q-card>
  </div>
</div>
</template>

<script lang="ts">
import axios from 'axios'
import store from '@/store'
import { BACK_SERVER } from '@/config'
import router from '@/router'
import type { historyType } from '../interfaces/history.type'

export default {
  name: 'User',
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
  async mounted () {
    this.user = await axios.get(
      `${BACK_SERVER}/user/info/${router.currentRoute.value.query.user}`,
      {
        headers: {
          Authorization: `Bearer ${store.state.token}`
        }
      }).then((t) => t.data)
    if (this.user) {
      if (this.user.avatar as number > 0) {
        this.avatar = `${BACK_SERVER}/local-files/${this.user.avatar}`
      }
      const ret = await axios.get(
      `${BACK_SERVER}/user/history/${router.currentRoute.value.query.user}`,
      {
        headers: {
          Authorization: `Bearer ${store.state.token}`
        }
      }).then((t) => t.data)
      console.log(ret)
      if (ret.length > 0) {
        this.history = ret
        this.winrate = this.user.wins / this.history.length * 100
      }
    }
  },
  methods: {
    getAvatar (id: number) {
      if (id !== 0) {
        return `${BACK_SERVER}/local-files/${id}`
      }
      return 'http://sitedemonstre.e-monsite.com/medias/site/logos/39bpdyn_seirjfulq1azt-o0sgw.jpg'
    }
  }
}
</script>
