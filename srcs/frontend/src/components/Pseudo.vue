<template>
  <q-dialog v-model="cardPseudo">
    <q-card flat bordered class="my-card">

      <q-card-section>
        <q-input outlined v-model="pseudo" label="Pseudo" />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat color="primary" @click="setPseudo" label="Update pseudo" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import store from '../store'

export default {
  name: 'Pseudo',
  props: {
    value: Boolean
  },
  setup (): any {
    return {
      store: store,
      pseudo: ''
    }
  },
  computed: {
    cardPseudo: {
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
    async setPseudo () {
      const ret = await this.store.dispatch('setPseudo', this.pseudo)
      if (ret) {
        this.$emit('close')
      }
    }
  }
}
</script>
