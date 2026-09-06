package com.mbemnova.recensement_cameroun.dto;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(

        LocalDateTime timestamp,

        int status,


        String message,

        String path,

        String requestURI, Map<String, String> validationErrors
) {
}