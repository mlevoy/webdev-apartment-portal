import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']

})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  status;
  constructor(private formBuilder: FormBuilder, private router: Router, private svc: UserService) {
  }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }
  onSubmit() {
    this.svc.loginUser(this.loginForm.value).then(actualUser => {
      if (actualUser.status === 200) {
        this.router.navigate([`profile`]);
      } else {
        this.status = actualUser.status;
      }
    });
  }
}
