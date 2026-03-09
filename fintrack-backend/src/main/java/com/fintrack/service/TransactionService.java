package com.fintrack.service;

import com.fintrack.dto.TransactionRequest;
import com.fintrack.dto.TransactionResponse;
import com.fintrack.model.Transaction;
import com.fintrack.model.User;
import com.fintrack.repository.TransactionRepository;
import com.fintrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public List<TransactionResponse> getAllTransactions(String email) {
        User user = getUser(email);
        return transactionRepository.findByUserIdOrderByDateDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TransactionResponse createTransaction(String email, TransactionRequest req) {
        User user = getUser(email);
        Transaction tx = Transaction.builder()
                .user(user)
                .type(req.getType())
                .category(req.getCategory().toUpperCase())
                .amount(req.getAmount())
                .note(req.getNote())
                .date(req.getDate())
                .build();
        return toResponse(transactionRepository.save(tx));
    }

    public TransactionResponse updateTransaction(String email, Long id, TransactionRequest req) {
        User user = getUser(email);
        Transaction tx = findOwnedTransaction(id, user.getId());
        tx.setType(req.getType());
        tx.setCategory(req.getCategory().toUpperCase());
        tx.setAmount(req.getAmount());
        tx.setNote(req.getNote());
        tx.setDate(req.getDate());
        return toResponse(transactionRepository.save(tx));
    }

    public void deleteTransaction(String email, Long id) {
        User user = getUser(email);
        Transaction tx = findOwnedTransaction(id, user.getId());
        transactionRepository.delete(tx);
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private Transaction findOwnedTransaction(Long txId, Long userId) {
        Transaction tx = transactionRepository.findById(txId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        if (!tx.getUser().getId().equals(userId))
            throw new RuntimeException("Unauthorized");
        return tx;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    public TransactionResponse toResponse(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .type(t.getType())
                .category(t.getCategory())
                .amount(t.getAmount())
                .note(t.getNote())
                .date(t.getDate())
                .userId(t.getUser().getId())
                .build();
    }
}
