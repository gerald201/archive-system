<template>
  <div class="g-application-toast left-0 position-fixed top-0 w-100">
    <div
      class="bottom-0 end-0 position-absolute p-3 toast-container"
      ref="toastContainerRef"
    ></div>
  </div>
</template>

<script>
import { Toast } from 'bootstrap';
import { ref, watchEffect } from 'vue';
import { emitter } from '@/services/emitter';

export default {
  name: 'GApplicationToast',
  setup() {
    const toastContainerRef = ref(null);

    const toasts = ref(new Map());

    function createToast(options) {
      options = options?.constructor?.name?.toLowerCase() == 'object' ? options : {};
      options.title = options.title && typeof options.title == 'string' ? options.title : '{NO_TITLE}';
      options.message = options.message && typeof options.message == 'string' ? options.message : '{NO_MESSAGE}';

      const toastMutationObserver = new MutationObserver(function(mutationsList, observer) {
        const attributeMutation = mutationsList
          .find(function(mutation) {
            return mutation.type == 'attributes';
          });
        
        if(!attributeMutation || attributeMutation.attributeName != 'class') return;

        if(attributeMutation.target.classList.contains('hide')) {
          observer.disconnect();
          toasts.value.delete(attributeMutation.target);
          attributeMutation.target.remove();
        }
      });
      const toastElement = document.createElement('div');
      const headerElement = document.createElement('div');
      const titleElement = document.createElement('strong');
      const closeElement = document.createElement('button');
      const bodyElement = document.createElement('div');

      toastElement.setAttribute('aria-atomic', 'true');
      toastElement.setAttribute('aria-live', 'assertive');
      toastElement.setAttribute('class', 'toast');
      toastElement.setAttribute('role', 'alert');
      toastElement.append(headerElement, bodyElement);

      headerElement.setAttribute('class', 'toast-header');
      headerElement.append(titleElement, closeElement);

      titleElement.setAttribute('class', 'me-auto');
      titleElement.innerText = options.title;

      closeElement.setAttribute('aria-label', 'Close');
      closeElement.setAttribute('class', 'btn-close');
      closeElement.setAttribute('data-bs-dismiss', 'toast');
      closeElement.setAttribute('type', 'button');

      bodyElement.setAttribute('class', 'toast-body');
      bodyElement.innerHTML = options.message;

      const toastData = {
        toast: Toast.getOrCreateInstance(toastElement),
        mounted: false
      };

      if(toastContainerRef.value) {
        toastContainerRef.value.append(toastElement);
        toastData.toast.show();
        toastData.mounted = true;
      }

      toastMutationObserver.observe(toastElement, {
        attributes: true,
        attributeFilter: ['class']
      });
      toasts.value.set(toastElement, toastData);
    }

    watchEffect(function() {
      if(toastContainerRef.value) {
        toasts.value
          .forEach(function(data, element) {
            if(!data.mounted) {
              toastContainerRef.value.append(element);
              data.toast.show();
              data.mounted = true;
            }
          });
      }
    });

    emitter.on('application:toast', function(data) {
      createToast(data);
    });

    window.makeAToast = function() {
      createToast({
        title: 'Success!',
        message: 'You made a toast.'
      });
    }

    return {toastContainerRef};
  }
}
</script>

<style lang="scss" scoped>
.g-application-toast {
  pointer-events: none;
  height: 100vh;
  z-index: 4;

  & > :deep(.toast-container > .toast) {
    pointer-events: auto;
  }
}
</style>