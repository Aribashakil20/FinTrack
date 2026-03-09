package com.fintrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BudgetResponse {
    private Long id;
    private String category;
    private BigDecimal limitAmount;
    private BigDecimal spent;
    private BigDecimal remaining;
    private double percentage;   // spent / limit * 100
    private boolean exceeded;
    private int month;
    private int year;
}
