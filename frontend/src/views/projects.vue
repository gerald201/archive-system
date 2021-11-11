<template>
  <div class="g-projects-view py-5 w-100">
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Index</th>
          <th scope="col">Created At</th>
          <th scope="col">Updated At</th>
          <th scope="col">Delete At</th>
        </tr>
      </thead>
      <tr v-if="$store.state.storage.projects === null">
        <td colspan="5">
          <div class="align-items-center d-flex justify-content-center py-2">
            <div class="spinner-grow text-primary" role="status"></div>
          </div>
        </td>
      </tr>
      <tr v-else-if="!$store.state.storage.projects.length">
        <td colspan="5">
          <div class="py-2 text-secondary">
            No projects to show!
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { useStore } from 'vuex';

export default {
  name: 'GProjectsView',
  setup() {
    const $store = useStore();

    if($store.state.storage.projects === null) $store.dispatch('requestProjects');
  }
}
</script>
