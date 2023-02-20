<template>
<div class="q-pa-md">
  <q-card flat bordered dark>
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>Played games</q-toolbar-title>
    </q-toolbar>
    <q-table
    table-header-class="grey"
    :rows="games"
    :columns="headers"
    row-key="label"
    separator="horizontal"
    no-results-label="No data available"
    hide-pagination
    bordered
    dark
    >
    <template v-slot:body-cell-victory="item">
      <q-td>
        <q-icon :name="item.row.victory ? 'done_outline' : 'cancel'" :color="item.row.victory ? 'green' : 'red'" />
      </q-td>
    </template>
    </q-table>
  </q-card>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import store from '../store'
import { ref } from 'vue'

export default {
  name: 'History',
  setup (): any {
    return {
      pseudo: store.getters.getPseudo,
      tableKey: 0,
      games: ref([]),
      headers: [
        { name: 'playerOne', required: true, label: 'You', field: 'playerOne', align: 'center' },
        { name: 'playerTwo', required: true, label: 'Opponent', field: 'playerTwo', align: 'center' },
        { name: 'score', required: true, label: 'Score', field: 'score', align: 'center' },
        { name: 'victory', required: true, label: 'Result', field: 'victory', align: 'center' }
      ]
    }
  },
  async beforeMount (): Promise<void> {
    const response = await axios.get(`http://localhost:3000/history/${this.pseudo}`, {
      headers: { Authorization: `Bearer ${store.getters.getToken}` }
    })
    if (response.data.length > 0) {
      this.games = this.populateGames(response.data)
    }
  },
  methods: {
    populateGames (gamesResponse): any {
      const games = []
      for (const game of gamesResponse) {
        games.push({
          playerOne: this.pseudo,
          playerTwo: game.opponentPseudo,
          score: `${game.playerOneScore} - ${game.playerTwoScore}`,
          victory: game.victory
        })
      }

      return games
    }
  }
}
</script>
