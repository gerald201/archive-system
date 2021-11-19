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
.g-transition-enter-active,
.g-transition-leave-active {
  transition-property: opacity, transform !important;
}
.g-transition-enter-from,
.g-transition-leave-to {
  opacity: 0 !important;
  transform: scale(0.5) !important;
}

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

.g-transition-application-main-aside-enter-active,
.g-transition-application-main-aside-leave-active {
  transition-property: opacity, transform !important;
}
.g-transition-application-main-aside-enter-from,
.g-transition-application-main-aside-leave-to {
  opacity: 0 !important;
  transform: translateX(-16rem) !important;
}

.g-transition-application-main-header-enter-active,
.g-transition-application-main-header-leave-active {
  transition-property: opacity, transform !important;
}
.g-transition-application-main-header-enter-from,
.g-transition-application-main-header-leave-to {
  opacity: 0 !important;
  transform: translateY(-4rem) !important;
}

.g-transition-application-main-shadow-enter-active,
.g-transition-application-main-shadow-leave-active {
  transition-property: opacity !important;
}
.g-transition-application-main-shadow-enter-from,
.g-transition-application-main-shadow-leave-to {
  opacity: 0 !important;
}

.g-transition-group-enter-active,
.g-transition-group-leave-active {
  transform-origin: center !important;
  transition-property: opacity, transform !important;
}
.g-transition-group-enter-from,
.g-transition-group-leave-to {
  opacity: 0;
  transform: scale(0.5) !important;
}
.g-transition-group-leave-active {
  position: absolute !important;
}
.g-transition-group-move {
  transition-property: transform !important;
}

.g-transition-router-view-enter-active,
.g-transition-router-view-leave-active {
  position: absolute !important;
  transform-origin: center !important;
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
</style>
