import store from '@/store';

const guardKeys = [
  'requireAuthentication',
  'requireGuest',
  'requireStaffUserProfileType',
  'requireStudentUserProfileType'
];

function testGuard(route, guardKey) {
  const guards = guardKeys
    .reduce(function(accumulator, current) {
      accumulator[current] = route.matched
        .some(function(m) {
          return m.meta.guards?.[current] === true
        });
      return accumulator;
    }, {});
  
  switch(guardKey) {
    case 'requireAuthentication': return guards[guardKey] ? store.getters.authenticated : true;
    case 'requireGuest': return guards[guardKey] ? !store.getters.authenticated : true;
    case 'requireStaffUserProfileType': return guards[guardKey] ? store.getters.authenticated && store.state.storage.authenticationUser.UserProfile.UserProfileType.name == 'staff' : true;
    case 'requireStudentUserProfileType': return guards[guardKey] ? store.getters.authenticated && store.state.storage.authenticationUser.UserProfile.UserProfileType.name == 'student' : true;
    default: return true;
  }
}

export function checkRouterGuards(route) {
  return guardKeys
    .every(function(guardKey) {
      return testGuard(route, guardKey);
    });
}

export default {
  checkRouterGuards
};
