<template>
    <div class="full-width row wrap justify-evenly items-start content-center q-gutter-y-md">
     <div class="col-xs-11 col-md-6 itemps-stretch q-gutter-md">

         <q-card id="chat-pannel" class="column">
             <q-card-section class="bg-primary text-white">
                 <div v-if="currentChannel !== undefined" class="text-h6">{{currentChannel.channelName}} (#{{currentChannel.id}})</div>
                 <div v-else class="text-h6">No channel Selected</div>
             </q-card-section>
      <q-card-section>
        <q-scroll-area style="height: 60vh">
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
    </div>
    <div class="col-md-5 col-xs-11 q-gutter-md">
    <q-card id="chat-menu">
      <q-list>
        <q-item v-for='(n, idx) in statusList' :key='idx' >
          <q-item-section>
            <q-expansion-item :label="idx">
              <q-list style="max-height: 10vh" class="scroll">
                <q-item clickable v-for='chan in coucou(n)' :key='chan.id' @click="updateSelectedChannel(chan.id)" class="q-py-xs" dense>
                  <q-item-section>
                    <q-item-label>
                      {{chan.channelName}} (#{{chan.id}})
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <template class="row q-gutter-xs justify-end">
                      <q-input v-if="chan.channelStatus === 1 && !chan.channelUser" v-model.trim="chan.password" type="text" dense/>
                      <q-btn v-if="chan.channelStatus === 1 && !chan.channelUser" label="Join" @click="joinChannel(chan)"/>
                      <q-btn v-if="(chan.channelStatus === 1 || chan.channelStatus === 2) && chan.channelUser" label="Leave" @click="leaveChannel(chan.id)"/>
                    </template>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-item-section>
        </q-item>
      </q-list>
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
      <q-item v-for="(chan, id) in invitations" :key='chan.id'>
        <q-item-section>
          <q-item-label>
            {{chan.channelName}}(#{{chan.id}})
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
    <div v-if="currentChannel && currentChannel.channelStatus === 2 && chanAdm && userList.size > 0">
        <q-card>
            <q-item v-for="(user, idx) in userList" :key="idx">
                <q-item-section>
                    {{user[1].name}}
                </q-item-section>
                <q-item-section>
                    <q-btn label="invite" @click="inviteUser(user[1].login)"/>
                </q-item-section>
            </q-item>
        </q-card>
    </div>
    </div>
    </div>
</template>

<script lang="ts">
import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'
import store from '@/store'
import { BACK_SERVER } from '@/config'

class UserInfo {
  name: string
  login: string
}

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
      blockedUsers: [],
      userList: new Map<string, UserInfo>()
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
            this.userList.set(msg.authorLogin, { name: msg.authorUsername, login: msg.authorLogin })
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
      if (channel.password === undefined) {
        channel.password = ''
      }
      const message = {
        channelId: channel.id,
        password: channel.password
      }
      socket.emit('joinChannel', message)
      channel.password = ''
    },
    inviteUser (login: string) {
      const message = {
        channelId: this.chatid,
        userLogin: login
      }
      socket.emit('inviteUser', message)
    },
    acceptInvitation (id: number) {
      if (id < 0 || id >= this.invitations.length) {
        return
      }
      const message = {
        channelId: Number(this.invitations[id].id),
        userLogin: 'me'
      }
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
      socket.emit('refuseInvitation', message)
    },
    leaveChannel (channelId?: number) {
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
      this.userList.set(message.authorLogin, {
        name: message.authorUsername,
        login: message.authorLogin
      })
      this.messages.push(message)
    })
    socket.on('updateChannel', (channel) => {
      this.channels.push(channel)
      if (this.chatid === 0) {
        this.chatid = channel.id
      }
    })
    socket.on('retriveMessages', (message) => {
      const index = this.channels.findIndex((chan) => chan.id === message)
      this.channels[index].channelUser = true
      this.getChannelMsg(message)
    })
    socket.on('badMessage', (message) => {
      console.log(message)
    })
    socket.on('updateAdmin', (message) => {
      const index = this.channels.findIndex((chan) => chan.id === message.channelId)
      if (index !== -1) {
        this.channels[index].channelAdm = Boolean(message.adminStatus)
        this.channels[index].channelUser = true
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
        console.log('before leave:', this.channels[index].channelStatus)
        if (this.channels[index].channelStatus === 2) {
          console.log('deleted')
          this.channels.splice(index, 1)
        } else {
          this.channels[index].channelUser = false
        }
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
