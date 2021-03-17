import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../services/user.service';
import {PropertyServiceClient} from '../services/property-service';

@Component({
  selector: 'app-contact-seller',
  templateUrl: './contact-seller.component.html',
  styleUrls: ['./contact-seller.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ContactSellerComponent implements OnInit {


  constructor(public activeModal: NgbActiveModal,
              public userService: UserService,
              public propertyService: PropertyServiceClient) {
  }

  @Input() public user;
  @Input() public address;
  @Input() public seller;
  @Output() clickevent = new EventEmitter<string>();


  sendMailObject = {
    mailTo: '',
    mailSubject: '',
    mailContent: '',
    mailFrom: '',
  };


  ngOnInit(): void {
    this.sendMailObject.mailSubject = 'Enquiry of property ' + this.address;
    this.sendMailObject.mailContent = 'I am interested in ' + this.address;
    this.userService.findProfileById(this.seller).then(userresponse => {
      this.sendMailObject.mailTo = userresponse.email;
      this.sendMailObject.mailFrom = this.user.email;

    });


  }

  onContactSeller() {
    this.propertyService.contactSeller(this.sendMailObject).then(response => {
      if (response.status === 200) {
        alert('Mail sent');
        this.clickevent.emit('CLOSE');
      } else {
        alert('Mail not send');
      }
    });


  }

}
