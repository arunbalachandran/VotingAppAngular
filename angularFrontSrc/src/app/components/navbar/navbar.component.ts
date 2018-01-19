import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authorizationService: AuthorizationService, private flashMessageService: FlashMessagesService,
              private router: Router) { }

  ngOnInit() {
  }

  onLogoutClick() {
    this.authorizationService.logout();
    this.flashMessageService.show('You have logged out successfully!', {cssClass: 'alert-success', timeOut: 2500});
    this.router.navigate(['/login']);
    return false;
  }
}
