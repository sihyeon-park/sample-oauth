<template>
  <section class="sign-in">
    <a href="http://localhost:3000/auth">Sign In</a>
    <section class="auth-info">
      <p>accessToken: {{ access_token }}</p>
      <p>refreshToekn: {{ refresh_token }}</p>
      <p>uuid: {{ uuid }}</p>
    </section>
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
  name: "SignIn",
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
      const res = await fetch("http://localhost:3000/groups", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: this.access_token,
          refresh_token: this.refresh_token,
        }),
      });
      const { response } = await res.json();
      this.groupEmails = response.result;
      this.loading = false;
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
  p:not(:last-child) {
    margin-bottom: 10px;
  }
}
</style>
