<template>
  <div id="app">
    <button @click="signIn">sgin in</button>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  data: () => ({
    auth2: null,
  }),
  methods: {
    async signIn() {
      const googleUser = await this.auth2.signIn();
      const profile = googleUser.getBasicProfile();
      console.log("ID: " + profile.getId());
      console.log("Name: " + profile.getName());
      console.log("Image URL: " + profile.getImageUrl());
      console.log("Email: " + profile.getEmail());
    },
  },
  mounted() {
    gapi.load("auth2", () => {
      gapi.auth2.init();
      this.auth2 = gapi.auth2.getAuthInstance();
    });
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
