import HomeView from '@/views/home';

export default [
  {
    name: 'Dashboard',
    path: '/dashboard',
    component() {
      return import('@/views/dashboard');
    },
    meta: {
      guards: {requireAuth: true}
    }
  },
  {
    name: 'Home',
    path: '/',
    component: HomeView
  },
  {
    name: 'SignIn',
    path: '/sign-in',
    component() {
      return import('@/views/sign-in');
    },
    meta: {
      guards: {requireGuest: true},
      checks: {
        disableMainAside: true,
        disableMainHeader: true
      }
    }
  }
];
