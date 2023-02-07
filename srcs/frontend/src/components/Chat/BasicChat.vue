<template>
    <div class="q-pa-md">
        <q-card id="chat-menu">
            <q-list v-for='(n, idx) in statusList' :key='idx' >
                <q-expansion-item :label="idx">
                    <q-scroll-area style="height: 200px">
                    <q-item clickable v-for='chan in coucou(n)' :key='chan.id' @click="updateSelectedChannel(chan.id)" class="q-py-xs">
                        {{chan.channelName}} ({{chan.id}})
                    </q-item>
                    </q-scroll-area>
                </q-expansion-item>
            </q-list>
        </q-card>

        <q-card id="chat-pannel" class="column">
            <q-card-section>
                <q-scroll-area style="height: 350px">
                <q-item v-for="item in chanmsg" :key='item' class="q-py-xs" dense clickable>
                    {{ item.authorUsername }}({{item.authorLogin}}) {{ item.content }}
                </q-item>
                </q-scroll-area>
                <q-form @submit="sendMessage" id="chan-input">
                    <q-input v-model.trim="message" type="text" counter maxlength="255"/>
                    <q-btn type="submit" label="Send"/>
                </q-form>
            </q-card-section>
        </q-card>

        <q-card>
            <q-card-section>
                <q-btn-toggle
                    v-model="picked"
                    toggle-color="primary"
                    :options="[
                        { label: 'Public', value: 0 },
                        { label: 'Protected', value: 1 },
                        { label: 'Private', value: 2 }]"
                />
            </q-card-section>
            <q-card-section>
                <q-form @submit="createChannel">
                    <q-input v-model.trim="channelName" placeholder="Channel name" type="text" counter maxlength="255">
                        <template v-slot:after>
                            <q-input v-if="picked == 1" v-model="password" placeholder="password" type="text"/>
                            <q-input v-else v-model="password" placeholder="no password" type="text" disable />
                        </template>
                    </q-input>
                    <q-btn type="submit" label="Create channel"/>
                </q-form>
            </q-card-section>
        </q-card>

        <q-card v-if="currentChannel && currentChannel.channelStatus == 1">
            <q-form @submit="joinChannel">
                <q-input v-model="password" type="text"/>
                <q-btn type="submit" label="Join Channel"/>
            </q-form>
        </q-card>

        <!-- admin pannel -->
        <q-card v-if="chanAdm" class="column">
            <q-card-section>
                <q-input v-model.trim="banlogin" type="text">
                    <template v-slot:after>
                        <q-btn @click="banChatter" label="Ban" />
                        <q-btn @click="unbanChatter" label="UnBan" />
                    </template>
                </q-input>
            </q-card-section>
            <q-card-section>
                <q-input v-model.trim="mutelogin" type="text">
                    <template v-slot:after>
                        <q-btn @click="muteChatter" label="Mute" />
                        <q-btn @click="unmuteChatter" label="UnMute" />
                    </template>
                </q-input>
            </q-card-section>
            <q-card-section>
                <q-input v-model.trim="adminlogin" type="text">
                    <template v-slot:after>
                        <q-btn @click="adminChatter" label="Set admin" />
                        <q-btn @click="unadminChatter" label="Unset admin" />
                    </template>
                </q-input>
            </q-card-section>
            <q-card-section>
                <q-form @submit="setPassword" v-if="currentChannel && currentChannel.channelStatus == 1">
                    <q-input v-model="password" type="text" placeholder="password"/>
                    <q-btn type="submit" label="Set Password"/>
                </q-form>
            </q-card-section>
        </q-card>

        <!-- Invitation pannel -->
        <q-card>
            <div v-if="currentChannel && currentChannel.channelStatus == 2 && chanAdm">
                <q-form @submit="inviteUser">
                    <q-input v-model.trim="invitedUser" type="text"/>
                    <q-button type="submit" label="invite"/>
                </q-form>
            </div>
            <li v-for="(chan, id) in invitations" :key='chan.id'>
                {{chan.channelName}}({{chan.id}})
                <button @click="acceptInvitation(id)">accept</button>
                <button @click="refuseInvitation(id)">refuse</button>
            </li>
        </q-card>
        <div v-if="currentChannel && (currentChannel.channelStatus == 1 || currentChannel.channelStatus == 2)" >
            <button @click="leaveChannel">leave channel</button>
        </div>
        <div>
            <input v-model.trim="privateMsg" type="text">
            <button @click="startPrivMsg">Private Message</button>
        </div>
    </div>
</template>

<script lang="ts">
import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'
import store from '@/store'
import { BACK_SERVER } from '@/config'

let socket = null

