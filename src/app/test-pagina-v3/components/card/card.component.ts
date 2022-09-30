import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() name!: string;
  @Input() image!: string;
  @Input() category!: string;
  @Input() date!: string;
  @Input() material!: string;
  @Output() likeButtonClicked = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
