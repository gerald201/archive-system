<template>
  <div class="g-students-view py-5 w-100">
    <!-- Begin: modals -->
    <teleport
      to="body"
      v-if="!$store.state.application.error"
    >
      <div
        aria-labelledby="g-students-view-create-modal-label"
        aria-hidden="true"
        class="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="g-students-view-create-modal"
        ref="createModalRef"
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
                :disabled="createModalProcessing"
                type="button"
              ></button>
            </div>
            <div class="modal-body">
              <form 
                id="g-students-view-create-modal-form"
                @input="
                  if(typeof createModalFormDataStates[$event.target.name]?.changed == 'boolean') createModalFormDataStates[$event.target.name].changed = true;

                  validateCreateModalForm();
                "
                @submit.prevent="submitCreateModalForm();"
              >
                <div class="mb-3">
                  <label
                    class="form-label"
                    for="g-students-view-create-modal-form-index-field"
                  >
                    Index
                  </label>
                  <input
                    class="form-control"
                    :class="{'is-invalid': createModalFormDataStates.index.errors.length}"
                    :disabled="createModalProcessing"
                    id="g-students-view-create-modal-form-index-field"
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
                <div class="mb-3">
                  <label
                    class="form-label"
                    for="g-students-view-create-modal-form-first-name-field"
                  >
                    First Name
                  </label>
                  <input
                    class="form-control"
                    :class="{'is-invalid': createModalFormDataStates.firstName.errors.length}"
                    :disabled="createModalProcessing"
                    id="g-students-view-create-modal-form-first-name-field"
                    name="firstName"
                    type="text"
                    v-model="createModalFormData.firstName"
                  >
                  <div
                    class="invalid-feedback"
                    v-if="createModalFormDataStates.firstName.errors.length"
                  >
                    <div
                      :key="error.type"
                      v-for="error in createModalFormDataStates.firstName.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    class="form-label"
                    for="g-students-view-create-modal-form-last-name-field"
                  >
                    Last Name
                  </label>
                  <input
                    class="form-control"
                    :class="{'is-invalid': createModalFormDataStates.lastName.errors.length}"
                    :disabled="createModalProcessing"
                    id="g-students-view-create-modal-form-last-name-field"
                    name="lastName"
                    type="text"
                    v-model="createModalFormData.lastName"
                  >
                  <div
                    class="invalid-feedback"
                    v-if="createModalFormDataStates.lastName.errors.length"
                  >
                    <div
                      :key="error.type"
                      v-for="error in createModalFormDataStates.lastName.errors"
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
                :disabled="createModalProcessing"
                type="button"
              >
                Close
              </button>
              <button
                class="btn btn-primary"
                :disabled="createModalProcessing"
                form="g-students-view-create-modal-form"
                type="submit"
              >
                <span
                  aria-hidden="true"
                  class="spinner-grow spinner-grow-sm"
                  role="status"
                  v-if="createModalProcessing"
                ></span>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-labelledby="g-students-view-destroy-modal-label"
        aria-hidden="true"
        class="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="g-students-view-destroy-modal"
        ref="destroyModalRef"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-students-view-destroy-modal-label"
                v-text="`Delete student with id '${destroyModalStudentId}'`"
              ></h5>
              <button
                aria-label="Close"
                class="btn-close"
                data-bs-dismiss="modal"
                :disabled="destroyModalProcessing"
                type="button"
              ></button>
            </div>
            <div class="modal-body">
              <p class="text-danger">
                Are you sure you want to delete this student?
                <span class="feather feather-alert-triangle fs-3"></span>
              </p>
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                :disabled="destroyModalProcessing"
                type="button"
              >
                Close
              </button>
              <button
                class="btn btn-danger"
                :disabled="destroyModalProcessing"
                type="submit"
                @click="submitDestroyModalForm();"
              >
                <span
                  aria-hidden="true"
                  class="spinner-grow spinner-grow-sm"
                  role="status"
                  v-if="destroyModalProcessing"
                ></span>
                Destroy
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-labelledby="g-students-view-obliterate-modal-label"
        aria-hidden="true"
        class="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="g-students-view-obliterate-modal"
        ref="obliterateModalRef"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-students-view-obliterate-modal-label"
                v-text="`Delete student with id '${obliterateModalStudentId}'`"
              ></h5>
              <button
                aria-label="Close"
                class="btn-close"
                data-bs-dismiss="modal"
                :disabled="obliterateModalProcessing"
                type="button"
              ></button>
            </div>
            <div class="modal-body">
              <p class="text-danger">
                Are you sure you want to permanently delete this student?
                <span class="feather feather-alert-triangle fs-3"></span>
              </p>
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                :disabled="obliterateModalProcessing"
                type="button"
              >
                Close
              </button>
              <button
                class="btn btn-danger"
                :disabled="obliterateModalProcessing"
                type="submit"
                @click="submitObliterateModalForm();"
              >
                <span
                  aria-hidden="true"
                  class="spinner-grow spinner-grow-sm"
                  role="status"
                  v-if="obliterateModalProcessing"
                ></span>
                Obliterate
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-labelledby="g-students-view-restore-modal-label"
        aria-hidden="true"
        class="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="g-students-view-restore-modal"
        ref="restoreModalRef"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-students-view-restore-modal-label"
                v-text="`Delete student with id '${restoreModalStudentId}'`"
              ></h5>
              <button
                aria-label="Close"
                class="btn-close"
                data-bs-dismiss="modal"
                :disabled="restoreModalProcessing"
                type="button"
              ></button>
            </div>
            <div class="modal-body">
              <p class="text-info">
                Are you sure you want to restore this student?
                <span class="feather feather-alert-triangle fs-3"></span>
              </p>
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                :disabled="restoreModalProcessing"
                type="button"
              >
                Close
              </button>
              <button
                class="btn btn-info"
                :disabled="restoreModalProcessing"
                type="submit"
                @click="submitRestoreModalForm();"
              >
                <span
                  aria-hidden="true"
                  class="spinner-grow spinner-grow-sm"
                  role="status"
                  v-if="restoreModalProcessing"
                ></span>
                Restore
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-labelledby="g-students-view-update-modal-label"
        aria-hidden="true"
        class="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="g-students-view-update-modal"
        ref="updateModalRef"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-students-view-update-modal-label"
                v-text="`Edit student with id '${updateModalStudentId}'`"
              ></h5>
              <button
                aria-label="Close"
                class="btn-close"
                data-bs-dismiss="modal"
                :disabled="updateModalProcessing"
                type="button"
              ></button>
            </div>
            <div class="modal-body">
              <form 
                id="g-students-view-update-modal-form"
                @input="
                  if(typeof updateModalFormDataStates[$event.target.name]?.changed == 'boolean') updateModalFormDataStates[$event.target.name].changed = true;

                  validateUpdateModalForm();
                "
                @submit.prevent="submitUpdateModalForm();"
              >
                <div class="mb-3">
                  <label
                    class="form-label"
                    for="g-students-view-update-modal-form-index-field"
                  >
                    Index
                  </label>
                  <input
                    class="form-control"
                    :class="{'is-invalid': updateModalFormDataStates.index.errors.length}"
                    :disabled="updateModalProcessing"
                    id="g-students-view-update-modal-form-index-field"
                    name="index"
                    type="text"
                    v-model="updateModalFormData.index"
                  >
                  <div
                    class="invalid-feedback"
                    v-if="updateModalFormDataStates.index.errors.length"
                  >
                    <div
                      :key="error.type"
                      v-for="error in updateModalFormDataStates.index.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <label
                    class="form-label"
                    for="g-students-view-update-modal-form-first-name-field"
                  >
                    First Name
                  </label>
                  <input
                    class="form-control"
                    :class="{'is-invalid': updateModalFormDataStates.firstName.errors.length}"
                    :disabled="updateModalProcessing"
                    id="g-students-view-update-modal-form-first-name-field"
                    name="firstName"
                    type="text"
                    v-model="updateModalFormData.firstName"
                  >
                  <div
                    class="invalid-feedback"
                    v-if="updateModalFormDataStates.firstName.errors.length"
                  >
                    <div
                      :key="error.type"
                      v-for="error in updateModalFormDataStates.firstName.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    class="form-label"
                    for="g-students-view-update-modal-form-last-name-field"
                  >
                    Last Name
                  </label>
                  <input
                    class="form-control"
                    :class="{'is-invalid': updateModalFormDataStates.lastName.errors.length}"
                    :disabled="updateModalProcessing"
                    id="g-students-view-update-modal-form-last-name-field"
                    name="lastName"
                    type="text"
                    v-model="updateModalFormData.lastName"
                  >
                  <div
                    class="invalid-feedback"
                    v-if="updateModalFormDataStates.lastName.errors.length"
                  >
                    <div
                      :key="error.type"
                      v-for="error in updateModalFormDataStates.lastName.errors"
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
                :disabled="updateModalProcessing"
                type="button"
              >
                Close
              </button>
              <button
                class="btn btn-primary"
                :disabled="updateModalProcessing"
                form="g-students-view-update-modal-form"
                type="submit"
              >
                <span
                  aria-hidden="true"
                  class="spinner-grow spinner-grow-sm"
                  role="status"
                  v-if="updateModalProcessing"
                ></span>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
    <!-- End: modals -->

    <div class="create-button-container align-items-center d-flex justify-content-end p-2 w-100">
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
    <div class="data-table-container w-100">
      <table class="data-table align-middle table table-bordered">
        <thead class="head table-dark">
          <tr>
            <th scope="col"></th>
            <th scope="col">#</th>
            <th scope="col">Id</th>
            <th scope="col">Index</th>
            <th scope="col">Created At</th>
            <th scope="col">Updated At</th>
            <th scope="col">Deleted At</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="$store.state.storage.students === null">
            <td colspan="8">
              <div class="align-items-center d-flex justify-content-center py-2">
                <div class="spinner-grow text-primary" role="status"></div>
              </div>
            </td>
          </tr>
          <tr v-else-if="!$store.state.storage.students.length">
            <td colspan="8">
              <div class="py-2 text-secondary">
                No students to show!
              </div>
            </td>
          </tr>
          <template v-else>
            <template
              :key="`student-${student.id}`"
              v-for="(student, studentIndex) in $store.state.storage.students"
            >
              <tr>
                <td
                  :aria-controls="`g-students-view-data-collapse-${student.id}`"
                  aria-expanded="false"
                  class="table-data-toggler"
                  :data-bs-target="`#g-students-view-data-collapse-${student.id}`"
                  data-bs-toggle="collapse"
                >
                  <span class="icon d-inline-block feather feather-chevron-right"></span>
                </td>
                <th
                  scope="row"
                  v-text="studentIndex + 1"
                ></th>
                <td v-text="student.id"></td>
                <td v-text="student.index"></td>
                <td v-text="moment(student.createdAt).format('DD/MM/YYYY, HH:MM:SS A')"></td>
                <td v-text="moment(student.updatedAt).format('DD/MM/YYYY, HH:MM:SS A')"></td>
                <td v-text="student.deletedAt ? moment(student.deletedAt).format('DD/MM/YYYY, HH:MM:SS A') : 'NULL'"></td>
                <td class=" align-items-center d-flex gap-1">
                  <button
                    class="btn btn-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#g-students-view-update-modal"
                    title="Edit"
                    type="button"
                    @click="
                      updateModalStudentId = student.id;
                      updateModalFormData.index = student.index;
                      updateModalFormData.firstName = student.UserProfile.firstName;
                      updateModalFormData.lastName = student.UserProfile.lastName;
                    "
                  >
                    <span class="feather feather-edit"></span>
                  </button>
                  <button
                    class="btn btn-danger btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#g-students-view-destroy-modal"
                    title="Delete"
                    @click="destroyModalStudentId = student.id;"
                    v-if="!student.deletedAt"
                  >
                    <span class="feather feather-trash"></span>
                  </button>
                  <button
                    class="btn btn-info btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#g-students-view-restore-modal"
                    title="Restore"
                    @click="restoreModalStudentId = student.id;"
                    v-if="student.deletedAt"
                  >
                    <span class="feather feather-tool"></span>
                  </button>
                  <button
                    class="btn btn-danger btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#g-students-view-obliterate-modal"
                    title="Permanent Delete"
                    @click="obliterateModalStudentId = student.id;"
                    v-if="student.deletedAt"
                  >
                    <span class="feather feather-slash"></span>
                  </button>
                </td>
              </tr>
              <tr class="border-transparent">
                <td class="p-0"></td>
                <td
                  class="p-0"
                  colspan="7"
                >
                  <div
                    class="collapse p-2"
                    :id="`g-students-view-data-collapse-${student.id}`"
                  >
                    <table class="align-middle border table table-bordered table-sm">
                      <thead>
                        <tr class="table-primary">
                          <th
                            class="text-center"
                            colspan="8"
                            scope="col"
                          >
                            Profile
                          </th>
                        </tr>
                        <tr class="table-light">
                          <th scope="col">#</th>
                          <th scope="col">Id</th>
                          <th scope="col">First Name</th>
                          <th scope="col">Last Name</th>
                          <th scope="col">User Profile Type Id</th>
                          <th scope="col">Created At</th>
                          <th scope="col">Updated At</th>
                          <th scope="col">Deleted At</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">
                            1
                          </th>
                          <td v-text="student.UserProfile.id"></td>
                          <td v-text="student.UserProfile.firstName"></td>
                          <td v-text="student.UserProfile.lastName"></td>
                          <td v-text="student.UserProfile.userProfileTypeId"></td>
                          <td v-text="moment(student.UserProfile.createdAt).format('DD/MM/YYYY, HH:MM:SS A')"></td>
                          <td v-text="moment(student.UserProfile.updatedAt).format('DD/MM/YYYY, HH:MM:SS A')"></td>
                          <td v-text="student.UserProfile.deletedAt ? moment(student.UserProfile.deletedAt).format('DD/MM/YYYY, HH:MM:SS A') : 'NULL'"></td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="align-middle border table table-bordered table-sm">
                      <thead>
                        <tr class="table-primary">
                          <th
                            class="text-center"
                            colspan="7"
                            scope="col"
                          >
                            Profile Type
                          </th>
                        </tr>
                        <tr class="table-light">
                          <th scope="col">#</th>
                          <th scope="col">Id</th>
                          <th scope="col">Name</th>
                          <th scope="col">Description</th>
                          <th scope="col">Created At</th>
                          <th scope="col">Updated At</th>
                          <th scope="col">Deleted At</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">
                            1
                          </th>
                          <td v-text="student.UserProfile.UserProfileType.id"></td>
                          <td v-text="student.UserProfile.UserProfileType.name"></td>
                          <td v-text="student.UserProfile.UserProfileType.description"></td>
                          <td v-text="moment(student.UserProfile.UserProfileType.createdAt).format('DD/MM/YYYY, HH:MM:SS A')"></td>
                          <td v-text="moment(student.UserProfile.UserProfileType.updatedAt).format('DD/MM/YYYY, HH:MM:SS A')"></td>
                          <td v-text="student.UserProfile.UserProfileType.deletedAt ? moment(student.UserProfile.UserProfileType.deletedAt).format('DD/MM/YYYY, HH:MM:SS A') : 'NULL'"></td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="align-middle border table table-bordered table-sm">
                      <thead>
                        <tr class="table-primary">
                          <th
                            class="text-center"
                            colspan="7"
                            scope="col"
                          >
                            Roles
                          </th>
                        </tr>
                        <tr class="table-light">
                          <th scope="col">#</th>
                          <th scope="col">Id</th>
                          <th scope="col">Name</th>
                          <th scope="col">Description</th>
                          <th scope="col">Created At</th>
                          <th scope="col">Updated At</th>
                          <th scope="col">Deleted At</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          :key="`student-${student.id}-role-${role.id}`"
                          v-for="(role, roleIndex) in student.Roles"
                        >
                          <th
                            scope="col"
                            v-text="roleIndex + 1"
                          ></th>
                          <td v-text="role.id"></td>
                          <td v-text="role.name"></td>
                          <td v-text="role.description"></td>
                          <td v-text="moment(role.createdAt).format('DD/MM/YYYY, HH:MM:SS A')"></td>
                          <td v-text="moment(role.updatedAt).format('DD/MM/YYYY, HH:MM:SS A')"></td>
                          <td v-text="role.deletedAt ? moment(role.deletedAt).format('DD/MM/YYYY, HH:MM:SS A') : 'NULL'"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import moment from 'moment';
