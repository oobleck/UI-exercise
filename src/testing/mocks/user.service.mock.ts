import { of } from 'rxjs';
import { defaultMockUser } from './defaultMockUser';

export const mockUsers = new Array(12).fill(0).map((skip, uu) => ({
  ...defaultMockUser,
  id: uu + 1,
  username: defaultMockUser.username + (uu + 1),
}));

export class MockUserService {
  isLoggedIn$ = of(true);
  usersHash = mockUsers.reduce((result, user) => {
    result[user.username] = result[user.id] = user;
    return result;
  }, {});
  currentUser = mockUsers[0];
  username = mockUsers[0].username;
  userFullName = mockUsers[0].name;
  isValid() {
    return true;
  }
  login() {
    return this.isLoggedIn$;
  }
  logout() {
    return of(true);
  }
  getUsers() {
    return of(mockUsers);
  }
}
