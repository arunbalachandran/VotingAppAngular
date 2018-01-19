import { Component, OnInit } from '@angular/core';
// import the validation service
import { ValidateService } from '../../services/validate.service';
// import the flash message service to show the invalid option message flash
import { FlashMessagesService } from 'angular2-flash-messages';
// bring in the auth service for authorization
import { AuthorizationService } from '../../services/authorization.service';
// import router for a redirect after registration
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // create the properties for a user who registers into the voting app
  name: String;
  username: String;
  email: String;
  password: String;

  // add the services that you need
  constructor(private validateService: ValidateService, private flashMessage: FlashMessagesService,
              private authorizationService: AuthorizationService, private router: Router) { }

  ngOnInit() {
  }

  // now create a onsubmit method for the submitted form
  onRegistrationFormSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }

    // validate the existence of a string in all fields
    if (!this.validateService.validateUserFields(user)) {
      console.log("Please fill in all the fields!");
      this.flashMessage.show('Please fill in all the fields', {cssClass: 'alert-danger', timeout: 2500});
      return false
    }

    if (!this.validateService.validateEmailAddress(user.email)) {
      console.log("Please fill in a valid email address!");
      this.flashMessage.show('Please fill in a valid email address!', {cssClass: 'alert-danger', timeout: 2500});
      return false;
    }

    this.authorizationService.registerUser(user).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('Registration successful!', {cssClass: 'alert-success', timeout: 2500});
        this.router.navigate(['/login']);
      }
      
      else {
        this.flashMessage.show('Problem in registration!', {cssClass: 'alert-danger', timeout: 2500});
        this.router.navigate(['/register']);
      }
    });
  }
}
