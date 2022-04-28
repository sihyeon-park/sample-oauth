<template>
  <div id="app">
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
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
#app {
  height: 100vh;
  @extend .flex-center;
}
</style>
