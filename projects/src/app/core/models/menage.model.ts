export interface Menage {
  id: number;
  chefMenage: string;
  zone: string;
  nombrePersonnes: number;
  ageMoyen: number;
  typeLogement: string;
  dateCreation: string;
  dateDerniereModification: string;
}

export interface MenageRequest {
  chefMenage: string;
  zone: string;
  nombrePersonnes: number;
  ageMoyen: number;
  typeLogement: string;
}