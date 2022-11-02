import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {
  @Input() listdata: any;
  @Output() clickOnLinkEvent = new EventEmitter<string>();
  linkData: any = [];
  constructor() { }

  ngOnInit(): void {
    //console.log(this.linkData);
  }

  linkClicked(url: string){
    //console.log(url);
    this.clickOnLinkEvent.emit(url);
  }
   //als er een verandering gebeurt van een Input()
   ngOnChanges(changes: SimpleChanges) {
    if(changes['listdata']){
      //console.log(changes['listdata'].currentValue);
      this.linkData = changes['listdata'].currentValue.meta.links
    }
  }
}