import { reactive, ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { validate } from '@/services/fastest-validator';

export default {
  name: 'GStudentsView',
  setup() {
    const $store = useStore();

    const createModalRef = ref(null);
    const destroyModalRef = ref(null);
    const obliterateModalRef = ref(null);
    const restoreModalRef = ref(null);
    const updateModalRef = ref(null);

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
    const updateModalValidationSchema = {
      $$strict: 'remove',
      index: {
        type: 'string',
        empty: false,
        optional: true
      },
      firstName: {
        type: 'string',
        empty: 'false',
        min: 3,
        optional: true
      },
      lastName: {
        type: 'string',
        empty: 'false',
        min: 3,
        optional: true
      }
    };

    const createModalBsModal = ref(null);
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
    const destroyModalBsModal = ref(null);
    const destroyModalProcessing = ref(false); 
    const destroyModalStudentId = ref(null);
    const obliterateModalBsModal = ref(null);
    const obliterateModalProcessing = ref(false); 
    const obliterateModalStudentId = ref(null);
    const restoreModalBsModal = ref(null);
    const restoreModalProcessing = ref(false);
    const restoreModalStudentId = ref(null);
    const updateModalBsModal = ref(null);
    const updateModalFormData = reactive({
      index: '',
      firstName: '',
      lastName: ''
    });
    const updateModalFormDataStates = reactive({
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
    const updateModalProcessing = ref(false);
    const updateModalStudentId = ref(null);

    function resetCreateModalForm(options) {
      options = options?.constructor?.name?.toLowerCase() == 'object' ? options : (Array.isArray(options) ? {include: options} : (typeof options == 'string' ? {include: [options]} : {}));
      options.exclude = (Array.isArray(options?.exclude) ? options.exclude : (typeof options?.exclude == 'string' ? [options.exclude] : []));
      options.include = (Array.isArray(options?.include) ? options.include : (typeof options?.include == 'string' ? [options.include] : Object.keys(createModalFormData)));

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

    function resetUpdateModalForm(options) {
      options = options?.constructor?.name?.toLowerCase() == 'object' ? options : (Array.isArray(options) ? {include: options} : (typeof options == 'string' ? {include: [options]} : {}));
      options.exclude = (Array.isArray(options?.exclude) ? options.exclude : (typeof options?.exclude == 'string' ? [options.exclude] : []));
      options.include = (Array.isArray(options?.include) ? options.include : (typeof options?.include == 'string' ? [options.include] : Object.keys(updateModalFormData)));

      options.include
        .filter(function(field) {
          return Object.keys(updateModalFormData).includes(field) && !options.exclude.includes(field);
        })
        .forEach(function(field) {
          updateModalFormData[field] = '';
          updateModalFormDataStates[field].changed = false;
          updateModalFormDataStates[field].errors = [];
        });
    }

    async function submitCreateModalForm() {
      if(createModalProcessing.value) return;

      createModalProcessing.value = true;

      if(!validateCreateModalForm()) {
        createModalProcessing.value = false;
        return;
      }

      const studentCreated = await $store.dispatch('createStudent', createModalFormData);

      if(studentCreated) {
        resetCreateModalForm();
        createModalBsModal.value && createModalBsModal.value.hide();
      }

      createModalProcessing.value = false;
    }

    async function submitDestroyModalForm() {
      if(isNaN(parseInt(destroyModalStudentId.value))) {
        destroyModalProcessing.value = false;
        return;
      }

      if(destroyModalProcessing.value) return;

      destroyModalProcessing.value = true;

      const studentDestroyed = await $store.dispatch('destroyStudent', destroyModalStudentId.value);

      (studentDestroyed && destroyModalBsModal.value) && destroyModalBsModal.value.hide();

      destroyModalProcessing.value = false;
    }

    async function submitObliterateModalForm() {
      if(isNaN(parseInt(obliterateModalStudentId.value))) {
        obliterateModalProcessing.value = false;
        return;
      }

      if(obliterateModalProcessing.value) return;

      obliterateModalProcessing.value = true;

      const studentObliterated = await $store.dispatch('obliterateStudent', obliterateModalStudentId.value);

      (studentObliterated && obliterateModalBsModal.value) && obliterateModalBsModal.value.hide();

      obliterateModalProcessing.value = false;
    }

    async function submitRestoreModalForm() {
      if(isNaN(parseInt(restoreModalStudentId.value))) {
        restoreModalProcessing.value = false;
        return;
      }

      if(restoreModalProcessing.value) return;

      restoreModalProcessing.value = true;

      const studentRestored = await $store.dispatch('restoreStudent', restoreModalStudentId.value);

      (studentRestored && restoreModalBsModal.value) && restoreModalBsModal.value.hide();

      restoreModalProcessing.value = false;
    }

    async function submitUpdateModalForm() {
      if(isNaN(parseInt(updateModalStudentId.value))) {
        updateModalProcessing.value = false;
        return;
      }

      if(updateModalProcessing.value) return;

      updateModalProcessing.value = true;

      if(!validateUpdateModalForm()) {
        updateModalProcessing.value = false;
        return;
      }

      const studentUpdated = await $store.dispatch('updateStudent', {
        data: updateModalFormData,
        id: updateModalStudentId.value
      });

      if(studentUpdated) {
        resetUpdateModalForm();
        updateModalBsModal.value && updateModalBsModal.value.hide();
      }

      updateModalProcessing.value = false;
    }

    function validateCreateModalForm() {
      const validated = validate(createModalFormData, createModalValidationSchema);

      for(const field in createModalFormDataStates) {
        createModalFormDataStates[field].errors = [];
      }

      if(validated === true) return true;

      validated
        .forEach(function(error) {
          if(!Array.isArray(createModalFormDataStates[error.field]?.errors) || !createModalFormDataStates[error.field].changed) return;

          const check = createModalFormDataStates[error.field].errors
            .findIndex(function(formError) {
              return formError.type == error.type
            }) < 0;

          if(!check) return;

          createModalFormDataStates[error.field].errors.push(error);
        });
      return false;
    }

    function validateUpdateModalForm() {
      const validated = validate(updateModalFormData, updateModalValidationSchema);

      for(const field in updateModalFormDataStates) {
        updateModalFormDataStates[field].errors = [];
      }

      if(validated === true) return true;

      validated
        .forEach(function(error) {
          if(!Array.isArray(updateModalFormDataStates[error.field]?.errors) || !updateModalFormDataStates[error.field].changed) return;

          const check = updateModalFormDataStates[error.field].errors
            .findIndex(function(formError) {
              return formError.type == error.type
            }) < 0;

          if(!check) return;

          updateModalFormDataStates[error.field].errors.push(error);
        });
      return false;
    }

    watchEffect(function() {
      if(createModalRef.value) createModalBsModal.value = Modal.getOrCreateInstance(createModalRef.value);
      else createModalBsModal.value = null;

      if(destroyModalRef.value) {
        destroyModalBsModal.value = Modal.getOrCreateInstance(destroyModalRef.value);
        destroyModalRef.value.addEventListener('hide.bs.modal', function() {
          destroyModalStudentId.value = null;
        });
      }
      else destroyModalBsModal.value = null;

      if(obliterateModalRef.value) {
        obliterateModalBsModal.value = Modal.getOrCreateInstance(obliterateModalRef.value);
        obliterateModalRef.value.addEventListener('hide.bs.modal', function() {
          obliterateModalStudentId.value = null;
        });
      }
      else obliterateModalBsModal.value = null;

      if(restoreModalRef.value) {
        restoreModalBsModal.value = Modal.getOrCreateInstance(restoreModalRef.value);
        restoreModalRef.value.addEventListener('hide.bs.modal', function() {
          restoreModalStudentId.value = null;
        });
      }
      else restoreModalBsModal.value = null;

      if(updateModalRef.value) {
        updateModalBsModal.value = Modal.getOrCreateInstance(updateModalRef.value);
        updateModalRef.value.addEventListener('hide.bs.modal', function() {
          updateModalStudentId.value = null;
          resetUpdateModalForm();
        });
      }
      else updateModalBsModal.value = null;
    })

    if($store.state.storage.students === null) $store.dispatch('requestStudents');

    return {
      createModalBsModal,
      createModalFormData,
      createModalFormDataStates,
      createModalProcessing,
      createModalRef,
      destroyModalBsModal,
      destroyModalProcessing,
      destroyModalRef,
      destroyModalStudentId,
      moment,
      obliterateModalBsModal,
      obliterateModalProcessing,
      obliterateModalRef,
      obliterateModalStudentId,
      resetCreateModalForm,
      resetUpdateModalForm,
      restoreModalBsModal,
      restoreModalProcessing,
      restoreModalRef,
      restoreModalStudentId,
      submitCreateModalForm,
      submitDestroyModalForm,
      submitObliterateModalForm,
      submitRestoreModalForm,
      submitUpdateModalForm,
      updateModalBsModal,
      updateModalFormData,
      updateModalFormDataStates,
      updateModalProcessing,
      updateModalRef,
      updateModalStudentId,
      validateCreateModalForm,
      validateUpdateModalForm
    };
  }
}
</script>

<style lang="scss" scoped>
.g-students-view {
  & > .data-table-container {
    overflow-x: auto;

    & > .data-table {
      th, td {
        white-space: nowrap;
      }

      .table-data-toggler {
        --self__background-alpha: 0;
        --icon__transform: none;

        &:where(:hover) {
          --self__background-alpha: 0.1;
        }

        &:where([aria-expanded=true]) {
          --icon__transform: rotate(90deg);
        }
      }
      .table-data-toggler {
        background-color: rgba(var(--bs-secondary-rgb), var(--self__background-alpha));
        
        & > .icon {
          transform: var(--icon__transform);
          transform-origin: center;
          transition-property: transform;
        }
      }
    }
  }
}
</style>
