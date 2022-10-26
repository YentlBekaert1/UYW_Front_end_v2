import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {

  @ViewChild('tabs', { read: ElementRef }) tabs!: ElementRef<HTMLInputElement>;
  active_tab: {key: number, value: string};

  tab_array: {key: number, value: string}[] = [
    { key: 1, value:"Mijn gegevens"},
    { key: 2, value:"Mijn Favorieten"},
    { key: 3, value:"Instellingen"},
    { key: 4, value:"Log Uit"},
  ];

  constructor(private auth: AuthService) {
    this.active_tab = this.tab_array[0];
  }

  ngOnInit(): void {
  }

  navCLicked(number: number){
    this.active_tab
    const found = this.tab_array.find(element => element.key === number);
    this.active_tab = found!;
    this.setTabActive(number)
  }

  setTabActive(tab_number: number){
    for(var i = 0; i < this.tabs.nativeElement.children.length; i++){
      this.tabs.nativeElement.children[i].classList.remove('active');
    }
    this.tabs.nativeElement.children[tab_number-1].classList.add('active');
  }

  logOut($event: any): void {
    $event.stopPropagation();

    this.auth.csrf().subscribe({
      next: data => {
        this.auth.logout()
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
