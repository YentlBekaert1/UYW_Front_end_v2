import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectedLang } from 'src/app/store/languagestate/lang.selector';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
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
  @Output() likeButtonClicked = new EventEmitter();

  image: any;
  materials: any
  locatie_string: string;
  env_url: string = environment.apiUrl;

  title:any;

  lang$ = this.store.select(selectedLang);
  lang: string;

  constructor(private store: Store) {
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
      this.materials = matArray.toString();
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
      }
      else if(this.lang == "fr"){
        if(this.name_fr){
          this.title = this.name_fr;
        }
        else{
          this.title = this.name;
        }
      }
      else if(this.lang == "en"){
        if(this.name_en){
          this.title = this.name_en;
        }
        else{
          this.title = this.name;
        }
      }
      else{
        if(this.name_en){
          this.title = this.name_en;
        }
        else{
          this.title = this.name;
        }
      }
    });
  }

}
