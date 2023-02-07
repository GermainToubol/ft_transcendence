<template>
  <q-dialog v-model="card2FA">
    <q-card flat bordered class="my-card">
      <img v-bind:src="qrCode" />

      <q-card-section>
        <q-input outlined v-model="code" label="Code" />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat color="primary" @click="verify2FA" label="Enable 2FA" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import store from '../store'

export default {
  name: 'Form2FA',
  props: {
    value: Boolean,
    qrCode: String
  },
  setup (): any {
    return {
      store: store,
      code: ''
    }
  },
  computed: {
    card2FA: {
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
    async verify2FA () {
      const response = await this.store.dispatch('verify2FA', { code: this.code })
      if (response.data.token === undefined) {
        console.log('MAUVAIS CODE')
        this.$emit('verified', false)
        return
      }
      await this.enable2FA()
      this.card2FA = false
      this.$emit('enabled')
      this.$emit('verified', true)
    },
    async enable2FA () {
      await this.store.dispatch('enable2FA')
    }
  }
}
</script>
