<template>
  <transition name="g-transition-application">
    <g-application-error v-if="$store.state.application.error"></g-application-error>
    <g-application-loader v-else-if="$store.state.application.loading"></g-application-loader>
    <g-application-main v-else></g-application-main>
  </transition>

  <g-application-toast></g-application-toast>
</template>

<script>
import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import GApplicationError from '@/components/application-error';
import GApplicationLoader from '@/components/application-loader';
import GApplicationMain from '@/components/application-main';
import GApplicationToast from '@/components/application-toast';

export default {
  components: {
    GApplicationError,
    GApplicationLoader,
    GApplicationMain,
    GApplicationToast,
  },
  name: 'GApp',
  setup() {
    const $route = useRoute();
    const $store = useStore();

    watchEffect(function() {
      const systemChecks = [
        'disableMainAside',
        'disableMainHeader'
      ]
        .reduce(function(accumulator, check) {
          accumulator[check] = $route.matched
            .some(function(match) {
              return match.meta.checks?.[check] === true;
            });
          return accumulator;
        }, {});

      $store.commit('SET_APPLICATION_MAIN_ASIDE_HIDDEN', systemChecks.disableMainAside);
      $store.commit('SET_APPLICATION_MAIN_HEADER_HIDDEN', systemChecks.disableMainHeader);
    });
  }
};
</script>


<style lang="scss">
#app {
  width: 100%;
}
</style>

<style lang="scss">
.g-transition-application-enter-active,
.g-transition-application-leave-active {
  transition-property: opacity, transform !important;
}
.g-transition-application-enter-from {
  opacity: 0 !important;
  transform: scale(1.1) !important;
}
.g-transition-application-leave-to {
  opacity: 0 !important;
  transform: scale(0.9) !important;
}

.g-transform-application-main-aside-enter-active,
.g-transform-application-main-aside-leave-active {
  transition-property: opacity, transform !important;
}
.g-transform-application-main-aside-enter-from,
.g-transform-application-main-aside-leave-to {
  opacity: 0 !important;
  transform: translateX(-16rem) !important;
}

.g-transform-application-main-header-enter-active,
.g-transform-application-main-header-leave-active {
  transition-property: opacity, transform !important;
}
.g-transform-application-main-header-enter-from,
.g-transform-application-main-header-leave-to {
  opacity: 0 !important;
  transform: translateY(-4rem) !important;
}

.g-transition-router-view-enter-active,
.g-transition-router-view-leave-active {
  position: absolute !important;
  transition-property: opacity, transform !important;
}
.g-transition-router-view-enter-from {
  opacity: 0 !important;
  transform: translateY(1.5rem) !important;
}
.g-transition-router-view-leave-to {
  opacity: 0 !important;
  transform: scale(0.9) !important;
}

.g-transform-application-main-shadow-enter-active,
.g-transform-application-main-shadow-leave-active {
  transition-property: opacity !important;
}
.g-transform-application-main-shadow-enter-from,
.g-transform-application-main-shadow-leave-to {
  opacity: 0 !important;
}
</style>
