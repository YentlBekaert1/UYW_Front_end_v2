import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { selectisLoggedIn } from '../store/authstate/auth.selector';
import { Category } from '../store/categorystate/category.model';
import { selectCategories } from '../store/categorystate/category.selector';
import { selectedLang } from '../store/languagestate/lang.selector';
import { OfferService } from '../_services/offer.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-offer-detail-page',
  templateUrl: './offer-detail-page.component.html',
  styleUrls: ['./offer-detail-page.component.scss']
})
export class OfferDetailPageComponent implements AfterViewInit {
  @ViewChild('descriptionEl', { read: ElementRef }) descriptionEl!: ElementRef<HTMLInputElement>;

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
  description: any;
  category_name:string = "";
  materials = [];
  submaterials = [];
  tags = [];
  likes: number;
  linked_items: any;

  viewTimeOut = null;

  isFavorite: boolean = false;

  isLoaded: boolean = false;

  isLoggedIn$ = this.store.select(selectisLoggedIn);
  isLoggedIn: Boolean = false;

  lang$ = this.store.select(selectedLang);
  lang: string;

  constructor(private offerservice: OfferService, private route: ActivatedRoute, private store: Store, private toastService: HotToastService) {
    this.lang$.subscribe(res => {
      this.lang =  res
      console.log(res)
      if(this.lang == "nl"){
        this.category_name = this.offer.category.name_nl
        if(this.offer.title_nl){
          this.title = this.offer.title_nl;
        }
        else{
          this.title = this.offer.title;
        }
        if(this.offer.description_nl){
          this.description = this.offer.description_nl;
        }
        else{
          this.description = this.offer.description;
        }
      }
      else if(this.lang == "fr"){
        this.category_name = this.offer.category.name_fr
        if(this.offer.title_fr){
          this.title = this.offer.title_fr;
        }
        else{
          this.title = this.offer.title;
        }
        if(this.offer.description_fr){
          this.description = this.offer.description_fr;
        }
        else{
          this.description = this.offer.description;
        }
      }
      else if(this.lang == "en"){
        this.category_name = this.offer.category.name_en
        if(this.offer.title_en){
          this.title = this.offer.title_en;
        }
        else{
          this.title = this.offer.title;
        }
        if(this.offer.description_en){
          this.description = this.offer.description_en;
        }
        else{
          this.description = this.offer.description;
        }
      }
      else{
        this.category_name = this.offer.category.name_en
        if(this.offer.title_en){
          this.title = this.offer.title_en;
        }
        else{
          this.title = this.offer.title;
        }
        if(this.offer.description_en){
          this.description = this.offer.description_en;
        }
        else{
          this.description = this.offer.description;
        }
      }
    });
   }

  // ngAfterViewChecked(): void {
  //   if(this.descriptionEl !== undefined && this.descriptionEl.nativeElement.innerHTML == ""){
  //       this.descriptionEl.nativeElement.innerHTML = this.description;
  //   }
  // }


  ngAfterViewInit(): void {
    this.isLoggedIn$.subscribe(res => this.isLoggedIn = res);

    const paramsub = this.route.paramMap.subscribe(params => {
      this.offer = null;
      this.imageArr = [];
      this.activeImage = "";
      this.imageExpand = false;
      this.imageActiveIndex = 1;
      this.Latlan = [];
      this.location = "";
      this.contact = "";
      this.url = "";
      this.title = "";
      this.description = null;
      this.category_name = "";
      this.materials = [];
      this.submaterials = [];
      this.tags = [];
      this.likes = 0;
      this.linked_items = null;
      this.isLoaded = false;
      //get activetab
      var id = params.get('id');
      this.offerservice.getOfferById(id).then((res: any)=> {
        console.log(res);
        this.offer = res.data[0];


        if(this.lang == "nl"){
          this.category_name = this.offer.category.name_nl
          if(this.offer.title_nl){
            this.title = this.offer.title_nl;
          }
          else{
            this.title = this.offer.title;
          }
          if(this.offer.description_nl){
            this.description = this.offer.description_nl;
          }
          else{
            this.description = this.offer.description;
          }
        }
        else if(this.lang == "fr"){
          this.category_name = this.offer.category.name_fr
          if(this.offer.title_fr){
            this.title = this.offer.title_fr;
          }
          else{
            this.title = this.offer.title;
          }
          if(this.offer.description_fr){
            this.description = this.offer.description_fr;
          }
          else{
            this.description = this.offer.description;
          }
        }
        else if(this.lang == "en"){
          this.category_name = this.offer.category.name_en
          if(this.offer.title_en){
            this.title = this.offer.title_en;
          }
          else{
            this.title = this.offer.title;
          }
          if(this.offer.description_en){
            this.description = this.offer.description_en;
          }
          else{
            this.description = this.offer.description;
          }
        }
        else{
          this.category_name = this.offer.category.name_en
          if(this.offer.title_en){
            this.title = this.offer.title_en;
          }
          else{
            this.title = this.offer.title;
          }
          if(this.offer.description_en){
            this.description = this.offer.description_en;
          }
          else{
            this.description = this.offer.description;
          }
        }
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

        if(this.offer.contact != "" ){
          this.contact = this.offer.contact;
        }

        if(this.offer.url != "" ){
          this.url = this.offer.url;
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
        console.log(this.offer.linked_offers);
        if(this.offer.linked_offers.length > 0){
          this.linked_items = this.offer.linked_offers
        }
        console.log(this.linked_items)

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

        this.isLoaded = true;
        // Make a new timeout set to go off in 1000ms (1 second)
        this.viewTimeOut = setTimeout(() => {
          //console.log('item viewed');
          this.offerservice.incrementOfferViews(this.offer.id);
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
    if(this.isLoggedIn == true){
      if(this.isFavorite == false){
        this.offerservice.addToFavorites(this.offer.id)
        .then((res) =>
          this.toastService.success("Succesfull", {
            position: 'top-right',
            style: {
              border: '2px solid #33b188',
              padding: '16px',
              color: '#33b188',
              background: '#fff'
            },
            iconTheme: {
              primary: '#33b188',
              secondary: '#fff',
            },
          })
        )
        .catch(()=>
          this.toastService.error("You have tobe logged in to add an item to your favorites", {
            position: 'top-right',
            style: {
              border: '2px solid #EF4444',
              padding: '16px',
              color: '#EF4444',
              background: '#fff'
            },
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          })
        );
        this.isFavorite = true;
        this.likes ++;
      }else if(this.isFavorite == true){
        this.offerservice.removerFromFavorites(this.offer.id)
        .then((res) =>
        this.toastService.success("Succesfull", {
          position: 'top-right',
          style: {
            border: '2px solid #33b188',
            padding: '16px',
            color: '#33b188',
            background: '#fff'
          },
          iconTheme: {
            primary: '#33b188',
            secondary: '#fff',
          },
        })
      )
      .catch(()=>
        this.toastService.error("You have to be logged in to add an item to your favorites", {
          position: 'top-right',
          style: {
            border: '2px solid #EF4444',
            padding: '16px',
            color: '#EF4444',
            background: '#fff'
          },
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
        }))
        this.isFavorite = false;
        this.likes --;
      }
    }
    else{
      this.toastService.error("You have to be logged in to add an item to your favorites", {
        position: 'top-right',
        style: {
          border: '2px solid #EF4444',
          padding: '16px',
          color: '#EF4444',
          background: '#fff'
        },
        iconTheme: {
          primary: '#EF4444',
          secondary: '#fff',
        },
      })
    }

  }
}
