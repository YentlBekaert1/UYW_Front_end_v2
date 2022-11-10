import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forbidden-page',
  templateUrl: './forbidden-page.component.html',
  styleUrls: ['./forbidden-page.component.scss']
})
export class ForbiddenPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  backToHome(){
    this.router.navigate(['home'])
  }
}
