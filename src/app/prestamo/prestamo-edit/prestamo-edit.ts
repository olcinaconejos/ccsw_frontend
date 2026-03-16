import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrestamoService } from '../prestamo';
import { Prestamo } from '../model/Prestamo';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Game } from '../../game/model/Game';
import { Client } from '../../client/model/Client';
import { GameService } from '../../game/game';
import { ClientService } from '../../client/client';
import { HttpErrorResponse } from '@angular/common/http';

export const endDateShouldBeAfterValidator = (startControl: AbstractControl): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value || !startControl.value) return null;
        return control.value < startControl.value ? { endDateShouldBeAfter: true } : null;
    }
}

export const maxLoanPeriodValidator = (startControl: AbstractControl): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value || !startControl.value) return null;
        const start = new Date(startControl.value).getTime();
        const end = new Date(control.value).getTime();
        const diffDays = (end - start) / (1000 * 60 * 60 * 24);
        return diffDays > 14 ? { maxLoanPeriod: true } : null;
    }
}

export class PrestamoEditForm extends FormGroup {
    gameName: FormControl<string>;
    clName: FormControl<string>;
    start: FormControl<Date>;
    end: FormControl<Date>;

    constructor() {
        const newForm = new FormGroup({
            gameName: new FormControl<string>(''),
            clName: new FormControl<string>(''),
            start: new FormControl<Date>(null),
            end: new FormControl<Date>(null, [])
        });

        newForm.controls.end.addValidators(endDateShouldBeAfterValidator(newForm.controls.start));
        newForm.controls.end.addValidators(maxLoanPeriodValidator(newForm.controls.start));

        super(newForm.controls);

        this.gameName = newForm.controls.gameName;
        this.clName = newForm.controls.clName;
        this.start = newForm.controls.start;
        this.end = newForm.controls.end;
    }
}

@Component({
    selector: 'app-author-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, CommonModule],
    templateUrl: './prestamo-edit.html',
    styleUrl: './prestamo-edit.scss',
})
export class PrestamoEdit implements OnInit {
    prestamo: Prestamo;
    prestamoEditForm: PrestamoEditForm;
    games: Game[] = [];
    clients: Client[] = [];
    errorMessage: string = '';

    constructor(
        public dialogRef: MatDialogRef<PrestamoEdit>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private prestamoService: PrestamoService,
        private gameService: GameService,
        private clientService: ClientService
    ) {}

    ngOnInit(): void {
        this.prestamo = this.data.prestamo ? Object.assign({}, this.data.prestamo) : new Prestamo();
        this.prestamoEditForm = new PrestamoEditForm();

        this.gameService.getGames().subscribe(games => {
            this.games = games;
            if (this.prestamo.gameName) {
                this.prestamoEditForm.gameName.setValue(this.prestamo.gameName);
            }
        });

        this.clientService.getClients().subscribe(clients => {
            this.clients = clients;
            if (this.prestamo.clName) {
                this.prestamoEditForm.clName.setValue(this.prestamo.clName);
            }
        });

        if (this.prestamo.start) {
            this.prestamoEditForm.start.setValue(new Date(this.prestamo.start));
        }
        if (this.prestamo.end) {
            this.prestamoEditForm.end.setValue(new Date(this.prestamo.end));
        }
    }

    onSave() {
        this.prestamoEditForm.end.updateValueAndValidity();

        if (this.prestamoEditForm.invalid) {
            return;
        }

        this.errorMessage = '';

        Object.assign(this.prestamo, {
            gameName: this.prestamoEditForm.gameName.value,
            clName: this.prestamoEditForm.clName.value,
            start: this.prestamoEditForm.start.value,
            end: this.prestamoEditForm.end.value
        });

        this.prestamoService.savePrestamo(this.prestamo).subscribe({
            next: () => {
                this.dialogRef.close();
            },
            error: (err: HttpErrorResponse) => {
                if (err.error && err.error.error) {
                    this.errorMessage = err.error.error;
                } else {
                    this.errorMessage = 'Error al guardar el préstamo';
                }
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }
}
