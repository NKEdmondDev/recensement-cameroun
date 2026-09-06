package com.mbemnova.recensement_cameroun.service;

import com.mbemnova.recensement_cameroun.dto.MenageRequest;
import com.mbemnova.recensement_cameroun.dto.MenageResponse;
import com.mbemnova.recensement_cameroun.dto.StatistiqueZoneResponse;
import com.mbemnova.recensement_cameroun.dto.StatistiquesResponse;
import com.mbemnova.recensement_cameroun.entity.Menage;
import com.mbemnova.recensement_cameroun.exception.ResourceNotFoundException;
import com.mbemnova.recensement_cameroun.mapper.MenageMapper;
import com.mbemnova.recensement_cameroun.repository.MenageRepository;
import com.mbemnova.recensement_cameroun.repository.projection.StatistiqueZoneProjection;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class MenageServiceImpl implements MenageService {

    private final MenageRepository menageRepository;
    private final MenageMapper menageMapper;

    public MenageServiceImpl(
            MenageRepository menageRepository,
            MenageMapper menageMapper
    ) {
        this.menageRepository = menageRepository;
        this.menageMapper = menageMapper;
    }

    // ============================================================
    // CREATION
    // ============================================================

    @Override
    public MenageResponse create(MenageRequest request) {

        Menage menage =
                menageMapper.toEntity(request);

        Menage savedMenage =
                menageRepository.save(menage);

        return menageMapper.toResponse(savedMenage);
    }

    // ============================================================
    // RECHERCHE PAR ID
    // ============================================================

    @Override
    @Transactional(readOnly = true)
    public MenageResponse findById(Long id) {

        Menage menage =
                menageRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Ménage introuvable avec l'identifiant : "
                                                + id
                                )
                        );

        return menageMapper.toResponse(menage);
    }

    // ============================================================
    // LISTE
    // ============================================================

    @Override
    @Transactional(readOnly = true)
    public List<MenageResponse> findAll() {

        return menageRepository.findAll()
                .stream()
                .map(menageMapper::toResponse)
                .toList();
    }

    // ============================================================
    // MODIFICATION
    // ============================================================

    @Override
    public MenageResponse update(
            Long id,
            MenageRequest request
    ) {

        Menage menage =
                menageRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Ménage introuvable avec l'identifiant : "
                                                + id
                                )
                        );

        menage.setChefMenage(
                normalize(request.chefMenage())
        );

        menage.setZone(
                normalize(request.zone())
        );

        menage.setNombrePersonnes(
                request.nombrePersonnes()
        );

        menage.setAgeMoyen(
                request.ageMoyen()
        );

        menage.setTypeLogement(
                normalize(request.typeLogement())
        );

        Menage updatedMenage =
                menageRepository.save(menage);

        return menageMapper.toResponse(updatedMenage);
    }

    // ============================================================
    // SUPPRESSION
    // ============================================================

    @Override
    public void delete(Long id) {

        Menage menage =
                menageRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Ménage introuvable avec l'identifiant : "
                                                + id
                                )
                        );

        menageRepository.delete(menage);
    }

    // ============================================================
    // STATISTIQUES
    // ============================================================

    @Override
    @Transactional(readOnly = true)
    public StatistiquesResponse getStatistiques() {

        long populationTotale =
                menageRepository.findPopulationTotale();

        long nombreMenages =
                menageRepository.findNombreMenages();

        Double tailleMoyenne =
                menageRepository.findTailleMoyenneMenage();

        String zoneAvecPlusHabitants =
                firstOrNull(
                        menageRepository
                                .findZonesOrderByPopulationDesc()
                );

        String zoneAvecAgeMoyenLePlusBas =
                firstOrNull(
                        menageRepository
                                .findZonesOrderByAgeMoyenAsc()
                );

        String zoneAvecAgeMoyenLePlusEleve =
                firstOrNull(
                        menageRepository
                                .findZonesOrderByAgeMoyenDesc()
                );

        String zoneAvecPlusFortTauxSurpeuplement =
                firstOrNull(
                        menageRepository
                                .findZonesOrderBySurpeuplementDesc()
                );

        Map<String, String>
                typeLogementDominantParZone =
                findTypeLogementDominantParZone();

        List<StatistiqueZoneResponse>
                statistiquesParZone =
                menageRepository
                        .findStatistiquesParZone()
                        .stream()
                        .map(this::toStatistiqueZoneResponse)
                        .toList();

        return new StatistiquesResponse(
                populationTotale,
                nombreMenages,
                toBigDecimal(tailleMoyenne),
                zoneAvecPlusHabitants,
                zoneAvecAgeMoyenLePlusBas,
                zoneAvecAgeMoyenLePlusEleve,
                zoneAvecPlusFortTauxSurpeuplement,
                typeLogementDominantParZone,
                statistiquesParZone
        );
    }

    // ============================================================
    // TYPE DE LOGEMENT DOMINANT PAR ZONE
    // ============================================================

    private Map<String, String>
    findTypeLogementDominantParZone() {

        List<Object[]> results =
                menageRepository
                        .findTypeLogementDominantParZone();

        Map<String, String> statistiques =
                new LinkedHashMap<>();

        for (Object[] result : results) {

            if (result == null || result.length < 2) {
                continue;
            }

            String zone =
                    result[0] != null
                            ? result[0].toString()
                            : null;

            String typeLogement =
                    result[1] != null
                            ? result[1].toString()
                            : null;

            if (zone != null && typeLogement != null) {
                statistiques.put(
                        zone,
                        typeLogement
                );
            }
        }

        return statistiques;
    }

    // ============================================================
    // CONVERSION STATISTIQUE
    // ============================================================

    private StatistiqueZoneResponse
    toStatistiqueZoneResponse(
            StatistiqueZoneProjection projection
    ) {

        return new StatistiqueZoneResponse(
                projection.getZone(),
                projection.getNombreMenages(),
                projection.getPopulationTotale(),
                toBigDecimal(
                        projection.getAgeMoyen()
                ),
                toBigDecimal(
                        projection.getTailleMoyenneMenage()
                ),
                projection.getNombreMenagesSurpeuples(),
                toBigDecimal(
                        projection.getTauxSurpeuplement()
                )
        );
    }

    // ============================================================
    // OUTILS
    // ============================================================

    private String firstOrNull(
            List<String> values
    ) {

        if (values == null || values.isEmpty()) {
            return null;
        }

        return values.get(0);
    }

    private BigDecimal toBigDecimal(
            Double value
    ) {

        if (value == null) {
            return BigDecimal.ZERO;
        }

        return BigDecimal.valueOf(value);
    }

    private String normalize(String value) {

        return value == null
                ? null
                : value.trim()
                .replaceAll("\\s+", " ");
    }
}