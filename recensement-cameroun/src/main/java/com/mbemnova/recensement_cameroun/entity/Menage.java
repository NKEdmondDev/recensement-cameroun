package com.mbemnova.recensement_cameroun.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "menages",
        indexes = {
                @Index(
                        name = "idx_menage_zone",
                        columnList = "zone"
                ),
                @Index(
                        name = "idx_menage_date_creation",
                        columnList = "date_creation"
                )
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded = true)
public class Menage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ToString.Include
    private Long id;

    @NotBlank(message = "Le nom du chef de ménage est obligatoire")
    @Size(
            min = 2,
            max = 100,
            message = "Le chef de ménage doit contenir entre 2 et 100 caractères"
    )
    @Column(
            name = "chef_menage",
            nullable = false,
            length = 100
    )
    @ToString.Include
    private String chefMenage;

    @NotBlank(message = "La zone est obligatoire")
    @Size(
            min = 2,
            max = 100,
            message = "La zone doit contenir entre 2 et 100 caractères"
    )
    @Column(
            name = "zone",
            nullable = false,
            length = 100
    )
    @ToString.Include
    private String zone;

    @NotNull(message = "Le nombre de personnes est obligatoire")
    @Min(
            value = 1,
            message = "Un ménage doit contenir au moins une personne"
    )
    @Max(
            value = 30,
            message = "Le nombre de personnes ne peut pas dépasser 30"
    )
    @Column(
            name = "nombre_personnes",
            nullable = false
    )
    private Integer nombrePersonnes;

    @NotNull(message = "L'âge moyen est obligatoire")
    @DecimalMin(
            value = "0.0",
            inclusive = true,
            message = "L'âge moyen ne peut pas être négatif"
    )
    @DecimalMax(
            value = "120.0",
            inclusive = true,
            message = "L'âge moyen ne peut pas dépasser 120 ans"
    )
    @Column(
            name = "age_moyen",
            nullable = false,
            precision = 5,
            scale = 2
    )
    private BigDecimal ageMoyen;

    @NotBlank(message = "Le type de logement est obligatoire")
    @Size(
            min = 2,
            max = 50,
            message = "Le type de logement doit contenir entre 2 et 50 caractères"
    )
    @Column(
            name = "type_logement",
            nullable = false,
            length = 50
    )
    @ToString.Include
    private String typeLogement;

    @Column(
            name = "date_creation",
            nullable = false,
            updatable = false
    )
    private LocalDateTime dateCreation;

    @Column(
            name = "date_derniere_modification",
            nullable = false
    )
    private LocalDateTime dateDerniereModification;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        this.dateCreation = now;
        this.dateDerniereModification = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.dateDerniereModification = LocalDateTime.now();
    }
}