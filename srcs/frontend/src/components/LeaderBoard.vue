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
export default {
  name: 'LeaderBoard',
  setup (): any {
    return {
      headers: [
        { name: 'login', required: true, label: 'Login', field: 'login', align: 'left' },
        { name: 'gamesPlayed', required: true, label: 'Games played', field: 'gamesPlayed', align: 'center' },
        { name: 'victories', required: true, label: 'Victories', field: 'victories', align: 'center' },
        { name: 'looses', required: true, label: 'Looses', field: 'looses', align: 'center' }

      ],
      players: [
        { login: 'iouali', gamesPlayed: 41, victories: 30, looses: 11 },
        { login: 'emcariot', gamesPlayed: 30, victories: 29, looses: 1 },
        { login: 'jfgfgerre', gamesPlayed: 25, victories: 15, looses: 10 },
        { login: 'erfdgd', gamesPlayed: 154, victories: 14, looses: 140 },
        { login: 'adupont', gamesPlayed: 54, victories: 2, looses: 52 }
      ]
    }
  }
}
</script>
