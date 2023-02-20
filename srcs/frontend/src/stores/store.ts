import { defineStore } from 'pinia'
import axios from "axios";
import { BACK_SERVER } from "../config";

const useJwtStore = defineStore('jwt', {
  state() {
    return {
      token: '',
	  pseudo: '',
	  avatar: '',
    };
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
	setPseudo(pseudo: string) {
		this.pseudo = pseudo;
	},
	setAvatar(avatar: string) {
		this.avatar = avatar;
	},
	async validateToken(token: string): Promise<boolean> {
		const test = await axios.get(
			`${BACK_SERVER}/api/auth/validate`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				}
		}).then((t) => t.data);
		if (!test)
		{
			localStorage.token = ''
			return false;
		}
		if (this.token == '' && this.pseudo == '' && this.avatar == '')
		{
			this.token = token;
			this.pseudo = test.usual_full_name;
			if (test.avatarId != null)
				this.avatar = `${BACK_SERVER}/api/local-files/${test.avatarId}`
			else
				this.avatar = "src/avatar/default.jpg"
		}
		return true;
	  },
  },
});

export default useJwtStore;
