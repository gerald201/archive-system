<template>
  <div class="g-dashboard-view py-5 w-100">
    <template v-if="$store.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'staff'">
      <div class="row m-0 w-100">
        <div class="col">
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
        <div class="col">
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
        <div class="col">
          <div class="card">
            <div class="card-header">
              Students
            </div>
            <div class="align-items-center card-body d-flex flex-column">
              <div
                class="spinner-grow mb-2 text-primary"
                v-if="$store.state.storage.studentCount === null"
              ></div>
              <p
                class="fs-1 text-center text-primary"
                v-else
                v-text="$store.state.storage.studentCount"
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
    </template>
    <template v-if="$store.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'student'">
      <h3>
        Projects
      </h3>
      <div class="projects-container d-grid gap-1">
        <div
          class="align-items-center d-flex justify-content-center py-2"
          v-if="$store.state.storage.projects === null"
        >
          <div class="spinner-grow text-primary" role="status"></div>
        </div>
        <div
          class="no-project py-2 text-secondary"
          v-else-if="!$store.state.storage.projects.length"
        >
          No projects to show!
        </div>
        <div
          class="py-2 row"
          v-else
        >
          <div
            class="col-xl-3 col-lg-4 col-md-6 col-12"
            :key="`project-${project.id}`"
            v-for="project in $store.state.storage.projects"
          >
            <div class="card">
              <div
                class="card-header"
                v-text="project.name"
              ></div>
              <div class="body">
                <p v-text="`${project.User.UserProfile.firstName} ${project.User.UserProfile.lastName}`"></p>
                <button class="btn btn-primary w-100">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3>
        Question Banks
      </h3>
      <div class="projects-container d-grid gap-1">
        <div
          class="align-items-center d-flex justify-content-center py-2"
          v-if="$store.state.storage.questionBanks === null"
        >
          <div class="spinner-grow text-primary" role="status"></div>
        </div>
        <div
          class="no-project py-2 text-secondary"
          v-else-if="!$store.state.storage.questionBanks.length"
        >
          No question banks to show!
        </div>
        <div
          class="py-2 row"
          v-else
        >
          <div
            class="col-xl-3 col-lg-4 col-md-6 col-12"
            :key="`question-bank-${questionBank.id}`"
            v-for="questionBank in $store.state.storage.questionBanks"
          >
            <div class="card">
              <div
                class="card-header"
                v-text="questionBank.Course.name"
              ></div>
              <div class="body">
                <p>
                  Question Bank
                </p>
                <button class="btn btn-primary w-100">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { useStore } from 'vuex';

export default {
  name: 'GDashboardView',
  setup() {
    const $store = useStore();

    if($store.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'staff') {
      if($store.state.storage.projectCount === null) $store.dispatch('requestProjectCount');

      if($store.state.storage.questionBankCount === null) $store.dispatch('requestQuestionBankCount');

      if($store.state.storage.studentCount === null) $store.dispatch('requestStudentCount');
    }

    if($store.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'student') {
      if($store.state.storage.projects === null) $store.dispatch('requestProjects');

      if($store.state.storage.questionBanks === null) $store.dispatch('requestQuestionBanks');
    }
  }
}
</script>
