import { AfterViewChecked, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { updateQuery } from 'src/app/store/filterstate/filter.actions';
import { selectQuery } from 'src/app/store/filterstate/filter.selector';
import { OfferService } from 'src/app/_services/offer.service';
import { liveSearch } from './livesearch.operator';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent {
  @Input() placement:string;
  @ViewChild('searchInput', { read: ElementRef }) searchInput!: ElementRef<HTMLInputElement>;

  private offerSubject = new Subject<string>();
  showResults = false;

  readonly offers$ = this.offerSubject.pipe(
    liveSearch(searchquery => this.offerservice.autocomplete(searchquery))
  );
  
  searchResults = [];

  constructor(private offerservice: OfferService, private eRef: ElementRef, private store: Store, private router: Router) {
    this.offers$.subscribe(res=>{
      console.log(res);
      this.searchResults = res
      this.showResults = true;
    })

  }
  // ngAfterViewChecked(): void {
  //   //this.store.select(selectQuery).subscribe(res=> this.searchInput.nativeElement.value =res);
  // }

  searchItems(event) {
    console.log("searchItems")
    var searchquery = event.target.value
    this.offerSubject.next(searchquery);
    this.showResults = true;
  }

  closeResults(query){
    console.log("closeResults")
    this.showResults = false
    this.searchInput.nativeElement.value = query;
    this.store.dispatch(updateQuery({query:query }));
    this.router.navigate(['/items']);
  }

  onEnter(event){
    console.log("onEnter")
    this.store.dispatch(updateQuery({query:event.target.value }));
    this.router.navigate(['/items']);
    this.showResults = false;
  }

  buttonClick($event){
    console.log("buttonClick")
    this.store.dispatch(updateQuery({query: this.searchInput.nativeElement.value }));
    this.router.navigate(['/items']);
    this.showResults = false;
  }

  keyUp() {
    console.log("keyUp")
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
