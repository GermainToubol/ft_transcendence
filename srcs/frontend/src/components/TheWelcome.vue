
<script lang="ts">
import useJwtStore from "../stores/store";
import { RouterLink, RouterView } from 'vue-router'

const jwtstore = useJwtStore();
export default {
	data() {
        return {
            verified: false,
			avatar: jwtstore.$state.avatar,
			pseudo: jwtstore.$state.pseudo
        }
    },
	async mounted() {
		if (await jwtstore.validateToken(jwtstore.$state.token).then((t) => t))
			this.verified = true;
	},
    computed: {
        imgPath() {
            return this.avatar;
        }
    }
}
</script>

<template>
	<div v-if="verified" >
		<nav>
			<RouterLink to="/2fa/generate">2fa Generate</RouterLink>
			<RouterLink to="/2fa/enable">2fa Activate</RouterLink>
			<RouterLink to="/avatar">Set avatar</RouterLink>
			<RouterLink to="/pseudo">Change pseudo</RouterLink>
		</nav>
		<div>
			<img :src='imgPath'>
		</div>
		<div>
			PSEUDO: {{ pseudo }}
		</div>
	</div>
	<div v-else>LOG TOI</div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>