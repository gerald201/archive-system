<template>
  <div class="g-students-view py-5 w-100">
    <h3>
      Students
    </h3>

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
        v-if="$store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff'"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-students-view-create-modal-label"
              >
                Add a new student.
              </h5>
              <button
                aria-label="Close"
                class="btn-close"
                data-bs-dismiss="modal"
                :disabled="createModalProcessing"
              ></button>
            </div>
            <div class="modal-body">
              <form 
                id="g-students-view-create-modal-form"
                @submit.prevent="submitCreateModalForm();"
              >
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    :class="{'is-invalid': createModalFormDataStates.index.errors.length}"
                    :disabled="createModalProcessing"
                    id="g-students-view-create-modal-form-index-field"
                    placeholder="_"
                    type="text"
                    v-model="createModalFormData.index"
                  >
                  <label for="g-students-view-create-modal-form-index-field">
                    Index
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="createModalFormDataStates.index.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in createModalFormDataStates.index.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    :class="{'is-invalid': createModalFormDataStates.firstName.errors.length}"
                    :disabled="createModalProcessing"
                    id="g-students-view-create-modal-form-first-name-field"
                    placeholder="_"
                    type="text"
                    v-model="createModalFormData.firstName"
                  >
                  <label for="g-students-view-create-modal-form-first-name-field">
                    First Name
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="createModalFormDataStates.firstName.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in createModalFormDataStates.firstName.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div class="form-floating">
                  <input
                    class="form-control"
                    :class="{'is-invalid': createModalFormDataStates.lastName.errors.length}"
                    :disabled="createModalProcessing"
                    id="g-students-view-create-modal-form-last-name-field"
                    placeholder="_"
                    type="text"
                    v-model="createModalFormData.lastName"
                  >
                  <label for="g-students-view-create-modal-form-last-name-field">
                    Last Name
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="createModalFormDataStates.lastName.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
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
        v-if="$store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff'"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-students-view-destroy-modal-label"
                v-text="`Delete student '#${destroyModalStudentId}'.`"
              ></h5>
              <button
                aria-label="Close"
                class="btn-close"
                data-bs-dismiss="modal"
                :disabled="destroyModalProcessing"
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
        aria-labelledby="g-students-view-restore-modal-label"
        aria-hidden="true"
        class="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="g-students-view-restore-modal"
        ref="restoreModalRef"
        tabindex="-1"
        v-if="$store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff'"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-students-view-restore-modal-label"
                v-text="`Delete student '#${restoreModalStudentId}'.`"
              ></h5>
              <button
                aria-label="Close"
                class="btn-close"
                data-bs-dismiss="modal"
                :disabled="restoreModalProcessing"
              ></button>
            </div>
            <div class="modal-body">
              <p class="text-primary">
                Are you sure you want to restore this student?
                <span class="feather feather-alert-triangle fs-3"></span>
              </p>
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                :disabled="restoreModalProcessing"
              >
                Close
              </button>
              <button
                class="btn btn-primary"
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
        v-if="$store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff'"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-students-view-update-modal-label"
                v-text="`Edit student '#${updateModalStudentId}'.`"
              ></h5>
              <button
                aria-label="Close"
                class="btn-close"
                data-bs-dismiss="modal"
                :disabled="updateModalProcessing"
              ></button>
            </div>
            <div class="modal-body">
              <form 
                id="g-students-view-update-modal-form"
                @submit.prevent="submitUpdateModalForm();"
              >
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    :class="{'is-invalid': updateModalFormDataStates.index.errors.length}"
                    :disabled="updateModalProcessing"
                    id="g-students-view-update-modal-form-index-field"
                    placeholder="_"
                    type="text"
                    v-model="updateModalFormData.index"
                  >
                  <label for="g-students-view-update-modal-form-index-field">
                    Index
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="updateModalFormDataStates.index.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in updateModalFormDataStates.index.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    :class="{'is-invalid': updateModalFormDataStates.firstName.errors.length}"
                    :disabled="updateModalProcessing"
                    id="g-students-view-update-modal-form-first-name-field"
                    placeholder="_"
                    type="text"
                    v-model="updateModalFormData.firstName"
                  >
                  <label for="g-students-view-update-modal-form-first-name-field">
                    First Name
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="updateModalFormDataStates.firstName.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in updateModalFormDataStates.firstName.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div class="form-floating">
                  <input
                    class="form-control"
                    :class="{'is-invalid': updateModalFormDataStates.lastName.errors.length}"
                    :disabled="updateModalProcessing"
                    id="g-students-view-update-modal-form-last-name-field"
                    placeholder="_"
                    type="text"
                    v-model="updateModalFormData.lastName"
                  >
                  <label for="g-students-view-update-modal-form-last-name-field">
                    Last Name
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="updateModalFormDataStates.lastName.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
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
    <div
      class="align-items-center d-flex justify-content-end py-2 w-100"
      v-if="$store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff'"
    >
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#g-students-view-create-modal"
      >
        New Student
        <span class="feather feather-plus"></span>
      </button>
    </div>
    <transition name="g-transition">
      <div
        class="align-items-center d-flex justify-content-center p-2 w-100"
        v-if="$store.state.storage.users === null"
      >
        <div class="spinner-grow text-primary" role="status"></div>
      </div>
      <div
        class="p-2 text-secondary"
        v-else-if="$store.state.storage.userCount === 0"
      >
        No students to show!
      </div>
      <div
        class="data-container position-relative w-100"
        v-else
      >
        <transition-group
          appear
          name="g-transition-group"
        >
          <div
            class="data-item card mb-1 p-2 w-100"
            :key="`student-${student.id}`"
            v-for="student in currentPageItems"
          >
            <div class="banner align-items-center d-flex justify-content-between w-100">
              <div class="data align-items-center d-flex gap-1">
                <button
                  :aria-controls="`g-students-view-student-${student.id}-data-collapse`"
                  aria-expanded="false"
                  class="toggler btn btn-sm"
                  :data-bs-target="`#g-students-view-student-${student.id}-data-collapse`"
                  data-bs-toggle="collapse"
                >
                  <span class="icon d-inline-block feather feather-chevron-right"></span>
                </button>
                <div
                  class="fs-5 fw-bold text-primary"
                  v-text="`#${student.id}`"
                ></div>
                <div v-text="student.index"></div>
                <div class="fst-italic text-secondary">
                  <small v-text="`${student.UserProfile.firstName} ${student.UserProfile.lastName}`"></small>
                </div>
                <transition name="g-transition">
                  <span
                    class="feather feather-slash text-danger"
                    v-if="student.deletedAt"
                  ></span>
                </transition>
              </div>
              <div class="align-items-center d-flex gap-1 position-relative">
                <transition-group
                  appear
                  name="g-transition-group"
                >
                  <button
                    class="btn btn-sm"
                    :class="action == 'delete' ? 'btn-danger' : 'btn-primary'"
                    data-bs-toggle="modal"
                    :data-bs-target="`#g-students-view-${{
                      delete: 'destroy',
                      edit: 'update',
                      restore: 'restore'
                    }[action]}-modal`"
                    :key="`action-${action}`"
                    :title="action.replace(/^\w/, function(match) {
                      return match.toUpperCase();
                    })"
                    v-for="action in ([
                      'edit',
                      'delete',
                      'restore'
                    ]
                      .filter(function(a) {
                        if($store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'student') return false;
                        
                        return !(a == 'delete' && student.deletedAt) && !(a == 'restore' && !student.deletedAt);
                      }))"
                    @click="
                      if(action == 'delete') destroyModalStudentId = student.id;
                      else if(action == 'restore') restoreModalStudentId = student.id;
                      else if(action == 'edit') {
                        updateModalStudentId = student.id;
                        updateModalFormData.index = student.index;
                        updateModalFormData.firstName = student.UserProfile.firstName;
                        updateModalFormData.lastName = student.UserProfile.lastName;
                      }
                    "
                  >
                    <span
                      class="feather"
                      :class="{
                        'feather-edit-3': action == 'edit',
                        'feather-refresh-ccw': action == 'restore',
                        'feather-trash-2': action == 'delete',
                      }"
                    ></span>
                  </button>
                </transition-group>
              </div>
            </div>
            <div
              class="collapse pt-2 w-100"
              :id="`g-students-view-student-${student.id}-data-collapse`"
            >
              <div class="align-items-stretch border-top d-flex flex-column gap-1 pt-2 px-3 w-100">
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-secondary">
                    Id &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="student.id"
                  ></span>
                </div>
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-secondary">
                    Index &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="student.index"
                  ></span>
                </div>
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-secondary">
                    First Name &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="student.UserProfile.firstName"
                  ></span>
                </div>
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-secondary">
                    Last Name &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="student.UserProfile.lastName"
                  ></span>
                </div>
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-secondary">
                    User Profile Type &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="student.UserProfile.UserProfileType.name"
                  ></span>
                </div>
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-secondary">
                    Roles &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="`${student.Roles
                      .map(function(role) {
                        return role.name;
                      })
                      .toString()}`"
                  ></span>
                </div>
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-secondary">
                    Deleted &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="!!student.deletedAt"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </transition>
    <transition name="g-transition">
      <nav
        aria-label="Students view data table pagination"
        class="align-items-center d-flex justify-content-center py-2 w-100"
        v-if="$store.state.storage.users && $store.state.storage.userCount !== null && $store.state.storage.userCount > $store.getters.resourcePageSize && currentPageItems.length >= $store.getters.resourcePageSize"
      >
        <ul class="pagination">
          <li
            class="page-item"
            :class="{disabled: currentPage == 1}"
          >
            <button
              aria-label="Previous"
              class="page-link"
              @click="currentPage--;"
            >
              <span
                aria-hidden="true"
                class="feather feather-chevron-left"
              ></span>
            </button>
          </li>
          <li
            class="page-item"
            :class="{active: page == currentPage}"
            :key="`pagination-item-${page}`"
            v-for="page in totalPages"
          >
            <button
              class="page-link"
              @click="currentPage = page;"
              v-text="page"
            ></button>
          </li>
          <li
            class="page-item"
            :class="{disabled: currentPage == totalPages}"
          >
            <button
              aria-label="Next"
              class="page-link"
              @click="currentPage++;"
            >
              <span
                aria-hidden="true"
                class="feather feather-chevron-right"
              ></span>
            </button>
          </li>
        </ul>
      </nav>
    </transition>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import moment from 'moment';
import { computed, reactive, ref, watch, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { validate } from '@/services/fastest-validator';

export default {
  name: 'GStudentsView',
  setup() {
    const $store = useStore();

    const createModalRef = ref(null);
    const destroyModalRef = ref(null);
    const restoreModalRef = ref(null);
    const updateModalRef = ref(null);

    let createModalResettingTimeout = null;
    const createModalValidationSchema = {
      index: 'string|empty:false|min:3',
      firstName: 'string|empty:false|min:3',
      lastName: 'string|empty:false|min:3'
    };
    let updateModalResettingTimeout = null;
    const updateModalValidationSchema = {
      index: 'string|empty:false|min:3|optional',
      firstName: 'string|empty:false|min:3|optional',
      lastName: 'string|empty:false|min:3|optional'
    };

    const createModalBsModal = ref(null);
    const createModalFormData = reactive({
      index: null,
      firstName: null,
      lastName: null
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
    const createModalResetting = ref(false);
    const currentPage = ref(1);
    const destroyModalBsModal = ref(null);
    const destroyModalProcessing = ref(false); 
    const destroyModalStudentId = ref(null);
    const restoreModalBsModal = ref(null);
    const restoreModalProcessing = ref(false);
    const restoreModalStudentId = ref(null);
    const updateModalBsModal = ref(null);
    const updateModalFormData = reactive({
      index: null,
      firstName: null,
      lastName: null
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
    const updateModalResetting = ref(false);
    const updateModalStudentId = ref(null);

    const currentPageItems = computed(function() {
      return ($store.state.storage.users || [])
        .filter(function(user) {
          return $store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff' || !user.deletedAt;
        })
        .filter(function(user, index) {
          const lowerLimit = (currentPage.value - 1) * $store.getters.resourcePageSize;
          const upperLimit = lowerLimit + $store.getters.resourcePageSize;

          return index >= lowerLimit && index < upperLimit;
        });
    });
    const totalPages = computed(function() {
      return ($store.state.storage.users?.length || 0) >= $store.state.storage.userCount ? Math.ceil(($store.state.storage.users?.length || 0) / $store.getters.resourcePageSize) : (Math.floor(($store.state.storage.users?.length || 0) / $store.getters.resourcePageSize) + 1);
    });

    function resetCreateModalForm(options) {
      if(createModalResettingTimeout) {
        clearTimeout(createModalResettingTimeout);
        createModalResettingTimeout = null;
      }

      createModalResetting.value = true;
      options = options?.constructor?.name?.toLowerCase() == 'object' ? options : (Array.isArray(options) ? {include: options} : (typeof options == 'string' ? {include: [options]} : {}));
      options.exclude = (Array.isArray(options?.exclude) ? options.exclude : (typeof options?.exclude == 'string' ? [options.exclude] : []));
      options.include = (Array.isArray(options?.include) ? options.include : (typeof options?.include == 'string' ? [options.include] : Object.keys(createModalFormDataStates)));

      options.include
        .filter(function(field) {
          return Object.keys(createModalFormDataStates).includes(field) && !options.exclude.includes(field);
        })
        .forEach(function(field) {
          createModalFormData[field] = null;
          createModalFormDataStates[field].changed = false;
          createModalFormDataStates[field].errors = [];
        });
      
      createModalResettingTimeout = setTimeout(function() {
        createModalResetting.value = false;
      }, 100);
    }

    function resetUpdateModalForm(options) {
      if(updateModalResettingTimeout) {
        clearTimeout(updateModalResettingTimeout);
        updateModalResettingTimeout = null;
      }

      updateModalResetting.value = true;
      options = options?.constructor?.name?.toLowerCase() == 'object' ? options : (Array.isArray(options) ? {include: options} : (typeof options == 'string' ? {include: [options]} : {}));
      options.exclude = (Array.isArray(options?.exclude) ? options.exclude : (typeof options?.exclude == 'string' ? [options.exclude] : []));
      options.include = (Array.isArray(options?.include) ? options.include : (typeof options?.include == 'string' ? [options.include] : Object.keys(updateModalFormDataStates)));

      options.include
        .filter(function(field) {
          return Object.keys(updateModalFormDataStates).includes(field) && !options.exclude.includes(field);
        })
        .forEach(function(field) {
          updateModalFormData[field] = null;
          updateModalFormDataStates[field].changed = false;
          updateModalFormDataStates[field].errors = [];
        });
      
      updateModalResettingTimeout = setTimeout(function() {
        updateModalResetting.value = false;
      }, 100);
    }

    async function submitCreateModalForm() {
      if(createModalProcessing.value) return;

      createModalProcessing.value = true;

      if(!validateCreateModalForm()) {
        createModalProcessing.value = false;
        return;
      }

      const form = new FormData();

      for(const key in createModalFormData) {
        form.append(key, createModalFormData[key]);
      }

      const studentCreated = await $store.dispatch('createResource', {
        type: 'users',
        body: form
      });

      if(studentCreated) {
        if (createModalBsModal.value) createModalBsModal.value.hide();
        
        resetCreateModalForm();
        currentPage.value = totalPages.value;
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

      const studentDestroyed = await $store.dispatch('destroyResource', {
        type: 'users',
        id: destroyModalStudentId.value
      });

      if (studentDestroyed && destroyModalBsModal.value) destroyModalBsModal.value.hide();

      destroyModalProcessing.value = false;
    }

    async function submitRestoreModalForm() {
      if(isNaN(parseInt(restoreModalStudentId.value))) {
        restoreModalProcessing.value = false;
        return;
      }

      if(restoreModalProcessing.value) return;

      restoreModalProcessing.value = true;

      const studentRestored = await $store.dispatch('restoreResource', {
        type: 'users',
        id: restoreModalStudentId.value
      });

      if(studentRestored && restoreModalBsModal.value) restoreModalBsModal.value.hide();

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

      const form = new FormData();

      for(const key in updateModalFormData) {
        form.append(key, updateModalFormData[key]);
      }

      const studentUpdated = await $store.dispatch('updateResource', {
        type: 'users',
        body: form,
        id: updateModalStudentId.value
      });

      if(studentUpdated) {
        resetUpdateModalForm();
        if(updateModalBsModal.value) updateModalBsModal.value.hide();
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

    watch(function() {
      return JSON.parse(JSON.stringify(createModalFormData));
    }, function(value, oldValue) {
      if(createModalResetting.value) return;

      for(const field in createModalFormDataStates) {
        if(!value[field]) createModalFormData[field] = null;

        createModalFormDataStates[field].changed = value[field] != oldValue[field];
      }

      validateCreateModalForm();
    }, {deep: true});

    watch(function() {
      return JSON.parse(JSON.stringify(updateModalFormData));
    }, function(value, oldValue) {
      if(updateModalResetting.value) return;

      for(const field in updateModalFormDataStates) {
        if(!value[field]) updateModalFormData[field] = null;

        updateModalFormDataStates[field].changed = value[field] != oldValue[field];
      }

      validateUpdateModalForm();
    }, {deep: true});

    watch(currentPage, function(value) {
      if(value < 1) currentPage.value == 1;
      else if(value > totalPages.value) currentPage.value = totalPages.value;
      else if(currentPageItems.value.length < $store.getters.resourcePageSize && ($store.state.storage.users || []).length < $store.state.storage.userCount) $store.dispatch('requestResource', {type: 'users'});
    });

    watchEffect(function() {
      if(createModalRef.value) {
        if(!createModalBsModal.value) createModalBsModal.value = Modal.getOrCreateInstance(createModalRef.value);

        createModalRef.value.addEventListener('hide.bs.modal', function() {
          resetCreateModalForm();
        });
      }
      else createModalBsModal.value = null;

      if(destroyModalRef.value) {
        if(!destroyModalBsModal.value) destroyModalBsModal.value = Modal.getOrCreateInstance(destroyModalRef.value);

        destroyModalRef.value.addEventListener('hide.bs.modal', function() {
          destroyModalStudentId.value = null;
        });
      }
      else destroyModalBsModal.value = null;

      if(restoreModalRef.value) {
        if(!restoreModalBsModal.value) restoreModalBsModal.value = Modal.getOrCreateInstance(restoreModalRef.value);

        restoreModalRef.value.addEventListener('hide.bs.modal', function() {
          restoreModalStudentId.value = null;
        });
      }
      else restoreModalBsModal.value = null;

      if(updateModalRef.value) {
        if(!updateModalBsModal.value) updateModalBsModal.value = Modal.getOrCreateInstance(updateModalRef.value);

        updateModalRef.value.addEventListener('hide.bs.modal', function() {
          updateModalStudentId.value = null;
          resetUpdateModalForm();
        });
      }
      else updateModalBsModal.value = null;
    });

    watchEffect(function() {
      if($store.state.application.error) {
        if(createModalBsModal.value) createModalBsModal.value.hide();

        if(destroyModalBsModal.value) destroyModalBsModal.value.hide();

        if(restoreModalBsModal.value) restoreModalBsModal.value.hide();

        if(updateModalBsModal.value) updateModalBsModal.value.hide();
      }
    });

    if(!$store.state.storage.users?.length) $store.dispatch('requestResource', {type: 'users'});

    return {
      createModalBsModal,
      createModalFormData,
      createModalFormDataStates,
      createModalProcessing,
      createModalRef,
      createModalResetting,
      currentPage,
      currentPageItems,
      destroyModalBsModal,
      destroyModalProcessing,
      destroyModalRef,
      destroyModalStudentId,
      moment,
      resetCreateModalForm,
      resetUpdateModalForm,
      restoreModalBsModal,
      restoreModalProcessing,
      restoreModalRef,
      restoreModalStudentId,
      submitCreateModalForm,
      submitDestroyModalForm,
      submitRestoreModalForm,
      submitUpdateModalForm,
      totalPages,
      updateModalBsModal,
      updateModalFormData,
      updateModalFormDataStates,
      updateModalProcessing,
      updateModalRef,
      updateModalResetting,
      updateModalStudentId,
      validateCreateModalForm,
      validateUpdateModalForm
    };
  }
}
</script>

<style lang="scss" scoped>
.g-students-view {
  & > .data-container {
    overflow-x: auto;

    & > .data-item > .banner > .data{
      .toggler {
        --self__background-alpha: 0;
        --icon__transform: none;

        &:where(:hover) {
          --self__background-alpha: 0.1;
        }

        &:where([aria-expanded=true]) {
          --icon__transform: rotate(90deg);
        }
      }
      .toggler {
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
