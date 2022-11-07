import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { OfferService } from '../_services/offer.service';

@Component({
  selector: 'app-offer-detail-page',
  templateUrl: './offer-detail-page.component.html',
  styleUrls: ['./offer-detail-page.component.scss']
})
export class OfferDetailPageComponent implements OnInit {
  offer: any;
  imageArr = [];
  activeImage: any = "";
  imageExpand: boolean = false;
  imageActiveIndex: number = 1;
  Latlan = [];
  location: string = "";
  contact: string = "";
  url: string = "";
  title: string = "";
  description:string = "";
  category_name:string = "";
  materials = [];
  submaterials = [];
  tags = [];
  likes: number;

  viewTimeOut = null;

  isFavorite: boolean = false;

  constructor(private offerservice: OfferService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    const paramsub = this.route.paramMap.subscribe(params => {
      //get activetab
      var id = params.get('id');
      this.offerservice.getOfferById(id).then((res: any)=> {
        //console.log(res);
        this.offer = res.data[0];

        this.title = this.offer.title;
        this.description = this.offer.description;
        this.category_name = this.offer.category.name
        this.likes = this.offer.total_likes;
        if(this.offer.images.length > 0){
          this.imageArr = this.offer.images
          this.activeImage = environment.apiUrl + this.offer.images[0].filename;
        }
        else{
          this.activeImage = "../../assets/default_image.png"
        }

        if(this.offer.materials.length > 0){
          this.materials = this.offer.materials
        }

        if(this.offer.submaterials.length > 0){
          this.submaterials = this.offer.submaterials
        }

        if(this.offer.tags.length > 0){
          this.tags = this.offer.tags
        }

        if(this.offer.location !== null){
          var street = "";
          var city = "";
          var country = "";

          if(this.offer.location.street !== null){
            street = this.offer.location.street + " ";
          }
          if(this.offer.location.city !== null){
            city = this.offer.location.city + ", ";
          }
          if(this.offer.location.country !== null){
            country = this.offer.location.country;
          }
          this.location = street + city + country;
          this.Latlan = [this.offer.location.lat,this.offer.location.lon];
        }

        this.offerservice.getUserFavorites().then((res: any) => {
          //console.log(res)
          res.data.forEach((element: any) => {
            //console.log(element.id, this.offer.id);
            if(element.id === this.offer.id){
              this.isFavorite = true;
              //console.log(this.isFavorite);
            }
          });
        });

        // Make a new timeout set to go off in 1000ms (1 second)
        this.viewTimeOut = setTimeout(() => {
          //console.log('item viewed');
          this.offerservice.incrementOfferViews(this.offer.id)
        }, 5000);

      })
    });
  }
  imageClicked(event: any){
    console.log(event);
    this.imageExpand = true;
  }
  closeImageClicked(){
    this.imageExpand = false;
  }
  changeActive(number: number){
    this.imageActiveIndex = this.imageActiveIndex + number;
    this.activeImage = environment.apiUrl +  this.imageArr[this.imageActiveIndex-1].filename;
  }

  imageSliderClickedEvent(event: any){
    this.imageActiveIndex = this.imageArr.findIndex((element) => element.id == event.id) + 1;
    this.activeImage = environment.apiUrl + event.filename;
  }

  likeClicked(){
    console.log('clicked' + this.offer.id);
    if(this.isFavorite == false){
      this.offerservice.addToFavorites(this.offer.id).then((res) => console.log(res));
      this.isFavorite = true;
      this.likes ++;
    }else if(this.isFavorite == true){
      this.offerservice.removerFromFavorites(this.offer.id).then((res) => console.log(res));
      this.isFavorite = false;
      this.likes --;
    }

  }
}
