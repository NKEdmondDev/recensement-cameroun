package com.mbemnova.recensement_cameroun.dto;

import java.math.BigDecimal;

public record StatistiqueZoneResponse(

        String zone,

        Long nombreMenages,

        Long populationTotale,

        BigDecimal ageMoyen,

        BigDecimal tailleMoyenneMenage,

        Long nombreMenagesSurpeuples,

        BigDecimal tauxSurpeuplement

) {
}