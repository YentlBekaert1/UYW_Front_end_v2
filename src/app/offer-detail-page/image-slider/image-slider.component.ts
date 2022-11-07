import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss']
})
export class ImageSliderComponent implements OnInit {
  @Input() arr: any[];
  @Input() activeImage: string;

  @Output() imageClickedEvent = new EventEmitter();
  //arr: any[] = ["../../assets/default_image.png", "../../assets/default_image.png", "../../assets/default_image.png", "../../assets/default_image.png", "../../assets/default_image.png", "../../assets/default_image.png", "../../assets/default_image.png", "../../assets/default_image.png", "../../assets/default_image.png"];
  totalImages: number;
  currentPage: number = 1;
  pagePosition: string = "0%";
  imagesPerPage: number;
  totalPages: number;
  overflowWidth: string;
  imageWidth: string;
  containerWidth: number;

  @ViewChild("container", { static: true, read: ElementRef }) container: ElementRef;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['arr']){
      if(changes['arr'].currentValue != undefined){
        this.totalImages = this.arr.length;
        this.imagesPerPage = this.getImagesPerPage();
        this.initializeSlider();
      }
    }
  }

  initializeSlider() {
    this.totalPages = Math.ceil(this.totalImages / this.imagesPerPage);
    this.overflowWidth = `calc(${this.totalPages * 100}% + ${this.totalPages *
      10}px)`;
    this.imageWidth = `calc((${100 / this.totalPages}% - ${this.imagesPerPage *
      10}px) / ${this.imagesPerPage})`;
  }

  getImagesPerPage() {
    return Math.floor(this.container.nativeElement.offsetWidth / 150);
  }


  changePage(incrementor) {
    this.currentPage += incrementor;
    this.populatePagePosition();
  }

  populatePagePosition() {
    this.pagePosition = `calc(${-100 * (this.currentPage - 1)}% - ${10 *
      (this.currentPage - 1)}px)`;
  }
  imageClicked(img: any){
    this.imageClickedEvent.emit(img);
  }

}
