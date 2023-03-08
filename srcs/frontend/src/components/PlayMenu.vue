<template>
  <div class="q-pa-md">
    <q-card flat bordered dark>
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>Play</q-toolbar-title>
      </q-toolbar>
      <q-item v-ripple dark>
        <q-item-section side top>
          <q-checkbox v-model="hardMode" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Hard</q-item-label>
          <q-item-label caption>Play with everything going faster.</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-ripple dark>
        <q-item-section side top>
          <q-checkbox v-model="normalMode" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Normal</q-item-label>
          <q-item-label caption>Or take it easy!</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="loading">
        <q-item-section>
          <q-item-label>{{ message }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-card-actions vertical>
        <q-btn :disable="btnDisabled" :loading="loading" @click="goPlay" color="secondary">Play</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import router from '@/router'
import store from '../store'
import { io, Socket } from 'socket.io-client'

export default {
  name: 'PlayMenu.vue',
  setup (): any {
    return {
      normalMode: ref(false),
      hardMode: ref(false),
      colorBtn: ref('grey'),
      loading: ref(false),
      message: ref('')
    }
  },
  computed: {
    btnDisabled (): boolean {
      if (this.normalMode === false && this.hardMode === false) {
        return true
      }
      return false
    }
  },
  watch: {
    normalMode (value): void {
      if (value) {
        this.hardMode = false
      }
    },
    hardMode (value): void {
      if (value) {
        this.normalMode = false
      }
    }
  },
  methods: {
    waitQueue () {
      if (this.normalMode === true) {
        this.$router.push('/play?mode=normal&role=player')
      } else {
        this.$router.push('/play?mode=hard&role=player')
      }
    },
    goPlay (): void {
      store.dispatch('createSocket')
      const socket = store.getters.getSocket
      socket.on('waitingForPlayer', (data) => {
        this.loading = true
        this.message = data.message
      }).once('updatePlayground', (data) => {
        this.waitQueue()
      })
    }
  }
}
</script>
