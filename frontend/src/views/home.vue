<template>
  <div id="g-home-view">
    Welcome &quot;HOME&quot;.
    <br>
    <router-link
      class="btn btn-primary"
      :to="{name: 'SignIn'}"
    >
      Sign In!
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'GHomeView'
}
</script>

<style lang="scss" scoped>
  #g-home-view {}
</style>