export default {
  name: 'BasicChat',
  setup () {
    return {
      store: store,
      statusList: {
        public: 0,
        protected: 1,
        private: 2,
        locked: 3
      }
    }
  },
  data () {
    return {
      messages: [],
      channels: [],
      message: '',
      channelName: '',
      chatid: 0,
      picked: 0,
      banlogin: '',
      mutelogin: '',
      adminlogin: '',
      password: '',
      invitations: [],
      invitedUser: '',
      privateMsg: ''
    }
  },
  methods: {
    getChannelMsg (channel: number) {
      fetch(`${BACK_SERVER}/chat/${channel}`, {
        headers: { Authorization: `Bearer ${this.store.state.token}` }
      })
        .then((response) => response.json())
        .then((msgTab) => {
          msgTab.forEach((msg) => {
            msg.channel = channel
            this.messages.push(msg)
          })
        })
    },
    getChannels () {
      fetch(`${BACK_SERVER}/chat`, {
        headers: { Authorization: `Bearer ${this.store.state.token}` }
      })
        .then((response) => response.json())
        .then((chanlist) => {
          chanlist.forEach((chan) => {
            this.channels.push(chan)
            this.getChannelMsg(chan.id)
          })
          if (chanlist.length > 0) {
            this.chatid = chanlist[0].id
          }
        })
        .catch(() => null)
    },
    getInvitations () {
      fetch(`${BACK_SERVER}/chat/invitations/me`, {
        headers: { Authorization: `Bearer ${this.store.state.token}` }
      })
        .then((response) => response.json())
        .then((invitations) => {
          invitations.forEach((invitation) => { this.invitations.push(invitation) })
        })
    },
    sendMessage () {
      const payload = {
        content: this.message,
        channel: this.chatid
      }
      if (this.message.length > 255) {
        return
      }
      console.log('payload', payload)
      socket.emit('sendMessage', payload)
      this.message = ''
    },
    createChannel () {
      const newChannel = {
        channelName: this.channelName,
        channelLevel: Number(this.picked),
        password: this.password
      }
      socket.emit('addChannel', newChannel)
      this.channelName = ''
      this.password = ''
    },
    updateSelectedChannel (chan: number) {
      this.chatid = chan
    },
    banChatter () {
      const message = {
        banLogin: this.banlogin,
        channelId: this.chatid
      }
      socket.emit('banChatter', message)
      this.banlogin = ''
    },
    unbanChatter () {
      const message = {
        banLogin: this.banlogin,
        channelId: this.chatid
      }
      socket.emit('unbanChatter', message)
      this.banlogin = ''
    },
    muteChatter () {
      const message = {
        banLogin: this.mutelogin,
        channelId: this.chatid
      }
      socket.emit('muteChatter', message)
      this.mutelogin = ''
    },
    unmuteChatter () {
      const message = {
        banLogin: this.mutelogin,
        channelId: this.chatid
      }
      socket.emit('unmuteChatter', message)
      this.mutelogin = ''
    },
    adminChatter () {
      const message = {
        banLogin: this.adminlogin,
        channelId: this.chatid
      }
      socket.emit('adminChatter', message)
      this.adminlogin = ''
    },
    unadminChatter () {
      const message = {
        banLogin: this.adminlogin,
        channelId: this.chatid
      }
      socket.emit('unadminChatter', message)
      this.adminlogin = ''
    },
    setPassword () {
      const message = {
        channelId: this.chatid,
        password: this.password
      }
      socket.emit('setPassword', message)
      this.password = ''
    },
    joinChannel () {
      const message = {
        channelId: this.chatid,
        password: this.password
      }
      socket.emit('joinChannel', message)
      this.password = ''
    },
    inviteUser () {
      const message = {
        channelId: this.chatid,
        userLogin: this.invitedUser
      }
      socket.emit('inviteUser', message)
      this.invitedUser = ''
    },
    acceptInvitation (id: number) {
      if (id < 0 || id >= this.invitations.length) {
        return
      }
      const message = {
        channelId: Number(this.invitations[id].id),
        userLogin: 'me'
      }
      console.log(message)
      socket.emit('acceptInvitation', message)
    },
    refuseInvitation (id: number) {
      if (id < 0 || id >= this.invitations.length) {
        return
      }
      const message = {
        channelId: Number(this.invitations[id].id),
        userLogin: 'me'
      }
      console.log(message)
      socket.emit('refuseInvitation', message)
    },
    leaveChannel () {
      const payload = { channelId: this.chatid }
      socket.emit('leaveChannel', payload)
    },
    startPrivMsg () {
      const chanCreation = {
        userLogin: this.privateMsg
      }
      socket.emit('askPrivate', chanCreation)
    },
    coucou (n: number) {
      return this.channels.filter((chan) => chan.channelStatus === n)
    }
  },
  computed: {
    chanmsg: function () {
      console.log(this.messages)
      return this.messages.filter((msg) => msg.channel === this.chatid)
    },
    chanAdm: function (): boolean {
      const arr = this.channels.filter((chan) => chan.id === this.chatid)
      return arr.length >= 1 && arr[0].channelAdm
    },
    currentChannel: function () {
      return this.channels.find((chan) => chan.id === this.chatid)
    }
  },
  mounted () {
    socket = io(BACK_SERVER, {
      path: '/chatsocket',
      auth: {
        accessToken: this.store.state.token
      },
      extraHeaders: {
        Authorization: `Bearer ${this.store.state.token}`
      }
    })
    this.getChannels()
    console.log('coucou les amisa')
    this.getInvitations()
    console.log('coucou les amisb')
    socket.on('recvMessage', (message) => {
      message.channel = message.channel.id
      console.log(message)
      this.messages.push(message)
    })
    socket.on('updateChannel', (channel) => {
      this.channels.push(channel)
      if (this.chatid === 0) {
        this.chatid = channel.id
      }
    })
    socket.on('retriveMessages', (message) => {
      this.getChannelMsg(message)
    })
    socket.on('badMessage', (message) => {
      console.log(message)
    })
    socket.on('updateAdmin', (message) => {
      const index = this.channels.findIndex((chan) => chan.id === message.channelId)
      console.log(message)
      console.log(index)
      if (index !== -1) {
        this.channels[index].channelAdm = Boolean(message.adminStatus)
      }
      console.log(this.channels[index])
    })
    socket.on('addInvitation', (message) => {
      this.invitations.push(message)
    })
    socket.on('popInvitation', (message) => {
      const index = this.invitations.findIndex((chan) => chan.id === message.id)
      if (index !== -1) {
        this.invitations.splice(index, 1)
      }
    })
  },
  beforeUnmount () {
    if (socket != null) {
      socket.disconnect()
    }
  }
}
</script>
