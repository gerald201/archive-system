<template>
  <div class="g-application-main left-0 position-absolute top-0 w-100">
    <transition name="g-transition-application-main-aside">
      <div
        class="aside bg-primary border-end position-fixed shadow-sm top-0"
        :class="{'state:opened': $store.state.application.mainAsideOpened}"
        v-if="!$store.state.application.mainAsideHidden"
      >
        <div class="toggler-container px-2">
          <button
            class="toggler btn-close btn-close-white"
            @click="$store.commit('SET_APPLICATION_MAIN_ASIDE_OPENED', false);"
          ></button>
        </div>
        <perfect-scrollbar class="scroll w-100">
          <div class="logo-container align-items-center d-flex justify-content-center p-3">
            <router-link
              class="h-100"
              :to="{name: 'Home'}"
            >
              <img
                alt=""
                class="logo h-100 rounded"
                :src="`${apiUrl}/assets/images/gctu-logo.jpg`"
              >
            </router-link>
          </div>
          <div
            aria-label="Docs navigation"
            class="body px-2 w-100"
            @click="if($event.target.closest('.link:not(.link-list-toggle)')) $store.commit('SET_APPLICATION_MAIN_ASIDE_OPENED', false);"
          >
            <ul class="list-unstyled mb-0 py-3">
              <li>
                <router-link
                  class="link btn btn-sm fs-6 mb-1 rounded text-light"
                  :to="{name: 'Dashboard'}"
                >
                  Dashboard
                </router-link>
              </li>
              <li v-if="$store.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'staff'">
                <router-link
                  class="link btn btn-sm fs-6 mb-1 rounded text-light"
                  :to="{name: 'Courses'}"
                >
                  Courses
                </router-link>
              </li>
              <li v-if="$store.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'staff'">
                <router-link
                  class="link btn btn-sm fs-6 mb-1 rounded text-light"
                  :to="{name: 'Programs'}"
                >
                  Programs
                </router-link>
              </li>
              <li>
                <router-link
                  class="link btn btn-sm fs-6 mb-1 rounded text-light"
                  :to="{name: 'Projects'}"
                >
                  Projects
                </router-link>
              </li>
              <li>
                <router-link
                  class="link btn btn-sm fs-6 mb-1 rounded text-light"
                  :to="{name: 'QuestionBanks'}"
                >
                  Question Banks
                </router-link>
              </li>
              <li v-if="$store.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'staff'">
                <router-link
                  class="link btn btn-sm fs-6 mb-1 rounded text-light"
                  :to="{name: 'Students'}"
                >
                  Students
                </router-link>
              </li>
            </ul>
          </div>
        </perfect-scrollbar>
      </div>
    </transition>

    <transition name="g-transition-application-main-shadow">
      <div
        class="shadow left-0 position-fixed top-0 w-100"
        @click="$store.commit('SET_APPLICATION_MAIN_ASIDE_OPENED', false);"
        v-if="!$store.state.application.mainAsideHidden && $store.state.application.mainAsideOpened"
      ></div>
    </transition>

    <transition name="g-transition-application-main-header">
      <div
        class="header align-items-center d-flex gap-2 border-bottom left-0 px-3 position-fixed shadow-sm top-0 w-100"
        v-if="!$store.state.application.mainHeaderHidden"
      >
        <button
          class="btn btn-sm btn-primary border-0 flex-grow-0 flex-shrink-0 rounded"
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
        <div class="left d-flex gap-2 flex-grow-1 flex-shrink-1 w-100">
          <div class="logo-container">
            <img
              alt=""
              class="logo h-100 rounded"
              :src="`${apiUrl}/assets/images/gctu-logo.jpg`"
            >
          </div>
        </div>
        <div
          class="right align-items-center d-flex gap-2 flex-grow-1 flex-shrink-1 justify-content-end w-100"
          v-if="$store.getters.authenticated"
        >
          <div
            class="fst-italic text-secondary"
            v-text="$store.state.storage.authenticationUser?.index || ''"
          ></div>
          <div class="dropdown">
            <button
              aria-expanded="false"
              class="btn btn-primary btn-sm"
              data-bs-toggle="dropdown"
              id="g-application-main-header-user-dropdown-toggler"
              type="button"
            >
              <span class="feather feather-more-horizontal"></span>
            </button>
            <ul
              aria-labelledby="g-application-main-header-user-dropdown-toggler"
              class="dropdown-menu"
            >
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{name: 'MyProfile'}"
                >
                  My Profile
                </router-link>
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li>
                <button
                  class="dropdown-item"
                  @click="signOut()"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>

    <div
      class="content left-0 mx-auto position-absolute w-100"
      :class="{'state:header-hidden': $store.state.application.mainHeaderHidden}"
      :style="{'--content-viewport': $store.state.application.mainHeaderHidden ? '100vh' : 'calc(100vh - 4rem)'}"
    >
      <div class="container w-100">
        <div class="wrapper position-relative w-100">
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
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import apiConfiguration from '@/configuration/api';

export default {
  components: {PerfectScrollbar},
  name: 'GApplicationMain',
  setup() {
    const $router = useRouter();
    const $store = useStore();

    const apiUrl = computed(function() {
      return apiConfiguration.url;
    });

    async function signOut() {
      await $store.dispatch('authenticationSignOut');
      await $router.push({name: 'Home'});
    }

    return {
      apiUrl,
      signOut
    };
  }
}
</script>

<style lang="scss" scoped>
.g-application-main {
  z-index: 1;

  & > .modal-overlay {
    height: 100vh;
    left: 0px;
    pointer-events: none;
    position: fixed;
    top: 0px;

    & > * {
      pointer-events: auto;
    }
  }

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

    & > .toggler-container {
      align-items: center;
      display: flex;
      height: 3rem;
      justify-content: flex-end;
    }

    & > .scroll {
      height: calc(100% - 3rem);

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

          &.router-link-active {
            font-weight: bold;
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

    & > .left > .logo-container {
      height: 3.5rem;
    }
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