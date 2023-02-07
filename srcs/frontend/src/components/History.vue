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
    row-key="name"
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
export default {
  name: 'History',
  setup (): any {
    return {
      user: null,
      games: [
        { playerOne: 'iouali', playerTwo: 'emcariot', score: '5-10', date: '15/01/2023', victory: false },
        { playerOne: 'iouali', playerTwo: 'jbidou', score: '10-5', date: '15/01/2023', victory: true }
      ],
      headers: [
        { name: 'playerOne', required: true, label: 'You', field: 'playerOne', align: 'center' },
        { name: 'playerTwo', required: true, label: 'Opponent', field: 'playerTwo', align: 'center' },
        { name: 'score', required: true, label: 'Score', field: 'score', align: 'center' },
        { name: 'victory', required: true, label: 'Result', field: 'victory', align: 'center' },
        { name: 'date', required: true, label: 'Date', field: 'date', align: 'center' }
      ]
    }
  }
}
</script>
