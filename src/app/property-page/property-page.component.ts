import {Component, OnInit} from '@angular/core';
import {Property} from '../property';
import {PropertyServiceClient} from '../services/property-service';
import {UserService} from '../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ContactSellerComponent} from '../contact-seller/contact-seller.component';

@Component({
  selector: 'app-property-page',
  templateUrl: './property-page.component.html',
  styleUrls: ['./property-page.component.css']
})
export class PropertyPageComponent implements OnInit {

  constructor(private service: PropertyServiceClient,
              private userService: UserService,
              private route: ActivatedRoute,
              private modalService: NgbModal,
              private routeNav: Router) {
  }

  property: Property;
  isFavourite: boolean;
  propertyId: string;
  tabsList: string[] = ['Overview', 'Facts & Features', 'Amenities'];
  selectedTab = this.tabsList[0];
  user = {
    id: '',
    userName: '',
    firstName: '',
    lastName: '',
    favouriteProperties: [],
    customerType: '',
    phone: '',
    email: ''
  };
  userLoggedIn = false;

  sellerEmail = '';

  open() {
    const modalRef = this.modalService.open(ContactSellerComponent, {size: 'lg', backdropClass: 'light-green-backdrop'});
    modalRef.componentInstance.user = this.user;
    modalRef.componentInstance.address = this.property.address;
    modalRef.componentInstance.seller = this.property.seller;
    modalRef.componentInstance.clickevent.subscribe(($e) => {
      modalRef.close();
    });
  }

  refreshUser() {
    this.userService.findProfileById(this.user.id).then(user => {
        this.user = user;
        this.isFavourite = this.favouriteExists(this.propertyId);
      }
    );
  }

  onFavourite() {
    if (this.isFavourite) {
      this.service.unfavouriteProperty(this.user.userName, this.propertyId)
        .then(response => this.refreshUser());
    } else {
      this.service.favouriteProperty(this.user.userName, this.propertyId).then(response =>
        this.refreshUser());
    }
  }

  favouriteExists(propId) {
    return this.user.favouriteProperties.some((el) =>
      el === propId);
  }
  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.userService.getUser().then(user => {
        if (user.status === 200) {
          this.user = user.body;
          this.refreshUser();
          this.service.findPropertyById(params.pid)
            .then(prop => {
              this.propertyId = params.pid;
              this.property = prop;
              this.isFavourite = this.favouriteExists(this.propertyId);
            });
        } else {
          alert('User not logged in. Redirecting to Login page');
          this.routeNav.navigateByUrl('login');
        }
      }).catch(err => {
        alert('User not logged in. Redirecting to Login page');
        this.routeNav.navigateByUrl('login');
      });
    });
  }

}
