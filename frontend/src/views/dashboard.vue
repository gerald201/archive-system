<template>
  <div class="g-dashboard-view py-5 w-100">
    <div class="row m-0 w-100">
      <div
        class="col-xl-3 col-lg-4 col-md-6 col-12 p-2"
        v-if="$store.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'staff'"
      >
        <div class="card">
          <div class="card-header">
            Courses
          </div>
          <div class="align-items-center card-body d-flex flex-column">
            <div
              class="spinner-grow mb-2 text-primary"
              v-if="$store.state.storage.courseCount === null"
            ></div>
            <p
              class="fs-1 text-center text-primary"
              v-else
              v-text="$store.state.storage.courseCount"
            ></p>
            <router-link
              class="btn btn-primary w-100"
              :to="{name: 'Courses'}"
            >
              View All
            </router-link>
          </div>
        </div>
      </div>
      <div
        class="col-xl-3 col-lg-4 col-md-6 col-12 p-2"
        v-if="$store.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'staff'"
      >
        <div class="card">
          <div class="card-header">
            Programs
          </div>
          <div class="align-items-center card-body d-flex flex-column">
            <div
              class="spinner-grow mb-2 text-primary"
              v-if="$store.state.storage.programCount === null"
            ></div>
            <p
              class="fs-1 text-center text-primary"
              v-else
              v-text="$store.state.storage.programCount"
            ></p>
            <router-link
              class="btn btn-primary w-100"
              :to="{name: 'Programs'}"
            >
              View All
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-lg-4 col-md-6 col-12 p-2">
        <div class="card">
          <div class="card-header">
            Projects
          </div>
          <div class="align-items-center card-body d-flex flex-column">
            <div
              class="spinner-grow mb-2 text-primary"
              v-if="$store.state.storage.projectCount === null"
            ></div>
            <p
              class="fs-1 text-center text-primary"
              v-else
              v-text="$store.state.storage.projectCount"
            ></p>
            <router-link
              class="btn btn-primary w-100"
              :to="{name: 'Projects'}"
            >
              View All
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-lg-4 col-md-6 col-12 p-2">
        <div class="card">
          <div class="card-header">
            Question Banks
          </div>
          <div class="align-items-center card-body d-flex flex-column">
            <div
              class="spinner-grow mb-2 text-primary"
              v-if="$store.state.storage.questionBankCount === null"
            ></div>
            <p
              class="fs-1 text-center text-primary"
              v-else
              v-text="$store.state.storage.questionBankCount"
            ></p>
            <router-link
              class="btn btn-primary w-100"
              :to="{name: 'QuestionBanks'}"
            >
              View All
            </router-link>
          </div>
        </div>
      </div>
      <div
        class="col-xl-3 col-lg-4 col-md-6 col-12 p-2"
        v-if="$store.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'staff'"
      >
        <div class="card">
          <div class="card-header">
            Students
          </div>
          <div class="align-items-center card-body d-flex flex-column">
            <div
              class="spinner-grow mb-2 text-primary"
              v-if="$store.state.storage.userCount === null"
            ></div>
            <p
              class="fs-1 text-center text-primary"
              v-else
              v-text="$store.state.storage.userCount"
            ></p>
            <router-link
              class="btn btn-primary w-100"
              :to="{name: 'Students'}"
            >
              View All
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';

export default {
  name: 'GDashboardView',
  setup() {
    const $store = useStore();

    if($store.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'staff') {
      if($store.state.storage.courseCount === null) $store.dispatch('requestResourceCount', {type: 'courses'});

      if($store.state.storage.programCount === null) $store.dispatch('requestResourceCount', {type: 'programs'});

      if($store.state.storage.projectCount === null) $store.dispatch('requestResourceCount', {type: 'projects'});

      if($store.state.storage.questionBankCount === null) $store.dispatch('requestResourceCount', {type: 'question-banks'});

      if($store.state.storage.userCount === null) $store.dispatch('requestResourceCount', {type: 'users'});
    }

    if($store.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'student') {
      if($store.state.storage.projects === null) $store.dispatch('requestResource', {type: 'projects'});

      if($store.state.storage.questionBanks === null) $store.dispatch('requestResource', {type: 'question-banks'});
    }
  }
}
</script>
