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
                    class="form-select"
                    :class="{'is-invalid': createModalFormDataStates.levelId.errors.length}"
                    :disabled="createModalProcessing"
                    id="g-courses-view-create-modal-form-level-id-field"
                    v-model="createModalFormData.levelId"
                  >
                      <span class="spinner-grow spinner-grow-sm"></span>
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
                  class="spinner-grow spinner-grow-sm"
                  v-if="createModalProcessing"
                ></span>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
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
                  class="spinner-grow spinner-grow-sm"
                  v-if="destroyModalProcessing"
                ></span>
                Destroy
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
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
                  class="spinner-grow spinner-grow-sm"
                  v-if="restoreModalProcessing"
                ></span>
                Restore
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
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
                  class="spinner-grow spinner-grow-sm"
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
        Add
        <span class="feather feather-plus"></span>
      </button>
    </div>
    <div class="border p-2 mb-3 mt-2 rounded w-100">
      <h5 class="text-center">
        Search by...
      </h5>
      <div class="mb-2 align-items-center d-flex flex-wrap justify-content-center w-100">
        <div
          class="form-check form-check-inline form-switch"
          :key="`search-check-${name}`"
          v-for="(name, index) in searchFields"
        >
          <input
            :checked="searchFilter & (2 ** index)"
            class="form-check-input"
            :disabled="(searchFilter & (2 ** index)) && searchFilter - (2 ** index) <= 0 || searching"
            :id="`g-programs-view-seach-form-${name}-check`"
            type="checkbox"
            :value="searchFilter & (2 ** index)"
            @input="searchFilter += ((searchFilter & (2 ** index)) ? -1 : 1) * (2 ** index)"
          >
          <label
            class="form-check-label"
            :for="`g-programs-view-seach-form-${name}-check`"
            v-text="name
              .replace(/[A-Z]/g, function(match) {
                return ` ${match}`;
              })
              .replace(/^[a-z]/, function(match) {
                return match.toUpperCase();
              })"
          ></label>
        </div>
      </div>
      <div class="input-group">
        <input
          class="form-control"
          :class="{'is-invalid': searchQueryErrors.length}"
          :disabled="searching"
          placeholder="Search..."
          type="text"
          @input="validateSearch();"
          @keydown.enter="submitSearch();"
          v-model="searchQuery"
        >
        <transition name="g-transition">
          <button
            class="btn btn-secondary"
            :disabled="searching"
            title="Cancel Search"
            type="button"
            @click="
              currentSearchQuery = '';
              inSearchMode = false;
              searchQuery = '';
              searchQueryErrors = [];
            "
            v-if="inSearchMode || searchQueryErrors.length || searchQuery"
          >
            <span class="feather feather-x"></span>
          </button>
        </transition>
        <button
          class="btn btn-primary"
          title="Search"
          type="button"
          @click="submitSearch();"
        >
          <span
            class="spinner-grow spinner-sm"
            v-if="searching"
          ></span>
          <span class="feather feather-search"></span>
        </button>
      </div>
      <div
        class="invalid-feedback"
        v-if="searchQueryErrors.length"
      >
        <div
          :key="`error-${error.type}`"
          v-for="error in searchQueryErrors"
        >
          <b>{{error.type}}:</b>
          {{error.message}}
        </div>
      </div>
    </div>
    <transition name="g-transition">
      <h5
        class="text-center text-info"
        v-if="inSearchMode"
      >
        Showing search results
      </h5>
    </transition>
    <transition name="g-transition">
      <div
        class="align-items-center d-flex justify-content-center p-2 w-100"
        v-if="$store.state.storage.courses === null || totalPages > 1 && currentPage == totalPages && !currentPageItems.length || searching"
      >
        <span class="spinner-grow text-primary"></span>
      </div>
      <div
        class="p-2 text-secondary"
        v-else-if="!currentPageItems.length"
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
            <div class="banner align-items-center d-flex flex-column flex-md-row gap-1 gap-md-3 justify-content-between w-100">
              <div class="data align-items-center d-flex flex-grow-1 flex-shrink-1 gap-1 w-100">
                <button
                  class="toggler btn btn-sm flex-grow-0 flex-shrink-0"
                  :data-bs-target="`#g-courses-view-course-${course.id}-data-collapse`"
                  data-bs-toggle="collapse"
                >
                  <span class="icon d-inline-block feather feather-chevron-right"></span>
                </button>
                <div
                  class="flex-grow-0 flex-shrink-1 fs-5 fw-bold text-primary"
                  v-text="`#${course.id}`"
                ></div>
                <div
                  class="flex-grow-0 flex-shrink-1"
                  v-text="course.name"
                ></div>
                <transition name="g-transition">
                  <span
                    class="feather feather-slash flex-grow-0 flex-shrink-0 text-danger"
                    v-if="course.deletedAt"
                  ></span>
                </transition>
              </div>
              <div class="actions align-items-center d-flex flex-grow-0 flex-shrink-0 gap-1 position-relative">
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
        class="align-items-center d-flex justify-content-center py-2 w-100"
        v-if="$store.state.storage.courses && $store.state.storage.courseCount !== null && $store.state.storage.courseCount > $store.getters.resourcePageSize && totalPages > 1"
      >
        <ul class="pagination">
          <li
            class="page-item"
            :class="{disabled: currentPage == 1}"
          >
            <button
              class="page-link"
              @click="currentPage--;"
            >
              <span class="feather feather-chevron-left"></span>
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
              class="page-link"
              @click="currentPage++;"
            >
              <span class="feather feather-chevron-right"></span>
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
    const currentSearchQuery = ref('');
    const destroyModalBsModal = ref(null);
    const destroyModalCourseId = ref(null);
    const destroyModalProcessing = ref(false);
    const inSearchMode = ref(false);
    const restoreModalBsModal = ref(null);
    const restoreModalCourseId = ref(null);
    const restoreModalProcessing = ref(false);
    const searchFields = ref([
      'id',
      'name',
      'level',
      'program',
      'semester'
    ]);
    const searchFilter = ref(searchFields.value
      .reduce(function(accumulator, current, index) {
        return accumulator + (2 ** index);
      }, 0));
    const searching = ref(false);
    const searchQuery = ref('');
    const searchQueryErrors = ref([]);
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
          if(inSearchMode.value) {
            return searchFields.value
              .filter(function(searchField, index) {
                return (2 ** index) & searchFilter.value;
              })
              .some(function(searchField) {
                const regExp = new RegExp(currentSearchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

                if(searchField.includes('level') || searchField.includes('program') || searchField.includes('semester')) {
                  const key = searchField
                    .replace(/^[a-z]/, function(match) {
                      return match.toUpperCase();
                    });
                  const key2 = 'name';
                  
                  return regExp.test(course[key][key2]);
                }
                else return regExp.test(course[searchField]);
              }) && ( $store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff' || !course.deletedAt);
          }
          else return $store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff' || !course.deletedAt;
        })
        .filter(function(course, index) {
          const lowerLimit = (currentPage.value - 1) * $store.getters.resourcePageSize;
          const upperLimit = lowerLimit + $store.getters.resourcePageSize;

          return index >= lowerLimit && index < upperLimit;
        });
    });
    const searchWhereQuery = computed(function() {
      return {
        $or: [
          ...searchFields.value
            .filter(function(searchField, index) {
              return (2 ** index) & searchFilter.value;
            })
            .map(function(searchField) {
              if(searchField.includes('level') || searchField.includes('program') || searchField.includes('semester')) {
                const key = searchField
                  .replace(/^[a-z]/, function(match) {
                    return match.toUpperCase();
                  });
                const key2 = 'name';

                return `#where | ${JSON.stringify([
                  `#fn | ${JSON.stringify([
                    'lower',
                    `#col | ${JSON.stringify([key + '.' + key2])}`
                  ])}`,
                  {$like: `%${currentSearchQuery.value.toLowerCase()}%`}
                ])}`;
              } else {
                return `#where | ${JSON.stringify([
                  `#fn | ${JSON.stringify([
                    'lower',
                    `#col | ${JSON.stringify([searchField])}`
                  ])}`,
                  {$like: `%${currentSearchQuery.value.toLowerCase()}%`}
                ])}`;
              }
            })
        ]
      }
    });
    const totalPages = computed(function() {
      const availableCourseCount = ($store.state.storage.courses || [])
        .filter(function(course) {
          if(inSearchMode.value) {
            return searchFields.value
              .filter(function(searchField, index) {
                return (2 ** index) & searchFilter.value;
              })
              .some(function(searchField) {
                const regExp = new RegExp(currentSearchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                
                if(searchField.includes('level') || searchField.includes('program') || searchField.includes('semester')) {
                  const key = searchField
                    .replace(/^[a-z]/, function(match) {
                      return match.toUpperCase();
                    });
                  const key2 = 'name';
                  
                  return regExp.test(course[key][key2]);
                }
                else return regExp.test(course[searchField]);
              }) && ( $store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff' || !course.deletedAt);
          }
          else return $store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff' || !course.deletedAt;
        }).length;

      return availableCourseCount >= $store.state.storage.courseCount ? Math.ceil(availableCourseCount / $store.getters.resourcePageSize) : (Math.floor(availableCourseCount / $store.getters.resourcePageSize) + 1);
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

    async function submitSearch() {
      if(searching.value) return;

      if(!validateSearch()) {
        searching.value = false;
        return;
      }
      
      searching.value = true;
      currentSearchQuery.value = searchQuery.value;

      const foundItems = ($store.state.storage.courses || [])
        .filter(function(course) {
          return searchFields.value
            .filter(function(searchField, index) {
              return (2 ** index) & searchFilter.value;
            })
            .some(function(searchField) {
              const regExp = new RegExp(currentSearchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
              
              if(searchField.includes('level') || searchField.includes('course') || searchField.includes('semester')) {
                const key = searchField
                  .replace(/^[a-z]/, function(match) {
                    return match.toUpperCase();
                  });
                const key2 = 'name';
                
                return regExp.test(course[key][key2]);
              }
              else return regExp.test(course[searchField]);
            }) && ( $store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff' || !course.deletedAt);
        });

      if(foundItems.length < $store.getters.resourcePageSize) {
        const searchSuccessful = await $store.dispatch('searchResource', {
          type: 'courses',
          searchWhereQuery: searchWhereQuery.value
        });

        if(searchSuccessful) searchQueryErrors.value = [];
      }
      else searchQueryErrors.value = [];

      searching.value = false;
      
      if(inSearchMode.value) currentPage.value = 1;
      else inSearchMode.value = true;
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

    function validateSearch() {
      const validated = validate({searchQuery: searchQuery.value}, {searchQuery: 'string|empty:false'});

      searchQueryErrors.value = validated;
      return validated === true;
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

    watch(inSearchMode, function() {
      currentPage.value = 1;
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
      currentSearchQuery,
      destroyModalBsModal,
      destroyModalCourseId,
      destroyModalProcessing,
      destroyModalRef,
      inSearchMode,
      moment,
      resetCreateModalForm,
      resetUpdateModalForm,
      restoreModalBsModal,
      restoreModalCourseId,
      restoreModalProcessing,
      restoreModalRef,
      searchFields,
      searchFilter,
      searching,
      searchQuery,
      searchQueryErrors,
      searchWhereQuery,
      submitCreateModalForm,
      submitDestroyModalForm,
      submitRestoreModalForm,
      submitSearch,
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
      validateSearch,
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
