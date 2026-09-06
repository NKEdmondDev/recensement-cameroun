package com.mbemnova.recensement_cameroun.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record StatistiquesResponse(

        Long populationTotale,

        Long nombreMenages,

        BigDecimal tailleMoyenneMenage,

        String zoneAvecPlusHabitants,

        String zoneAvecAgeMoyenLePlusBas,

        String zoneAvecAgeMoyenLePlusEleve,

        String zoneAvecPlusFortTauxSurpeuplement,

        Map<String, String> typeLogementDominantParZone,

        List<StatistiqueZoneResponse> statistiquesParZone

) {
}