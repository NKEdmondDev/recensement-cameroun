package com.mbemnova.recensement_cameroun.repository;

import com.mbemnova.recensement_cameroun.entity.Menage;
import com.mbemnova.recensement_cameroun.repository.projection.StatistiqueZoneProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenageRepository extends JpaRepository<Menage, Long> {

    /*
     * ============================================================
     * STATISTIQUES GENERALES
     * ============================================================
     */

    @Query("""
            SELECT COALESCE(SUM(m.nombrePersonnes), 0)
            FROM Menage m
            """)
    long findPopulationTotale();

    @Query("""
            SELECT COUNT(m)
            FROM Menage m
            """)
    long findNombreMenages();

    @Query("""
            SELECT COALESCE(AVG(m.nombrePersonnes), 0)
            FROM Menage m
            """)
    Double findTailleMoyenneMenage();


    /*
     * ============================================================
     * STATISTIQUES PAR ZONE
     * ============================================================
     */

    @Query("""
            SELECT
                m.zone AS zone,
                COUNT(m) AS nombreMenages,
                COALESCE(SUM(m.nombrePersonnes), 0) AS populationTotale,
                COALESCE(AVG(m.ageMoyen), 0) AS ageMoyen,
                COALESCE(AVG(m.nombrePersonnes), 0) AS tailleMoyenneMenage,
                SUM(
                    CASE
                        WHEN m.nombrePersonnes > 5 THEN 1
                        ELSE 0
                    END
                ) AS nombreMenagesSurpeuples,
                (
                    SUM(
                        CASE
                            WHEN m.nombrePersonnes > 5 THEN 1
                            ELSE 0
                        END
                    ) * 100.0 / COUNT(m)
                ) AS tauxSurpeuplement
            FROM Menage m
            GROUP BY m.zone
            ORDER BY m.zone ASC
            """)
    List<StatistiqueZoneProjection> findStatistiquesParZone();


    /*
     * ============================================================
     * ZONE AVEC LE PLUS D'HABITANTS
     * ============================================================
     */

    @Query("""
            SELECT m.zone
            FROM Menage m
            GROUP BY m.zone
            ORDER BY SUM(m.nombrePersonnes) DESC, m.zone ASC
            """)
    List<String> findZonesOrderByPopulationDesc();


    /*
     * ============================================================
     * ZONE AVEC L'AGE MOYEN LE PLUS BAS
     * ============================================================
     */

    @Query("""
            SELECT m.zone
            FROM Menage m
            GROUP BY m.zone
            ORDER BY AVG(m.ageMoyen) ASC, m.zone ASC
            """)
    List<String> findZonesOrderByAgeMoyenAsc();


    /*
     * ============================================================
     * ZONE AVEC L'AGE MOYEN LE PLUS ELEVE
     * ============================================================
     */

    @Query("""
            SELECT m.zone
            FROM Menage m
            GROUP BY m.zone
            ORDER BY AVG(m.ageMoyen) DESC, m.zone ASC
            """)
    List<String> findZonesOrderByAgeMoyenDesc();


    /*
     * ============================================================
     * ZONE AVEC LE PLUS FORT TAUX DE SURPEUPLEMENT
     * ============================================================
     *
     * En cas d'égalité, la zone dont le nom vient en premier
     * dans l'ordre alphabétique est sélectionnée.
     */

    @Query("""
            SELECT m.zone
            FROM Menage m
            GROUP BY m.zone
            ORDER BY
                (
                    SUM(
                        CASE
                            WHEN m.nombrePersonnes > 5 THEN 1
                            ELSE 0
                        END
                    ) * 100.0 / COUNT(m)
                ) DESC,
                m.zone ASC
            """)
    List<String> findZonesOrderBySurpeuplementDesc();


    /*
     * ============================================================
     * TYPE DE LOGEMENT DOMINANT PAR ZONE
     * ============================================================
     *
     * En cas d'égalité entre plusieurs types de logement,
     * le type de logement alphabétiquement premier est retenu.
     *
     * ROW_NUMBER() garantit une seule ligne par zone.
     */

    @Query(value = """
            SELECT zone, type_logement
            FROM (
                SELECT
                    zone,
                    type_logement,
                    COUNT(*) AS nombre,
                    ROW_NUMBER() OVER (
                        PARTITION BY zone
                        ORDER BY COUNT(*) DESC, type_logement ASC
                    ) AS rang
                FROM menages
                GROUP BY zone, type_logement
            ) statistiques
            WHERE rang = 1
            ORDER BY zone ASC
            """, nativeQuery = true)
    List<Object[]> findTypeLogementDominantParZone();
}