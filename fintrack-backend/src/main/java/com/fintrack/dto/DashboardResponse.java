package com.fintrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardResponse {

    // Monthly totals
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpense;
    private BigDecimal monthlySavings;

    // All-time totals
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal totalBalance;

    // Chart data
    private Map<String, BigDecimal> categoryBreakdown;      // Pie chart
    private List<MonthlyData> monthlyChart;                 // Bar chart

    // Recent transactions
    private List<TransactionResponse> recentTransactions;

    // Insights
    private List<String> insights;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MonthlyData {
        private String month;
        private BigDecimal income;
        private BigDecimal expense;
    }
}
