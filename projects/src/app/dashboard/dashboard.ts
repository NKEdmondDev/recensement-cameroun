import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MenageService } from '../core/services/menage';
import { StatistiquesResponse } from '../core/models/statistiques.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private readonly menageService = inject(MenageService);
  private readonly cdr = inject(ChangeDetectorRef);

  statistiques: StatistiquesResponse | null = null;

  loading = true;

  error: string | null = null;


  // ============================================================
  // INITIALISATION
  // ============================================================

  ngOnInit(): void {
    this.chargerStatistiques();
  }


  // ============================================================
  // CHARGEMENT DES STATISTIQUES
  // ============================================================

  chargerStatistiques(): void {

    this.loading = true;
    this.error = null;

    this.menageService.getStatistiques().subscribe({

      next: (data: StatistiquesResponse) => {

        console.log(
          'STATISTIQUES RECUES PAR ANGULAR :',
          data
        );

        this.statistiques = data;
        this.loading = false;

        // Force Angular à mettre à jour l'affichage
        this.cdr.markForCheck();
      },

      error: (err: unknown) => {

        console.error(
          'ERREUR API STATISTIQUES :',
          err
        );

        this.statistiques = null;
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
          'Impossible de charger les statistiques.';

        this.cdr.markForCheck();
      }

    });
  }


  // ============================================================
  // NOMBRE DE ZONES
  // ============================================================

  get zonesCount(): number {

    return this.statistiques
      ?.statistiquesParZone?.length ?? 0;
  }


  // ============================================================
  // TAUX MOYEN DE SURPEUPLEMENT
  // ============================================================

  get tauxSurpeuplementMoyen(): number {

    const zones =
      this.statistiques?.statistiquesParZone;

    if (!zones?.length) {
      return 0;
    }

    const total = zones.reduce(
      (somme, zone) =>
        somme + Number(zone.tauxSurpeuplement ?? 0),
      0
    );

    return total / zones.length;
  }


  // ============================================================
  // FORMATAGE DES NOMBRES
  // ============================================================

  formatNombre(
    value: number | null | undefined
  ): string {

    return new Intl.NumberFormat(
      'fr-FR'
    ).format(Number(value ?? 0));
  }


  // ============================================================
  // FORMATAGE DES DECIMAUX
  // ============================================================

  formatDecimal(
    value: number | null | undefined
  ): string {

    return new Intl.NumberFormat(
      'fr-FR',
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }
    ).format(Number(value ?? 0));
  }
}