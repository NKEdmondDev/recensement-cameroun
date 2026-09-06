package com.mbemnova.recensement_cameroun.controller;

import com.mbemnova.recensement_cameroun.dto.MenageRequest;
import com.mbemnova.recensement_cameroun.dto.MenageResponse;
import com.mbemnova.recensement_cameroun.dto.StatistiquesResponse;
import com.mbemnova.recensement_cameroun.service.MenageService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menages")
public class MenageController {

    private final MenageService menageService;

    public MenageController(MenageService menageService) {
        this.menageService = menageService;
    }

    // ============================================================
    // CREER UN MENAGE
    // ============================================================

    @PostMapping
    public ResponseEntity<MenageResponse> create(
            @Valid @RequestBody MenageRequest request
    ) {

        MenageResponse response =
                menageService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ============================================================
    // LISTE DES MENAGES
    // ============================================================

    @GetMapping
    public ResponseEntity<List<MenageResponse>> findAll() {

        return ResponseEntity.ok(
                menageService.findAll()
        );
    }

    // ============================================================
    // DETAIL D'UN MENAGE
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<MenageResponse> findById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                menageService.findById(id)
        );
    }

    // ============================================================
    // MODIFIER UN MENAGE
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<MenageResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody MenageRequest request
    ) {

        return ResponseEntity.ok(
                menageService.update(id, request)
        );
    }

    // ============================================================
    // SUPPRIMER UN MENAGE
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        menageService.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }

    // ============================================================
    // STATISTIQUES
    // ============================================================

    @GetMapping("/statistiques")
    public ResponseEntity<StatistiquesResponse> getStatistiques() {

        StatistiquesResponse statistiques =
                menageService.getStatistiques();

        return ResponseEntity.ok(statistiques);
    }
}