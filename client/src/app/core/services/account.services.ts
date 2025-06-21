import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { Account } from '../../shared/models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountServices {
  baseUrl = "https://localhost:5001";
  private http = inject(HttpClient);

  getUsers():Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/users`);
  }
}
