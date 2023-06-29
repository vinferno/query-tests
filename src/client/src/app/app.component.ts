import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';
  public categories$: Observable<any>
  constructor(private http: HttpClient) {
    this.categories$ = this.http.get<any>('http://localhost:3501/categories')
  }


}
