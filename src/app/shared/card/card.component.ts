import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() name!: string;
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
  constructor() { }

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
  }

}
