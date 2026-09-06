import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  BaseChartDirective
} from 'ng2-charts';

import {
  Chart,
  ChartConfiguration,
  ChartData,
  registerables
} from 'chart.js';

import { MenageService } from '../core/services/menage';
import { StatistiquesResponse } from '../core/models/statistiques.model';


/*
 * ============================================================
 * ENREGISTREMENT DE CHART.JS
 * ============================================================
 *
 * Permet notamment d'utiliser :
 * - category
 * - linear
 * - bar
 * - doughnut
 * - tooltip
 * - legend
 * etc.
 *
 */

Chart.register(...registerables);


@Component({
  selector: 'app-statistiques',
  standalone: true,

  imports: [
    CommonModule,
    BaseChartDirective
  ],

  templateUrl: './statistiques.html',
  styleUrl: './statistiques.css'
})
export class Statistiques implements OnInit {

  private readonly menageService = inject(MenageService);

  private readonly cdr = inject(ChangeDetectorRef);


  /*
   * ============================================================
   * OBJETS JAVASCRIPT ACCESSIBLES DANS LE TEMPLATE
   * ============================================================
   */

  Math = Math;

  Number = Number;


  /*
   * ============================================================
   * DONNEES
   * ============================================================
   */

  statistiques: StatistiquesResponse | null = null;

  loading = false;

  error: string | null = null;


  /*
   * ============================================================
   * CHARGEMENT
   * ============================================================
   */

  ngOnInit(): void {
    this.chargerStatistiques();
  }


  chargerStatistiques(): void {

    if (this.loading) {
      return;
    }

    this.loading = true;

    this.error = null;


    this.menageService.getStatistiques().subscribe({

      next: (data: StatistiquesResponse) => {

        console.log(
          'STATISTIQUES RECUES :',
          data
        );


        this.statistiques = data;


        /*
         * Préparation des données des graphiques
         */
        this.preparerGraphiques();


        this.loading = false;


        /*
         * Force Angular à mettre à jour
         * le template et les graphiques.
         */
        this.cdr.detectChanges();

      },


      error: (err: unknown) => {

        console.error(
          'Erreur statistiques :',
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
          'Impossible de charger les statistiques.';


        this.cdr.detectChanges();

      }

    });

  }


  /*
   * ============================================================
   * STATISTIQUES
   * ============================================================
   */

  get populationTotale(): number {

    return this.statistiques?.populationTotale ?? 0;

  }


  get nombreMenages(): number {

    return this.statistiques?.nombreMenages ?? 0;

  }


  get tailleMoyenne(): number {

    return this.statistiques?.tailleMoyenneMenage ?? 0;

  }


  get nombreZones(): number {

    return this.statistiques
      ?.statistiquesParZone
      ?.length ?? 0;

  }


  get zonePlusPeuplee(): string {

    return this.statistiques
      ?.zoneAvecPlusHabitants ?? '—';

  }


  get zonePlusJeune(): string {

    return this.statistiques
      ?.zoneAvecAgeMoyenLePlusBas ?? '—';

  }


  get zonePlusAgee(): string {

    return this.statistiques
      ?.zoneAvecAgeMoyenLePlusEleve ?? '—';

  }


  get zoneSurpeuplee(): string {

    return this.statistiques
      ?.zoneAvecPlusFortTauxSurpeuplement ?? '—';

  }


  /*
   * ============================================================
   * OUTILS
   * ============================================================
   */

  formatNombre(
    value: number | null | undefined
  ): string {

    return new Intl.NumberFormat(
      'fr-FR'
    ).format(
      Number(value ?? 0)
    );

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
    ).format(
      Number(value ?? 0)
    );

  }


  /*
   * ============================================================
   * GRAPHIQUE 1
   *
   * Population par zone
   * ============================================================
   */

  populationBarChartType: 'bar' = 'bar';


  populationBarChartData: ChartData<'bar'> = {

    labels: [],

    datasets: [

      {

        label: 'Population',

        data: [],

        borderWidth: 0,

        borderRadius: 8,

        barThickness: 28

      }

    ]

  };


  populationBarChartOptions:
    ChartConfiguration<'bar'>['options'] = {

    responsive: true,

    maintainAspectRatio: false,


    animation: {

      duration: 800

    },


    interaction: {

      mode: 'index',

      intersect: false

    },


    plugins: {

      legend: {

        display: false

      },


      tooltip: {

        enabled: true,

        displayColors: false,


        callbacks: {

          title: (items) => {

            return items[0]?.label ?? '';

          },


          label: (context) => {

            return ` Population : ${this.formatNombre(
              Number(context.raw ?? 0)
            )}`;

          }

        }

      }

    },


    scales: {

      x: {

        grid: {

          display: false

        },


        ticks: {

          maxRotation: 45,

          minRotation: 0

        }

      },


      y: {

        beginAtZero: true,


        grid: {

          color: 'rgba(148,163,184,0.15)'

        },


        ticks: {

          callback: (value) => {

            return this.formatNombre(
              Number(value)
            );

          }

        }

      }

    }

  };


  /*
   * ============================================================
   * GRAPHIQUE 2
   *
   * Répartition des ménages par zone
   * ============================================================
   */

  zonesPieChartType: 'doughnut' = 'doughnut';


  zonesPieChartData:
    ChartData<'doughnut'> = {

    labels: [],

    datasets: [

      {

        data: [],

        borderWidth: 3,

        hoverOffset: 12

      }

    ]

  };


  zonesPieChartOptions:
    ChartConfiguration<'doughnut'>['options'] = {

    responsive: true,

    maintainAspectRatio: false,

    cutout: '62%',


    animation: {

      duration: 900

    },


    plugins: {

      legend: {

        position: 'bottom',

        labels: {

          padding: 16,

          usePointStyle: true

        }

      },


      tooltip: {

        enabled: true,

        displayColors: false,


        callbacks: {

          label: (context) => {

            const valeur =
              Number(context.raw ?? 0);


            const total =
              this.nombreMenages;


            const pourcentage =
              total > 0

                ? ((valeur / total) * 100)
                    .toFixed(1)

                : '0';


            return ` ${this.formatNombre(
              valeur
            )} ménages (${pourcentage}%)`;

          }

        }

      }

    }

  };


  /*
   * ============================================================
   * PREPARATION DES GRAPHIQUES
   * ============================================================
   */

  private preparerGraphiques(): void {

    const zones =
      this.statistiques
        ?.statistiquesParZone ?? [];


    /*
     * ----------------------------------------------------------
     * GRAPHIQUE BARRES
     * Population par zone
     * ----------------------------------------------------------
     */

    this.populationBarChartData = {

      labels: zones.map(
        zone => zone.zone
      ),


      datasets: [

        {

          label: 'Population',


          data: zones.map(
            zone =>
              Number(
                zone.populationTotale ?? 0
              )
          ),


          borderWidth: 0,

          borderRadius: 8,

          barThickness: 28

        }

      ]

    };


    /*
     * ----------------------------------------------------------
     * GRAPHIQUE DOUGHNUT
     * Ménages par zone
     * ----------------------------------------------------------
     */

    this.zonesPieChartData = {

      labels: zones.map(
        zone => zone.zone
      ),


      datasets: [

        {

          data: zones.map(
            zone =>
              Number(
                zone.nombreMenages ?? 0
              )
          ),


          borderWidth: 3,

          hoverOffset: 12

        }

      ]

    };

  }

}