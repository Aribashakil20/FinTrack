package com.fintrack.service;

import com.fintrack.dto.BudgetRequest;
import com.fintrack.dto.BudgetResponse;
import com.fintrack.model.Budget;
import com.fintrack.model.Transaction.TransactionType;
import com.fintrack.model.User;
import com.fintrack.repository.BudgetRepository;
import com.fintrack.repository.TransactionRepository;
import com.fintrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public List<BudgetResponse> getBudgets(String email, int month, int year) {
        User user = getUser(email);
        return budgetRepository.findByUserIdAndMonthAndYear(user.getId(), month, year)
                .stream()
                .map(b -> enrichBudget(b, user.getId(), month, year))
                .collect(Collectors.toList());
    }

    public BudgetResponse saveBudget(String email, BudgetRequest req) {
        User user = getUser(email);
        Budget budget = budgetRepository
                .findByUserIdAndCategoryAndMonthAndYear(user.getId(), req.getCategory().toUpperCase(), req.getMonth(), req.getYear())
                .orElse(Budget.builder().user(user).build());

        budget.setCategory(req.getCategory().toUpperCase());
        budget.setLimitAmount(req.getLimitAmount());
        budget.setMonth(req.getMonth());
        budget.setYear(req.getYear());

        return enrichBudget(budgetRepository.save(budget), user.getId(), req.getMonth(), req.getYear());
    }

    public void deleteBudget(String email, Long id) {
        User user = getUser(email);
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        if (!budget.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");
        budgetRepository.delete(budget);
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private BudgetResponse enrichBudget(Budget b, Long userId, int month, int year) {
        LocalDate from = LocalDate.of(year, month, 1);
        LocalDate to = from.withDayOfMonth(from.lengthOfMonth());

        List<Object[]> breakdown = transactionRepository.categorySpendingInRange(userId, from, to);
        BigDecimal spent = breakdown.stream()
                .filter(r -> r[0].toString().equalsIgnoreCase(b.getCategory()))
                .map(r -> (BigDecimal) r[1])
                .findFirst()
                .orElse(BigDecimal.ZERO);

        BigDecimal remaining = b.getLimitAmount().subtract(spent);
        double pct = b.getLimitAmount().compareTo(BigDecimal.ZERO) > 0
                ? spent.divide(b.getLimitAmount(), 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0;

        return BudgetResponse.builder()
                .id(b.getId())
                .category(b.getCategory())
                .limitAmount(b.getLimitAmount())
                .spent(spent)
                .remaining(remaining)
                .percentage(Math.min(pct, 100))
                .exceeded(spent.compareTo(b.getLimitAmount()) > 0)
                .month(b.getMonth())
                .year(b.getYear())
                .build();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
