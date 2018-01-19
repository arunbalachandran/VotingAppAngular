import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(private authorizationService: AuthorizationService, private router: Router,
              private flashMessageService: FlashMessagesService) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    console.log("The login button was clicked!");
    const user = {
      username: this.username,
      password: this.password
    }

    this.authorizationService.authenticateUser(user).subscribe(data => {
      console.log("The data is " + data);
      if (data.success) {
        this.authorizationService.storeUserData(data.token, data.user);
        this.flashMessageService.show('You are now logged in successfully!', {cssClass: 'alert-success', timeout: 2500});
        this.router.navigate(['/votehome']);
        // this.router.navigate(['/dashboard']);
      }

      else {
        this.flashMessageService.show(data.msg, {cssClass: 'alert-success', timeout: 2500});
        this.router.navigate(['/login']);
      }
    });

  }
}
