import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';
import { Liste } from './menages/liste/liste';
import { Detail } from './menages/detail/detail';
import { Formulaire } from './menages/formulaire/formulaire';
import { Statistiques } from './statistiques/statistiques';
import { Zones } from './zones/zones';

import { NotificationsPage } from './shared/pages/notifications/notifications-page/notifications-page';
import { Settings } from './shared/modals/settings/settings';

export const routes: Routes = [

  // =========================================================
  // RACINE
  // =========================================================

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },


  // =========================================================
  // DASHBOARD
  // =========================================================

  {
    path: 'dashboard',
    component: Dashboard
  },


  // =========================================================
  // MENAGES
  // =========================================================

  {
    path: 'menages',

    children: [

      {
        path: '',
        component: Liste
      },

      {
        path: 'nouveau',
        component: Formulaire
      },

      {
        path: ':id/modifier',
        component: Formulaire
      },

      {
        path: ':id',
        component: Detail
      }

    ]
  },


  // =========================================================
  // ZONES
  // =========================================================

  {
    path: 'zones',
    component: Zones
  },


  // =========================================================
  // STATISTIQUES
  // =========================================================

  {
    path: 'statistiques',
    component: Statistiques
  },


  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  {
    path: 'notifications',
    component: NotificationsPage
  },


  // =========================================================
  // PARAMETRES
  // =========================================================

  {
    path: 'parametres',
    component: Settings
  },


  // =========================================================
  // ROUTE INCONNUE
  // =========================================================

  {
    path: '**',
    redirectTo: 'dashboard'
  }

];