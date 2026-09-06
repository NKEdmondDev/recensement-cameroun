package com.mbemnova.recensement_cameroun.repository.projection;

public interface StatistiqueZoneProjection {

    String getZone();

    Long getNombreMenages();

    Long getPopulationTotale();

    Double getAgeMoyen();

    Double getTailleMoyenneMenage();

    Long getNombreMenagesSurpeuples();

    Double getTauxSurpeuplement();
}