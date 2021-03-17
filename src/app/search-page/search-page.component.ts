import {Component, OnInit} from '@angular/core';
import {LocationService} from '../services/location.service';
import {Property} from '../property';
import {USSTATES} from '../USStates';
import {UserService} from '../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {PropertyServiceClient} from '../services/property-service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {
  propertyList: Property[];
  displayList: Property[];
  zipCode: string;
  searchText: string;
  bedFilter = 0;
  bathFilter = 0;

  statesList = USSTATES;
  selectedState: string;

  cityList: string[];
  selectedCity: string;
  cityDisabled = true;

  neighbourhoodList;
  selectedNeighbourhood;
  neighbourhoodDisabled = true;

  userLoggedIn = false;
  pageLoad = false;
  userLoad = false;

  start = 0;
  end;

  user = {
    id: '',
    userName: '',
    firstName: '',
    favouriteProperties: [],
    customerType: ''
  };

  constructor(private propertyServiceClient: PropertyServiceClient,
              private locationService: LocationService,
              private service: UserService,
              private router: ActivatedRoute,
              private location: Location,
              private routerNav: Router) {
  }

  isPropertyPresent(propId) {
    return this.user.favouriteProperties.includes(propId);
  }

  onFavourite(propId) {
    if (this.userLoggedIn) {
      if (this.isPropertyPresent(propId)) {
        this.propertyServiceClient.unfavouriteProperty(this.user.userName, propId)
          .then(response => this.refreshUser());
      } else {
        this.propertyServiceClient.favouriteProperty(this.user.userName, propId).then(response =>
          this.refreshUser());
      }
    } else {
      alert('Login/Sign up for more details on property');
    }
  }

  refreshUser() {
    this.service.findProfileById(this.user.id).then(user => {
        this.user = user;
      }
    );
  }


  ngOnInit(): void {
    this.service.getUser().then(user => {
      if (user.status === 200) {
        this.user = user.body;
        this.userLoggedIn = true;
        this.service.findProfileById(this.user.id).then(userres => {
            this.user.favouriteProperties = userres.favouriteProperties;
            this.userLoad = true;

          }
        );
      }
    }).catch(err => {
      this.userLoggedIn = false;
      this.userLoad = true;

    });
    this.router.params.subscribe(params => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.locationService.getLocation(position.coords.latitude, position.coords.longitude)
            .then(response => {
              this.selectedState = params.selectedState ? params.selectedState : response.records[0].fields.state;
              this.locationService.getCities(this.selectedState)
                .then(res => {
                  this.cityList = res.facet_groups
                    .filter(facet => facet.name === 'city')[0].facets
                    .map(city => city.name);
                });
              this.selectedCity = params.selectedCity ? params.selectedCity : response.records[0].fields.city;
              this.locationService.getNeighbourhood(this.selectedState, this.selectedCity)
                .then(res1 => {
                  this.neighbourhoodList = res1.records.filter(neighbourhood => neighbourhood.fields.geo_point_2d).map(neighbourhood => {
                    return {
                      name: neighbourhood.fields.name,
                      latitude: neighbourhood.fields.geo_point_2d[0],
                      longitude: neighbourhood.fields.geo_point_2d[1]
                    };
                  });
                  this.selectedNeighbourhood = params.selectedNeighbourhood ?
                    params.selectedNeighbourhood : response.records[0].fields.name;
                  this.searchProperties();
                  this.location.go(`search/${this.selectedState}/${this.selectedCity}/${this.selectedNeighbourhood}`);
                });

            });
        });
        this.pageLoad = true;
      } else {
        this.pageLoad = true;
        alert('Location not supported');
      }
    });

  }

  logout = () =>
    this.service.logout()
      .then(status => window.location.reload());

  getPropertyList(zipCode: string, city: string) {
    this.propertyServiceClient.getListingFromLocal(zipCode, city)
      .then(listing => {
        this.propertyList = listing;
        this.filterList();
      });
  }

  searchProperties() {
    if (this.selectedNeighbourhood) {
      const neighbourhoodLocation = this.neighbourhoodList.filter(neighbourhood => neighbourhood.name === this.selectedNeighbourhood)[0];
      this.locationService.getZipCode(neighbourhoodLocation.latitude, neighbourhoodLocation.longitude)
        .then(geoLocations => {
          this.zipCode = geoLocations.records[0].fields.zip;
          this.getPropertyList(this.zipCode, this.selectedCity);
          this.clearFilter();
        });
      this.location.go(`search/${this.selectedState}/${this.selectedCity}/${this.selectedNeighbourhood}`);
    }
  }

  setBedFilter(numberOfBeds) {
    this.bedFilter = numberOfBeds;
    this.filterList();
  }

  setBathFilter(numberOfBaths) {
    this.bathFilter = numberOfBaths;
    this.filterList();
  }

  filterList() {
    if (!this.searchText && this.bedFilter === 0 && this.bathFilter === 0) {
      this.displayList = [...this.propertyList];
      this.start = 0;
      this.end = this.displayList.length > 8 ? 8 : this.displayList.length;
      return;
    }
    let filterList = [...this.propertyList];
    filterList = this.textFilter(filterList);
    filterList = this.numberOfBedFilter(filterList);
    filterList = this.numberOfBathFilter(filterList);
    this.displayList = filterList;
    this.start = 0;
    this.end = this.displayList.length > 8 ? 8 : this.displayList.length;
  }

  textFilter(filterList: Property[]) {
    if (this.searchText) {
      return filterList.filter(prop => prop.address.toLowerCase().includes(this.searchText.toLowerCase()) ||
        prop.locality.toLowerCase().includes(this.searchText.toLowerCase()));
    } else {
      return filterList;
    }
  }

  numberOfBedFilter(filterList: Property[]) {
    if (this.bedFilter.toString() === '5+') {
      return filterList.filter(prop => prop.bed >= 5);
    } else if (this.bedFilter > 0) {
      return filterList.filter(prop => prop.bed === this.bedFilter);
    } else {
      return filterList;
    }
  }

  numberOfBathFilter(filterList: Property[]) {
    if (this.bathFilter.toString() === '3+') {
      return filterList.filter(prop => prop.bath >= 3);
    } else if (this.bathFilter > 0) {
      return filterList.filter(prop => prop.bath === this.bathFilter);
    } else {
      return filterList;
    }
  }

  clearFilter() {
    this.searchText = '';
    this.bathFilter = 0;
    this.bedFilter = 0;
  }

  onStateChange() {
    this.selectedCity = '';
    this.selectedNeighbourhood = {name: ''};
    this.cityDisabled = false;
    this.neighbourhoodDisabled = true;
    this.locationService.getCities(this.selectedState)
      .then(response => {
        this.cityList = response.facet_groups
          .filter(facet => facet.name === 'city')[0].facets
          .map(city => city.name);
      });
  }

  onCityChanged() {
    this.selectedNeighbourhood = '';
    this.neighbourhoodDisabled = false;
    this.locationService.getNeighbourhood(this.selectedState, this.selectedCity)
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

  onMoreInfoClick(Id: string) {
    if (this.userLoggedIn) {
      this.routerNav.navigateByUrl(`/property/${Id}`);
    } else {
      alert('Login/Sign up for more details on property');
    }
  }

  onNext() {
    if (this.end < 99) {
      this.start = this.end;
      this.end = this.start + 8 < this.displayList.length ? this.start + 8 : this.displayList.length;
    }
  }

  onBack() {
    if (this.start > 0) {
      this.end = this.start;
      this.start = this.end - 8 > 0 ? this.end - 8 : 0;
    }
  }
}
