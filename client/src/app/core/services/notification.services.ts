import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Notification} from "../../shared/models/notification";

@Injectable({
  providedIn: 'root'
})
export class NotificationServices {
  baseUrl = "https://localhost:5001";
  private http = inject(HttpClient);
  
  getNotifications():Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/notifications`);
  }
}
