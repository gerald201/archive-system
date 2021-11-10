<template>
  <div class="g-home-view py-5 w-100">
    Welcome &quot;HOME&quot;.
    <div class="d-flex">
      <router-link
        class="btn btn-primary m-1"
        :to="{name: 'SignIn'}"
        v-if="!$store.getters.authenticated"
      >
        Sign In!
      </router-link>
      <router-link
        class="btn btn-primary m-1"
        :to="{name: 'Dashboard'}"
        v-if="$store.getters.authenticated"
      >
        Visit the Dashboard
      </router-link>
      <router-link
        class="btn btn-primary m-1"
        :to="{name: 'Projects'}"
        v-if="$store.getters.authenticated"
      >
        View all Projects
      </router-link>
      <router-link
        class="btn btn-primary m-1"
        :to="{name: 'QuestionBanks'}"
        v-if="$store.getters.authenticated"
      >
        View all Question Banks
      </router-link>
      <router-link
        class="btn btn-primary m-1"
        :to="{name: 'Students'}"
        v-if="$store.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'staff'"
      >
        View all Students
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GHomeView'
}
</script>
