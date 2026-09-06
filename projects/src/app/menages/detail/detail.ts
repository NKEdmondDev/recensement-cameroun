import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  MenageService
} from '../../core/services/menage';

import {
  Menage
} from '../../core/models/menage.model';


@Component({
  selector: 'app-menage-detail',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class Detail implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly menageService =
    inject(MenageService);

  private readonly cdr =
    inject(ChangeDetectorRef);


  menage: Menage | null = null;

  loading = false;

  error: string | null = null;


  // =========================================================
  // INITIALISATION
  // =========================================================

  ngOnInit(): void {

    this.chargerMenage();
  }


  // =========================================================
  // CHARGER LE MENAGE
  // =========================================================

  chargerMenage(): void {

    const idParam =
      this.route.snapshot.paramMap.get('id');


    if (!idParam) {

      this.error =
        'Identifiant du ménage introuvable.';

      this.cdr.markForCheck();

      return;
    }


    const id =
      Number(idParam);


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      this.error =
        'Identifiant du ménage invalide.';

      this.cdr.markForCheck();

      return;
    }


    this.loading = true;

    this.error = null;


    this.menageService
      .findById(id)
      .subscribe({

        next: (data: Menage) => {

          this.menage = data;

          this.loading = false;

          this.error = null;

          this.cdr.markForCheck();
        },


        error: (err: unknown) => {

          this.loading = false;


          const response =
            err as {
              error?: {
                message?: string;
              };
              message?: string;
            };


          this.error =
            response?.error?.message ??
            response?.message ??
            'Impossible de charger les informations du ménage.';


          this.cdr.markForCheck();
        }

      });
  }


  // =========================================================
  // RETOUR LISTE
  // =========================================================

  retourListe(): void {

    this.router.navigate([
      '/menages'
    ]);
  }


  // =========================================================
  // MODIFICATION
  // =========================================================

  modifier(): void {

    if (!this.menage) {
      return;
    }


    /*
     * Route correcte :
     *
     * /menages/:id/modifier
     */
    this.router.navigate([
      '/menages',
      this.menage.id,
      'modifier'
    ]);
  }


  // =========================================================
  // FORMAT NOMBRE
  // =========================================================

  formatNombre(
    value: number | null | undefined
  ): string {

    return new Intl.NumberFormat(
      'fr-FR'
    ).format(
      Number(value ?? 0)
    );
  }


  // =========================================================
  // FORMAT DECIMAL
  // =========================================================

  formatDecimal(
    value: number | null | undefined
  ): string {

    return new Intl.NumberFormat(
      'fr-FR',
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }
    ).format(
      Number(value ?? 0)
    );
  }


  // =========================================================
  // FORMAT DATE
  // =========================================================

  formatDate(
    value: string | null | undefined
  ): string {

    if (!value) {
      return '—';
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;
    }


    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(date);
  }
}