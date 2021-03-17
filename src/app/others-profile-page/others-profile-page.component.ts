import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-others-profile-page',
  templateUrl: './others-profile-page.component.html',
  styleUrls: ['./others-profile-page.component.css']
})
export class OthersProfilePageComponent implements OnInit {
  profileData = {id: '', password: '', userName: '', firstName: '', lastName: '', email: '', phone: '', zipCode: ''}
  user;
  constructor(private svc: UserService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.svc.findProfileById(params.id).then(user => this.profileData = user);
    });
    this.svc.getUser().then(user => {
    if (user.status === 200) {
      this.user = user.body;
    } else {
      return;
    }});
  }
  backClick() {
    this.location.back();
  }
  logout() {
    this.svc.logout();
  }
}
