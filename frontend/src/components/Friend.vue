<template>
    <q-dialog v-model="cardFriend">
      <q-card flat bordered class="my-card">

        <q-card-section>
          <q-item clickable v-ripple @click="getProfile(friendPseudo)">
        <q-item-section avatar>
          <q-icon color="primary" name="arrow_forward_ios" />
        </q-item-section>
        <q-item-section>Go to {{ friendPseudo }} profile</q-item-section>
      </q-item>
        </q-card-section>

        <q-separator />
        <q-card-actions align="center">
          <q-btn flat color="red" @click="removeFriend(friendPseudo)" label="Remove from friends" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>

<script lang="ts">
import store from '../store'
import { BACK_SERVER } from '@/config'
import axios from 'axios'
import router from '@/router'

export default {
  name: 'Friend',
  props: {
    value: Boolean,
    friendPseudo: String
  },
  setup (): any {
    return {
      store: store,
      pseudo: ''
    }
  },
  computed: {
    cardFriend: {
      get () {
        return this.value
      },
      set (value) {
        if (!value) {
          this.$emit('close')
        }
      }
    }
  },
  methods: {
    async removeFriend (pseudo: string) {
      const ret = await axios.post(
      `${BACK_SERVER}/api/user/removefriend`,
      { pseudo: pseudo },
      {
        headers: {
          Authorization: `Bearer ${store.state.token}`
        }
      }).then()
      this.$emit('refresh')
    },
    getProfile (name: string) {
      router.push(`/user?user=${name}`)
    }
  }
}
</script>
