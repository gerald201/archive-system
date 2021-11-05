<template>
  <div class="g-application-loader align-items-center bg-primary d-flex flex-column h-100 justify-content-center left-0 position-fixed top-0 w-100">
    <div
      aria-hidden="true"
      class="spinner-border text-light"
      role="status"
    ></div>
    <h5 class="text-light text-center">
      Loading...
    </h5>
  </div>
</template>

<script>
export default {
  name: 'GApplicationLoader'
}
</script>

<style lang="scss" scoped>
.g-application-loader {
  gap: 0.5rem;
  z-index: 2;
}
</style>