import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})


export class RegisterPageComponent implements OnInit {
  updateForm: FormGroup;
  status;
  constructor(private formBuilder: FormBuilder, private router: Router, private svc: UserService) {}
  ngOnInit(): void {
    this.updateForm = this.formBuilder.group({
      firstName: new FormControl('', [
        Validators.required,
      ]),
      lastName: new FormControl('', [
        Validators.required,
      ]),
      customerType: new FormControl('BUYER', [
        Validators.required,
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.pattern('[0-9]{3}-[0-9]{3}-[0-9]{4}')),
      zipCode: new FormControl('', [Validators.pattern('[0-9]{5}')]),
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      verifyPassword: new FormControl(''),
    }, {validator: this.passwordMatch('password', 'verifyPassword')});
  }
  onSubmit() {
    this.svc.createUser(this.updateForm.value).then(actualUser => {
      if (actualUser.status === 200) {
        this.router.navigate([`profile`]);
      } else if (actualUser.status === 400) {
        this.status = actualUser.status;
      }
    });
  }
  passwordMatch(password: string, verifyPassword: string) {
    return (group: FormGroup) => {
      const input = group.controls[password];
      const confirmationInput = group.controls[verifyPassword];
      return confirmationInput.setErrors(
        input.value !== confirmationInput.value ? {notEquivalent: true} : null
      );
    };
  }
}
