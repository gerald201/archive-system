<template>
  <div class="g-sign-in-view align-items-center d-flex justify-content-center w-100">
    <div class="card my-3">
      <img
        alt="placeholder"
        class="mt-3 mx-auto rounded w-50"
        src="https://via.placeholder.com/150"
      >
      <div class="card-body">
        <h3 class="text-center text-primary">
          Sign In
        </h3>

        <form @submit.prevent="submit();">
          <div class="mb-3">
            <label
              class="form-label"
              for="sign-in-view-form-index-field"
            >
              Index
            </label>
            <input
              class="form-control"
              id="sign-in-view-form-index-field"
              name="index"
              placeholder="040123456"
              type="text"
              v-model="formData.index"
            >
          </div>
          <div class="mb-3">
            <label
              class="form-label"
              for="sign-in-view-form-password-field"
            >
              Password
            </label>
            <input
              class="form-control"
              id="sign-in-view-form-password-field"
              name="password"
              type="password"
              v-model="formData.password"
            >
          </div>
          <div class="d-grid">
            <button
              class="btn btn-primary"
              type="submit"
            >
              Sign In!
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { validate } from '@/services/fastest-validator';

export default {
  name: 'GSignInView',
  setup() {
    const $router = useRouter();
    const $store = useStore();

    const formData = reactive({
      index: '',
      password: ''
    });

    async function submit() {
      const schema = {
        $$strict: 'remove',
        index: {
          type: 'string',
          empty: false
        },
        password: {
          type: 'string',
          empty: false
        }
      };
      const validated = validate(formData, schema);

      console.log('VALIDATED', validated);

      if(validated !== true) return;

      console.log('FORM DATA', formData);

      const signedIn = await $store.dispatch('authenticationSignIn', formData);

      console.log('SIGNED IN', signedIn);

      if(signedIn) return await $router.push({name: 'Dashboard'});
    }

    return {
      formData,
      submit
    };
  }
}
</script>

<style lang="scss" scoped>
.g-sign-in-view {
  height: var(--content-viewport);

  & > .card {
    max-width: 25rem;
    width: 100%;
  }
}
</style>