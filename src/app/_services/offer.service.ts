import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(private http: HttpClient) { }

  addOffer(formData: any){
    console.log(formData);
    console.log(formData.images)
    const requesturl = environment.apiUrl + 'api/offers';
    const httpOptions = {
      headers: new HttpHeaders({'Accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    var arr = []
    var body = new FormData();

    if(formData.images){
      Array.from(formData.images).forEach((file: Blob, i) => {
        body.append('images['+i+']', file);
       });
    }
    // formData.images.forEach((item, i) => {
    //   body.append('images['+i+']', item);
    // })

    body.append('title', formData.title);
    body.append('description', formData.description);
    body.append('category', '21');
    body.append('approach', '4');
  //  const body = {
  //      title: 'test angular 1',
  //      description: ['dfsfdf'],
  //      category: '21',
  //      approach:'4'
  //   };

    console.log(body);
    //this.http.post(requesturl, FormData, httpOptions);
    return this.http.post(requesturl, body, httpOptions);

  }
}
