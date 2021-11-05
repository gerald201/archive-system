<template>
  <div class="g-dashboard-view py-5">
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header">
            Projects
          </div>
          <div class="card-body">
            <p
              class="fs-1 text-center text-primary"
              v-text="$store.state.storage.projects.length"
            ></p>
            <button class="btn btn-primary w-100">
              View All
            </button>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <div class="card-header">
            Question Banks
          </div>
          <div class="card-body">
            <p
              class="fs-1 text-center text-primary"
              v-text="$store.state.storage.questionBanks.length"
            ></p>
            <button class="btn btn-primary w-100">
              View All
            </button>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <div class="card-header">
            Students
          </div>
          <div class="card-body">
            <p
              class="fs-1 text-center text-primary"
              v-text="$store.state.storage.students.length"
            ></p>
            <button class="btn btn-primary w-100">
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GDashboardView'
}
</script>

<style>
.g-dashboard-view {}
</style>