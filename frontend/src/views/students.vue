<template>
  <div class="g-students-view py-5 w-100">
    <!-- Begin: modals -->
    <teleport to="body">
      <div
        aria-labelledby="g-students-view-create-modal-label"
        aria-hidden="true"
        class="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="g-students-view-create-modal"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-students-view-create-modal-label"
              >
                Add New Student
              </h5>
              <button
                aria-label="Close"
                class="btn-close"
                data-bs-dismiss="modal"
                type="button"
              ></button>
            </div>
            <div class="modal-body">
              <form 
                id="students-view-create-modal-form"
                @submit.prevent
              >
                <div class="mb-3">
                  <label
                    class="form-label"
                    for="students-view-create-modal-form-index-field"
                  >
                    Index
                  </label>
                  <input
                    class="form-control"
                    :class="{'is-invalid': createModalFormDataStates.index.errors.length}"
                    :disabled="createModalProcessing"
                    id="students-view-create-modal-form-index-field"
                    name="index"
                    type="text"
                    v-model="createModalFormData.index"
                  >
                  <div
                    class="invalid-feedback"
                    v-if="createModalFormDataStates.index.errors.length"
                  >
                    <div
                      :key="error.type"
                      v-for="error in createModalFormDataStates.index.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                type="button"
              >Close</button>
              <button
                class="btn btn-primary"
                form="students-view-create-modal-form"
                type="submit"
              >Create</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
    <!-- End: modals -->

    <div class="align-items-center d-flex justify-content-end p-2 w-100">
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#g-students-view-create-modal"
        type="button"
      >
        New Student
        <span class="feather feather-plus"></span>
      </button>
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">#</th>
          <th scope="col">Index</th>
          <th scope="col">Created At</th>
          <th scope="col">Updated At</th>
          <th scope="col">Delete At</th>
        </tr>
      </thead>
      <tr v-if="$store.state.storage.students === null">
        <td colspan="6">
          <div class="align-items-center d-flex justify-content-center py-2">
            <div class="spinner-grow text-primary" role="status"></div>
          </div>
        </td>
      </tr>
      <tr v-else-if="!$store.state.storage.students.length">
        <td colspan="6">
          <div class="py-2 text-secondary">
            No students to show!
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'GStudentsView',
  setup() {
    const $store = useStore();

    const createModalValidationSchema = {
      $$strict: 'remove',
      index: {
        type: 'string',
        empty: false
      },
      firstName: {
        type: 'string',
        empty: 'false',
        min: 3
      },
      lastName: {
        type: 'string',
        empty: 'false',
        min: 3
      }
    };

    const createModalFormData = reactive({
      index: '',
      firstName: '',
      lastName: ''
    });
    const createModalFormDataStates = reactive({
      index: {
        changed: false,
        errors: []
      },
      firstName: {
        changed: false,
        errors: []
      },
      lastName: {
        changed: false,
        errors: []
      }
    });
    const createModalProcessing = ref(false);

    function resetCreateModalForm(options) {
      options = options?.constructor?.name?.toLowerCase() == 'object' ? options : (Array.isArray(options) ? {include: options} : (typeof options == 'string' ? {include: [options]} : {}));
      options.exclude = (Array.isArray(options?.exclude) ? options.exclude : (typeof options?.exclude == 'string' ? [options.exclude] : []));
      options.include = (Array.isArray(options?.include) ? options.include : (typeof options?.include == 'string' ? [options.include] : Object.keys(formData)));

      options.include
        .filter(function(field) {
          return Object.keys(createModalFormData).includes(field) && !options.exclude.includes(field);
        })
        .forEach(function(field) {
          createModalFormData[field] = '';
          createModalFormDataStates[field].changed = false;
          createModalFormDataStates[field].errors = [];
        });
    }

    async function submitCreateModalForm() {
      if(createModalProcessing.value) return;

      createModalProcessing.value = true;

      if(!validateForm()) {
        processing.value = false;
        createModalProcessing;
      }

      try {

      } finally {
        createModalProcessing.value = false;
      }

      const signedIn = await $store.dispatch('authenticationSignIn', formData);

      if(signedIn) {
        resetForm();
        await $router.push({name: 'Dashboard'});
      }
      else resetForm('password');
    }

    if($store.state.storage.students === null) $store.dispatch('requestStudentsFromApi');

    return {
      createModalFormData,
      createModalFormDataStates,
      createModalProcessing,
      resetCreateModalForm,
      submitCreateModalForm
    };
  }
}
</script>
