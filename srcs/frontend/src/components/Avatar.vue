<template>
  <q-dialog v-model="cardAvatar">
      <q-card flat bordered class="my-card">

        <q-card-section>
          <q-uploader outlined v-model="avatar" accept=".jpeg, image/*" @change="uploadFile"/>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat color="primary" @click="setAvatar" label="Update avatar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>

<script lang="ts">
import store from '../store'
import { BACK_SERVER } from '@/config'
import axios from 'axios'

export default {
  name: 'Avatar',
  props: {
    value: Boolean
  },
  setup (): any {
    return {
      store: store,
      avatar: null
    }
  },
  computed: {
    cardAvatar: {
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
    uploadFile (event: any) {
      this.avatar = event.target.files[0]
    },
    async setAvatar () {
      const formData = new FormData()
      formData.append('file', this.avatar)
      const response = await axios.post(`${BACK_SERVER}/user/avatar`,
        formData,
        {
          headers: { Authorization: `Bearer ${this.store.state.token}` }
        })
        .then((t) => t.data)
    }
  }
}
</script>
