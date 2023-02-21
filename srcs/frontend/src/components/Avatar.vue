<template>
  <q-dialog v-model="cardAvatar" persistent>
      <q-card flat bordered class="my-card">

        <q-card-section>
          <input type="file" @change="uploadFile( $event )"/>
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
      avatar: ''
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
      if (this.avatar !== '') {
        const formData = new FormData()
        formData.append('file', this.avatar)
        const ret = await this.store.dispatch('setAvatar', formData)
        if (ret === 'Request failed with status code 400') {
          this.$emit('alert')
        } else {
          this.$emit('updated')
          this.$emit('close')
        }
      }
    }
  }
}
</script>
