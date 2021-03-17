import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private service: UserService) {
  }

  user = {
    userName: '',
    firstName: '',
    favouriteProperties: [],
    customerType: ''
  };

  ngOnInit(): void {
    this.service.getUser().then(user => {
      if (user.status === 200) {
        this.user = user.body;
      }
    });
  }

  onLogout() {
    this.service.logout().then(e => location.reload());
  }

}
