import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-display',
  templateUrl: './list-display.component.html',
  styleUrls: ['./list-display.component.scss']
})
export class ListDisplayComponent implements OnInit {
  @Input() listdata: any
  constructor() { }

  ngOnInit(): void {
    console.log(this.listdata);
  }

}
