import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, lastValueFrom, of, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { changeCategories } from '../store/categorystate/category.actions';
import { Category } from '../store/categorystate/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private store: Store) { }

  getCategories(){
    const requesturl = environment.apiUrl + 'api/categories';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',  'Accept': 'application/json', }),
      withCredentials: true,
    };

    return lastValueFrom(
      this.http.get<any>(requesturl, httpOptions)
      .pipe(
        map((res) => {
          this.store.dispatch(changeCategories({categories: res.data}));
        })
      )
    );

  }
}
