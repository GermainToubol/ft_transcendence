<template>
    <div class="full-width row wrap justify-evenly items-start content-center q-gutter-y-md">
     <div class="col-xs-11 col-md-6 itemps-stretch q-gutter-md">
      <q-card class="column">
        <q-card-section class="bg-primary text-white text-h6">
          Friends
        </q-card-section>
        <q-card-section v-if="friend">
          <q-list>
            <q-item clickable v-for="friend in msg" :key="friend.pseudo" @click="selectFriend(friend)">
              <q-item-section avatar>
                <q-avatar>
                  <img :src='getAvatar(friend.avatar)' />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ friend.pseudo }}</q-item-label>
                <q-item-label caption class="text-red" v-if="friend.status == 'offline'">{{ friend.status }}</q-item-label>
                <q-item-label caption class="text-orange-12" v-else-if="friend.status == 'playing'">{{ friend.status }}</q-item-label>
                <q-item-label caption class="text-light-green-13" v-else>{{ friend.status }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section v-else>You have no friends...</q-card-section>
      </q-card>
  </div>
  <div class="col-md-5 col-xs-11 q-gutter-md">
    <q-card class="column">
      <q-card-section class="bg-primary text-white text-h6">
        Add friends
      </q-card-section>
      <q-card-section>
        <q-input v-model="pseudo" type="text" placeholder="Player pseudo" clearable/>
      </q-card-section>
      <q-card-section v-if="msgs">{{ msgs }}</q-card-section>
      <q-card-section>
        <q-btn @click="addFriend" label="Add Friend" />
      </q-card-section>
    </q-card>
      <q-card class="column">
        <q-card-section class="bg-primary text-white text-h6">
          Invitations
        </q-card-section>
        <q-card-section v-if="invit">
          <q-list>
            <q-item v-for="friend in msg2" :key="friend.pseudo">
              <q-item-section avatar>
                <q-avatar>
                  <img :src='getAvatar(friend.avatar)' />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ friend.pseudo }}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-btn round color="green" icon="check_circle" @click="acceptFriend(friend.pseudo)"/>
              </q-item-section>
              <q-item-section avatar>
                <q-btn round color="red" icon="cancel" @click="declineFriend(friend.pseudo)"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section v-else>You have no pending invitations...</q-card-section>
      </q-card>
  </div>
  <Friend v-model="cardFriend" :friendPseudo="friendPseudo" @refresh="refresh" @close="cardFriend=false" />
</div>
</template>

<script lang="ts">
import type { friendstype } from '../interfaces/friend.type'
import axios from 'axios'
import store from '@/store'
import { BACK_SERVER } from '@/config'
import Friend from './Friend.vue'
import { ref } from 'vue'
import { getCurrentInstance } from 'vue'

export default {
  name: 'Friends',
  components: {
    Friend
  },
  setup () {
    return {
      store: store,
      cardFriend: ref(false)
    }
  },
  data () {
    return {
      friend: null as friendstype[],
      invit: null as friendstype[],
      msgs: '',
      pseudo: '',
      friendPseudo: ''
    }
  },

  async mounted () {
    const re = await axios.get(
      `${BACK_SERVER}/api/user/invitations`,
      {
        headers: {
          Authorization: `Bearer ${store.state.token}`
        }
      }).then((t) => t.data)
    if (re.length > 0) {
      this.invit = re
    }
    const ret = await axios.get(
      `${BACK_SERVER}/api/user/friends`,
      {
        headers: {
          Authorization: `Bearer ${store.state.token}`
        }
      }).then((t) => t.data)
    if (ret.length > 0) {
      const onlineFriends = []
      const playingFriends = []
      const offlineFriends = []
      for (const friend of ret) {
        switch (friend.status) {
          case 'online':
            onlineFriends.push(friend)
            break
          case 'playing':
            playingFriends.push(friend)
            break
          case 'offline':
            offlineFriends.push(friend)
            break
        }
      }
      this.friend = [...onlineFriends, ...playingFriends, ...offlineFriends]
    }
  },
  computed: {
    msg: function () {
      return this.friend
    },
    msg2: function () {
      return this.invit
    }
  },
  methods: {
    getAvatar (id: number) {
      if (id !== 0) {
        return `${BACK_SERVER}/api/local-files/${id}`
      }
      return 'http://sitedemonstre.e-monsite.com/medias/site/logos/39bpdyn_seirjfulq1azt-o0sgw.jpg'
    },
    async addFriend () {
      if (this.pseudo === '') {
        return
      }
      const ret = await axios.post(
      `${BACK_SERVER}/api/user/addfriend`,
      { pseudo: this.pseudo },
      {
        headers: {
          Authorization: `Bearer ${store.state.token}`
        }
      }).then((t) => t.data)
      if (ret) {
        this.msgs = ret
        if (ret.substring(0, 9) === 'You added') {
		  this.$emit('refresh')
        }
      }
    },
    async acceptFriend (pseudo: string) {
      const ret = await axios.post(
      `${BACK_SERVER}/api/user/acceptfriend`,
      { pseudo: pseudo },
      {
        headers: {
          Authorization: `Bearer ${store.state.token}`
        }
      }).then()
      this.$emit('refresh')
    },
    async declineFriend (pseudo: string) {
      const ret = await axios.post(
      `${BACK_SERVER}/api/user/declinefriend`,
      { pseudo: pseudo },
      {
        headers: {
          Authorization: `Bearer ${store.state.token}`
        }
      }).then()
      this.$emit('refresh')
    },
    clearInput () {
      this.pseudo = ''
    },
    selectFriend (friend) {
      this.friendPseudo = friend.pseudo
      this.cardFriend = true
    },
	refresh() {
      this.$emit('refresh')
	}
  }
}
</script>
