import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { Cleanlog } from '../../shared/models/cleanlog';

@Injectable({
  providedIn: 'root'
})
export class CleanLogServices {
  baseUrl = "https://localhost:5001";
  private http = inject(HttpClient);

  getCleanLogs():Observable<Cleanlog[]> {
    return this.http.get<Cleanlog[]>(`${this.baseUrl}/clean-logs`);
  }
}
