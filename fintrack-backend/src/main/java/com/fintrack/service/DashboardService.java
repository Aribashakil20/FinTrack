package com.fintrack.service;

import com.fintrack.dto.DashboardResponse;
import com.fintrack.dto.DashboardResponse.MonthlyData;
import com.fintrack.model.Transaction.TransactionType;
import com.fintrack.model.User;
import com.fintrack.repository.TransactionRepository;
import com.fintrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final TransactionService transactionService;

    public DashboardResponse getDashboard(String email) {
        User user = getUser(email);
        Long uid = user.getId();
        int year = LocalDate.now().getYear();

        LocalDate monthStart = LocalDate.now().withDayOfMonth(1);
        LocalDate monthEnd   = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());

        // Monthly totals
        BigDecimal monthIncome  = orZero(transactionRepository.sumByUserTypeAndDateRange(uid, TransactionType.INCOME,  monthStart, monthEnd));
        BigDecimal monthExpense = orZero(transactionRepository.sumByUserTypeAndDateRange(uid, TransactionType.EXPENSE, monthStart, monthEnd));
        BigDecimal monthSavings = monthIncome.subtract(monthExpense);

        // All-time totals
        List<Object[]> incomeRows  = transactionRepository.monthlyTotals(uid, TransactionType.INCOME,  year);
        List<Object[]> expenseRows = transactionRepository.monthlyTotals(uid, TransactionType.EXPENSE, year);
        BigDecimal totalIncome  = incomeRows.stream().map(r -> (BigDecimal) r[1]).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpense = expenseRows.stream().map(r -> (BigDecimal) r[1]).reduce(BigDecimal.ZERO, BigDecimal::add);

        // Category breakdown (this month)
        List<Object[]> breakdown = transactionRepository.expenseBreakdownByCategory(uid, monthStart, monthEnd);
        Map<String, BigDecimal> categoryBreakdown = new LinkedHashMap<>();
        breakdown.forEach(r -> categoryBreakdown.put(r[0].toString(), (BigDecimal) r[1]));

        // Monthly chart (full year)
        Map<Integer, BigDecimal> incomeMap  = toMonthMap(incomeRows);
        Map<Integer, BigDecimal> expenseMap = toMonthMap(expenseRows);
        List<MonthlyData> chart = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            chart.add(MonthlyData.builder()
                    .month(Month.of(m).name().substring(0, 3))
                    .income(incomeMap.getOrDefault(m, BigDecimal.ZERO))
                    .expense(expenseMap.getOrDefault(m, BigDecimal.ZERO))
                    .build());
        }

        // Recent 5 transactions
        var recentTx = transactionRepository.findByUserIdOrderByDateDesc(uid)
                .stream().limit(5).map(transactionService::toResponse).collect(Collectors.toList());

        // Insights
        List<String> insights = generateInsights(categoryBreakdown, monthIncome, monthExpense);

        return DashboardResponse.builder()
                .monthlyIncome(monthIncome)
                .monthlyExpense(monthExpense)
                .monthlySavings(monthSavings)
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .totalBalance(totalIncome.subtract(totalExpense))
                .categoryBreakdown(categoryBreakdown)
                .monthlyChart(chart)
                .recentTransactions(recentTx)
                .insights(insights)
                .build();
    }

    // ── insight generation ────────────────────────────────────────────────────

    private List<String> generateInsights(Map<String, BigDecimal> breakdown,
                                           BigDecimal income, BigDecimal expense) {
        List<String> insights = new ArrayList<>();

        if (income.compareTo(BigDecimal.ZERO) > 0) {
            double savingsRate = income.subtract(expense)
                    .divide(income, 4, java.math.RoundingMode.HALF_UP)
                    .doubleValue() * 100;
            if (savingsRate >= 20)
                insights.add(String.format("Great job! You saved %.0f%% of your income this month.", savingsRate));
            else if (savingsRate > 0)
                insights.add(String.format("You saved %.0f%% of your income. Try to save at least 20%%.", savingsRate));
            else
                insights.add("Your expenses exceeded your income this month. Review your spending.");
        }

        if (!breakdown.isEmpty()) {
            String topCategory = breakdown.entrySet().stream()
                    .max(Map.Entry.comparingByValue()).get().getKey();
            BigDecimal topAmount = breakdown.get(topCategory);
            insights.add(String.format("Highest spending: %s (₹%.2f)", capitalize(topCategory), topAmount));
        }

        if (expense.compareTo(BigDecimal.ZERO) > 0 && breakdown.containsKey("FOOD")) {
            double foodPct = breakdown.get("FOOD")
                    .divide(expense, 4, java.math.RoundingMode.HALF_UP)
                    .doubleValue() * 100;
            if (foodPct > 40)
                insights.add(String.format("Food accounts for %.0f%% of your expenses. Consider meal planning.", foodPct));
        }

        return insights;
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private Map<Integer, BigDecimal> toMonthMap(List<Object[]> rows) {
        Map<Integer, BigDecimal> map = new HashMap<>();
        rows.forEach(r -> map.put(((Number) r[0]).intValue(), (BigDecimal) r[1]));
        return map;
    }

    private BigDecimal orZero(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return s.charAt(0) + s.substring(1).toLowerCase();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
