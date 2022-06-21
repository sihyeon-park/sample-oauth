<template>
  <div id="app">
    <nav>
      <router-link to="/oauth">OAuth2.0</router-link>
      <router-link to="/sign-in-with-google">Sign In With</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
/* eslint-disable */

export default {};
</script>

<style lang="scss">
.flex-center {
  display: flex;
  align-items: center;
  flex-direction: column;
}
nav {
  display: flex;
  *:not(:last-child) {
    margin-right: 10px;
  }
}
#app {
  height: 100vh;
  width: 100%;
  @extend .flex-center;
}
</style>
