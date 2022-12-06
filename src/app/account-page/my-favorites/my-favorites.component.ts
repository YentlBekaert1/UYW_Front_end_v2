import { Component, OnInit } from '@angular/core';
import { OfferService } from 'src/app/_services/offer.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-favorites',
  templateUrl: './my-favorites.component.html',
  styleUrls: ['./my-favorites.component.scss']
})
export class MyFavoritesComponent implements OnInit {
  userFavorites: any = [];
  url = environment.apiUrl;
  isLoaded = false;

  displayedColumns: string[] = ['image', 'title', 'category','actions'];
  data: any = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;


  constructor(private offerservice: OfferService) { }

  ngOnInit(): void {
    this.offerservice.getUserFavorites().then((res: any) => {
      this.userFavorites = res.data;
      console.log( this.userFavorites);
      this.isLoaded = true;
    })
  }

}
