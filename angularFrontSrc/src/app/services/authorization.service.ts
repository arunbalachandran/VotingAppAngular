import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map'; // used for the auth service callback
// import tokenNotExpired
import { tokenNotExpired } from 'angular2-jwt';


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
    return this.http.post('api/registration', user, {headers: headers}).map(response => response.json());
  }

  // authentication function
  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('api/authentication', user, {headers: headers}).map(response => response.json());
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getProfile() {
    console.log('Call being made to getProfile() ...');
    let headers = new Headers();
    this.loadAuthToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('api/profile', {headers: headers}).map(response => response.json());
  }

  getVoteData() {
    let headers = new Headers();
    this.loadAuthToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('api/votes', {headers: headers}).map(response => response.json());
  }

  changeVote(userFruit) {
    let headers = new Headers();
    this.loadAuthToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.put('api/votes', userFruit, {headers: headers}).map(response => response.json());
  }

  getFruitsList() {
    console.log('Call made to getFruitsList');
    let headers = new Headers();
    this.loadAuthToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('api/fruits', {headers: headers}).map(response => response.json());
  }

  loadAuthToken() {
    console.log('Call to fetch token ...');
    const token = localStorage.getItem('id_token');
    console.log('Token is ' + token);
    this.authToken = token;
  }

  loggedIn() {
    console.log('Token not expired is ' + tokenNotExpired('id_token'));
    return tokenNotExpired('id_token');
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
