import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SearchPageComponent} from './search-page/search-page.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {RegisterPageComponent} from './register-page/register-page.component';
import {PropertyPageComponent} from './property-page/property-page.component';
import {ProfilePageComponent} from './profile-page/profile-page.component';
import {OthersProfilePageComponent} from './others-profile-page/others-profile-page.component';
import {CreateListingComponent} from './create-listing/create-listing.component';
import {LoginActivate} from './LoginActivate';
import {PrivacyPolicyPageComponent} from './privacy-policy-page/privacy-policy-page.component';


const routes: Routes = [
  {path: '', redirectTo: '/search', pathMatch: 'full'},
  {path: 'search', component: SearchPageComponent},
  {path: 'search/:selectedState/:selectedCity/:selectedNeighbourhood', component: SearchPageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'property/:pid', component: PropertyPageComponent},
  {path: 'profile', component: ProfilePageComponent},
  {path: 'profile/:id', component: OthersProfilePageComponent},
  {path: 'create', component: CreateListingComponent, canActivate: [LoginActivate]},
  {path: 'dataprivacy', component: PrivacyPolicyPageComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
