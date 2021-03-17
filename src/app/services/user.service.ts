import {Injectable} from '@angular/core';
// import {server} from '../../constants';

// @ts-ignore
@Injectable()
export class UserService {
  public createUser(user) {
    return fetch(`https://househuntersapi.herokuapp.com/api/register`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json().then(data => ({status: response.status, body: data})));
  }
  public loginUser(user) {
    return fetch(`https://househuntersapi.herokuapp.com/api/login`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json().then(data => ({status: response.status, body: data})));
  }
  public logout() {
    return fetch(`https://househuntersapi.herokuapp.com/api/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  }

  public getUser() {
    return fetch(`https://househuntersapi.herokuapp.com/api/profile`, {
      method: 'POST',
      credentials: 'include'
    }).then(response => response.json().then(data => ({status: response.status, body: data})));
  }
  public findProfileById(id) {
    return fetch(`https://househuntersapi.herokuapp.com/api/profile/${id}`).then(response => response.json());
  }

  public updateUser(user) {
    return fetch(`https://househuntersapi.herokuapp.com/api/users/${user.userName}`, {
    method: 'PUT',
    body: JSON.stringify(user),
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include'
  }).then(response => response.json().then(data => ({status: response.status, body: data})));
}


  public isLoggedIn() {
    return fetch(`https://househuntersapi.herokuapp.com/api/profile`, {
      method: 'POST',
      credentials: 'include'
    }).then(response => {
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    });
  }

  public deleteUser(userName) {
    return fetch(`https://househuntersapi.herokuapp.com/api/users/${userName}`, {
      method: 'DELETE',
      credentials: 'include'
    });
  }
}
