import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Notification} from './shared/models/notification';
import {Cleanlog} from './shared/models/cleanlog';
import {Account} from './shared/models/account';
import {NotificationServices} from './core/services/notification.services';
import {CleanLogServices} from './core/services/clean-log.services';
import {AccountServices} from './core/services/account.services';
import {HttpClientModule} from '@angular/common/http';
import {MatIcon} from "@angular/material/icon";
import {DatePipe} from "@angular/common"; // <-- Añade esto

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, HttpClientModule, MatIcon,DatePipe],
    template: `
        <div class="app-container">
            <header class="app-header">
                <h1 class="app-title">CleanUp Dashboard</h1>
                <div class="user-stats">
                    <div class="stat-badge active">
                        <span class="stat-value">{{ activeCount }}</span>
                        <span class="stat-label">Active</span>
                    </div>
                    <div class="stat-badge inactive">
                        <span class="stat-value">{{ inactiveCount }}</span>
                        <span class="stat-label">Inactive</span>
                    </div>
                </div>
            </header>

            <main class="app-content">
                <section class="card notifications-card">
                    <div class="card-header">
                        <mat-icon class="card-icon">notifications</mat-icon>
                        <h2 class="card-title">Notifications</h2>
                        <span class="badge">{{ notifications.length }}</span>
                    </div>
                    <div class="card-content">
                        @for (n of notifications; track n.id) {
                            <div class="notification-item">
                                <div class="notification-icon">
                                    <mat-icon>info</mat-icon>
                                </div>
                                <div class="notification-content">
                                    <p class="notification-message">{{ n.message }}</p>
                                    <p class="notification-time">{{ n.createdAt | date:'medium' }}</p>
                                </div>
                            </div>
                        } @empty {
                            <div class="empty-state">
                                <mat-icon>notifications_off</mat-icon>
                                <p>No notifications available</p>
                            </div>
                        }
                    </div>
                </section>

                <section class="card logs-card">
                    <div class="card-header">
                        <mat-icon class="card-icon">list_alt</mat-icon>
                        <h2 class="card-title">Clean Logs</h2>
                    </div>
                    <div class="card-content">
                        <div class="logs-grid">
                            <div class="grid-header">
                                <span>Time</span>
                                <span>Deleted</span>
                                <span>Note</span>
                            </div>
                            @for (l of logs; track l.id) {
                                <div class="log-item">
                                    <span>{{ l.executeAt | date:'shortTime' }}</span>
                                    <span class="deleted-count">{{ l.deleteCount }}</span>
                                    <span class="log-note">{{ l.note }}</span>
                                </div>
                            } @empty {
                                <div class="empty-state">
                                    <mat-icon>cleaning_services</mat-icon>
                                    <p>No logs available</p>
                                </div>
                            }
                        </div>
                    </div>
                </section>
            </main>
        </div>

        <router-outlet></router-outlet>
    `,
    styles: [`
        /* Estilos globales */
        :root {
            --primary-color: #0071e3;
            --secondary-color: #86868b;
            --background-color: #f5f5f7;
            --card-color: #ffffff;
            --text-color: #1d1d1f;
            --border-color: #d2d2d7;
            --success-color: #34c759;
            --warning-color: #ff9500;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        body {
            background-color: var(--background-color);
            color: var(--text-color);
            line-height: 1.5;
        }

        /* Layout principal */
        .app-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .app-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--border-color);
        }

        .app-title {
            font-size: 28px;
            font-weight: 600;
            color: var(--primary-color);
        }

        .app-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        /* Tarjetas */
        .card {
            background-color: var(--card-color);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .card-header {
            display: flex;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-color);
        }

        .card-icon {
            margin-right: 10px;
            color: var(--primary-color);
        }

        .card-title {
            font-size: 18px;
            font-weight: 500;
            flex-grow: 1;
        }

        .card-content {
            padding: 16px 20px;
        }

        /* Notificaciones */
        .notification-item {
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid var(--border-color);
            align-items: flex-start;
        }

        .notification-item:last-child {
            border-bottom: none;
        }

        .notification-icon {
            margin-right: 12px;
            color: var(--primary-color);
        }

        .notification-content {
            flex-grow: 1;
        }

        .notification-message {
            font-size: 14px;
            margin-bottom: 4px;
        }

        .notification-time {
            font-size: 12px;
            color: var(--secondary-color);
        }

        /* Logs */
        .logs-grid {
            display: grid;
            grid-template-columns: auto 80px 1fr;
            gap: 10px;
        }

        .grid-header {
            grid-column: 1 / span 3;
            display: grid;
            grid-template-columns: auto 80px 1fr;
            font-weight: 500;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 8px;
        }

        .log-item {
            display: contents;
        }

        .log-item > span {
            padding: 6px 0;
            font-size: 13px;
        }

        .deleted-count {
            color: var(--success-color);
            font-weight: 500;
            text-align: center;
        }

        .log-note {
            color: var(--secondary-color);
        }

        /* Estadísticas */
        .user-stats {
            display: flex;
            gap: 12px;
        }

        .stat-badge {
            padding: 8px 12px;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 80px;
        }

        .active {
            background-color: rgba(52, 199, 89, 0.1);
            color: var(--success-color);
        }

        .inactive {
            background-color: rgba(255, 149, 0, 0.1);
            color: var(--warning-color);
        }

        .stat-value {
            font-size: 18px;
            font-weight: 600;
        }

        .stat-label {
            font-size: 12px;
            opacity: 0.8;
        }

        /* Estados vacíos */
        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            text-align: center;
            color: var(--secondary-color);
        }

        .empty-state mat-icon {
            font-size: 40px;
            margin-bottom: 10px;
            opacity: 0.5;
        }

        .empty-state p {
            font-size: 14px;
        }

        /* Badges */
        .badge {
            background-color: var(--primary-color);
            color: white;
            border-radius: 10px;
            padding: 2px 8px;
            font-size: 12px;
            font-weight: 500;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .app-content {
                grid-template-columns: 1fr;
            }
        }
    `],
})
export class App implements OnInit {
    notifications: Notification[] = [];
    logs: Cleanlog[] = [];
    users: Account[] = [];

    private ns = inject(NotificationServices);
    private ls = inject(CleanLogServices);
    private us = inject(AccountServices);

    ngOnInit() {
        this.ns.getNotifications().subscribe(data => this.notifications = data);
        this.ls.getCleanLogs().subscribe(data => this.logs = data);
        this.us.getUsers().subscribe(data => this.users = data);
    }

    get activeCount() {
        return this.users.filter(u => u.isActive).length;
    }

    get inactiveCount() {
        return this.users.filter(u => !u.isActive).length;
    }

}
