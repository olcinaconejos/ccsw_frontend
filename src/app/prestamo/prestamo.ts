import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Prestamo } from './model/Prestamo';
import { Observable, of } from 'rxjs';
import { Pageable } from '../core/model/Pageable';
import { PrestamoPage } from './model/PrestamoPage';

@Injectable({
  providedIn: 'root',
})
export class PrestamoService {
  constructor(
    private http: HttpClient
  ) { }

  private baseUrl = 'http://localhost:8080/prestamos'


  findPrestamos(pageable: Pageable, gameName?: string, clName?: string, date?: Date): Observable<PrestamoPage> {
    let prestamoPage = this.http.post<PrestamoPage>(
      this.baseUrl, { pageable }, 
      { params: {
          gameName: gameName, 
          clientName: clName, 
          date: date == null ? "null" : date.toISOString()
        }
      }
    );

    prestamoPage.subscribe(page => {
      page.content.map(p => ({...p, start: p.start, end: p.end}));
      return of(page);
    });

    return prestamoPage;
  }

  savePrestamo(prestamo: Prestamo): Observable<{error?: string}> {
    const { id } = prestamo;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;

    return this.http.put<{error?: string}>(url, prestamo);
  }

  deletePrestamo(idAuthor: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idAuthor}`);
  }

  getAllPrestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.baseUrl);
  }
}
