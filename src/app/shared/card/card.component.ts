import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Store } from '@ngrx/store';
import { selectisLoggedIn, selectProfile } from 'src/app/store/authstate/auth.selector';
import { selectedLang } from 'src/app/store/languagestate/lang.selector';
import { OfferService } from 'src/app/_services/offer.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit{
  @Input() name!: string;
  @Input() name_nl!: string;
  @Input() name_en!: string;
  @Input() name_fr!: string;
  @Input() images!: any;
  @Input() category!: any;
  @Input() locatie!: any;
  @Input() material!: any;
  @Input() id!: any;
  @Input() likes!: any;
  @Input() userFav!:any;
  @Input() view!: any
  @Input() total_views!: any;
  @Input() description!: any
  @Input() description_nl!:any;
  @Input() description_fr!:any;
  @Input() description_en!:any;
  @Output() likeButtonClicked = new EventEmitter();

  image: any;
  materials: any
  locatie_string: string;
  env_url: string = environment.apiUrl;

  title:any;
  displayed_description: any;

  lang$ = this.store.select(selectedLang);
  lang: string;

  isLikedbyUser:boolean = undefined;

  isLoggedIn$ = this.store.select(selectisLoggedIn);
  isLoggedIn: Boolean = false;

  constructor(private store: Store, private offerservice: OfferService,  private toastService: HotToastService, private router: Router) {
    this.isLoggedIn$.subscribe(res => this.isLoggedIn = res);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['userFav']){
      if(this.userFav){
        this.isLikedbyUser = this.userFav.find(el => el == this.id);
      }
    }
  }


  ngOnInit(): void {
    if(this.images){
      if(this.images.length > 0){
        this.image = this.images[0].filename
      }
    }
    if(this.material){
      var matArray = []
      this.material.forEach(mat => {
        matArray.push(mat.name);
      });
      this.materials = matArray.join(', ');
    }
    if(this.locatie){
      var city = "";
      var country = "";

      if(this.locatie.city !== null){
        city = this.locatie.city + ", ";
      }

      if(this.locatie.country !== null){
        country = this.locatie.country
      }
      this.locatie_string =  city + country
    }

    this.lang$.subscribe(res => {
      this.lang =  res
      if(this.lang == "nl"){
        if(this.name_nl){
          this.title = this.name_nl;
        }
        else{
          this.title = this.name;
        }
        if(this.description_nl){
          this.displayed_description = this.description_nl;
        }
        else{
          this.displayed_description = this.description;
        }
      }
      else if(this.lang == "fr"){
        if(this.name_fr){
          this.title = this.name_fr;
        }
        else{
          this.title = this.name;
        }
        if(this.description_fr){
          this.displayed_description = this.description_fr;
        }
        else{
          this.displayed_description = this.description;
        }
      }
      else if(this.lang == "en"){
        if(this.name_en){
          this.title = this.name_en;
        }
        else{
          this.title = this.name;
        }
        if(this.description_en){
          this.displayed_description = this.description_en;
        }
        else{
          this.displayed_description = this.description;
        }
      }
      else{
        if(this.name_en){
          this.title = this.name_en;
        }
        else{
          this.title = this.name;
        }
        if(this.description_en){
          this.displayed_description = this.description_en;
        }
        else{
          this.displayed_description = this.description;
        }
      }
      //dit is om de opmaak uit de beschrijving te verwijderen 
      var description_tags = document.querySelectorAll(".description font");
      description_tags.forEach((el: any) => {
        el.size = 2
        el.color ="";
        el.face="";
      })
    });
  }

  likeClicked(){
    console.log('clicked' + this.id);
    if(this.isLoggedIn == true){
      if(this.isLikedbyUser == undefined){
        this.offerservice.addToFavorites(this.id)
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
          })
        );
        this.isLikedbyUser = true;
        this.likes ++;
      }else if(this.isLikedbyUser != undefined){
        this.offerservice.removerFromFavorites(this.id)
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
        this.isLikedbyUser = undefined;
        this.likes --;
      }
    }
    else{
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
    }

  }

  linkClicked(id: number){
    window.scrollTo(0, 0);
    this.router.navigate(['/offerdetail', id]);
  }
}
