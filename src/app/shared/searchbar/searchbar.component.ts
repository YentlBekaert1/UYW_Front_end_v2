import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { updateQuery } from 'src/app/store/filterstate/filter.actions';
import { OfferService } from 'src/app/_services/offer.service';
import { liveSearch } from './livesearch.operator';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent {
  @ViewChild('searchInput', { read: ElementRef }) searchInput!: ElementRef<HTMLInputElement>;

  private offerSubject = new Subject<string>();
  showResults = false;
  readonly offers$ = this.offerSubject.pipe(
    liveSearch(searchquery => this.offerservice.autocomplete(searchquery))
  );

  constructor(private offerservice: OfferService, private eRef: ElementRef, private store: Store) {
    this.offers$.subscribe(res=>console.log(res))
  }

  searchItems(event) {
    var searchquery = event.target.value
    this.offerSubject.next(searchquery);
    this.showResults = true
  }

  closeResults(query){
    this.showResults = false
    this.searchInput.nativeElement.value = query;
    this.store.dispatch(updateQuery({query:query }))
  }

  onEnter(event){
    this.showResults = false
    this.store.dispatch(updateQuery({query:event.target.value }))
  }

  buttonClick($event){
    this.showResults = false
    this.store.dispatch(updateQuery({query: this.searchInput.nativeElement.value }))
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(this.eRef.nativeElement.contains(event.target)) {
    }
    else {
      this.showResults = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
      this.showResults = false;
  }
}
