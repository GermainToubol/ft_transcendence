<script lang="ts">
import router from "@/router";
import axios from "axios";
import { ref } from "vue";
import useJwtStore from "../stores/store";
import { BACK_SERVER } from "../config";
import type { friendstype } from "../interfaces/friend.type";

const jwtstore = useJwtStore();
export default {
	data() {
        return {
			friend: {} as friendstype[],
			invit: {} as friendstype[],
            msgs: 'test',
            pseudo: ''
        }
    },

	async mounted(){
		const ret = await axios.get(
			`${BACK_SERVER}/user/friends`,
			{
				headers: {
					Authorization: `Bearer ${jwtstore.$state.token}`,
				}
		}).then((t) => t.data)
		this.friend = ret
		const re = await axios.get(
			`${BACK_SERVER}/user/invitations`,
			{
				headers: {
					Authorization: `Bearer ${jwtstore.$state.token}`,
				}
		}).then((t) => t.data)
		this.invit = re
    },
    computed: {
		msg: function() {
			return this.friend;
		},
        msg2: function() {
			return this.invit;
		}
	},
    methods: {
        async AddFriend() {
            const ret = await axios.post(
                `${BACK_SERVER}/user/addfriend`,
                 {pseudo: this.pseudo},
                {
                    headers: {
                        Authorization: `Bearer ${jwtstore.$state.token}`,
                    }
            }).then((t) => t.data);
			if (ret)
			{
				this.msgs = ret
			}
            else
                this.msgs = 'caca'
        },
        async AcceptFriend(pseudo: string) {
            const ret = await axios.post(
                `${BACK_SERVER}/user/acceptfriend`,
                 {pseudo: pseudo},
                {
                    headers: {
                        Authorization: `Bearer ${jwtstore.$state.token}`,
                    }
            }).then()
        },
        async DeclineFriend(pseudo: string) {
            const ret = await axios.post(
                `${BACK_SERVER}/user/declinefriend`,
                 {pseudo: pseudo},
                {
                    headers: {
                        Authorization: `Bearer ${jwtstore.$state.token}`,
                    }
            }).then()
        },
        async RemoveFriend(pseudo: string) {
            const ret = await axios.post(
                `${BACK_SERVER}/user/removefriend`,
                 {pseudo: pseudo},
                {
                    headers: {
                        Authorization: `Bearer ${jwtstore.$state.token}`,
                    }
            }).then()
        }
    }
}
</script>

<template>
    <div>
		<input id="pseudo" v-model="pseudo" type="text"/>
		<button @click="AddFriend"></button>
	</div>
    <div>{{ msgs }}</div>
	<div>
		AMIS
            <button v-for="friend in msg" @click="RemoveFriend(friend.pseudo)">
                {{ friend.pseudo}}
                Remove
			</button>
	</div>
	<div>
        INVITATIONS
			<button v-for="friend in msg2" @click="AcceptFriend(friend.pseudo)">
                {{ friend.pseudo}}
                Accept
			</button>
            <button v-for="friend in msg2" @click="DeclineFriend(friend.pseudo)">
                {{ friend.pseudo}}
				Decline
			</button>
	</div>
</template>