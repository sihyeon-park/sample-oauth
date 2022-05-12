<template>
  <section class="sign-in">
    <a href="http://localhost:3000/auth">Sign In</a>
    <section class="auth-info">
      <p>accessToken: {{ access_token }}</p>
      <p>refreshToekn: {{ refresh_token }}</p>
      <p>uuid: {{ uuid }}</p>
    </section>
    <button @click="refreshAccessToken">refreshAccessToken</button>
    <button @click="revoke">revoke</button>
    <button @click="getGroups">getGroups</button>
    <h3>group emails</h3>
    <section v-loading="loading">
      <p v-for="email in groupEmails" :key="email">{{ email }}</p>
    </section>
  </section>
</template>
<script>
/* eslint-disable */
import { mapState, mapMutations } from "vuex";

export default {
  name: "OAuth",
  data: () => ({
    groupEmails: [],
    loading: false,
  }),
  computed: {
    ...mapState(["access_token", "refresh_token", "uuid"]),
  },
  methods: {
    ...mapMutations(["setAuth"]),
    async getGroups() {
      this.loading = true;
      try {
        const res = await fetch("http://localhost:3000/groups", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: this.access_token,
          }),
        });
        const { response } = await res.json();
        this.groupEmails = response.result;
      } catch (err) {
      } finally {
        this.loading = false;
      }
    },
    async refreshAccessToken() {
      const res = await fetch(`http://localhost:3000/refreshToken`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: this.refresh_token,
        }),
      });
      const result = await res.json();
      this.setAuth(result);
    },
    async revoke() {
      await fetch(`http://localhost:3000/revoke?token=${this.access_token}`);
    },
  },
  async created() {
    if (this.$route?.query.access_token) {
      this.setAuth(this.$route.query);
    }
  },
};
</script>
<style lang="scss" scoped>
.auth-info {
  width: 500px;
  overflow: hidden;
  word-wrap: break-word;
  p:not(:last-child) {
    margin-bottom: 10px;
  }
}
</style>
