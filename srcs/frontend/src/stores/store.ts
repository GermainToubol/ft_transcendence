import { defineStore } from 'pinia'
import axios from "axios";

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
			"http://localhost:3000/auth/validate",
			{
				headers: {
					Authorization: `Bearer ${token}`,
				}
		}).then((t) => t.data);
		if (!test)
			return false;
		return true;
	  },
  },
});

export default useJwtStore;