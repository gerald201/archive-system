<template>
  <div class="g-question-banks-view py-5 w-100">
    <h3>
      Question Banks
    </h3>
    <teleport to="body">
      <div
        aria-labelledby="g-question-banks-view-create-modal-label"
        aria-hidden="true"
        class="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="g-question-banks-view-create-modal"
        ref="createModalRef"
        tabindex="-1"
        v-if="$store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff'"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-question-banks-view-create-modal-label"
              >
                Add a new question bank.
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
                id="g-question-banks-view-create-modal-form"
                @submit.prevent="submitCreateModalForm();"
              >
                <div class="form-floating mb-3">
                  <select
                    aria-label="Course"
                    class="form-select"
                    :class="{'is-invalid': createModalFormDataStates.courseId.errors.length}"
                    :disabled="createModalProcessing"
                    id="g-question-banks-view-create-modal-form-course-id-field"
                    v-model="createModalFormData.courseId"
                  >
                    <option
                      :key="`select-option-${course.id}`"
                      :value="course.id"
                      v-for="course in $store.state.storage.courses"
                      v-text="course.name"
                    ></option>
                  </select>
                  <label for="g-question-banks-view-create-modal-form-course-id-field">
                    Course
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="createModalFormDataStates.courseId.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in createModalFormDataStates.courseId.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    class="form-label"
                    for="g-question-banks-view-create-modal-form-file-field"
                  >
                    File
                  </label>
                  <input
                    accept="application/pdf"
                    class="form-control"
                    :class="{'is-invalid': createModalFormDataStates.file.errors.length}"
                    :disabled="createModalProcessing"
                    id="g-question-banks-view-create-modal-form-file-field"
                    ref="createModalFileInputRef"
                    type="file"
                    @change="
                      if($event.target.files[0]) createModalFormData.file = $event.target.files[0];
                      else createModalFormData.file = null;
                    "
                  >
                  <div
                    class="invalid-feedback"
                    v-if="createModalFormDataStates.file.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in createModalFormDataStates.file.errors"
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
                form="g-question-banks-view-create-modal-form"
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
        aria-labelledby="g-question-banks-view-destroy-modal-label"
        aria-hidden="true"
        class="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="g-question-banks-view-destroy-modal"
        ref="destroyModalRef"
        tabindex="-1"
        v-if="$store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff'"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-question-banks-view-destroy-modal-label"
                v-text="`Delete question bank '#${destroyModalQuestionBankId}'.`"
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
                Are you sure you want to delete this question bank?
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
        aria-labelledby="g-question-banks-view-restore-modal-label"
        aria-hidden="true"
        class="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="g-question-banks-view-restore-modal"
        ref="restoreModalRef"
        tabindex="-1"
        v-if="$store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff'"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-question-banks-view-restore-modal-label"
                v-text="`Delete question bank '#${restoreModalQuestionBankId}'.`"
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
                Are you sure you want to restore this question bank?
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
        aria-labelledby="g-question-banks-view-update-modal-label"
        aria-hidden="true"
        class="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="g-question-banks-view-update-modal"
        ref="updateModalRef"
        tabindex="-1"
        v-if="$store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff'"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-question-banks-view-update-modal-label"
                v-text="`Edit question bank '#${updateModalQuestionBankId}'.`"
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
                id="g-question-banks-view-update-modal-form"
                @submit.prevent="submitUpdateModalForm();"
              >
                <div class="form-floating mb-3">
                  <select
                    aria-label="Course"
                    class="form-select"
                    :class="{'is-invalid': updateModalFormDataStates.courseId.errors.length}"
                    :disabled="updateModalProcessing"
                    id="g-question-banks-view-update-modal-form-course-id-field"
                    v-model="updateModalFormData.courseId"
                  >
                    <option
                      :key="`select-option-${course.id}`"
                      :value="course.id"
                      v-for="course in $store.state.storage.courses"
                      v-text="course.name"
                    ></option>
                  </select>
                  <label for="g-question-banks-view-update-modal-form-course-id-field">
                    Course
                  </label>
                  <div
                    class="invalid-feedback"
                    v-if="updateModalFormDataStates.courseId.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in updateModalFormDataStates.courseId.errors"
                    >
                      <b>{{error.type}}:</b>
                      {{error.message}}
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    class="form-label"
                    for="g-question-banks-view-update-modal-form-file-field"
                  >
                    File
                  </label>
                  <input
                    accept="application/pdf"
                    class="form-control"
                    :class="{'is-invalid': updateModalFormDataStates.file.errors.length}"
                    :disabled="updateModalProcessing"
                    id="g-question-banks-view-update-modal-form-file-field"
                    ref="updateModalFileInputRef"
                    type="file"
                    @change="
                      if($event.target.files[0]) updateModalFormData.file = $event.target.files[0];
                      else updateModalFormData.file = null;
                    "
                  >
                  <div
                    class="invalid-feedback"
                    v-if="updateModalFormDataStates.file.errors.length"
                  >
                    <div
                      :key="`error-${error.type}`"
                      v-for="error in updateModalFormDataStates.file.errors"
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
                form="g-question-banks-view-update-modal-form"
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
      <div
        aria-labelledby="g-question-banks-view-view-modal-label"
        aria-hidden="true"
        class="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="g-question-banks-view-view-modal"
        ref="viewModalRef"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="g-question-banks-view-view-modal-label"
                v-text="`Viewing file for question bank '#${viewModalQuestionBankId}'.`"
              ></h5>
              <button
                aria-label="Close"
                class="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div class="modal-body overflow-hidden p-0">
              <iframe
                class="h-100 w-100"
                frameborder="0"
                height="100%"
                :src="viewModalFileUrl"
                width="100%"
              ></iframe>
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                class="btn btn-primary"
                :disabled="downloading"
                @click="downloadViewModalFile();"
                v-if="$store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'student'"
              >
                <span
                  aria-hidden="true"
                  class="spinner-grow spinner-grow-sm"
                  role="status"
                  v-if="downloading"
                ></span>
                Download
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
        data-bs-target="#g-question-banks-view-create-modal"
      >
        New Question Bank
        <span class="feather feather-plus"></span>
      </button>
    </div>
    <transition name="g-transition">
      <div
        class="align-items-center d-flex justify-content-center p-2 w-100"
        v-if="$store.state.storage.questionBanks === null"
      >
        <div class="spinner-grow text-primary" role="status"></div>
      </div>
      <div
        class="p-2 text-secondary"
        v-else-if="$store.state.storage.questionBankCount === 0"
      >
        No question banks to show!
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
            :key="`question-bank-${questionBank.id}`"
            v-for="questionBank in currentPageItems"
          >
            <div class="banner align-items-center d-flex justify-content-between w-100">
              <div class="data align-items-center d-flex gap-1">
                <button
                  :aria-controls="`g-question-banks-view-question-bank-${questionBank.id}-data-collapse`"
                  aria-expanded="false"
                  class="toggler btn btn-sm"
                  :data-bs-target="`#g-question-banks-view-question-bank-${questionBank.id}-data-collapse`"
                  data-bs-toggle="collapse"
                >
                  <span class="icon d-inline-block feather feather-chevron-right"></span>
                </button>
                <div
                  class="fs-5 fw-bold text-primary"
                  v-text="`#${questionBank.id}`"
                ></div>
                <div v-text="questionBank.Course.name"></div>
                <div class="fst-italic text-secondary">
                  <small v-text="`Level ${questionBank.Course.Level.name}`"></small>
                </div>
                <transition name="g-transition">
                  <span
                    class="feather feather-slash text-danger"
                    v-if="questionBank.deletedAt"
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
                    :data-bs-target="`#g-question-banks-view-${{
                      delete: 'destroy',
                      edit: 'update',
                      read: 'view',
                      restore: 'restore'
                    }[action]}-modal`"
                    :key="`action-${action}`"
                    :title="action.replace(/^./, function(match) {
                      return match.toUpperCase();
                    })"
                    v-for="action in ([
                      'read',
                      'edit',
                      'delete',
                      'restore'
                    ]
                      .filter(function(a) {
                        if($store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'student') return a == 'read';

                        return !(a == 'delete' && questionBank.deletedAt) && !(a == 'restore' && !questionBank.deletedAt);
                      }))"
                    @click="
                      if(action == 'delete') destroyModalQuestionBankId = questionBank.id;
                      else if(action == 'restore') restoreModalQuestionBankId = questionBank.id;
                      else if(action == 'edit') {
                        updateModalQuestionBankId = questionBank.id;
                        updateModalFormData.courseId = questionBank.courseId;
                      }
                      else if(action == 'read') viewModalQuestionBankId = questionBank.id;
                    "
                  >
                    <span
                      class="feather"
                      :class="{
                        'feather-book-open': action == 'read',
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
              :id="`g-question-banks-view-question-bank-${questionBank.id}-data-collapse`"
            >
              <div class="align-items-stretch border-top d-flex flex-column gap-1 pt-2 px-3 w-100">
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-nowrap text-secondary">
                    Id &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="questionBank.id"></span>
                </div>
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-nowrap text-secondary">
                    Course &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="questionBank.Course.name"
                  ></span>
                </div>
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-nowrap text-secondary">
                    Level &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="questionBank.Course.Level.name"
                  ></span>
                </div>
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-nowrap text-secondary">
                    Program &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="questionBank.Course.Program.name"
                  ></span>
                </div>
                <div class="d-flex gap-1 w-100">
                  <span class="flex-shrink-0 overflow-hidden text-nowrap text-secondary">
                    Semester &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="questionBank.Course.Semester.name"
                  ></span>
                </div>
                <div
                  class="d-flex gap-1 w-100"
                  v-if="$store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff'"
                >
                  <span class="flex-shrink-0 overflow-hidden text-nowrap text-secondary">
                    File &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="questionBank.file"
                  ></span>
                </div>
                <div
                  class="d-flex gap-1 w-100"
                  v-if="$store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff'"
                >
                  <span class="flex-shrink-0 overflow-hidden text-secondary">
                    Deleted &colon;
                  </span>
                  <span
                    class="flex-grow-1 flex-shrink-1 overflow-hidden"
                    v-text="!!questionBank.deletedAt"
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
        aria-label="Question banks view data table pagination"
        class="align-items-center d-flex justify-content-center py-2 w-100"
        v-if="$store.state.storage.questionBanks && $store.state.storage.questionBankCount !== null && $store.state.storage.questionBankCount > $store.getters.resourcePageSize && currentPageItems.length >= $store.getters.resourcePageSize"
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
import axios from 'axios';
import { Modal } from 'bootstrap';
import moment from 'moment';
import { computed, reactive, ref, watch, watchEffect } from 'vue';
import { useStore } from 'vuex';
import apiConfiguration from '@/configuration/api';
import { validate } from '@/services/fastest-validator';

export default {
  name: 'GQuestionBanksView',
  setup() {
    const $store = useStore();

    const createModalFileInputRef = ref(null);
    const createModalRef = ref(null);
    const destroyModalRef = ref(null);
    const restoreModalRef = ref(null);
    const updateModalFileInputRef = ref(null);
    const updateModalRef = ref(null);
    const viewModalRef = ref(null);

    let createModalResettingTimeout = null;
    const createModalValidationSchema = {
      courseId: 'number|integer|positive|convert',
      file: {
        type: 'class',
        instanceOf: File
      }
    };
    let updateModalResettingTimeout = null;
    const updateModalValidationSchema = {
      courseId: 'number|integer|positive|optional',
      file: {
        type: 'class',
        instanceOf: File,
        optional: true
      }
    };

    const createModalBsModal = ref(null);
    const createModalFormData = reactive({
      courseId: $store.state.storage.courses?.[0]?.id || null,
      file: null,
    });
    const createModalFormDataStates = reactive({
      courseId: {
        changed: false,
        errors: []
      },
      file: {
        changed: false,
        errors: []
      }
    });
    const createModalProcessing = ref(false);
    const createModalResetting = ref(false);
    const currentPage = ref(1);
    const destroyModalBsModal = ref(null);
    const destroyModalQuestionBankId = ref(null);
    const destroyModalProcessing = ref(false); 
    const downloading = ref(false);
    const restoreModalBsModal = ref(null);
    const restoreModalQuestionBankId = ref(null);
    const restoreModalProcessing = ref(false);
    const updateModalBsModal = ref(null);
    const updateModalFormData = reactive({
      courseId: null,
      file: null
    });
    const updateModalFormDataStates = reactive({
      courseId: {
        changed: false,
        errors: []
      },
      file: {
        changed: false,
        errors: []
      }
    });
    const updateModalQuestionBankId = ref(null);
    const updateModalProcessing = ref(false);
    const updateModalResetting = ref(false);
    const viewModalBsModal = ref(null);
    const viewModalQuestionBankId = ref(null);

    const currentPageItems = computed(function() {
      return ($store.state.storage.questionBanks || [])
        .filter(function(questionBank) {
          return $store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff' || !questionBank.deletedAt;
        })
        .filter(function(questionBank, index) {
          const lowerLimit = (currentPage.value - 1) * $store.getters.resourcePageSize;
          const upperLimit = lowerLimit + $store.getters.resourcePageSize;

          return index >= lowerLimit && index < upperLimit;
        });
    });
    const totalPages = computed(function() {
      const availableQuestionBankCount = ($store.state.storage.questionBanks || [])
        .filter(function(questionBank) {
          return $store.state.storage.authenticationUser?.UserProfile.UserProfileType?.name == 'staff' || !questionBank.deletedAt;
        }).length;

      return availableQuestionBankCount >= $store.state.storage.questionBankCount ? Math.ceil(availableQuestionBankCount / $store.getters.resourcePageSize) : (Math.floor(availableQuestionBankCount / $store.getters.resourcePageSize) + 1);
    });
    const viewModalFileUrl = computed(function() {
      const filePath = ($store.state.storage.questionBanks || [])
        .find(function(questionBank) {
          return questionBank.id == viewModalQuestionBankId.value;
        })?.file || null;

      return filePath ? `${apiConfiguration.url}/uploads/${filePath}` : null;
    });

    async function downloadViewModalFile() {
      if(downloading.value) return;

      const filePath = ($store.state.storage.questionBanks || [])
        .find(function(questionBank) {
          return questionBank.id == viewModalQuestionBankId.value;
        })?.file;

      if(!filePath) return;

      downloading.value = true;

      try {
        const response = await axios.get(`/uploads/${filePath}`, {responseType: 'blob'});
        const downloadUrl = URL.createObjectURL(response.data);
        const downloadLinkEl = document.createElement('a');

        downloadLinkEl.setAttribute('download', 'question-bank.pdf');
        downloadLinkEl.setAttribute('href', downloadUrl);
        downloadLinkEl.setAttribute('style', 'display: none;');
        document.documentElement.append(downloadLinkEl);
        downloadLinkEl.click();
      } finally {
        downloading.value = false;
      }
    }

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
          if(field == 'courseId') createModalFormData[field] = $store.state.storage.courses?.[0]?.id || null;
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

      const questionBankCreated = await $store.dispatch('createResource', {
        type: 'question-banks',
        body: form
      });

      if(questionBankCreated) {
        if (createModalBsModal.value) createModalBsModal.value.hide();
        
        resetCreateModalForm();
        currentPage.value = totalPages.value;
      }

      createModalProcessing.value = false;
    }

    async function submitDestroyModalForm() {
      if(isNaN(parseInt(destroyModalQuestionBankId.value))) {
        destroyModalProcessing.value = false;
        return;
      }

      if(destroyModalProcessing.value) return;

      destroyModalProcessing.value = true;

      const questionBankDestroyed = await $store.dispatch('destroyResource', {
        type: 'question-banks',
        id: destroyModalQuestionBankId.value
      });

      if (questionBankDestroyed && destroyModalBsModal.value) destroyModalBsModal.value.hide();

      destroyModalProcessing.value = false;
    }

    async function submitRestoreModalForm() {
      if(isNaN(parseInt(restoreModalQuestionBankId.value))) {
        restoreModalProcessing.value = false;
        return;
      }

      if(restoreModalProcessing.value) return;

      restoreModalProcessing.value = true;

      const questionBankRestored = await $store.dispatch('restoreResource', {
        type: 'question-banks',
        id: restoreModalQuestionBankId.value
      });

      if(questionBankRestored && restoreModalBsModal.value) restoreModalBsModal.value.hide();

      restoreModalProcessing.value = false;
    }

    async function submitUpdateModalForm() {
      if(isNaN(parseInt(updateModalQuestionBankId.value))) {
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

      const questionUpdated = await $store.dispatch('updateResource', {
        type: 'question-banks',
        body: form,
        id: updateModalQuestionBankId.value
      });

      if(questionUpdated) {
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
      else if(currentPageItems.value.length < $store.getters.resourcePageSize && ($store.state.storage.courses || []).length < $store.state.storage.courseCount) $store.dispatch('requestResource', {type: 'question-banks'});
    })

    watchEffect(function() {
      if(createModalRef.value) {
        if(!createModalBsModal.value) createModalBsModal.value = Modal.getOrCreateInstance(createModalRef.value);

        createModalRef.value.addEventListener('hide.bs.modal', function() {
          if(createModalFileInputRef.value) createModalFileInputRef.value.value = null;

          resetCreateModalForm();
        });
      }
      else createModalBsModal.value = null;

      if(destroyModalRef.value) {
        if(!destroyModalBsModal.value) destroyModalBsModal.value = Modal.getOrCreateInstance(destroyModalRef.value);

        destroyModalRef.value.addEventListener('hide.bs.modal', function() {
          destroyModalQuestionBankId.value = null;
        });
      }
      else destroyModalBsModal.value = null;

      if(restoreModalRef.value) {
        if(!restoreModalBsModal.value) restoreModalBsModal.value = Modal.getOrCreateInstance(restoreModalRef.value);

        restoreModalRef.value.addEventListener('hide.bs.modal', function() {
          restoreModalQuestionBankId.value = null;
        });
      }
      else restoreModalBsModal.value = null;

      if(updateModalRef.value) {
        if(!updateModalBsModal.value) updateModalBsModal.value = Modal.getOrCreateInstance(updateModalRef.value);

        updateModalRef.value.addEventListener('hide.bs.modal', function() {
          if(updateModalFileInputRef.value) updateModalFileInputRef.value.value = null;

          updateModalQuestionBankId.value = null;
          resetUpdateModalForm();
        });
      }
      else updateModalBsModal.value = null;

      if(viewModalRef.value) {
        if(!viewModalBsModal.value) viewModalBsModal.value = Modal.getOrCreateInstance(viewModalRef.value);

        viewModalRef.value.addEventListener('hide.bs.modal', function() {
          viewModalQuestionBankId.value = null;
        });
      }
      else viewModalBsModal.value = null;
    });

    watchEffect(function() {
      if($store.state.application.error) {
        if(createModalBsModal.value) createModalBsModal.value.hide();

        if(destroyModalBsModal.value) destroyModalBsModal.value.hide();

        if(restoreModalBsModal.value) restoreModalBsModal.value.hide();

        if(updateModalBsModal.value) updateModalBsModal.value.hide();

        if(viewModalBsModal.value) viewModalBsModal.value.hide();
      }
    });

    $store.dispatch('requestAllResource', {type: 'courses'});

    if(!$store.state.storage.questionBanks?.length) $store.dispatch('requestResource', {type: 'question-banks'});

    return {
      createModalBsModal,
      createModalFileInputRef,
      createModalFormData,
      createModalFormDataStates,
      createModalProcessing,
      createModalResetting,
      createModalRef,
      currentPage,
      currentPageItems,
      destroyModalBsModal,
      destroyModalProcessing,
      destroyModalQuestionBankId,
      destroyModalRef,
      downloading,
      downloadViewModalFile,
      moment,
      resetCreateModalForm,
      resetUpdateModalForm,
      restoreModalBsModal,
      restoreModalProcessing,
      restoreModalQuestionBankId,
      restoreModalRef,
      submitCreateModalForm,
      submitDestroyModalForm,
      submitRestoreModalForm,
      submitUpdateModalForm,
      totalPages,
      updateModalBsModal,
      updateModalFileInputRef,
      updateModalFormData,
      updateModalFormDataStates,
      updateModalProcessing,
      updateModalQuestionBankId,
      updateModalResetting,
      updateModalRef,
      validateCreateModalForm,
      validateUpdateModalForm,
      viewModalBsModal,
      viewModalFileUrl,
      viewModalQuestionBankId,
      viewModalRef
    };
  }
}
</script>

<style lang="scss" scoped>
.g-question-banks-view {
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
