package com.mbemnova.recensement_cameroun.service;

import com.mbemnova.recensement_cameroun.dto.MenageRequest;
import com.mbemnova.recensement_cameroun.dto.MenageResponse;
import com.mbemnova.recensement_cameroun.dto.StatistiquesResponse;

import java.util.List;

public interface MenageService {

    MenageResponse create(MenageRequest request);

    MenageResponse findById(Long id);

    List<MenageResponse> findAll();

    MenageResponse update(Long id, MenageRequest request);

    void delete(Long id);

    StatistiquesResponse getStatistiques();
}