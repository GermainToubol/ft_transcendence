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
        INFOS
      </q-card-section>
      <q-card-section>
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src='avatar' />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ user.pseudo }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
    </q-card>
      <q-card class="column">
        <q-card-section class="bg-primary text-white text-h6">
          Stats
        </q-card-section>
      </q-card>
  </div>
  <div class="col-xs-11 col-md-6 itemps-stretch q-gutter-md">
      <q-card class="column">
        <q-card-section class="bg-primary text-white text-h6">
          History
        </q-card-section>
        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>{{ history }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
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
      history: {}
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
    console.log('ICI')
    if (this.user) {
      if (this.user.avatar > 0) {
        this.avatar = `${BACK_SERVER}/local-files/${this.user.id}`
      }
      this.history = await axios.get(
      `${BACK_SERVER}/user/history/${router.currentRoute.value.query.user}`,
      {
        headers: {
          Authorization: `Bearer ${store.state.token}`
        }
      }).then((t) => t.data)
    }
  }
}
</script>
