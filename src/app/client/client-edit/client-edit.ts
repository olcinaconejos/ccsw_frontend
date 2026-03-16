import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../client';
import { Client } from '../model/Client';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-client-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule],
    templateUrl: './client-edit.html',
    styleUrl: './client-edit.scss'
})
export class ClientEdit implements OnInit {
    client: Client;
    errorMessage: string = '';

    constructor(
        public dialogRef: MatDialogRef<ClientEdit>,
        @Inject(MAT_DIALOG_DATA) public data: {client: Client},
        private clientService: ClientService
    ) {}

    ngOnInit(): void {
        this.client = this.data.client ? Object.assign({}, this.data.client) : new Client();
    }

    onSave() {
        this.errorMessage = '';
        this.clientService.saveClient(this.client).subscribe({
            next: () => {
                this.dialogRef.close();
            },
            error: (err: HttpErrorResponse) => {
                if (err.error && err.error.error) {
                    this.errorMessage = err.error.error;
                } else {
                    this.errorMessage = 'Error al guardar el cliente';
                }
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }
}
