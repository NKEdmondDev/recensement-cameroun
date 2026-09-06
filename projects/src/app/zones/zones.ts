import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MenageService } from '../core/services/menage';

import { StatistiquesResponse } from '../core/models/statistiques.model';
import { StatistiqueZone } from '../core/models/statistique-zone.model';

@Component({
  selector: 'app-zones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './zones.html',
  styleUrl: './zones.css'
})
export class Zones implements OnInit {

  private readonly menageService = inject(MenageService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly Math = Math;
  readonly Number = Number;

  statistiques: StatistiquesResponse | null = null;

  zones: StatistiqueZone[] = [];

  loading = false;

  error: string | null = null;

  searchTerm = '';


  ngOnInit(): void {
    this.chargerZones();
  }


  chargerZones(): void {

    if (this.loading) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.menageService.getStatistiques().subscribe({

      next: (data: StatistiquesResponse) => {

        console.log(
          'ZONES RECUES PAR ANGULAR :',
          data
        );

        this.statistiques = data;

        this.zones =
          data.statistiquesParZone ?? [];

        this.loading = false;

        this.cdr.markForCheck();
      },

      error: (err: unknown) => {

        console.error(
          'Erreur lors du chargement des zones :',
          err
        );

        this.loading = false;

        const erreur = err as {
          error?: {
            message?: string;
          };
          message?: string;
        };

        this.error =
          erreur?.error?.message ??
          erreur?.message ??
          'Impossible de charger les zones.';

        this.cdr.markForCheck();
      }
    });
  }


  get zonesFiltrees(): StatistiqueZone[] {

    const recherche =
      this.searchTerm
        .trim()
        .toLowerCase();

    if (!recherche) {
      return this.zones;
    }

    return this.zones.filter(zone =>
      zone.zone
        ?.toLowerCase()
        .includes(recherche)
    );
  }


  get populationTotale(): number {

    return this.zones.reduce(
      (total, zone) =>
        total +
        Number(zone.populationTotale || 0),
      0
    );
  }


  get nombreMenages(): number {

    return this.zones.reduce(
      (total, zone) =>
        total +
        Number(zone.nombreMenages || 0),
      0
    );
  }


  get tauxSurpeuplementMoyen(): number {

    if (!this.zones.length) {
      return 0;
    }

    const total = this.zones.reduce(
      (somme, zone) =>
        somme +
        Number(zone.tauxSurpeuplement || 0),
      0
    );

    return total / this.zones.length;
  }


  formatNombre(
    value: number | null | undefined
  ): string {

    return new Intl.NumberFormat(
      'fr-FR'
    ).format(Number(value || 0));
  }


  formatDecimal(
    value: number | null | undefined
  ): string {

    return new Intl.NumberFormat(
      'fr-FR',
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }
    ).format(Number(value || 0));
  }


  tauxClasse(
    taux: number | null | undefined
  ): string {

    const valeur =
      Number(taux || 0);

    if (valeur >= 50) {
      return 'danger';
    }

    if (valeur >= 25) {
      return 'warning';
    }

    return 'normal';
  }
}