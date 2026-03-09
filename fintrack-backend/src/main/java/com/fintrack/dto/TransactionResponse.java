package com.fintrack.dto;

import com.fintrack.model.Transaction.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private TransactionType type;
    private String category;
    private BigDecimal amount;
    private String note;
    private LocalDate date;
    private Long userId;
}
