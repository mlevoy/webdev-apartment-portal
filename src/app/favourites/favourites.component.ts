import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PropertyServiceClient} from '../services/property-service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['../search-page/search-page.component.css'],
})
export class FavouritesComponent implements OnInit, OnChanges {

  constructor(private propertyService: PropertyServiceClient) {
  }

  @Input() public favouriteProperties: [];
  propertyDetails = [] as any;
  req = null;
  loadFlag = false;
  @Output() clickevent = new EventEmitter<string>();
  @Output() favEvent = new EventEmitter<string>();

  async loadData() {
    this.propertyDetails = [];
    for (const propId of this.favouriteProperties) {
      this.req = this.propertyService.findPropertyById(propId);
      await this.req.then((response) => {
        if (!this.propertyDetails.includes(propId)) {
          this.propertyDetails.push(response);
        }
      });

    }
  }

  onMoreInfo(propId) {
    this.clickevent.next(propId);
  }

  onFavourite(propId) {
    this.favEvent.next(propId);
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

    this.loadData().then(res => this.loadFlag = true);
  }

}
