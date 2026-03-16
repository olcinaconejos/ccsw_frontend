import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PrestamoEdit } from '../prestamo-edit/prestamo-edit';
import { Prestamo } from '../model/Prestamo';
import { Pageable } from '../../core/model/Pageable';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PrestamoService } from '../prestamo';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Client } from '../../client/model/Client';
import { ClientService } from '../../client/client';
import { ReactiveFormsModule } from '@angular/forms';
import { Game } from '../../game/model/Game';
import { GameService } from '../../game/game';
import { MatDatepicker, MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';

export class PrestamoFilterForm extends FormGroup {
    gameName: FormControl<string>;
    clName: FormControl<Client>;
    date: FormControl<Date>;

    constructor() {
        const newForm = new FormGroup({
            gameName: new FormControl<string>(null),
            clName: new FormControl<Client>(null),
            date: new FormControl<Date>(null)
        });

        super(newForm.controls);

        this.gameName = newForm.controls.gameName;
        this.clName = newForm.controls.clName;
        this.date = newForm.controls.date;
    }
}

@Component({
    selector: 'app-author-list',
    standalone: true,
    imports: [MatButtonModule, ReactiveFormsModule, MatFormField, MatInput, MatDatepickerModule, MatSelectModule, MatOption, MatIconModule, FormsModule, MatTableModule, CommonModule, MatPaginator, MatFormField, MatLabel, MatSelect, MatInput, ReactiveFormsModule, MatOption, MatDatepickerInput, MatDatepickerToggle, MatDatepicker],
    templateUrl: './prestamo-list.html',
    styleUrl: './prestamo-list.scss',
})
export class PrestamoList implements OnInit {
    prestamos: Prestamo[];

    clients: Client[];
    games: Game[];

    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;

    dataSource = new MatTableDataSource<Prestamo>();
    displayedColumns: string[] = ['id', 'game_name', 'cl_name', 'start_date', 'end_date', 'action'];

    constructor(private prestamoService: PrestamoService, private clientService: ClientService, private gameService: GameService, public dialog: MatDialog) {
    }

    prestamoFilterForm: PrestamoFilterForm;

    ngOnInit(): void {
        this.prestamoFilterForm = new PrestamoFilterForm();
        this.prestamoService.getAllPrestamos().subscribe(prestamos => (this.prestamos = prestamos));
        this.clientService.getClients().subscribe(clients => (this.clients = clients));
        this.gameService.getGames().subscribe(games => (this.games = games));
        this.loadPage();
    }

    clNameFilter: string = null;
    gameNameFilter: string = null;
    dateFilter: Date = null;

    loadPage(event?: PageEvent) {

        const pageable: Pageable = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sort: [
                {
                    property: 'id',
                    direction: 'ASC',
                },
            ],
        };

        if (event != null) {
            pageable.pageSize = event.pageSize;
            pageable.pageNumber = event.pageIndex;
        }

        this.prestamoService.findPrestamos(pageable, this.gameNameFilter, this.clNameFilter, this.dateFilter).subscribe((data) => {
            this.dataSource.data = data.content;
            this.pageNumber = data.pageable.pageNumber;
            this.pageSize = data.pageable.pageSize;
            this.totalElements = data.totalElements;
        });
    }

    createPrestamo() {
        const dialogRef = this.dialog.open(PrestamoEdit, {
            data: {},
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.ngOnInit();
        });
    }

    editPrestamo(prestamo: Prestamo) {
        const dialogRef = this.dialog.open(PrestamoEdit, {
            data: { prestamo: prestamo },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.ngOnInit();
        });
    }

    deletePrestamo(prestamo: Prestamo) {
        const dialogRef = this.dialog.open(DialogConfirmation, {
            data: {
                title: 'Eliminar autor',
                description:
                    'Atención si borra el autor se perderán sus datos.<br> ¿Desea eliminar el autor?',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.prestamoService.deletePrestamo(prestamo.id).subscribe((result) => {
                    this.ngOnInit();
                });
            }
        });
    }

    onCleanFilter(): void {
        this.prestamoFilterForm.reset();

        this.gameNameFilter = null;
        this.clNameFilter = null;
        this.dateFilter = null;

        this.onSearch();
    }


    onSearch(): void {
        this.clNameFilter = this.prestamoFilterForm.clName.value ? this.prestamoFilterForm.clName.value.name : null;
        this.gameNameFilter = this.prestamoFilterForm.gameName.value || null;
        this.dateFilter = this.prestamoFilterForm.date.value || null;

        this.loadPage();
    }
}
