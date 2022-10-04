import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  @Output() tabClickedEvent = new EventEmitter<string>();

  activeTab!: string;
  constructor() { }

  ngOnInit(): void {
    this.activeTab = "listV"
    this.tabClickedEvent.emit("listV");
  }

  tabClicked(event: any){
    //console.log(event.target.id);
    this.tabClickedEvent.emit(event.target.id);
    for(var i = 0; i < event.target.parentNode.childNodes.length; i++){
      event.target.parentNode.childNodes[i].className = "tab"
    }
    event.target.className = "tab active"
  }
}
