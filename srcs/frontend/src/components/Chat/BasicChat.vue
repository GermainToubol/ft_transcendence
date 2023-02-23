<template>
  <div class="full-width row wrap justify-evenly items-start content-center q-gutter-y-md">
    <div class="col-xs-11 col-md-6 itemps-stretch q-gutter-md">

      <!-- Main chat pannel -->
      <q-card id="chat-pannel" class="column">
        <q-card-section id="chat-pannel-title" class="bg-primary text-white full-width" style="overflow-wrap: break-word">
          <div v-if="currentChannel !== undefined"  class="text-h6">
            {{currentChannel.channelName}} (#{{currentChannel.id}})
          </div>
          <div v-else class="text-h6">
            No channel Selected
          </div>
        </q-card-section>

        <q-card-section id="chat-message-list"  class="full-width">
          <q-list class="scroll full-width" style="height: 60vh; min-height: 350px">
            <q-item v-for="item in chanmsg" :key='item' dense clickable @click="selected = item.authorLogin" class="full-width">
              <q-item-section class="full-width" style="overflow-wrap: break-word">
                <div class="full-width">
                  <q-item class="full-width" align="right" style="overflow-wrap: break-word">
                    <q-item-section>
                      <q-item-label v-if="item.authorLogin !== store.state.login" align="left">
                        {{item.authorUsername}}
                      </q-item-label>
                      <q-item-label v-else align="right">
                        {{item.authorUsername}}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div>
                  <q-input v-model="item.content" readonly borderless filled type="textarea" autogrow />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator/>
          <q-form @submit="sendMessage" id="chan-input" class="q-gutter-y-sm" >
            <q-input v-model.trim="message" type="text" counter maxlength="255"/>
            <q-btn type="submit" label="Send"/>
          </q-form>
        </q-card-section>
      </q-card>
    </div>

    <!-- Channel choice menu -->
    <div class="col-md-5 col-xs-11 q-gutter-md scroll" style="height: 90vh; min-height: 400px">
      <q-card id="channel-selection-menu">
        <q-list>
          <q-expansion-item v-for='(n, idx) in statusList' :key='idx' :label="idx" group="channel-select-group" header-class="bg-primary text-white" style="overflow-wrap: break-word" class="full-width">
            <q-list style="max-height: 15vh" class="scroll">
              <q-item clickable v-for='chan in coucou(n)' :key='chan.id' @click="updateSelectedChannel(chan.id)" class="q-py-xs" dense>
                <q-item-section>
                  <q-item-label>
                    {{chan.channelName}} (#{{chan.id}})
                  </q-item-label>
                </q-item-section>
                <q-item-section side top class="text-black">
                  <template class="row q-gutter-xs justify-end">
                    <q-input v-if="chan.channelStatus === 1 && !chan.channelUser" v-model="chan.password" type="password" dense/>
                    <q-btn v-if="chan.channelStatus === 1 && !chan.channelUser" label="Join" @click="joinChannel(chan)"/>
                    <q-btn v-if="(chan.channelStatus === 1 || chan.channelStatus === 2) && chan.channelUser" label="Leave" @click="leaveChannel(chan.id)"/>
                  </template>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </q-list>
      </q-card>
      <q-card v-if="selected && selected !== store.state.login">
        <q-card-section class="bg-primary text-white row justify-between">
          <div class="text-h6" style="overflow-wrap: break-word">
            {{userList.get(selected).name}}
          </div>
          <q-btn label="X" @click="selected = ''"/>
        </q-card-section>
        <q-card-section class="full-width q-gutter-y-xs">
          <q-btn label="Private message" @click="startPrivMsg(selected)" class="full-width" />
          <q-btn label="Profile" @click="profileRoute(selected)" class="full-width" />
          <q-btn v-if="currentChannel && currentChannel.channelStatus === 3" label="Invite for game" class="full-width" @click="sendGameInvitation(false)"/>
          <q-btn v-if="currentChannel && currentChannel.channelStatus === 3" label="Invite for game hard" class="full-width" @click="sendGameInvitation(true)"/>
          <q-btn-group spread>
            <q-btn label="Block" @click="blockChatter(selected, 1)"/>
            <q-btn label="Unblock" @click="unblockChatter(selected, 1)"/>
          </q-btn-group>
          <q-btn-group spread v-if="chanAdm">
            <q-btn label="Ban" @click="banChatter(selected, chatid)"/>
            <q-btn label="Unban" @click="unbanChatter(selected, chatid)"/>
          </q-btn-group>
          <q-btn-group spread v-if="chanAdm">
            <q-btn label="Mute" @click="muteChatter(selected, chatid)"/>
            <q-btn label="Unmute" @click="unmuteChatter(selected, chatid)"/>
          </q-btn-group>
          <q-btn-group spread v-if="chanAdm">
            <q-btn  label="Set admin" @click="adminChatter(selected, chatid)"/>
            <q-btn  label="Unset admin" @click="unadminChatter(selected, chatid)"/>
          </q-btn-group>
        </q-card-section>
      </q-card>

      <!-- Invitation pannel -->
      <q-card>
          <q-card-section class="bg-primary text-white full-width row q-gutter-sm justify-between" style="overflow-wrap: break-word">
              <div class="text-h6">
                  Invitations to join
              </div>
              <q-btn class="bg-white text-black" @click="showListInvitations = !showListInvitations" :label="invitations.length" />
          </q-card-section>
          <q-list v-if="showListInvitations">
              <q-item v-for="(chan, id) in invitations" :key='chan.id' class="row q-gutter-x-xs">
                  <q-item-section multiline>
                      <q-item-label style="overflow-wrap: break-word" class="full-width">
                          {{chan.channelName}} (#{{chan.id}})
                      </q-item-label>
                  </q-item-section>
                  <q-item-section top side class="text-black">
                      <q-btn-group spread>
                          <q-btn @click="acceptInvitation(id)" label="accept" />
                          <q-btn @click="refuseInvitation(id)" label="refuse" />
                      </q-btn-group>
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
                <q-input v-if="picked == 1" v-model="password" placeholder="password" type="password"/>
                <q-input v-else  placeholder="no password" type="text" disable />
              </template>
            </q-input>
            <q-btn type="submit" label="Create channel"/>
          </q-form>
        </q-card-section>
        <q-separator/>
          <q-card-section v-if="currentChannel && currentChannel.channelStatus == 1 && chanAdm" class="column">
            <q-form @submit="setPassword" class="q-gutter-y-sm" >
              <q-input v-model="password" type="password" placeholder="password"/>
              <q-btn type="submit" label="Change Password"/>
            </q-form>
          </q-card-section>
      </q-card>

      <q-card v-if="currentChannel && currentChannel.channelStatus === 2 && chanAdm && userList.size > 0">
            <q-card-section class="bg-primary text-white full-width row q-gutter-sm justify-between" style="overflow-wrap: break-word">
              <div class="text-h6">
                  Invite user
              </div>
              <q-btn class="bg-white text-black" @click="showUserList = !showUserList" :label="showUserList ? 'hide' : 'show'" />
            </q-card-section>
            <q-list v-if="showUserList">
            <q-item v-for="(user, idx) in userList" :key="idx">
            <q-item-section>
              {{user[1].name}}
            </q-item-section>
            <q-item-section>
              <q-btn label="invite" @click="inviteUser(user[1].login)"/>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

    <q-card v-if="blockedUsers.length > 0">
        <q-card-section class="bg-primary text-white full-width row q-gutter-sm justify-between" style="overflow-wrap: break-word">
            <div class="text-h6">
                Blocked users
            </div>
            <q-btn class="bg-white text-black" @click="showBlockedList = !showBlockedList" :label="showBlockedList ? 'Hide': 'Show'" />
        </q-card-section>
        <q-list v-if="showBlockedList">
            <q-item v-for="(user, idx) in blockedUsers" :key="idx">
                <q-item-section multiline>
                    <q-item-label  style="overflow-wrap: break-word" class="full-width">
                {{ user.name }}
              </q-item-label>
            </q-item-section>
            <q-item-section top side class="text-black">
              <q-btn @click="unblockChatter(user.login, 1)" label="unblock" />
            </q-item-section>
          </q-item>
          </q-list>
        </q-card>

    <q-dialog v-model="alertAccept" persistent>
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Game Invitation</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ requester }} wants to play against you. Invitation will expire after 5 seconds.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Accept" @click="acceptGame(true)" v-close-popup />
          <q-btn flat label="Decline" @click="acceptGame(false)" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alertLoad">
      <q-card>
        <q-card-section>
          <div class="text-h6">Invitation sent</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          If opponent accepts, you will be automatically redirect. Invitation will expire after 5 seconds.
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alertCant">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          User actually not chatting, can't invite him.
        </q-card-section>
      </q-card>
    </q-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'
import store from '@/store'
import router from '@/router'
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
        Public: 0,
        Protected: 1,
        Private: 2,
        'Private messages': 3
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
      userList: new Map<string, UserInfo>(),
      selected: '',
      showListInvitations: false,
      showUserList: false,
      showBlockedList: false,
      alertLoad: ref(false),
      alertCant: ref(false),
      alertAccept: ref(false),
      requester: ref(''),
      requested: ref(false),
      mode: '',
      id: 0
    }
  },
  watch: {
    async requester () {
      if (this.requested === false && this.requester === this.store.state.login) {
        this.alertLoad = true
      } else if (this.requested === true) {
        this.alertAccept = true
      }
    },
    async alertLoad () {
      if (this.alertLoad === true) {
        setTimeout(() => { this.endPop() }, 5000)
      }
    },
    async alertAccept () {
      if (this.alertAccept === true) {
        setTimeout(() => { this.endPop() }, 5000)
      }
    }
  },
  methods: {
    endPop () {
      this.alertLoad = false
      this.alertAccept = false
      this.requester = ''
      this.requested = false
      this.id = 0
    },
    getChannelMsg (channel: number) {
      fetch(`${BACK_SERVER}/api/chat/messages/${channel}`, {
        headers: { Authorization: `Bearer ${this.store.state.token}` }
      })
        .then((response) => response.json())
        .then((msgTab) => {
          msgTab.forEach((msg) => {
            msg.channel = channel
            if (msg.authorLogin !== this.store.state.login) {
              this.userList.set(msg.authorLogin, { name: msg.authorUsername, login: msg.authorLogin })
            }
            this.messages.push(msg)
          })
        })
    },
    getChannels () {
      fetch(`${BACK_SERVER}/api/chat`, {
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
      fetch(`${BACK_SERVER}/api/chat/invitations`, {
        headers: { Authorization: `Bearer ${this.store.state.token}` }
      })
        .then((response) => response.json())
        .then((invitations) => {
          invitations.forEach((invitation) => { this.invitations.push(invitation) })
        })
    },
    getBlocked () {
      fetch(`${BACK_SERVER}/api/chat/blocked`, { headers: { Authorization: `Bearer ${this.store.state.token}` } })
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
    sendGameInvitation (mode: boolean) {
      const payload = {
        content: `${mode}`,
        channel: this.chatid
      }
      socket.emit('sendGameInvitation', payload)
      this.mode = `${mode}`
    },
    acceptGame (accept: boolean) {
      socket.emit('acceptGameInvitation', { accept: accept, chan: this.id, mode: this.mode, id: this.id })
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
    },
    profileRoute (login: string) {
      router.push(`/user?user=${this.userList.get(login).name}`)
    }
  },
  computed: {
    chanmsg: function () {
      return this.messages.filter((msg) => msg.channel === this.chatid)
        .filter((msg) => this.blockedUsers.findIndex((item) => { return item.login === msg.authorLogin }) === -1)
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
    socket = io(`${BACK_SERVER}`, {
      path: '/api/chatsocket',
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
      if (message.authorLogin !== this.store.state.login) {
        this.userList.set(message.authorLogin, {
          name: message.authorUsername,
          login: message.authorLogin
        })
      }
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
    socket.on('badMessage', () => {
      console.log('invalid message')
    })
    socket.on('updateAdmin', (message) => {
      const index = this.channels.findIndex((chan) => chan.id === message.channelId)
      if (index !== -1) {
        this.channels[index].channelAdm = Boolean(message.adminStatus)
        this.channels[index].channelUser = true
      }
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
        if (this.channels[index].channelStatus === 2) {
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
    socket.on('cannotInvite', (data) => {
      this.alertCant = true
      this.requested = false
      this.requester = ''
      this.mode = ''
      this.id = 0
    })
    socket.on('discoForGame', (data) => {
      if (this.requested === true && this.requester === data.login) {
        this.requested = false
        this.requester = ''
        this.alertAccept = false
        this.mode = ''
        this.id = 0
      }
    })
    socket.on('receiveInvitation', (data) => {
      if (this.requester !== '' ||
        this.blockedUsers.findIndex((usr) => usr.login === data.login) !== -1) {
        return
      }
      if (data.login !== this.store.state.login) {
        this.requested = true
      }
      this.requester = data.login
      this.mode = data.mode
      this.id = data.id
    })
    socket.on('acceptInvitation', (data) => {
      const validInvite: boolean = data.id === this.id
      this.alertLoad = false
      this.alertAccept = false
      this.requester = ''
      this.requested = false
      this.id = 0
      if (data.accept === true && validInvite) {
        this.$router.push(`/play?mode=${data.mode}&chat=chat&role=player`)
      }
      this.mode = ''
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
