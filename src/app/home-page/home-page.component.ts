import { Component, Input, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  @ViewChild('canvas') private canvasRef!: ElementRef;
  @ViewChild('topintro') private topintro!: ElementRef;
  @ViewChild('zoekform') private zoekform!: ElementRef;
  @ViewChild('earthdrawing') private earthdrawing!: ElementRef;
  public ctx!: any;

  category_info_visible: Boolean = false;
  active_category_info:  {key: number, name: string, description: string, image: string};

  categories_array: {key: number, name: string, description: string, image: string}[] = [
    { key: 1, name:"Afval", description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words', image:"../../assets/category-logos/afval.svg"},
    { key: 2, name:"Inspiratie", description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words', image:"../../assets/category-logos/inspiratie.svg"},
    { key: 3, name:"Persoon", description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words',image:"../../assets/category-logos/mens.svg"},
    { key: 4, name:"Organisatie", description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words',image:"../../assets/category-logos/organisatie.svg"},
    { key: 5, name:"Technologie",description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words', image:"../../assets/category-logos/technologie.svg"},
  ];


  constructor(private auth: AuthService, private router: Router) {
    this.active_category_info = this.categories_array[0];
  }

  ngOnInit(): void {

  }

  infoCategoryClicked(evkey: any){
    this.active_category_info = this.categories_array.find(element => element.key == evkey);
    this.category_info_visible = true;
    console.log(this.active_category_info);
  }
  closeInfoCategoryClicked(event){
    this.category_info_visible = false;
  }
  zoekformClicked(){
    console.log('click')
    this.router.navigate(['/items/all']);
  }


  ngAfterViewInit(): void {
    //this.ctx = this.canvasRef.nativeElement.getContext('2d');
    //this.draw();
  }

  //   draw() {
  //     var canvas_width: number;
  //     var canvas_height: number;
  //     const eart_img  = new Image();
  //     const cat1_img  = new Image();
  //     const cat2_img  = new Image();
  //     const cat3_img  = new Image();
  //     const cat4_img  = new Image();
  //     const cat5_img  = new Image();

  //     eart_img.src = '../../assets/aardbol3.svg';
  //     cat1_img.src = '../../assets/logo1.svg';

  //     var eart_img_size: number;
  //     var category_img_size: number;

  //     console.log(window.innerHeight - 120 - this.topintro.nativeElement.clientHeight,
  //       window.innerHeight,
  //       this.topintro.nativeElement.clientHeight,
  //       this.zoekform.nativeElement.clientHeight);

  //     if(window.innerWidth > 1340){
  //       canvas_width = this.earthdrawing.nativeElement.clientWidth;
  //       canvas_height =  window.innerHeight - 120
  //       eart_img_size = 550
  //       category_img_size = 100
  //     }
  //     else if(window.innerWidth < 1340 && window.innerWidth > 1010){
  //       canvas_width = this.earthdrawing.nativeElement.clientWidth;
  //       canvas_height =  window.innerHeight - 120 - this.topintro.nativeElement.clientHeight
  //       eart_img_size = 400
  //     }
  //     else if(window.innerWidth < 1010 && window.innerWidth > 680){
  //       canvas_width = window.innerWidth - 20
  //       canvas_height =  window.innerHeight - 120 - this.topintro.nativeElement.clientHeight - this.zoekform.nativeElement.clientHeight
  //       eart_img_size = 350
  //     }
  //     else{
  //       canvas_height =  window.innerHeight - 120 - this.topintro.nativeElement.clientHeight - this.zoekform.nativeElement.clientHeight
  //       canvas_width =  window.innerWidth - 20;
  //       eart_img_size = 300
  //     }

  //     this.canvasRef.nativeElement.height = canvas_height;
  //     this.canvasRef.nativeElement.width = canvas_width;

  //     this.ctx.globalCompositeOperation = 'destination-over';
  //     this.ctx.clearRect(0, 0, canvas_width, canvas_height); // clear canvas

  //     this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  //     this.ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
  //     this.ctx.save();

  //     //this. ctx.fillRect(0, 0, canvas_width, canvas_height);

  //     eart_img.onload = () => {
  //       this.ctx.drawImage(eart_img, canvas_width/10, canvas_height/6, eart_img_size*1.35, eart_img_size);
  //       //this.ctx.drawImage(cat1_img, canvas_width/4, canvas_height/4, category_img_size, category_img_size);
  //     }
  // }

  // @HostListener("window:resize", ["$event"])
  // onResize(event: any) {
  //   console.log(window.innerHeight - 120 - this.topintro.nativeElement.clientHeight - this.zoekform.nativeElement.clientHeight,this.topintro.nativeElement.clientHeight, this.zoekform.nativeElement.clientHeight);
  //   this.draw();
  // }

}
