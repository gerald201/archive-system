<template>
  <div class="g-application-main left-0 position-absolute top-0 w-100">
    <transition name="g-transform-application-main-aside">
      <div
        class="aside bg-primary border-end position-fixed shadow-sm top-0"
        :class="{'state:opened': $store.state.application.mainAsideOpened}"
        v-if="!$store.state.application.mainAsideHidden"
      >
        <perfect-scrollbar class="scroll h-100 w-100">
          <div class="logo-container align-items-center d-flex justify-content-center p-3">
            <img
              alt=""
              class="logo rounded"
              :src="`${apiUrl}/assets/images/gctu-logo.jpg`"
            >
          </div>
          <div class="body px-2 w-100" aria-label="Docs navigation">
            <ul class="list-unstyled mb-0 py-3">
              <li>
                <router-link
                  class="link btn btn-sm fs-5 rounded text-light"
                  tag="li"
                  :to="{name: 'Dashboard'}"
                >
                  Dashboard
                </router-link>
              </li>
              <li>
                <button
                  class="link btn btn-sm fs-5 rounded text-light"
                  :to="{name: 'Dashboard'}"
                >
                  Projects
                </button>
              </li>
            </ul>
          </div>
        </perfect-scrollbar>
      </div>
    </transition>

    <transition name="g-transform-application-main-shadow">
      <div
        class="shadow left-0 position-fixed top-0 w-100"
        @click="$store.commit('SET_APPLICATION_MAIN_ASIDE_OPENED', false);"
        v-if="!$store.state.application.mainAsideHidden && $store.state.application.mainAsideOpened"
      ></div>
    </transition>

    <transition name="g-transform-application-main-header">
      <div
        class="header align-items-center d-flex gap-2 border-bottom left-0 px-3 position-fixed shadow-sm top-0 w-100"
        v-if="!$store.state.application.mainHeaderHidden"
      >
        <button
          class="btn btn-primary border-0 flex-grow-0 flex-shrink-0 rounded"
          @click="$store.commit('SET_APPLICATION_MAIN_ASIDE_OPENED', !$store.state.application.mainAsideOpened);"
          v-if="!$store.state.application.mainAsideHidden"
        >
          <span
            class="feather"
            :class="{
              'feather-menu': !$store.state.application.mainAsideOpened,
              'feather-x': $store.state.application.mainAsideOpened
            }"
          ></span>
        </button>
        <div class="left flex-grow-1 flex-shrink-1"></div>
        <div class="center flex-grow-1 flex-shrink-1"></div>
        <div class="right d-flex flex-grow-1 flex-shrink-1 justify-content-end">
          <button
            class="btn btn-outline-danger"
            @click="
              $store.dispatch('authenticationSignOut');
              $router.push({name: 'Home'});
            "
            v-if="$store.getters.authenticated"
          >
            <span class="feather feather-log-out"></span>
          </button>
        </div>
      </div>
    </transition>

    <div
      class="content left-0 mx-auto position-absolute w-100"
      :class="{'state:header-hidden': $store.state.application.mainHeaderHidden}"
      :style="{'--content-viewport': $store.state.application.mainHeaderHidden ? '100vh' : 'calc(100vh - 4rem)'}"
    >
      <div class="container position-relative">
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
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { computed } from 'vue';
import apiConfiguration from '@/configuration/api';

export default {
  components: {PerfectScrollbar},
  name: 'GApplicationMain',
  setup() {
    const apiUrl = computed(function() {
      return apiConfiguration.url;
    });

    return {apiUrl};
  }
}
</script>

<style lang="scss" scoped>
.g-application-main {
  z-index: 1;

  & > .aside {
    --self__left: -16rem;

    &:where(.state\:opened) {
      --self__left: 0px;
    }
  }
  & > .aside {
    height: 100vh;
    left: var(--self__left);
    transition-property: left;
    width: 16rem;
    z-index: 4;

    & > .scroll {
      & > .logo-container {
        height: 12rem;
        width: 100%;
        
        & > .logo {
          height: 100%;
        }
      }

      & > .body {
        transition-property: background-color, border;
        .link {
          &:where(:hover) {
            background-color: rgba(var(--bs-light-rgb), 0.25);
          }
          &:where(:focus) {
            border: 1px solid rgba(var(--bs-light-rgb), 0.75);
          }
        }
      }
    }
  }

  & > .shadow {
    background-color: rgba(var(--bs-body-color-rgb), 0.2);
    height: 100vh;
    z-index: 3;
  }

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
    transition-property: top;
    z-index: 1;
  }
}
</style>