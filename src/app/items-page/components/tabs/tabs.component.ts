import { Component, OnInit, Output, EventEmitter, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterViewInit {
  @ViewChild('tabs', { read: ElementRef }) tabs!: ElementRef<HTMLInputElement>;
  @Output() tabClickedEvent = new EventEmitter<string>();
  @Input() activeTab: string;

  category: string = 'all';

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngAfterViewInit(): void {
    const paramsub = this.route.paramMap.subscribe(params => {
      var tab = params.get('tab');
      this.category = params.get('category');
      //console.log(tab)
      if(tab === 'list'){
        this.setTabActive(1);
      }
      else if(tab === 'map'){
        this.setTabActive(2);
      }
      else if(tab === 'combi'){
        this.setTabActive(3);
      }
    });
  }

  setTabActive(tab_number: number){
    //console.log(tab_number, this.tabs)
    for(var i = 0; i < this.tabs.nativeElement.children.length; i++){
      this.tabs.nativeElement.children[i].classList.remove('active');
    }
    this.tabs.nativeElement.children[tab_number-1].classList.add('active');
  }

  tabClicked(event: any){
    this.setTabActive(event.target.id);
    if(event.target.id === '1'){
      this.router.navigate(['items', 'list', this.category]);
    }
    else if(event.target.id === '2'){
      this.router.navigate(['items', 'map', this.category]);
    }
    else if(event.target.id === '3'){
      this.router.navigate(['items','combi', this.category]);
    }
  }
}
