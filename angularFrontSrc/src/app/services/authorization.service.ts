import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map'; // used for the auth service callback

@Injectable()
export class AuthorizationService {
  authToken: any;
  user: any;

  constructor(private http: Http) { }

  // on registering a user
  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // send a post request
    // console.log('Send a request to backend');
    return this.http.post('http://localhost:3000/users/registration', user, {headers: headers}).map(response => response.json());
  }

  // authentication function
  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/authentication', user, {headers: headers}).map(response => response.json());
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
