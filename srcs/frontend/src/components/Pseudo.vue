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
      pseudo: '' as string
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
      if (this.validatePseudo(this.pseudo)) {
        const ret = await this.store.dispatch('setPseudo', this.pseudo)
        if (ret) {
          this.$emit('updated')
          this.$emit('close')
        } else {
          this.$emit('alert')
        }
      } else {
        this.$emit('alert')
      }
    },
    validatePseudo (pseudo: string) {
      if (pseudo.length < 1 || pseudo.length > 15) {
        return false
      }
      for (let i = 0; i < pseudo.length; i++) {
        const char1 = pseudo.charAt(i)
        const cc = char1.charCodeAt(0)
        if (!((cc > 47 && cc < 58) || (cc > 64 && cc < 91) || (cc > 96 && cc < 123) || (cc === 95))) {
          return false
        }
      }
      return true
    }
  }
}
</script>
