package com.mbemnova.recensement_cameroun.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record MenageRequest(

        @NotBlank(message = "Le nom du chef de ménage est obligatoire")
        @Size(
                min = 2,
                max = 100,
                message = "Le chef de ménage doit contenir entre 2 et 100 caractères"
        )
        String chefMenage,

        @NotBlank(message = "La zone est obligatoire")
        @Size(
                min = 2,
                max = 100,
                message = "La zone doit contenir entre 2 et 100 caractères"
        )
        String zone,

        @NotNull(message = "Le nombre de personnes est obligatoire")
        @Min(
                value = 1,
                message = "Un ménage doit contenir au moins une personne"
        )
        @Max(
                value = 30,
                message = "Le nombre de personnes ne peut pas dépasser 30"
        )
        Integer nombrePersonnes,

        @NotNull(message = "L'âge moyen est obligatoire")
        @DecimalMin(
                value = "0.0",
                message = "L'âge moyen ne peut pas être négatif"
        )
        @DecimalMax(
                value = "120.0",
                message = "L'âge moyen ne peut pas dépasser 120 ans"
        )
        BigDecimal ageMoyen,

        @NotBlank(message = "Le type de logement est obligatoire")
        @Size(
                min = 2,
                max = 50,
                message = "Le type de logement doit contenir entre 2 et 50 caractères"
        )
        String typeLogement
) {
}