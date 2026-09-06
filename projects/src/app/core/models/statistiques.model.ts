import { StatistiqueZone } from './statistique-zone.model';

export interface StatistiquesResponse {
  populationTotale: number;
  nombreMenages: number;
  tailleMoyenneMenage: number;

  zoneAvecPlusHabitants: string | null;
  zoneAvecAgeMoyenLePlusBas: string | null;
  zoneAvecAgeMoyenLePlusEleve: string | null;
  zoneAvecPlusFortTauxSurpeuplement: string | null;

  typeLogementDominantParZone: Record<string, string>;

  statistiquesParZone: StatistiqueZone[];
}