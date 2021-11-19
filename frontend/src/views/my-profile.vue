<template>
  <div class="g-my-profile-view py-5 w-100">
    <h3>
      My Profile
    </h3>
    <div class="py-3 w-100">
      <h5 class="border-top pt-3 text-secondary">
        Details
      </h5>
      <div class="d-flex gap-1 w-100">
        <span class="flex-grow-0 flex-shrink-0 overflow-hidden text-nowrap text-secondary">
          Index &colon;
        </span>
        <span
          class="flex-grow-1 flex-shrink-1 overflow-hidden w-100"
          v-text="$store.state.storage.authenticationUser?.index"
        ></span>
      </div>
      <div class="d-flex gap-1 w-100">
        <span class="flex-grow-0 flex-shrink-0 overflow-hidden text-nowrap text-secondary">
          First Name &colon;
        </span>
        <span
          class="flex-grow-1 flex-shrink-1 overflow-hidden w-100"
          v-text="$store.state.storage.authenticationUser?.UserProfile?.firstName"
        ></span>
      </div>
      <div class="d-flex gap-1 w-100">
        <span class="flex-grow-0 flex-shrink-0 overflow-hidden text-nowrap text-secondary">
          Last Name &colon;
        </span>
        <span
          class="flex-grow-1 flex-shrink-1 overflow-hidden w-100"
          v-text="$store.state.storage.authenticationUser?.UserProfile?.lastName"
        ></span>
      </div>
      <div class="d-flex gap-1 w-100">
        <span class="flex-grow-0 flex-shrink-0 overflow-hidden text-nowrap text-secondary">
          Roles &colon;
        </span>
        <span
          class="flex-grow-1 flex-shrink-1 overflow-hidden w-100"
          v-text="($store.state.storage.authenticationUser?.Roles || [])
            .map(function(role) {
              return role.name;
            })
            .toString()"
        ></span>
      </div>
      <div class="d-flex gap-1 w-100">
        <span class="flex-grow-0 flex-shrink-0 overflow-hidden text-nowrap text-secondary">
          User Type &colon;
        </span>
        <span
          class="flex-grow-1 flex-shrink-1 overflow-hidden w-100"
          v-text="$store.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name"
        ></span>
      </div>
    </div>
    <form @submit.prevent="submitForm();">
      <h5 class="border-top py-3 text-secondary">
        Change Password
      </h5>
      <div class="form-floating mb-3">
        
        <input
          class="form-control"
          :class="{'is-invalid': formDataStates.newPassword.errors.length}"
          :disabled="processing"
          id="g-my-profile-view-form-new-password-field"
          placeholder="_"
          type="password"
          v-model="formData.newPassword"
        >
        <label for="g-my-profile-view-form-new-password-field">
          New Password
        </label>
        <div
          class="invalid-feedback"
          v-if="formDataStates.newPassword.errors.length"
        >
          <div
            :key="`error-${error.type}`"
            v-for="error in formDataStates.newPassword.errors"
          >
            <b>{{error.type}}:</b>
            {{error.message}}
          </div>
        </div>
      </div>
      <div class="form-floating mb-3">
        <input
          class="form-control"
          :class="{'is-invalid': formDataStates.currentPassword.errors.length}"
          :disabled="processing"
          id="g-my-profile-view-form-current-password-field"
          placeholder="_"
          type="password"
          v-model="formData.currentPassword"
        >
        <label for="g-my-profile-view-form-current-password-field">
          Current Password
        </label>
        <div
          class="invalid-feedback"
          v-if="formDataStates.currentPassword.errors.length"
        >
          <div
            :key="`error-${error.type}`"
            v-for="error in formDataStates.currentPassword.errors"
          >
            <b>{{error.type}}:</b>
            {{error.message}}
          </div>
        </div>
      </div>
      <div class="mb-3">
        <button
            class="btn btn-primary w-100"
            :disabled="processing"
            type="submit"
          >
            <span
              aria-hidden="true"
              class="spinner-grow spinner-grow-sm"
              role="status"
              v-if="processing"
            ></span>
            Change
          </button>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { validate } from '@/services/fastest-validator';

export default {
  name: 'GMyProfileView',
  setup() {
    const $store = useStore();

    let resettingTimeout = null;
    const validationSchema = {
      newPassword: {
        type: 'string',
        empty: false,
        min: 6,
        pattern: /^.*(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/,
        messages: {stringPattern: 'The \'{field}\' field must have at least one lowercase letter, one uppercase letter and one digit.'}
      },
      currentPassword: 'string|empty:false'
    };

    const formData = reactive({
      newPassword: null,
      currentPassword: null
    });
    const formDataStates = reactive({
      newPassword: {
        changed: false,
        errors: []
      },
      currentPassword: {
        changed: false,
        errors: []
      }
    });
    const processing = ref(false);
    const resetting = ref(false);

    function resetForm(options) {
      if(resettingTimeout) {
        clearTimeout(resettingTimeout);
        resettingTimeout = null;
      }

      resetting.value = true;
      options = options?.constructor?.name?.toLowerCase() == 'object' ? options : (Array.isArray(options) ? {include: options} : (typeof options == 'string' ? {include: [options]} : {}));
      options.exclude = (Array.isArray(options?.exclude) ? options.exclude : (typeof options?.exclude == 'string' ? [options.exclude] : []));
      options.include = (Array.isArray(options?.include) ? options.include : (typeof options?.include == 'string' ? [options.include] : Object.keys(formDataStates)));

      options.include
        .filter(function(field) {
          return Object.keys(formData).includes(field) && !options.exclude.includes(field);
        })
        .forEach(function(field) {
          formData[field] = null;
          formDataStates[field].changed = false;
          formDataStates[field].errors = [];
        });
      
      resettingTimeout = setTimeout(function() {
        resetting.value = false;
      }, 100);
    }

    async function submitForm() {
      if(processing.value) return;

      processing.value = true;

      if(!validateForm()) {
        processing.value = false;
        return;
      }

      const form = new FormData();

      for(const key in formData) {
        form.append(key, formData[key]);
      }

      await $store.dispatch('authenticationUpdateUser', form);

      resetForm();
      processing.value = false;
    }

    function validateForm() {
      const validated = validate(formData, validationSchema);

      for(const field in formDataStates) {
        formDataStates[field].errors = [];
      }

      if(validated === true) return true;

      validated
        .forEach(function(error) {
          if(!Array.isArray(formDataStates[error.field]?.errors) || !formDataStates[error.field].changed) return;

          const check = formDataStates[error.field].errors
            .findIndex(function(formError) {
              return formError.type == error.type
            }) < 0;

          if(!check) return;

          formDataStates[error.field].errors.push(error);
        });
      return false;
    }

    watch(function() {
      return JSON.parse(JSON.stringify(formData));
    }, function(value, oldValue) {
      if(resetting.value) return;

      for(const field in formDataStates) {
        if(!value[field]) formData[field] = null;
        
        if(!formDataStates[field].changed) formDataStates[field].changed = value[field] != oldValue[field];
      }

      validateForm();
    }, {deep: true});

    return {
      formData,
      formDataStates,
      processing,
      resetting,
      submitForm,
      validateForm
    };
  }
}
</script>