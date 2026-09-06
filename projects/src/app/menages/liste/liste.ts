import {
  Component,
  HostListener,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink
} from '@angular/router';
import { finalize } from 'rxjs';

import { MenageService } from '../../core/services/menage';
import { Menage } from '../../core/models/menage.model';
import {
  NotificationService
} from '../../core/services/notification';


@Component({
  selector: 'app-menages-liste',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './liste.html',
  styleUrl: './liste.css'
})
export class Liste implements OnInit {

  // ============================================================
  // SERVICES
  // ============================================================

  private readonly menageService = inject(MenageService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  // ============================================================
  // DONNÉES
  // ============================================================

  menages: Menage[] = [];

  loading = false;

  error: string | null = null;

  recherche = '';


  // ============================================================
  // MENU ACTIONS
  // ============================================================

  menuOuvert: number | null = null;


  // ============================================================
  // SUPPRESSION
  // ============================================================

  suppressionEnCours: Menage | null = null;

  suppressionLoading = false;


  // ============================================================
  // INITIALISATION
  // ============================================================

  ngOnInit(): void {
    this.chargerMenages();
  }


  // ============================================================
  // CHARGER LES MÉNAGES
  // ============================================================

  chargerMenages(): void {

    this.loading = true;
    this.error = null;

    this.menageService.findAll().subscribe({

      next: (data: Menage[]) => {

        this.menages = Array.isArray(data)
          ? data
          : [];

        this.loading = false;
      },

      error: (err) => {

        console.error(
          'Erreur lors du chargement des ménages :',
          err
        );

        this.menages = [];

        this.loading = false;

        this.error =
          err?.error?.message ??
          'Impossible de charger les ménages. Vérifiez que le serveur est disponible.';
      }

    });
  }


  // ============================================================
  // RÉESSAYER LE CHARGEMENT
  // ============================================================

  reessayer(): void {
    this.chargerMenages();
  }


  // ============================================================
  // RÉSULTATS FILTRÉS
  // ============================================================

  get menagesFiltres(): Menage[] {

    const terme = this.recherche
      .trim()
      .toLowerCase();

    // Aucun terme de recherche :
    // on retourne directement tous les ménages.

    if (!terme) {
      return this.menages;
    }


    // Recherche sur plusieurs informations.

    return this.menages.filter((menage) => {

      const chefMenage =
        String(menage.chefMenage ?? '')
          .toLowerCase();

      const zone =
        String(menage.zone ?? '')
          .toLowerCase();

      const typeLogement =
        String(menage.typeLogement ?? '')
          .toLowerCase();


      return (
        chefMenage.includes(terme) ||
        zone.includes(terme) ||
        typeLogement.includes(terme)
      );
    });
  }


  // ============================================================
  // NOMBRE DE RÉSULTATS
  // ============================================================

  get nombreResultats(): number {
    return this.menagesFiltres.length;
  }


  // ============================================================
  // MENU TROIS POINTS
  // ============================================================

  toggleMenu(id: number): void {

    if (this.menuOuvert === id) {

      this.menuOuvert = null;

      return;
    }

    this.menuOuvert = id;
  }


  // ============================================================
  // FERMER LE MENU SI CLIC À L'EXTÉRIEUR
  // ============================================================

  @HostListener('document:click', ['$event'])
  fermerMenu(event: MouseEvent): void {

    const target =
      event.target as HTMLElement;


    /*
     * Si le clic vient du bouton trois points
     * ou du menu lui-même, on ne ferme pas ici.
     */

    if (
      target.closest('.action-menu') ||
      target.closest('.card-menu-button')
    ) {
      return;
    }


    this.menuOuvert = null;
  }


  // ============================================================
  // VOIR LE DÉTAIL
  // ============================================================

  voirDetail(id: number): void {

    this.menuOuvert = null;

    this.router.navigate([
      '/menages',
      id
    ]);
  }


  // ============================================================
  // MODIFIER
  // ============================================================

  modifier(id: number): void {

    this.menuOuvert = null;

    this.router.navigate([
      '/menages',
      id,
      'modifier'
    ]);
  }


  // ============================================================
  // DEMANDER CONFIRMATION DE SUPPRESSION
  // ============================================================

  demanderSuppression(
    menage: Menage
  ): void {

    this.menuOuvert = null;

    this.suppressionEnCours = menage;

    this.suppressionLoading = false;
  }


  // ============================================================
  // ANNULER SUPPRESSION
  // ============================================================

  annulerSuppression(): void {

    /*
     * On empêche la fermeture pendant
     * qu'une suppression est en cours.
     */

    if (this.suppressionLoading) {
      return;
    }

    this.suppressionEnCours = null;
  }


  // ============================================================
  // CONFIRMER SUPPRESSION
  // ============================================================

confirmerSuppression(): void {

  const menage = this.suppressionEnCours;

  // ----------------------------------------------------------
  // SECURITE
  // ----------------------------------------------------------

  if (!menage) {
    return;
  }


  if (menage.id == null) {

    this.notificationService.error(
      'Suppression impossible',
      'L’identifiant du ménage est manquant.'
    );

    this.suppressionEnCours = null;

    return;
  }


  // ----------------------------------------------------------
  // EVITER LES DOUBLE-SUPPRESSIONS
  // ----------------------------------------------------------

  if (this.suppressionLoading) {
    return;
  }


  const id = menage.id;


  // ----------------------------------------------------------
  // DEBUT SUPPRESSION
  // ----------------------------------------------------------

  this.suppressionLoading = true;

  this.error = null;


  this.menageService
    .delete(id)
    .pipe(

      /*
       * finalize() est exécuté dans tous les cas :
       *
       * succès
       * erreur
       * interruption
       */
      finalize(() => {

        this.suppressionLoading = false;

      })

    )
    .subscribe({

      // ======================================================
      // SUCCES
      // ======================================================

      next: () => {

        /*
         * Retirer immédiatement le ménage
         * de la liste affichée.
         */

        this.menages =
          this.menages.filter(
            item => item.id !== id
          );


        /*
         * Fermer le menu et la confirmation.
         */

        this.suppressionEnCours = null;

        this.menuOuvert = null;


        /*
         * Notification globale.
         *
         * La Navbar, la Sidebar et le Toast
         * utilisent le même NotificationService.
         */

        this.notificationService.success(
          'Ménage supprimé',
          `Le ménage de ${menage.chefMenage} a été supprimé avec succès.`
        );

      },


      // ======================================================
      // ERREUR
      // ======================================================

      error: (err) => {

        console.error(
          'Erreur lors de la suppression du ménage :',
          err
        );


        const message =
          err?.error?.message ??
          err?.error?.error ??
          'Impossible de supprimer le ménage. Vérifiez que le serveur est disponible.';


        this.error = message;


        this.notificationService.error(
          'Suppression impossible',
          message
        );

      }

    });
}



  // ============================================================
  // FORMAT NOMBRE
  // ============================================================

  formatNombre(
    value: number | null | undefined
  ): string {

    if (
      value === null ||
      value === undefined
    ) {
      return '0';
    }


    return new Intl.NumberFormat(
      'fr-FR'
    ).format(value);
  }


  // ============================================================
  // FORMAT DATE
  // ============================================================

  formatDate(
    value: string | Date | null | undefined
  ): string {

    if (!value) {
      return '—';
    }


    const date =
      new Date(value);


    /*
     * Vérification d'une date invalide.
     */

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '—';
    }


    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(date);
  }

}

