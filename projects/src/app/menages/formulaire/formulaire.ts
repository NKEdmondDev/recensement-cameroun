import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  Router,
  RouterLink,
  ActivatedRoute
} from '@angular/router';

import { MenageService } from '../../core/services/menage';
import {
  Menage,
  MenageRequest
} from '../../core/models/menage.model';

import { NotificationService } from '../../core/services/notification';

@Component({
  selector: 'app-menage-formulaire',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './formulaire.html',
  styleUrl: './formulaire.css'
})
export class Formulaire implements OnInit {

  private readonly fb = inject(FormBuilder);

  private readonly menageService =
    inject(MenageService);

  private readonly notificationService =
    inject(NotificationService);

  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);


  // ============================================================
  // FORMULAIRE
  // ============================================================

  formulaire!: FormGroup;


  // ============================================================
  // ETAT
  // ============================================================

  loading = false;

  error: string | null = null;

  submitted = false;


  // ============================================================
  // MODE
  // ============================================================

  /**
   * ID du ménage lorsqu'on est en mode modification.
   *
   * null = création
   */
  menageId: number | null = null;


  /**
   * Permet au HTML de savoir si on est en modification.
   */
  get modeModification(): boolean {
    return this.menageId !== null;
  }


  /**
   * Titre dynamique.
   */
  get titre(): string {
    return this.modeModification
      ? 'Modifier le ménage'
      : 'Nouveau ménage';
  }


  /**
   * Texte du bouton.
   */
  get texteBouton(): string {
    return this.modeModification
      ? 'Enregistrer les modifications'
      : 'Enregistrer le ménage';
  }


  // ============================================================
  // INITIALISATION
  // ============================================================

  ngOnInit(): void {

    this.creerFormulaire();

    this.detecterMode();
  }


  // ============================================================
  // CREATION DU FORMULAIRE
  // ============================================================

  private creerFormulaire(): void {

    this.formulaire = this.fb.group({

      chefMenage: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],

      zone: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],

      nombrePersonnes: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(30)
        ]
      ],

      ageMoyen: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(120)
        ]
      ],

      typeLogement: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ]

    });
  }


  // ============================================================
  // DETECTER CREATION / MODIFICATION
  // ============================================================

  private detecterMode(): void {

    const id = this.route.snapshot.paramMap.get('id');

    /*
     * /menages/nouveau
     *
     * Il n'y a pas de :id.
     */
    if (!id) {

      this.menageId = null;

      return;
    }


    /*
     * /menages/123/modifier
     *
     * On récupère l'identifiant.
     */

    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {

      this.error =
        'Identifiant du ménage invalide.';

      return;
    }


    this.menageId = parsedId;

    this.chargerMenage(parsedId);
  }


  // ============================================================
  // CHARGER LE MÉNAGE POUR MODIFICATION
  // ============================================================

  private chargerMenage(id: number): void {

    if (this.loading) {
      return;
    }

    this.loading = true;

    this.error = null;


    console.log(
      'Chargement du ménage pour modification :',
      id
    );


    this.menageService.findById(id).subscribe({

      next: (menage: Menage) => {

        console.log(
          'Ménage chargé :',
          menage
        );


        /*
         * Préremplissage du formulaire.
         */

        this.formulaire.patchValue({

          chefMenage:
            menage.chefMenage ?? '',

          zone:
            menage.zone ?? '',

          nombrePersonnes:
            menage.nombrePersonnes ?? null,

          ageMoyen:
            menage.ageMoyen ?? null,

          typeLogement:
            menage.typeLogement ?? ''

        });


        this.loading = false;

        this.error = null;
      },


      error: (err: any) => {

        console.error(
          'Erreur lors du chargement du ménage :',
          err
        );


        this.loading = false;


        this.error =
          err?.error?.message ??
          'Impossible de charger les informations du ménage.';


        this.notificationService.error(
  'Enregistrement impossible',
  this.error ?? 'Impossible d’enregistrer le ménage.'
);
      }

    });
  }


  // ============================================================
  // RACCOURCI VERS LES CHAMPS
  // ============================================================

  get f() {
    return this.formulaire.controls;
  }


  // ============================================================
  // SOUMISSION
  // ============================================================

  enregistrer(): void {

    this.submitted = true;

    this.error = null;


    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (this.formulaire.invalid) {

      this.formulaire.markAllAsTouched();

      this.notificationService.warning(
        'Formulaire incomplet',
        'Veuillez corriger les champs obligatoires avant de continuer.'
      );

      return;
    }


    // ----------------------------------------------------------
    // EVITER LES DOUBLE-SOUMISSIONS
    // ----------------------------------------------------------

    if (this.loading) {
      return;
    }


    this.loading = true;


    // ----------------------------------------------------------
    // CONSTRUCTION DE LA REQUETE
    // ----------------------------------------------------------

    const request: MenageRequest = {

      chefMenage:
        String(
          this.f['chefMenage'].value
        ).trim(),

      zone:
        String(
          this.f['zone'].value
        ).trim(),

      nombrePersonnes:
        Number(
          this.f['nombrePersonnes'].value
        ),

      ageMoyen:
        Number(
          this.f['ageMoyen'].value
        ),

      typeLogement:
        String(
          this.f['typeLogement'].value
        ).trim()

    };


    console.log(
      'Requête envoyée :',
      request
    );


    // ==========================================================
    // MODIFICATION
    // ==========================================================

    if (this.menageId !== null) {

      this.modifierMenage(
        this.menageId,
        request
      );

      return;
    }


    // ==========================================================
    // CREATION
    // ==========================================================

    this.creerMenage(request);
  }


  // ============================================================
  // CREER
  // ============================================================

  private creerMenage(
    request: MenageRequest
  ): void {

    this.menageService.create(request).subscribe({

      next: () => {

        this.loading = false;

        this.error = null;


        this.notificationService.success(
          'Ménage enregistré',
          'Le ménage a été enregistré avec succès.'
        );


        this.formulaire.reset();

        this.submitted = false;


        this.router.navigate([
          '/menages'
        ]);
      },


      error: (err: any) => {

        console.error(
          'Erreur lors de la création du ménage :',
          err
        );


        this.loading = false;


        this.error =
          err?.error?.message ??
          'Impossible d’enregistrer le ménage.';


        this.notificationService.error(
  'Enregistrement impossible',
  this.error ?? 'Impossible d’enregistrer le ménage.'
);
      }

    });
  }


  // ============================================================
  // MODIFIER
  // ============================================================

  private modifierMenage(
    id: number,
    request: MenageRequest
  ): void {

    console.log(
      'Modification du ménage :',
      id
    );


    this.menageService
      .update(id, request)
      .subscribe({

        next: () => {

          console.log(
            'Ménage modifié avec succès :',
            id
          );


          this.loading = false;

          this.error = null;


          this.notificationService.success(
            'Ménage modifié',
            'Les modifications ont été enregistrées avec succès.'
          );


          this.router.navigate([
            '/menages'
          ]);
        },


        error: (err: any) => {

          console.error(
            'Erreur lors de la modification du ménage :',
            err
          );


          this.loading = false;


          this.error =
            err?.error?.message ??
            'Impossible de modifier le ménage.';


          this.notificationService.error(
  'Enregistrement impossible',
  this.error ?? 'Impossible d’enregistrer le ménage.'
);
        }

      });
  }


  // ============================================================
  // ANNULATION
  // ============================================================

  annuler(): void {

    if (this.loading) {
      return;
    }

    this.router.navigate([
      '/menages'
    ]);
  }

}