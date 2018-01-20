import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import forms for use the registration validation ngModel
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// do we need this?
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { VotehomeComponent } from './components/votehome/votehome.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';

// add services manually
import { ValidateService } from './services/validate.service';
// use the flash module to alert the user of errors
import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';
// bring in the auth service so that it can be used across the app
import { AuthorizationService } from './services/authorization.service';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'votehome', component: VotehomeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    VotehomeComponent,
    DashboardComponent,
    HomeComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule
  ],
  // manually add the services over here as well
  providers: [ValidateService, FlashMessagesService, AuthorizationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
