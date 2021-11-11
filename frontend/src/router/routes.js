import HomeView from '@/views/home';

export default [
  {
    name: 'Dashboard',
    path: '/dashboard',
    component() {
      return import('@/views/dashboard');
    },
    meta: {
      guards: {requireAuthentication: true}
    }
  },
  {
    name: 'Home',
    path: '/',
    component: HomeView,
    meta: {
      checks: {disableMainAside: true}
    }
  },
  {
    name: 'Projects',
    path: '/projects',
    component() {
      return import('@/views/projects');
    },
    meta: {
      guards: {requireAuthentication: true}
    }
  },
  {
    name: 'QuestionBanks',
    path: '/question-banks',
    component() {
      return import('@/views/question-banks');
    },
    meta: {
      guards: {requireAuthentication: true}
    }
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
  },
  {
    name: 'Students',
    path: '/students',
    component() {
      return import('@/views/students');
    },
    meta: {
      guards: {requireStaffUserProfileType: true}
    }
  },
];
