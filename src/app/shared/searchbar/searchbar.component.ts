import { AfterViewChecked, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { setinitialPageURL, updateQuery } from 'src/app/store/filterstate/filter.actions';
import { selectQuery } from 'src/app/store/filterstate/filter.selector';
import { OfferService } from 'src/app/_services/offer.service';
import { liveSearch } from './livesearch.operator';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit{
  @Input() placement:string;
  @ViewChild('searchInput', { read: ElementRef }) searchInput!: ElementRef<HTMLInputElement>;

  private offerSubject = new Subject<string>();
  showResults = false;

  readonly offers$ = this.offerSubject.pipe(
    liveSearch(searchquery => this.offerservice.autocomplete(searchquery))
  );

  searchResults = [];
  placeholderText: string = "Zoek op kernwoorden, locatie, materialen, ...."

  constructor(private offerservice: OfferService, private eRef: ElementRef, private store: Store, private router: Router) {
    this.offers$.subscribe(res=>{
      console.log(res);
      this.searchResults = res
      this.showResults = true;
    });


  }
  ngOnInit(): void {
    if(this.placement == 'top'){
      this.placeholderText = "Zoek in de database...";
    }else{
      this.placeholderText = "Zoek op kernwoorden, locatie, materialen, ....";
    }
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
    this.searchInput.nativeElement.blur();
    this.searchInput.nativeElement.value = "";
    this.searchInput.nativeElement.style.outline = "none"
    this.store.dispatch(updateQuery({query:query }));
    this.store.dispatch(setinitialPageURL());
    this.router.navigate(['/items']);
  }

  onEnter(event){
    console.log("onEnter");
    this.searchInput.nativeElement.blur();
    this.store.dispatch(updateQuery({query:event.target.value }));
    this.store.dispatch(setinitialPageURL());
    this.searchInput.nativeElement.value = "";
    this.router.navigate(['/items']);
    this.showResults = false;


  }

  buttonClick($event){
    console.log("buttonClick")
    this.searchInput.nativeElement.blur();
    this.store.dispatch(updateQuery({query: this.searchInput.nativeElement.value }));
    this.store.dispatch(setinitialPageURL());
    this.searchInput.nativeElement.value = "";
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
