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
  margin-bottom: 30px;
  a {
    &.router-link-active {
      background-color: rgba($color: #000000, $alpha: 0.1);
    }
    &:hover:not(.router-link-exact-active) {
      background-color: rgba($color: #000000, $alpha: 0.03);
    }
    border: 1px solid #000;
    padding: 10px;
    &:not(:last-child) {
      border-right: none;
    }
  }
}
a {
  text-decoration: none;
  color: initial;
  &:visited {
    color: initial;
  }
}
button {
  padding: 5px;
  &:not(:last-child) {
    margin-right: 10px;
  }
}
#app {
  height: 100vh;
  width: 100vw;
  @extend .flex-center;
}
</style>
