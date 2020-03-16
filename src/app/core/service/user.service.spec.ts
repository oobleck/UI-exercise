import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MockSharedModule, MockStorageService, mockUsers } from 'src/testing';

import { API_ENDPOINT_BASE } from '../constants';
import { BrowserStorageService } from './browser-storage.service';
import { RestApiService } from './rest-api.service';
import { UserService } from './user.service';

const testUser = mockUsers[0];

const routerStub = {
  navigateByUrl: () => Promise.resolve({}),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MockSharedModule, HttpClientTestingModule ],
      providers: [
        RestApiService,
        {
          provide: BrowserStorageService,
          useClass: MockStorageService,
        },
        {
          provide: Router,
          useValue: routerStub,
        },
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(
    'initially fetch users',
    inject([ HttpTestingController ], (httpMock: HttpTestingController) => {
      const users = [ ...mockUsers ];
      service.getUsers().subscribe((fetchedUsers) => {
        expect(fetchedUsers.length).toBe(users.length);
        expect(service.usersHash[testUser.id]).toBeTruthy();
      });

      const mockReq = httpMock.expectOne(`${API_ENDPOINT_BASE}/users`);
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(users);
      httpMock.verify();
    })
  );

  it(
    'should NOT authenticate invalid users',
    inject([ HttpTestingController ], (httpMock: HttpTestingController) => {
      const invalidUserCredentials = { username: 'testUser.username' };
      const mockReq = httpMock.expectOne(`${API_ENDPOINT_BASE}/users`);

      service.getUsers().subscribe(() => {
        service.login(invalidUserCredentials).subscribe((isValid) => {
          expect(isValid).toBeFalsy();
        });
      });

      mockReq.flush(mockUsers);
      httpMock.verify();
    })
  );

  it(
    'should authenticate valid users',
    inject([ HttpTestingController ], (httpMock: HttpTestingController) => {
      const userCredentials = { username: testUser.username };
      const mockReq = httpMock.expectOne(`${API_ENDPOINT_BASE}/users`);

      service.getUsers().subscribe(() => {
        service.login(userCredentials).subscribe((isValid: boolean) => {
          expect(isValid).toBeTruthy();
        });
      });

      mockReq.flush(mockUsers);
      httpMock.verify();
    })
  );

  it(
    'should populate valid user data',
    inject([ HttpTestingController ], (httpMock: HttpTestingController) => {
      const userCredentials = { username: testUser.username };
      const mockReq = httpMock.expectOne(`${API_ENDPOINT_BASE}/users`);

      service.getUsers().subscribe(() => {
        service.login(userCredentials).subscribe((isValid: boolean) => {
          expect(service.username).toEqual(testUser.username);
          expect(service.userFullName).toEqual(testUser.name);
          expect(service.currentUser.id).toEqual(testUser.id);
        });
      });

      mockReq.flush(mockUsers);
      httpMock.verify();
    })
  );

  it('should logout and invalidate the user', () => {
    service.logout().subscribe((isLoggedOut: boolean) => {
      expect(service.isValid()).toBeFalsy();
      expect(isLoggedOut).toBeTruthy();
    });
  });
});
