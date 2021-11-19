<template>
  <div class="g-courses-view py-5 w-100">
    <h3>
      Courses
    </h3>

    <teleport
      to="body"
      v-if="!$store.state.application.error"
    >
      <div
        aria-labelledby="g-courses-view-create-modal-label"
        aria-hidden="true"
        class="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="g-courses-view-create-modal"
        ref="createModalRef"
        tabindex="-1"
        v-if="$store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff'"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-courses-view-create-modal-label"
              >
                Add a new course.
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
                id="g-courses-view-create-modal-form"
                @submit.prevent="submitCreateModalForm();"
              >
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    :class="{'is-invalid': createModalFormDataStates.name.errors.length}"
                    :disabled="createModalProcessing"
                    id="g-courses-view-create-modal-form-name-field"
                    placeholder="_"
                    type="text"
                    v-model="createModalFormData.name"
                  >
                  <label for="g-courses-view-create-modal-form-name-field">
                    Name
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="createModalFormDataStates.name.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in createModalFormDataStates.name.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    :class="{'is-invalid': createModalFormDataStates.description.errors.length}"
                    :disabled="createModalProcessing"
                    id="g-courses-view-create-modal-form-description-field"
                    placeholder="_"
                    type="text"
                    v-model="createModalFormData.description"
                  >
                  <label for="g-courses-view-create-modal-form-description-field">
                    Description
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="createModalFormDataStates.description.errors.length"
                  >
                    <div
                      :key="error.type"
                      v-for="error in createModalFormDataStates.description.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div class="form-floating mb-3">
                  <select
                    aria-label="Level"
                    class="form-select"
                    :class="{'is-invalid': createModalFormDataStates.levelId.errors.length}"
                    :disabled="createModalProcessing"
                    id="g-courses-view-create-modal-form-level-id-field"
                    v-model="createModalFormData.levelId"
                  >
                      <span
                        aria-hidden="true"
                        class="spinner-grow spinner-grow-sm"
                        role="status"
                      ></span>
                    <option
                      :key="`select-option-${level.id}`"
                      :value="level.id"
                      v-for="level in $store.state.storage.levels"
                      v-text="level.name"
                    ></option>
                  </select>
                  <label for="g-courses-view-create-modal-form-level-id-field">
                    Level
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="createModalFormDataStates.levelId.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in createModalFormDataStates.levelId.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div class="form-floating mb-3">
                  <select
                    aria-label="Program"
                    class="form-select"
                    :class="{'is-invalid': createModalFormDataStates.programId.errors.length}"
                    :disabled="createModalProcessing"
                    id="g-courses-view-create-modal-form-program-id-field"
                    v-model="createModalFormData.programId"
                  >
                    <option
                      :key="`select-option-${program.id}`"
                      :value="program.id"
                      v-for="program in $store.state.storage.programs"
                      v-text="program.name"
                    ></option>
                  </select>
                  <label for="g-courses-view-create-modal-form-program-id-field">
                    Program
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="createModalFormDataStates.programId.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in createModalFormDataStates.programId.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div class="form-floating">
                  <select
                    aria-label="Semester"
                    class="form-select"
                    :class="{'is-invalid': createModalFormDataStates.semesterId.errors.length}"
                    :disabled="createModalProcessing"
                    id="g-courses-view-create-modal-form-semester-id-field"
                    v-model="createModalFormData.semesterId"
                  >
                    <option
                      :key="`select-option-${semester.id}`"
                      :value="semester.id"
                      v-for="semester in $store.state.storage.semesters"
                      v-text="semester.name"
                    ></option>
                  </select>
                  <label for="g-courses-view-create-modal-form-semester-id-field">
                    Semester
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="createModalFormDataStates.semesterId.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in createModalFormDataStates.semesterId.errors"
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
                form="g-courses-view-create-modal-form"
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
        aria-labelledby="g-courses-view-destroy-modal-label"
        aria-hidden="true"
        class="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="g-courses-view-destroy-modal"
        ref="destroyModalRef"
        tabindex="-1"
        v-if="$store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff'"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-courses-view-destroy-modal-label"
                v-text="`Delete course '#${destroyModalCourseId}'.`"
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
                Are you sure you want to delete this course?
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
        aria-labelledby="g-courses-view-restore-modal-label"
        aria-hidden="true"
        class="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="g-courses-view-restore-modal"
        ref="restoreModalRef"
        tabindex="-1"
        v-if="$store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff'"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-courses-view-restore-modal-label"
                v-text="`Restore course '#${restoreModalCourseId}'.`"
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
                Are you sure you want to restore this course?
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
        aria-labelledby="g-courses-view-update-modal-label"
        aria-hidden="true"
        class="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="g-courses-view-update-modal"
        ref="updateModalRef"
        tabindex="-1"
        v-if="$store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff'"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-courses-view-update-modal-label"
                v-text="`Edit course '#${updateModalCourseId}'.`"
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
                id="g-courses-view-update-modal-form"
                @submit.prevent="submitUpdateModalForm();"
              >
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    :class="{'is-invalid': updateModalFormDataStates.name.errors.length}"
                    :disabled="updateModalProcessing"
                    id="g-courses-view-update-modal-form-name-field"
                    placeholder="_"
                    type="text"
                    v-model="updateModalFormData.name"
                  >
                  <label for="g-courses-view-update-modal-form-name-field">
                    Name
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="updateModalFormDataStates.name.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in updateModalFormDataStates.name.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    :class="{'is-invalid': updateModalFormDataStates.description.errors.length}"
                    :disabled="updateModalProcessing"
                    id="g-courses-view-update-modal-form-description-field"
                    placeholder="_"
                    type="text"
                    v-model="updateModalFormData.description"
                  >
                  <label for="g-courses-view-update-modal-form-description-field">
                    Description
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="updateModalFormDataStates.description.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in updateModalFormDataStates.description.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div class="form-floating mb-3">
                  <select
                    class="form-control"
                    :class="{'is-invalid': updateModalFormDataStates.levelId.errors.length}"
                    :disabled="updateModalProcessing"
                    id="g-courses-view-update-modal-form-level-id-field"
                    v-model="updateModalFormData.levelId"
                  >
                    <option
                      :key="`select-option-${level.id}`"
                      :value="level.id"
                      v-for="level in $store.state.storage.levels"
                      v-text="level.name"
                    ></option>
                  </select>
                  <label for="g-courses-view-update-modal-form-level-id-field">
                    Level
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="updateModalFormDataStates.levelId.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in updateModalFormDataStates.levelId.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div class="form-floating mb-3">
                  <select
                    class="form-control"
                    :class="{'is-invalid': updateModalFormDataStates.programId.errors.length}"
                    :disabled="updateModalProcessing"
                    id="g-courses-view-update-modal-form-program-id-field"
                    v-model="updateModalFormData.programId"
                  >
                    <option
                      :key="`select-option-${program.id}`"
                      :value="program.id"
                      v-for="program in $store.state.storage.programs"
                      v-text="program.name"
                    ></option>
                  </select>
                  <label for="g-courses-view-update-modal-form-program-id-field">
                    Program
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="updateModalFormDataStates.programId.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in updateModalFormDataStates.programId.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div class="form-floating">
                  <select
                    class="form-control"
                    :class="{'is-invalid': updateModalFormDataStates.semesterId.errors.length}"
                    :disabled="updateModalProcessing"
                    id="g-courses-view-update-modal-form-semester-id-field"
                    v-model="updateModalFormData.semesterId"
                  >
                    <option
                      :key="`select-option-${semester.id}`"
                      :value="semester.id"
                      v-for="semester in $store.state.storage.semesters"
                      v-text="semester.name"
                    ></option>
                  </select>
                  <label for="g-courses-view-update-modal-form-semester-id-field">
                    Semester
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="updateModalFormDataStates.semesterId.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in updateModalFormDataStates.semesterId.errors"
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
                form="g-courses-view-update-modal-form"
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
        data-bs-target="#g-courses-view-create-modal"
      >
        New Course
        <span class="feather feather-plus"></span>
      </button>
    </div>
    <transition name="g-transition">
      <div
        class="align-items-center d-flex justify-content-center p-2 w-100"
        v-if="$store.state.storage.courses === null"
      >
        <div class="spinner-grow text-primary" role="status"></div>
      </div>
      <div
        class="p-2 text-secondary"
        v-else-if="$store.state.storage.courseCount === 0"
      >
        No courses to show!
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
            :key="`course-${course.id}`"
            v-for="course in currentPageItems"
          >
            <div class="banner align-items-center d-flex justify-content-between w-100">
              <div class="data align-items-center d-flex gap-1">
                <button
                  :aria-controls="`g-courses-view-course-${course.id}-data-collapse`"
                  aria-expanded="false"
                  class="toggler btn btn-sm"
                  :data-bs-target="`#g-courses-view-course-${course.id}-data-collapse`"
                  data-bs-toggle="collapse"
                >
                  <span class="icon d-inline-block feather feather-chevron-right"></span>
                </button>
                <div
                  class="fs-5 fw-bold text-primary"
                  v-text="`#${course.id}`"
                ></div>
                <div v-text="course.name"></div>
                <transition name="g-transition">
                  <span
                    class="feather feather-slash text-danger"
                    v-if="course.deletedAt"
                  ></span>
                </transition>
              </div>
              <div class="actions align-items-center d-flex gap-1 position-relative">
                <transition-group
                  appear
                  name="g-transition-group"
                >
                  <button
                    class="btn btn-sm"
                    :class="action == 'delete' ? 'btn-danger' : 'btn-primary'"
                    data-bs-toggle="modal"
                    :data-bs-target="`#g-courses-view-${{
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

                        return !(a == 'delete' && course.deletedAt) && !(a == 'restore' && !course.deletedAt);
                      }))"
                    @click="
                      if(action == 'delete') destroyModalCourseId = course.id;
                      else if(action == 'restore') restoreModalCourseId = course.id;
                      else if(action == 'edit') {
                        updateModalCourseId = course.id;
                        updateModalFormData.name = course.name;
                        updateModalFormData.description = course.description;
                        updateModalFormData.levelId = course.levelId;
                        updateModalFormData.programId = course.programId;
                        updateModalFormData.semesterId = course.semesterId;
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
              :id="`g-courses-view-course-${course.id}-data-collapse`"
            >
              <div class="align-items-stretch border-top d-flex flex-column gap-1 pt-2 px-3 w-100">
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-secondary">
                    Id &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="course.id"
                  ></span>
                </div>
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-secondary">
                    Name &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="course.name"
                  ></span>
                </div>
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-secondary">
                    Description &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="course.description"
                  ></span>
                </div>
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-secondary">
                    Level &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="course.Level.name"
                  ></span>
                </div>
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-secondary">
                    Program &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="course.Program.name"
                  ></span>
                </div>
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-secondary">
                    Semester &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="course.Semester.name"
                  ></span>
                </div>
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-secondary">
                    Deleted &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="!!course.deletedAt"
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
        aria-label="Programs view data table pagination"
        class="align-items-center d-flex justify-content-center py-2 w-100"
        v-if="$store.state.storage.courses && $store.state.storage.courseCount !== null && $store.state.storage.courseCount > $store.getters.resourcePageSize && currentPageItems.length >= $store.getters.resourcePageSize"
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
  name: 'GCoursesView',
  setup() {
    const $store = useStore();

    const createModalRef = ref(null);
    const destroyModalRef = ref(null);
    const restoreModalRef = ref(null);
    const updateModalRef = ref(null);

    let createModalResettingTimeout = null;
    const createModalValidationSchema = {
      name: 'string|empty:false',
      description: 'string|empty:false|optional',
      levelId: 'number|integer|positive',
      programId: 'number|integer|positive',
      semesterId: 'number|integer|positive'
    };
    let updateModalResettingTimeout = null;
    const updateModalValidationSchema = {
      name: 'string|empty:false|optional',
      description: 'string|empty:false|optional',
      levelId: 'number|integer|positive|optional',
      programId: 'number|integer|positive|optional',
      semesterId: 'number|integer|positive|optional'
    };

    const createModalBsModal = ref(null);
    const createModalFormData = reactive({
      name: null,
      description: null,
      levelId: $store.state.storage.levels?.[0]?.id || null,
      programId: $store.state.storage.programs?.[0]?.id || null,
      semesterId: $store.state.storage.semesters?.[0]?.id || null
    });
    const createModalFormDataStates = reactive({
      name: {
        changed: false,
        errors: []
      },
      description: {
        changed: false,
        errors: []
      },
      levelId: {
        changed: false,
        errors: []
      },
      programId: {
        changed: false,
        errors: []
      },
      semesterId: {
        changed: false,
        errors: []
      }
    });
    const createModalProcessing = ref(false);
    const createModalResetting = ref(false);
    const currentPage = ref(1);
    const destroyModalBsModal = ref(null);
    const destroyModalCourseId = ref(null);
    const destroyModalProcessing = ref(false); 
    const restoreModalBsModal = ref(null);
    const restoreModalCourseId = ref(null);
    const restoreModalProcessing = ref(false);
    const updateModalBsModal = ref(null);
    const updateModalFormData = reactive({
      name: null,
      description: null,
      levelId: null,
      programId: null,
      semesterId: null
    });
    const updateModalFormDataStates = reactive({
      name: {
        changed: false,
        errors: []
      },
      description: {
        changed: false,
        errors: []
      },
      levelId: {
        changed: false,
        errors: []
      },
      programId: {
        changed: false,
        errors: []
      },
      semesterId: {
        changed: false,
        errors: []
      }
    });
    const updateModalCourseId = ref(null);
    const updateModalProcessing = ref(false);
    const updateModalResetting = ref(false);

    const currentPageItems = computed(function() {
      return ($store.state.storage.courses || [])
        .filter(function(course) {
          return $store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff' || !course.deletedAt;
        })
        .filter(function(course, index) {
          const lowerLimit = (currentPage.value - 1) * $store.getters.resourcePageSize;
          const upperLimit = lowerLimit + $store.getters.resourcePageSize;

          return index >= lowerLimit && index < upperLimit;
        });
    });
    const totalPages = computed(function() {
      return ($store.state.storage.courses?.length || 0) >= $store.state.storage.courseCount ? Math.ceil(($store.state.storage.courses?.length || 0) / $store.getters.resourcePageSize) : (Math.floor(($store.state.storage.courses?.length || 0) / $store.getters.resourcePageSize) + 1);
    });

    function resetCreateModalForm(options) {
      if(!createModalResettingTimeout) {
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
          if(field == 'levelId') createModalFormData[field] = $store.state.storage.levels?.[0]?.id || null;
          else if(field == 'programId') createModalFormData[field] = $store.state.storage.programs?.[0]?.id || null;
          else if(field == 'semesterId') createModalFormData[field] = $store.state.storage.semesters?.[0]?.id || null;
          else createModalFormData[field] = null;

          createModalFormDataStates[field].changed = false;
          createModalFormDataStates[field].errors = [];
        });
      
      createModalResettingTimeout = setTimeout(function() {
        createModalResetting.value = false;
      }, 100);
    }

    function resetUpdateModalForm(options) {
      if(!updateModalResettingTimeout) {
        clearTimeout(createModalResettingTimeout);
        createModalResettingTimeout = null;
      }

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

      const courseCreated = await $store.dispatch('createResource', {
        type: 'courses',
        body: form
      });

      if(courseCreated) {
        if (createModalBsModal.value) createModalBsModal.value.hide();
        
        resetCreateModalForm();
        currentPage.value = totalPages.value;
      }

      createModalProcessing.value = false;
    }

    async function submitDestroyModalForm() {
      if(isNaN(parseInt(destroyModalCourseId.value))) {
        destroyModalProcessing.value = false;
        return;
      }

      if(destroyModalProcessing.value) return;

      destroyModalProcessing.value = true;

      const courseDestroyed = await $store.dispatch('destroyResource', {
        type: 'courses',
        id: destroyModalCourseId.value
      });

      if (courseDestroyed && destroyModalBsModal.value) destroyModalBsModal.value.hide();

      destroyModalProcessing.value = false;
    }

    async function submitRestoreModalForm() {
      if(isNaN(parseInt(restoreModalCourseId.value))) {
        restoreModalProcessing.value = false;
        return;
      }

      if(restoreModalProcessing.value) return;

      restoreModalProcessing.value = true;

      const courseRestored = await $store.dispatch('restoreResource', {
        type: 'courses',
        id: restoreModalCourseId.value
      });

      if(courseRestored && restoreModalBsModal.value) restoreModalBsModal.value.hide();

      restoreModalProcessing.value = false;
    }

    async function submitUpdateModalForm() {
      if(isNaN(parseInt(updateModalCourseId.value))) {
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

      const courseUpdated = await $store.dispatch('updateResource', {
        type: 'courses',
        body: form,
        id: updateModalCourseId.value
      });

      if(courseUpdated) {
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
      else if(currentPageItems.value.length < $store.getters.resourcePageSize && ($store.state.storage.courses || []).length < $store.state.storage.courseCount) $store.dispatch('requestResource', {type: 'courses'});
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
          destroyModalCourseId.value = null;
        });
      }
      else destroyModalBsModal.value = null;

      if(restoreModalRef.value) {
        if(!restoreModalBsModal.value) restoreModalBsModal.value = Modal.getOrCreateInstance(restoreModalRef.value);

        restoreModalRef.value.addEventListener('hide.bs.modal', function() {
          restoreModalCourseId.value = null;
        });
      }
      else restoreModalBsModal.value = null;

      if(updateModalRef.value) {
        if(!updateModalBsModal.value) updateModalBsModal.value = Modal.getOrCreateInstance(updateModalRef.value);

        updateModalRef.value.addEventListener('hide.bs.modal', function() {
          updateModalCourseId.value = null;
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

    $store.dispatch('requestAllResource', {type: 'levels'});
    $store.dispatch('requestAllResource', {type: 'programs'});
    $store.dispatch('requestAllResource', {type: 'semesters'});

    if(!$store.state.storage.courses?.length) $store.dispatch('requestResource', {type: 'courses'});

    return {
      createModalBsModal,
      createModalFormData,
      createModalFormDataStates,
      createModalProcessing,
      createModalResetting,
      createModalRef,
      currentPage,
      currentPageItems,
      destroyModalBsModal,
      destroyModalCourseId,
      destroyModalProcessing,
      destroyModalRef,
      moment,
      resetCreateModalForm,
      resetUpdateModalForm,
      restoreModalBsModal,
      restoreModalCourseId,
      restoreModalProcessing,
      restoreModalRef,
      submitCreateModalForm,
      submitDestroyModalForm,
      submitRestoreModalForm,
      submitUpdateModalForm,
      totalPages,
      updateModalBsModal,
      updateModalCourseId,
      updateModalFormData,
      updateModalFormDataStates,
      updateModalProcessing,
      updateModalResetting,
      updateModalRef,
      validateCreateModalForm,
      validateUpdateModalForm
    };
  }
}
</script>

<style lang="scss" scoped>
.g-courses-view {
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
