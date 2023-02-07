<template>
  <div>
    <button v-for='chan in channels' :key='chan.id' @click="updateSelectedChannel(chan.id)">
      {{ chan.channelName }}({{ chan.id }})
    </button>
    <li v-for="item in chanmsg" :key='item'>
      {{ item.authorUsername }}({{item.authorLogin}}) {{ item.content }}
    </li>
  </div>
  <div>
    <input v-model.trim="message" type="text"/><button @click="sendMessage">Send</button>
  </div>
  <div style="border: 1px solid red">
    <input type="radio" id="zero" value=0 v-model=picked>
    <label for="one">Public</label>
    <br>
    <input type="radio" id="one" value=1 v-model=picked>
    <label for="one">Protected</label>
    <br>
    <input type="radio" id="two" value=2 v-model=picked>
    <label for="two">Private</label>
    <div>
      <input v-model.trim="channelName" type="text"/><button @click="createChannel">Create channel</button>
      <br><input v-if="picked == 1" v-model="password" type="text"/>
    </div>
  </div>
  <div>
    <input v-model="password" type="text"/>
    <button @click="joinChannel">Join Channel</button>
  </div>

  <!-- admin pannel -->
  <div v-if="chanAdm" style="border: 1px solid red">
    <div>
      <input v-model.trim="banlogin" type="text"/>
      <button @click="banChatter">Ban</button>
      <button @click="unbanChatter">UnBan</button>
    </div>
    <div>
      <input v-model.trim="mutelogin" type="text"/>
      <button @click="muteChatter">Mute</button>
      <button @click="unmuteChatter">UnMute</button>
    </div>
    <div>
      <input v-model.trim="adminlogin" type="text"/>
      <button @click="adminChatter">Adm</button>
      <button @click="unadminChatter">UnAdm</button>
    </div>
    <div>
      <input v-model="password" type="text"/>
      <button @click="setPassword">Set Password</button>
    </div>
  </div>

  <!-- Invitation pannel -->
  <div style="border: 1px solid red">
    <div v-if="currentChannel && currentChannel.channelStatus == 2 && chanAdm">
      <input v-model.trim="invitedUser" type="text">
      <button @click="inviteUser">invite</button>
    </div>
    <li v-for="(chan, id) in invitations" :key='chan.id'>
      {{chan.channelName}}({{chan.id}})
      <button @click="acceptInvitation(id)">accept</button>
      <button @click="refuseInvitation(id)">refuse</button>
    </li>
  </div>
  <div>
    <button @click="leaveChannel">leave channel</button>
  </div>
  <div>
    <input v-model.trim="privateMsg" type="text">
    <button @click="startPrivMsg">Private Message</button>
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
      store: store
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
