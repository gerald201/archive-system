<template>
  <div class="g-application-error align-items-center bg-danger d-flex flex-column h-100 justify-content-center position-fixed left-0 top-0 w-100">
    <h5 class="text-light text-center">
      There seems to have been a &quot;Server Error&quot;!
    </h5>
    <button
      class="btn btn-light"
      type="button"
      @click="reload();"
    >
      Reload
    </button>
  </div>
</template>

<script>
export default {
  name: 'GApplicationError',
  setup() {
    function reload() {
      location.reload();
    }

    return {reload};
  }
}
</script>

<style lang="scss" scoped>
.g-application-error {
  gap: 0.5rem;
  z-index: 3;
}
</style>