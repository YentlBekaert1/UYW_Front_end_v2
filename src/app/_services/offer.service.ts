import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(private http: HttpClient) { }

  getOffers(url: string, pagesize:number, materialFilter:number, locationFilter: string, categories: string){
    var mat = materialFilter.toString();
    if(materialFilter == 0){
      mat = ""
    }
    const requesturl = url +'&page_size=' + pagesize + '&materials=' + mat + '&location=' + locationFilter +'&categories=' + categories;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true,
    };
    return lastValueFrom(
      this.http.get(requesturl, httpOptions)
    );

  }

  getOfferById(id: string){

    const requesturl = environment.apiUrl + "api/offers/" + id;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true,
    };
    return lastValueFrom(
      this.http.get(requesturl, httpOptions)
    );

  }

  addOffer(formData: any){

    const requesturl = environment.apiUrl + 'api/offers';
    const httpOptions = {
      headers: new HttpHeaders({'Accept': 'application/json', }),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };

    //create formdata
    var body = new FormData();

    if(formData.images){
      console.log(formData.images)
      Array.from(formData.images).forEach((file: Blob, i) => {
        console.log('images['+i+']',file)
        body.append('images['+i+']', file);
       });
    }

    body.append('title', formData.title);
    body.append('description', formData.description);
    if(formData.selectedmaterials){
      body.append('materials', JSON.stringify(formData.selectedmaterials));
    }
    if(formData.selectedsubmaterials){
      body.append('submaterials', JSON.stringify(formData.selectedsubmaterials));
    }
    if(formData.selectedtags){
      body.append('tags', JSON.stringify(formData.selectedtags));
    }
    if(formData.new_tags){
      body.append('newtags', JSON.stringify(formData.new_tags));
    }
    if(formData.contact){
      body.append('contact', formData.contact);
    }
    if(formData.url){
      body.append('url', formData.url);
    }
    if(formData.lat !== 0 && formData.lon !== 0){
      body.append('lat', formData.lat);
      body.append('lon', formData.lon);
      body.append('street', formData.street_number);
      body.append('city', formData.city);
      body.append('country', formData.country);
    }

    body.append('category', formData.category_id);
    body.append('approach', '1');

    console.log(body);
//this.http.post(requesturl, body, httpOptions);
    return this.http.post(requesturl, body, httpOptions);

  }

  editOffer(formData: any, id: number){

    const requesturl = environment.apiUrl + 'api/offers/' + id + '?_method=PATCH';
    const httpOptions = {
      headers: new HttpHeaders({'Accept': 'application/json'}),
      withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
    };
    console.log(formData);
    //create formdata
    var body = new FormData();

    if(formData.images){
      console.log(formData.images)
      Array.from(formData.images).forEach((file: Blob, i) => {
        console.log('newimages['+i+']',file)
        body.append('newimages['+i+']', file);
       });
    }
    if(formData.editimages){
      console.log(formData.editimages)
      body.append('editimages', JSON.stringify(formData.editimages));

    }

    body.append('title', formData.title);
    body.append('description', formData.description);
    if(formData.selectedmaterials){
      body.append('materials', JSON.stringify(formData.selectedmaterials));
    }
    if(formData.selectedsubmaterials){
      body.append('submaterials', JSON.stringify(formData.selectedsubmaterials));
    }
    if(formData.selectedtags){
      body.append('tags', JSON.stringify(formData.selectedtags));
    }
    if(formData.new_tags){
      body.append('newtags', JSON.stringify(formData.new_tags));
    }
    if(formData.contact){
      body.append('contact', formData.contact);
    }
    if(formData.url){
      body.append('url', formData.url);
    }
    if(formData.lat !== 0 && formData.lon !== 0){
      body.append('lat', formData.lat);
      body.append('lon', formData.lon);
      body.append('street', formData.street_number);
      body.append('city', formData.city);
      body.append('country', formData.country);
    }

    body.append('category', formData.category_id);
    body.append('approach', '1');

    //console.log(body);

    return this.http.post(requesturl, body, httpOptions);

  }

  getMaterials(){

    const requesturl = environment.apiUrl + 'api/materials';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true,
    };

    return lastValueFrom(
      this.http.get(requesturl, httpOptions)
    );

  }

  getSubMaterials(id: number){

    const requesturl = environment.apiUrl + 'api/materialsubmaterials/' + id;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true,
    };

    return lastValueFrom(
      this.http.get(requesturl, httpOptions)
    );

  }

  addToFavorites(id: any){
    const requesturl = environment.apiUrl + 'api/offers_add_to_favorites/' + id;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true,
    };

    return lastValueFrom(
      this.http.get(requesturl, httpOptions)
    );
  }

  removerFromFavorites(id: any){
    const requesturl = environment.apiUrl + 'api/offers_remove_from_favorites/' + id;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true,
    };

    return lastValueFrom(
      this.http.get(requesturl, httpOptions)
    );
  }

  incrementOfferViews(id: any){
    const requesturl = environment.apiUrl + 'api/offersincrementviews/' + id;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true,
    };

    return lastValueFrom(
      this.http.get(requesturl, httpOptions)
    );
  }

  //functie om de offers die de gebruiker heeft toegevoegd aan zijn favoriten op te vragen
  getUserFavorites(){
      const requesturl = environment.apiUrl + 'api/userfavorites';
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
        withCredentials: true,
      };

      return lastValueFrom(
        this.http.get(requesturl, httpOptions)
      );
   }

  getUserOffers(){
    const requesturl = environment.apiUrl + 'api/useroffers';
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true,
    };

    return lastValueFrom(
      this.http.get(requesturl, httpOptions)
    );
  }
}
