import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Profile } from 'src/app/store/authstate/auth.model';
import { selectProfile } from 'src/app/store/authstate/auth.selector';
import { AuthState } from 'src/app/store/authstate/auth.state';
import { AuthService } from 'src/app/_services/auth.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  userData: Profile;
  registerForm: FormGroup;
  dashbaordData:any = { 'totalOffers':0,'totalLikes':0,'totalViews':0,'useroffers': []};
  cardLength = 3;
  multi: any[];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = false;
  showYAxisLabel: boolean = false;
  colorScheme: Color = {
    domain: ['#99CCE5', '#FF7F7F'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
};


  constructor(private authservice: AuthService, private fb: FormBuilder, private store: Store<AuthState>) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.authservice.getuserdashboarddata().then(res=>{
      this.dashbaordData = res
      var chartData = [];
      this.cardLength = this.dashbaordData.useroffers.length + 3;
      this.dashbaordData.useroffers.forEach(element => {
        chartData.push({
          "name": element.title,
          "series": [
            {
              "name": "Total Views",
              "value": element.total_views
            },
            {
              "name": "Total Likes",
              "value": element.total_likes
            }
          ]
        });
        this.multi = chartData;
      });

     }
    )
   }

  ngOnInit(): void {
    this.store.select(selectProfile).subscribe(data =>{
      console.log(data);
      this.userData = data;
    })
  }

  onSubmit(){
    console.log(this.registerForm.value);
    //functie werkt al maar moet nog zorgen dat de gebruiker melding krijgt dat er nieuwe verificatie mail is verstuurd.
    //this.store.dispatch(UpdateProfile(this.registerForm.value))
  }

}
