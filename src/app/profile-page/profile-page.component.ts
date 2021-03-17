import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})


export class ProfilePageComponent implements OnInit {
  profileData = {id: '', password: '', userName: '', firstName: '', lastName: '', email: '', phone: '', zipCode: '', customerType: ''};
  updateForm: FormGroup;
  editing = false;
  isLandlord = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private svc: UserService, private location: Location) {}
   ngOnInit(): void {
      this.updateForm = this.formBuilder.group({
        id: new FormControl(''),
        userName: new FormControl(''),
        firstName: new FormControl('', [
          Validators.required,
        ]),
        lastName: new FormControl('', [
          Validators.required,
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        phone: new FormControl('', Validators.pattern('[0-9]{3}-[0-9]{3}-[0-9]{4}')),
        zipCode: new FormControl('', [Validators.pattern('[0-9]{5}')]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)])});
      this.svc.getUser().then(user => {
      if (user.status === 200) {
        this.profileData = user.body;
      } else {
        return;
      }}).then(e => {
        this.update();
        this.addPostingOption();
      });
  }
  onEdit() {
    this.editing = true;
  }
  update() {
    this.updateForm.patchValue({
        id: this.profileData.id,
        userName: this.profileData.userName,
        firstName: this.profileData.firstName,
        lastName: this.profileData.lastName,
        email: this.profileData.email,
        phone: this.profileData.phone,
        password: this.profileData.password,
        zipCode: this.profileData.zipCode
      }
    );
  }
   onSubmit() {
    this.svc.updateUser(this.updateForm.value).then(response => {
      this.profileData = response.body;
    });
    this.editing = false;
  }

  backClick() {
    this.location.back();
  }

  addPostingOption() {
    if (this.profileData.customerType === 'LANDLORD') {
      this.isLandlord = true;
    }
  }

  clickCancel() {
    this.editing = false;
  }

  onLogout() {
    this.svc.logout().then(e => location.reload());
  }
  onDelete() {
    this.svc.deleteUser(this.profileData.userName).then(e => this.onLogout());
  }
}
