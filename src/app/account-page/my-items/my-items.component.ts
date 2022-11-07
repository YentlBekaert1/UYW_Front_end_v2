import { Component, OnInit } from '@angular/core';
import { OfferService } from 'src/app/_services/offer.service';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.scss']
})
export class MyItemsComponent implements OnInit {
  userOffers: any = [];

  constructor(private offerservice: OfferService) { }

  ngOnInit(): void {
    this.offerservice.getUserOffers().then((res: any) => this.userOffers = res.data)
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
