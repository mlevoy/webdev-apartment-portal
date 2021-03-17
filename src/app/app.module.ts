import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SearchPageComponent} from './search-page/search-page.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginPageComponent} from './login-page/login-page.component';
import {RegisterPageComponent} from './register-page/register-page.component';


import {PropertyPageComponent} from './property-page/property-page.component';
import {PropertyServiceClient} from './services/property-service';
import {UserService} from './services/user.service';
import {ProfilePageComponent} from './profile-page/profile-page.component';
import {OthersProfilePageComponent} from './others-profile-page/others-profile-page.component';
import {CreateListingComponent} from './create-listing/create-listing.component';
import {HeaderComponent} from './header/header.component';
import {LoginActivate} from './LoginActivate';
import { PrivacyPolicyPageComponent } from './privacy-policy-page/privacy-policy-page.component';
import { ContactSellerComponent } from './contact-seller/contact-seller.component';
import { FavouritesComponent } from './favourites/favourites.component';



@NgModule({
  declarations: [
    AppComponent,
    SearchPageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    PropertyPageComponent,
    ProfilePageComponent,
    OthersProfilePageComponent,
    CreateListingComponent,
    HeaderComponent,
    PrivacyPolicyPageComponent,
    ContactSellerComponent,
    FavouritesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],

  providers: [UserService, PropertyServiceClient, LoginActivate],

  bootstrap: [AppComponent]
})
export class AppModule {
}
