<template>
<div class="row q-mt-xl" style="margin-top: 200px">
  <div class="col-3">
  </div>
  <div class="col-6">
    <div class="q-gutter-y-md" style="">
      <q-card flat bordered dark>
            <q-item>
              <q-item-section>
                <q-item-label>Two factors authentication</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-btn style="width: 5%px;" v-if="doubleFA === false" color="primary" :icon="icon" @click="card2FA = true" label="Enable 2FA" />
                <q-btn style="width: 5%px;" v-else color="primary" :icon="icon" @click="disable2FA" label="Disable 2FA" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>Change pseudo</q-item-label>
              </q-item-section>
              <q-item-section >
                <q-btn color="primary" style="width: 5%px;" @click="cardPseudo = true" label="Change pseudo" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>Change avatar</q-item-label>
              </q-item-section>
              <q-item-section >
                <q-btn color="primary" style="width: 5%px;" @click="cardAvatar = true" label="Change avatar" />
              </q-item-section>
            </q-item>
      </q-card>
    </div>
  </div>
  <div class="col-3">
  </div>
  <Form2FA v-model="card2FA" :qrCode="qrCode" @close="card2FA=false" @enabled="doubleFA=true" @alert="alert2fa=true" @updated="alertUpdated=true"/>
  <Pseudo v-model="cardPseudo" :pseudo="pseudo" @close="cardPseudo=false" @alert="alertPseudo=true" @updated="alertUpdated=true"/>
  <Avatar v-model="cardAvatar" @close="cardAvatar=false" @alert="alertAvatar=true" @updated="alertUpdated=true"/>
  <q-dialog v-model="alertAvatar">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Please, upload a valid image
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="alertPseudo">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          This pseudo either has a bad format or has already been choosen by someone else or is yours.
          Please try with an other one.
          Choose a pseudo with 15 characters max only with numbers and letters.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="alert2fa">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Invalid code.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="alertUpdated">
      <q-card>
        <q-card-section>
          <div class="text-h6">Success</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Your account has been successfully updated !
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</div>
</template>

<script lang="ts">
import { ref } from 'vue'
import store from '../store'
import axios from 'axios'
import Form2FA from '../components/Form2FA.vue'
import Pseudo from '../components/Pseudo.vue'
import Avatar from '../components/Avatar.vue'
import { BACK_SERVER } from '@/config'

export default {
  name: 'Account',
  components: {
    Form2FA,
    Pseudo,
    Avatar
  },
  setup (): any {
    return {
      store: store,
      tab: ref('infos'),
      doubleFA: ref(store.getters.getDoubleFA),
      card2FA: ref(false),
      cardPseudo: ref(false),
      cardAvatar: ref(false),
      qrCode: ref(''),
      code: '',
      alertAvatar: ref(false),
      alertPseudo: ref(false),
      alert2fa: ref(false),
      alertUpdated: ref(false)
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
    },
    reloadPseudo () {
      this.cardPseudo = false
      this.$router.go()
      this.cardPseudo = true
    }
  }
}
</script>
