<template>
  <div class="q-pa-md q-gutter-y-lg">
    <q-card id="chat-menu">
      <q-list>
        <q-item v-for='(n, idx) in statusList' :key='idx' >
          <q-item-section>
            <q-expansion-item :label="idx">
              <q-list style="max-height: 10vh" class="scroll">
                <q-item clickable v-for='chan in coucou(n)' :key='chan.id' @click="updateSelectedChannel(chan.id)" class="q-py-xs" dense>
                  <q-item-section>
                    <q-item-label>
                      {{chan.channelName}} ({{chan.id}})
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <template class="row q-gutter-xs justify-end">
                      <q-input v-if="chan.channelStatus === 1" v-model.trim="chan.passwd" type="text" dense/>
                      <q-btn v-if="chan.channelStatus === 1" label="Join" @click="joinChannel(chan)"/>
                      <q-btn v-if="chan.channelStatus === 1 || chan.channelStatus === 2" label="Leave" @click="leaveChannel(chan.id)"/>
                    </template>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <q-card id="chat-pannel" class="column">
      <q-card-section>
        <q-scroll-area style="height: 350px">
          <q-item v-for="item in chanmsg" :key='item' dense clickable>
            <q-item-section>
              <div>
                <q-btn-dropdown :label="item.authorUsername" class="full-width" flat>
                  <div class="full-width q-gutter-y-xs">
                    <q-btn label="Private message" @click="startPrivMsg(item.authorLogin)" class="full-width" />
                    <q-btn-group spread>
                    <q-btn label="Block" @click="blockChatter(item.authorLogin, 1)"/>
                    <q-btn label="Unblock" @click="unblockChatter(item.authorLogin, 1)"/>
                  </q-btn-group>
                  <q-btn-group spread v-if="chanAdm">
                    <q-btn label="Ban" @click="banChatter(item.authorLogin, item.channel)"/>
                    <q-btn label="Unban" @click="unbanChatter(item.authorLogin, item.channel)"/>
                  </q-btn-group>
                  <q-btn-group spread v-if="chanAdm">
                    <q-btn label="Mute" @click="muteChatter(item.authorLogin, item.channel)"/>
                    <q-btn label="Unmute" @click="unmuteChatter(item.authorLogin, item.channel)"/>
                  </q-btn-group>
                  <q-btn-group spread v-if="chanAdm">
                    <q-btn  label="Set admin" @click="adminChatter(item.authorLogin, item.channel)"/>
                    <q-btn  label="Unset admin" @click="unadminChatter(item.authorLogin, item.channel)"/>
                  </q-btn-group>
                  </div>
                </q-btn-dropdown>
              </div>
              <div>
                <q-input v-model="item.content" readonly borderless filled type="textarea" autogrow />
              </div>
            </q-item-section>
          </q-item>
         </q-scroll-area>
        <q-form @submit="sendMessage" id="chan-input" class="q-gutter-y-sm" >
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
        <q-form @submit="createChannel" class="q-gutter-y-sm" >
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
      <q-card-section>
      <q-form @submit="joinChannel" class="q-gutter-y-sm">
        <q-input v-model="password" type="text"/>
        <q-btn type="submit" label="Join Channel"/>
      </q-form>
      </q-card-section>
    </q-card>

    <!-- admin pannel -->
    <div v-if="currentChannel && chanAdm">
    <q-card v-if="currentChannel && currentChannel.channelStatus == 1 && chanAdm" class="column">
      <q-card-section>
        <q-form @submit="setPassword" class="q-gutter-y-sm" >
          <q-input v-model="password" type="text" placeholder="password"/>
          <q-btn type="submit" label="Set Password"/>
        </q-form>
      </q-card-section>
    </q-card>
    </div>

    <!-- Invitation pannel -->
    <div v-if="invitations.length > 0 || (currentChannel && currentChannel.channelStatus == 2 && chanAdm)">
    <q-card>
      <div v-if="currentChannel && currentChannel.channelStatus == 2 && chanAdm">
        <q-form @submit="inviteUser" class="q-gutter-y-sm" >
          <q-input v-model.trim="invitedUser" type="text"/>
          <q-btn type="submit" label="invite"/>
        </q-form>
      </div>
      <q-item v-for="(chan, id) in invitations" :key='chan.id'>
        <q-item-section>
          <q-item-label>
            {{chan.channelName}}({{chan.id}})
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-btn-group spread>
            <q-btn @click="acceptInvitation(id)" label="accept" />
            <q-btn @click="refuseInvitation(id)" label="refuse" />
          </q-btn-group>
        </q-item-section>
      </q-item>
    </q-card>
    </div>
    <div v-if="blockedUsers.length > 0">
        <q-card>
            <q-item v-for="(user, idx) in blockedUsers" :key="idx">
                <q-item-section>
                    <q-item-label>
                        {{ user.name }}
                    </q-item-label>
                </q-item-section>
                <q-item-section>
                    <q-btn @click="unblockChatter(user.login, 1)" label="unblock" />
                </q-item-section>
            </q-item>
        </q-card>
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
      blockedUsers: []
    }
  },
  methods: {
    getChannelMsg (channel: number) {
      fetch(`${BACK_SERVER}/chat/messages/${channel}`, {
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
      fetch(`${BACK_SERVER}/chat/invitations`, {
        headers: { Authorization: `Bearer ${this.store.state.token}` }
      })
        .then((response) => response.json())
        .then((invitations) => {
          invitations.forEach((invitation) => { this.invitations.push(invitation) })
        })
    },
    getBlocked () {
      fetch(`${BACK_SERVER}/chat/blocked`, { headers: { Authorization: `Bearer ${this.store.state.token}` } })
        .then((response) => response.json())
        .then((blocks) => { blocks.forEach((block) => { this.blockedUsers.push(block) }) })
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
    banChatter (login: string, channelId: number) {
      const message = {
        banLogin: login,
        channelId: channelId
      }
      socket.emit('banChatter', message)
    },
    unbanChatter (login: string, channelId: number) {
      const message = {
        banLogin: login,
        channelId: channelId
      }
      socket.emit('unbanChatter', message)
    },
    blockChatter (login: string, channelId: number) {
      const message = {
        banLogin: login,
        channelId: channelId
      }
      socket.emit('blockChatter', message)
    },
    unblockChatter (login: string, channelId: number) {
      const message = {
        banLogin: login,
        channelId: channelId
      }
      socket.emit('unblockChatter', message)
    },
    muteChatter (login: string, channelId: number) {
      const message = {
        banLogin: login,
        channelId: channelId
      }
      socket.emit('muteChatter', message)
    },
    unmuteChatter (login: string, channelId: number) {
      const message = {
        banLogin: login,
        channelId: channelId
      }
      socket.emit('unmuteChatter', message)
    },
    adminChatter (login: string, channelId: number) {
      const message = {
        banLogin: login,
        channelId: channelId
      }
      socket.emit('adminChatter', message)
    },
    unadminChatter (login: string, channelId: number) {
      const message = {
        banLogin: login,
        channelId: channelId
      }
      socket.emit('unadminChatter', message)
    },
    setPassword () {
      const message = {
        channelId: this.chatid,
        password: this.password
      }
      socket.emit('setPassword', message)
      this.password = ''
    },
    joinChannel (channel?: any) {
      if (channel === undefined) {
        const message = {
          channelId: this.chatid,
          password: this.password
        }
        socket.emit('joinChannel', message)
        this.password = ''
        return
      }
      if (channel.channelPasswd === undefined) {
        channel.channelPasswd = ''
      }
      const message = {
        channelId: channel.id,
        password: channel.channelPasswd
      }
      console.log('join request', message)
      socket.emit('joinChannel', message)
      channel.channelPasswd = ''
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
    leaveChannel (channelId?: number) {
      console.log(channelId)
      if (channelId === undefined) {
        const payload = { channelId: this.chatid }
        socket.emit('leaveChannel', payload)
        return
      }
      const payload = { channelId: channelId }
      socket.emit('leaveChannel', payload)
    },
    startPrivMsg (login: string) {
      const chanCreation = {
        userLogin: login
      }
      socket.emit('askPrivate', chanCreation)
    },
    coucou (n: number) {
      return this.channels.filter((chan) => chan.channelStatus === n)
    }
  },
  computed: {
    chanmsg: function () {
      return this.messages.filter((msg) => msg.channel === this.chatid)
        .filter((msg) => this.blockedUsers.findIndex((item) => { console.log(item, msg); return item.login === msg.authorLogin }) === -1)
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
    this.getInvitations()
    this.getBlocked()
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
    socket.on('leavedDone', (message) => {
      const index = this.channels.findIndex((chan) => chan.id === message.channelId)
      if (index !== -1) {
        this.channels.splice(index, 1)
        this.messages = this.messages.filter((msg) => msg.channel !== message.channelId)
      }
    })
    socket.on('addBlock', (message) => {
      const index = this.blockedUsers.findIndex((user) => user.login === message.login)
      if (index === -1) {
        this.blockedUsers.push(message)
      }
    })
    socket.on('popBlock', (message) => {
      const index = this.blockedUsers.findIndex((user) => user.login === message.login)
      if (index !== -1) {
        this.blockedUsers.splice(index, 1)
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
