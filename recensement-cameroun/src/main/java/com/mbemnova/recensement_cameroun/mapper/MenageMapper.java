package com.mbemnova.recensement_cameroun.mapper;

import com.mbemnova.recensement_cameroun.dto.MenageRequest;
import com.mbemnova.recensement_cameroun.dto.MenageResponse;
import com.mbemnova.recensement_cameroun.entity.Menage;

import org.springframework.stereotype.Component;

@Component
public class MenageMapper {

    public Menage toEntity(MenageRequest request) {

        return Menage.builder()
                .chefMenage(normalize(request.chefMenage()))
                .zone(normalize(request.zone()))
                .nombrePersonnes(request.nombrePersonnes())
                .ageMoyen(request.ageMoyen())
                .typeLogement(normalize(request.typeLogement()))
                .build();
    }

    private String normalize(String value) {

        return value == null
                ? null
                : value.trim().replaceAll("\\s+", " ");
    }

    public MenageResponse toResponse(Menage menage) {

        return new MenageResponse(
                menage.getId(),
                menage.getChefMenage(),
                menage.getZone(),
                menage.getNombrePersonnes(),
                menage.getAgeMoyen(),
                menage.getTypeLogement(),
                menage.getDateCreation(),
                menage.getDateDerniereModification()
        );
    }
}