import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OfferService } from '../_services/offer.service';

@Component({
  selector: 'app-offer-detail-page',
  templateUrl: './offer-detail-page.component.html',
  styleUrls: ['./offer-detail-page.component.scss']
})
export class OfferDetailPageComponent implements OnInit {
  offer: any;

  constructor(private offerservice: OfferService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    const paramsub = this.route.paramMap.subscribe(params => {
      //get activetab
      var id = params.get('id');
      this.offerservice.getOfferById(id).then((res: any)=> {
        console.log(res);
        this.offer = res.data;
      })
    });
  }

}
