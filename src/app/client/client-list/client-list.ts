import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from '../model/Client';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../client';
import { MatDialog } from '@angular/material/dialog';
import { ClientEdit } from '../client-edit/client-edit'
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';

@Component({
    selector: 'app-client-list',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        CommonModule
    ],
    templateUrl: './client-list.html',
    styleUrl: './client-list.scss'
})
export class ClientList implements OnInit {

    dataSource = new MatTableDataSource<Client>();
    displayedColumns: string[] = ['id', 'name', 'action'];

    constructor(
        private clientService: ClientService,
        public dialog: MatDialog
    ) { }

    createClient() {
        const dialogRef = this.dialog.open(ClientEdit, {
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.ngOnInit();
        });
    }

    editClient(client: Client) {
        const dialogRef = this.dialog.open(ClientEdit, {
            data: { client }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.ngOnInit();
        });
    }

    deleteClient(client: Client) {
        const dialogRef = this.dialog.open(DialogConfirmation, {
            data: { title: "Eliminar categoría", description: "Atención si borra la categoría se perderán sus datos.<br> ¿Desea eliminar la categoría?" }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.clientService.deleteClient(client.id).subscribe(result => {
                    this.ngOnInit();
                });
            }
        });
    }

    ngOnInit(): void {
        this.clientService.getClients().subscribe(
            categories => this.dataSource.data = categories);
    }
}
