package com.mbemnova.recensement_cameroun.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MenageResponse(

        Long id,

        String chefMenage,

        String zone,

        Integer nombrePersonnes,

        BigDecimal ageMoyen,

        String typeLogement,

        LocalDateTime dateCreation,

        LocalDateTime dateDerniereModification
) {
}