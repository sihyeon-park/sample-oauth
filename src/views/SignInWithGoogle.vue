<template>
  <section class="sign-in-with-google">
    <div class="sign-in-button" ref="signIn"></div>
    <button v-if="idToken !== null" @click="verifyIdToken">
      verifyIdToken
    </button>
    <button v-if="idToken !== null" @click="revoke">revoke</button>
    <button v-if="idToken !== null" @click="onSignout">sign out</button>
    <section class="user-info">
      <p>Id Token: {{ idToken }}</p>
      <p>name: {{ name }}</p>
      <p>account: {{ account }}</p>
      <p>uuid: {{ uuid }}</p>
    </section>
  </section>
</template>
<script>
/* eslint-disable */
export default {
  name: "SignInWithGoogle",
  data: () => ({
    idToken: null,
    name: null,
    account: null,
    uuid: null,
  }),
  methods: {
    handleCredentialResponse(response) {
      const idToken = response.credential;
      const select_by = response.select_by;
      const [token, header, payload] = this.parseJwt(idToken);
      this.idToken = token;
      this.name = payload.name;
      this.account = payload.email;
      this.uuid = payload.sub;
    },
    async verifyIdToken() {
      try {
        const res = await fetch(
          `http://localhost:3000/verifyIdToken?token=${this.idToken}`
        );
        const result = await res.json();
        alert(result);
      } catch (e) {
        alert("FAIL:: verify id token");
      }
    },
    parseJwt(token) {
      const [header, payload] = token.split(".");
      const headerBase64 = header.replace(/-/g, "+").replace(/_/g, "/");
      const payloadBase64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const jsonHeader = decodeURIComponent(
        window
          .atob(headerBase64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const jsonPayload = decodeURIComponent(
        window
          .atob(payloadBase64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return [token, JSON.parse(jsonHeader), JSON.parse(jsonPayload)];
    },
    initGoogleAcounts() {
      google.accounts.id.initialize({
        client_id:
          "419276155718-s91buqp4ohlgfitr1e6pig5mjs14p53c.apps.googleusercontent.com",
        callback: this.handleCredentialResponse,
        auto_select: true,
      });
      google.accounts.id.renderButton(this.$refs.signIn, { type: "standard" });
      google.accounts.id.prompt();
    },
    revoke() {
      google.accounts.id.revoke(this.uuid, (response) => {
        if (response.successful) {
          alert("SUCCESS:: revoke token");
        } else {
          alert("FAIL:: revoke token");
        }
      });
    },
    onSignout() {
      google.accounts.id.disableAutoSelect();
    },
  },
  mounted() {
    this.initGoogleAcounts();
  },
};
</script>
<style lang="scss" scoped>
.sign-in-with-google {
  width: 500px;
  overflow: hidden;
  word-wrap: break-word;
}

.sign-in-button {
  margin-bottom: 10px;
}
</style>
