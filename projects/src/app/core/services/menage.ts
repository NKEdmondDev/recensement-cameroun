import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  Menage,
  MenageRequest
} from '../models/menage.model';

import {
  StatistiquesResponse
} from '../models/statistiques.model';

import {
  environment
} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MenageService {

  private readonly http =
    inject(HttpClient);


  /**
   * URL complète de l'API des ménages.
   *
   * Développement :
   * http://localhost:8080/api/menages
   *
   * Production :
   * https://ton-backend.com/api/menages
   */
  private readonly apiUrl =
    `${environment.apiUrl}/menages`;


  // =========================================================
  // LISTE
  // =========================================================

  findAll(): Observable<Menage[]> {

    return this.http.get<Menage[]>(
      this.apiUrl
    );
  }


  // =========================================================
  // DETAIL
  // =========================================================

  findById(id: number): Observable<Menage> {

    return this.http.get<Menage>(
      `${this.apiUrl}/${id}`
    );
  }


  // =========================================================
  // CREATION
  // =========================================================

  create(
    request: MenageRequest
  ): Observable<Menage> {

    return this.http.post<Menage>(
      this.apiUrl,
      request
    );
  }


  // =========================================================
  // MODIFICATION
  // =========================================================

  update(
    id: number,
    request: MenageRequest
  ): Observable<Menage> {

    return this.http.put<Menage>(
      `${this.apiUrl}/${id}`,
      request
    );
  }


  // =========================================================
  // SUPPRESSION
  // =========================================================

  delete(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }


  // =========================================================
  // STATISTIQUES
  // =========================================================

  getStatistiques():
    Observable<StatistiquesResponse> {

    return this.http.get<StatistiquesResponse>(
      `${this.apiUrl}/statistiques`
    );
  }
}