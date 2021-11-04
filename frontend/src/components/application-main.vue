<template>
  <div class="g-application-main left-0 position-absolute top-0 w-100">
    <transition name=".g-transform-application-main-header">
      <div
        class="header border-bottom left-0 position-sticky shadow-sm top-0 w-100"
        v-if="!$store.state.application.mainHeaderHidden"
      ></div>
    </transition>
    <div
      class="content left-0 mx-auto position-absolute w-100"
      :class="{'state:header-hidden': $store.state.application.mainHeaderHidden}"
      :style="{'--content-viewport': $store.state.application.mainHeaderHidden ? '100vh' : 'calc(100vh - 4rem)'}"
    >
      <div class="container">
        <router-view #default="{Component}">
          <keep-alive>
            <transition name="g-transition-router-view">
              <component :is="Component"></component>
            </transition>
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GApplicationMain'
}
</script>

<style lang="scss" scoped>
.g-application-main {
  z-index: 1;

  & > .header {
    background-color: rgba(var(--bs-body-bg-rgb), 0.95);
    height: 4rem;
    z-index: 2;
  }

  & > .content {
    --self__header-offset-top: 4rem;

    &:where(.state\:header-hidden) {
      --self__header-offset-top: 0px;
    }
  }
  & > .content {
    top: var(--self__header-offset-top);
    z-index: 1;
  }
}
</style>