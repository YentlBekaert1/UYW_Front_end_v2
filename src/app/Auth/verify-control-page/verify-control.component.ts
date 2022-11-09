import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-verify-control',
  templateUrl: './verify-control.component.html',
  styleUrls: ['./verify-control.component.scss']
})
export class VerifyControlComponent implements OnInit {

  constructor(private route:ActivatedRoute, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    const paramsub = this.route.paramMap.subscribe(params => {
      var url = params.get('url');
      if(url){
        this.auth.verfiyaccount(url).pipe(first()).subscribe({
          next: data => {
            this.router.navigate(['account','profile']);
          },
          error: err => {
            this.router.navigate(['forbidden']);
          }
        });
      }
    });
  }
}
