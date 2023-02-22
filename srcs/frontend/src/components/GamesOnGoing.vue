<template>
  <div class="q-pa-md">
    <q-card flat dark>
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>Games On Going</q-toolbar-title>
      </q-toolbar>
      <q-list>
        <div v-for="game in games" v-bind:key="game.playerOne">
          <q-item>
            <q-item-section>{{ game.playerOne }} VS {{ game.playerTwo }}</q-item-section>
            <q-item-section side>
              <q-btn color="secondary" @click="specGame(game.roomName)">Spectate</q-btn>
            </q-item-section>
          </q-item>
          <q-separator />
        </div>
      </q-list>
    </q-card>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import store from '../store'
import router from '@/router'
import { ref } from 'vue'
import { BACK_SERVER } from '@/config'

export default {
  name: 'GamesOnGoing',
  setup (): any {
    return {
      games: ref([])
    }
  },
  async beforeMount (): Promise<void> {
    const response = await axios.get(`${BACK_SERVER}/api/rooms`, {
      headers: { Authorization: `Bearer ${store.getters.getToken}` }
    })

    if (response.data.rooms.length > 0) {
      this.populateGames(response.data.rooms)
    }
  },
  methods: {
    populateGames (gamesResponse): void {
      for (const game of gamesResponse) {
        this.games.push({
          playerOne: game.player1,
          playerTwo: game.player2,
          roomName: game.roomname
        })
      }
    },
    specGame (roomId): void {
      router.push(`/spec?roomname=${roomId}`)
    }
  }
}
</script>
