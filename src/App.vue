<template>
  <div id="app">
    <div
      class="g_id_signin"
      data-type="standard"
      data-shape="rectangular"
      data-theme="outline"
      data-text="signin_with"
      data-size="large"
      data-logo_alignment="left"
    ></div>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  mounted() {
    google.accounts.id.initialize({
      client_id:
        "419276155718-s91buqp4ohlgfitr1e6pig5mjs14p53c.apps.googleusercontent.com",
      callback: this.handleCredentialResponse,
    });
  },
  methods: {
    handleCredentialResponse(response) {
      console.log(this.parseJwt(response.credential));
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
  },
};
</script>

<style lang="scss">
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
#app {
  height: 100vh;
  @extend .flex-center;
}
</style>
