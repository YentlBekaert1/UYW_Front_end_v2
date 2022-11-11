import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OfferService } from 'src/app/_services/offer.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.scss']
})
export class MyItemsComponent implements OnInit, AfterViewInit {
  @ViewChild('wrapper1', { read: ElementRef }) wrapper1!: ElementRef<HTMLInputElement>;
  @ViewChild('wrapper2', { read: ElementRef }) wrapper2!: ElementRef<HTMLInputElement>;

  userOffers: any = [];
  url = environment.apiUrl;

  isLoaded = false;

  constructor(private offerservice: OfferService) { }

  ngOnInit(): void {
    this.offerservice.getUserOffers().then((res: any) =>{
      this.userOffers = res.data;
      this.isLoaded = true;
    });
  }

  ngAfterViewInit(): void {
    console.log(this.wrapper1);
    var wrap1 = this.wrapper1.nativeElement;
    var wrap2 = this.wrapper2.nativeElement;
    this.wrapper1.nativeElement.onscroll = function() {
      wrap2.scrollLeft = wrap1.scrollLeft;
    };
    this.wrapper2.nativeElement.onscroll = function() {
      wrap1.scrollLeft = wrap2.scrollLeft;
    };
  }

  showActions(event){
    document.querySelectorAll('ul').forEach(element => {
      element.classList.remove('show');
    });
    if(event.target.nextSibling !== null){
      event.target.nextSibling.classList.toggle('show');
    }
  }

}
