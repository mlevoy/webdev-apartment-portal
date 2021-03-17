import {Component, OnInit} from '@angular/core';
import {USSTATES} from '../USStates';
import {LocationService} from '../services/location.service';
import {PropertyServiceClient} from '../services/property-service';
import {Property} from '../property';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.css']
})
export class CreateListingComponent implements OnInit {

  constructor(private userService: UserService,
              private router: Router,
              private propertyService: PropertyServiceClient,
              private  locationService: LocationService,
              private formBuilder: FormBuilder) {
  }

  updateForm: FormGroup;
  addressLine1: string;
  addressLine2: string;
  states = USSTATES;
  cityList: string[];
  neighbourhoodList: string[];
  amenities: Array<{
    name: string;
    value: string;
    checked: boolean;
  }> = [];
  property: Property = {} as Property;


  user = {
    userName: '',
    firstName: '',
    favouriteProperties: [],
    customerType: ''
  };
  pageLoad = false;

  ngOnInit(): void {

    this.userService.getUser().then(user => {
      if (user.status === 200) {
        this.user = user.body;
        if (this.user.customerType !== 'LANDLORD') {
          this.router.navigate(['/']);
        }
      }
      this.pageLoad = true;
    });

    this.updateForm = this.formBuilder.group({
      addressLine1: new FormControl('', [
        Validators.required,
      ]),
      addressLine2: new FormControl(''),
      state: new FormControl('', [
        Validators.required,
      ]),
      city: new FormControl('', [
        Validators.required,
      ]),
      locality: new FormControl('', [
        Validators.required,
      ]),
      postal: new FormControl('', [
        Validators.required,
      ]),
      type: new FormControl('', [
        Validators.required,
      ]),
      builtYear: new FormControl('', [ Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      amount: new FormControl('',
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      bed: new FormControl('', [
        Validators.required,
      ]),
      bath: new FormControl('', [
        Validators.required,
      ]),
      size: new FormControl('',  [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      description: new FormControl('', [
        Validators.required,
      ]),
      dateAvailable: new FormControl('')


    });


    this.propertyService.getAmenities().then(amenities => {
      Object.keys(amenities).forEach((key) =>
        this.amenities.push({name: key, value: amenities[key], checked: false})
      );
    });

  }


  onSubmit() {

    if (this.updateForm.valid) {
      this.property.address = this.addressLine1 + ' ' + this.addressLine2;
      this.property.amenities = this.amenities.filter(amenity => amenity.checked !== false).map(amenity => amenity.value);
      this.property.seller = 'paruljindal';
      return fetch(`https://househuntersapi.herokuapp.com/api/properties`, {
        method: 'POST',
        body: JSON.stringify(this.property),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          alert('Property has been created successfully');
          this.router.navigate([`profile`]);
        }
      });

    } else {
    }
  }

  onStateChange() {
    this.locationService.getCities(this.property.state)
      .then(response => {
        this.cityList = response.facet_groups
          .filter(facet => facet.name === 'city')[0].facets
          .map(city => city.name);
      });
  }

  onCityChanged() {
    this.locationService.getNeighbourhood(this.property.state, this.property.city)
      .then(response => {
        this.neighbourhoodList = response.records.filter(neighbourhood => neighbourhood.fields.geo_point_2d).map(neighbourhood => {
          return {
            name: neighbourhood.fields.name,
            latitude: neighbourhood.fields.geo_point_2d[0],
            longitude: neighbourhood.fields.geo_point_2d[1]
          };
        });
      });
  }

}
