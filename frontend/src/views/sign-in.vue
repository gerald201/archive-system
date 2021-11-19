<template>
  <div class="g-sign-in-view align-items-center d-flex justify-content-center py-5 w-100">
    <div class="card my-3">
      <img
        alt="placeholder"
        class="mt-3 mx-auto rounded w-50"
        :src="`${apiUrl}/assets/images/gctu-logo.jpg`"
      >
      <div class="card-body">
        <h3 class="text-center text-primary">
          Sign In
        </h3>

        <form @submit.prevent="submitForm();">
          <div class="form-floating mb-3">
            <input
              class="form-control"
              :class="{'is-invalid': formDataStates.index.errors.length}"
              :disabled="processing"
              id="sign-in-view-form-index-field"
              placeholder="_"
              type="text"
              v-model="formData.index"
            >
            <label for="sign-in-view-form-index-field">
              Index
            </label>
            <div
              class="invalid-feedback"
              v-if="formDataStates.index.errors.length"
            >
              <div
                :key="error.type"
                v-for="error in formDataStates.index.errors"
              >
                <b>{{error.type}}:</b>
                {{error.message}}
              </div>
            </div>
          </div>
          <div class="form-floating mb-3">
            <input
              class="form-control"
              :class="{'is-invalid': formDataStates.password.errors.length}"
              :disabled="processing"
              id="sign-in-view-form-password-field"
              placeholder="_"
              type="password"
              v-model="formData.password"
            >
            <label for="sign-in-view-form-password-field">
              Password
            </label>
            <div
              class="invalid-feedback"
              v-if="formDataStates.password.errors.length"
            >
              <div
                :key="error.type"
                v-for="error in formDataStates.password.errors"
              >
                <b>{{error.type}}:</b>
                {{error.message}}
              </div>
            </div>
          </div>
          <div class="d-grid">
            <button
              class="btn btn-primary"
              :disabled="processing"
              type="submit"
            >
              <span
                aria-hidden="true"
                class="spinner-grow spinner-grow-sm"
                role="status"
                v-if="processing"
              ></span>
              Sign In!
            </button>
            <router-link
              class="pt-2 text-center w-100"
              :to="{name: 'Home'}"
            >
              Home
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import apiConfiguration from '@/configuration/api';
import { validate } from '@/services/fastest-validator';

export default {
  name: 'GSignInView',
  setup() {
    const $router = useRouter();
    const $store = useStore();

    let resettingTimeout = null;
    const validationSchema = {
      index: 'string|empty:false',
      password: 'string|empty:false'
    };

    const formData = reactive({
      index: null,
      password: null
    });
    const formDataStates = reactive({
      index: {
        changed: false,
        errors: []
      },
      password: {
        changed: false,
        errors: []
      }
    });
    const processing = ref(false);
    const resetting = ref(false);

    const apiUrl = computed(function() {
      return apiConfiguration.url;
    });

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

      const signedIn = await $store.dispatch('authenticationSignIn', form);

      if(signedIn) {
        resetForm();
        await $router.push({name: 'Dashboard'});
      }
      else resetForm('password');

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
      apiUrl,
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

<style lang="scss" scoped>
.g-sign-in-view {
  transition-property: height;

  & > .card {
    max-width: 25rem;
    width: 100%;
  }
}
</style>