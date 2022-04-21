<template>
  <div id="app">
    <div
      id="g_id_onload"
      data-client_id=""
      data-context="signin"
      data-ux_mode="popup"
      data-login_uri="http://localhost:8080"
      data-auto_prompt="false"
    ></div>
    <div
      class="g_id_signin"
      data-type="icon"
      data-shape="circle"
      data-theme="outline"
      data-text="signin_with"
      data-size="large"
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
    google.accounts.id.prompt();
  },
  methods: {
    handleCredentialResponse(response) {
      console.log(response);
      console.log(this.parseJwt(response.credential));
    },
    parseJwt(token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
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
