<template>
<div class="row q-mt-xl" style="margin-top: 200px">
  <div class="col-3">
  </div>
  <div class="col-6">
    <div class="q-gutter-y-md" style="">
      <q-card flat bordered dark>
        <q-tabs
          v-model="tab"
          align="justify"
          narrow-indicator
          secondary
        >
          <q-tab name="infos" label="Informations" />
          <q-tab name="settings" label="Settings" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated dark>
          <q-tab-panel name="infos">
            <div class="row items-center q-mt-md q-mb-md">
              <div class="col-4">
                <div class="text-h6">Pseudo</div>
                  {{ pseudo }}
                </div>
                <div class="col-4">
                  <div class="text-h6">Channels</div>
                    20
                </div>
                <div class="col-4">
                  <div class="text-h6">Friends</div>
                    20
                </div>
            </div>
            <q-separator />
            <div class="row items-center q-mt-md q-mb-md">
              <div class="col-4">
                <div class="text-h6">Games played</div>
                  20
              </div>
              <div class="col-4">
                <div class="text-h6">Games won</div>
                  20
              </div>
              <div class="col-4">
                <div class="text-h6">Winrate</div>
                  20
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="settings">
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Two factors authentication</q-item-label>
              </q-item-section>
              <q-item-section side >
                <q-btn v-if="doubleFA === false" color="primary" :icon="icon" @click="card2FA = true" label="Enable 2FA" />
                <q-btn v-else color="primary" :icon="icon" @click="disable2FA" label="Disable 2FA" />
              </q-item-section>
            </q-item>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
  <div class="col-3">
  </div>
  <Form2FA v-model="card2FA" :qrCode="qrCode" @close="card2FA=false" @enabled="doubleFA=true" />
</div>
</template>

<script lang="ts">
import { ref } from 'vue'
import store from '../store'
import axios from 'axios'
import Form2FA from '../components/Form2FA.vue'
import { BACK_SERVER } from '@/config'

export default {
  name: 'Account',
  components: {
    Form2FA
  },
  setup (): any {
    return {
      store: store,
      tab: ref('infos'),
      doubleFA: ref(store.getters.getDoubleFA),
      card2FA: ref(false),
      qrCode: ref(''),
      code: ''
    }
  },
  computed: {
    pseudo (): string {
      return this.store.state.pseudo
    },
    icon (): string {
      return 'qr_code_scanner'
    }
  },
  watch: {
    async card2FA () {
      if (this.card2FA === true && this.doubleFA === false) {
        return await this.generate2FA()
      }
    }
  },
  methods: {
    async generate2FA () {
      const response = await axios.get(`${BACK_SERVER}/2fa/generate`, {
        headers: { Authorization: `Bearer ${this.store.state.token}` }
      }).then((t) => t.data)

      this.qrCode = response
    },
    async disable2FA () {
      await this.store.dispatch('disable2FA')
      this.doubleFA = false
    }
  }
}
</script>
