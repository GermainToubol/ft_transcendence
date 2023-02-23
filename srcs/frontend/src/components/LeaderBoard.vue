<template>
  <div class="q-pa-md">
    <q-card flat bordered dark>
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>LeaderBoard</q-toolbar-title>
      </q-toolbar>
      <q-table
      table-header-class="grey"
      :rows="players"
      :columns="headers"
      row-key="name"
      separator="horizontal"
      no-results-label="No data available"
      hide-pagination
      bordered
      dark
      >
      </q-table>
    </q-card>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import store from '../store'
import { ref } from 'vue'
import { BACK_SERVER } from '@/config'

export default {
  name: 'LeaderBoard',
  setup (): any {
    return {
      headers: [
        { name: 'login', required: true, label: 'Login', field: 'login', align: 'left' },
        { name: 'victories', required: true, label: 'Victories', field: 'victories', align: 'center' }
      ],
      players: ref([])
    }
  },
  async beforeMount (): Promise<void> {
    const response = await axios.get(`${BACK_SERVER}/api/user/leaderboard`, {
      headers: { Authorization: `Bearer ${store.getters.getToken}` }
    })

    if (response.data.length > 0) {
      this.populateLeaders(response.data)
    }
  },
  methods: {
    populateLeaders (leaders): any {
      for (const leader of leaders) {
        this.players.push({
          login: leader.pseudo,
          victories: leader.wins
        })
      }
    }
  }
}
</script>
