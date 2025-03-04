package com.example.backend.controllers;

import com.example.backend.entities.Stock;
import com.example.backend.services.IStockService;
import com.example.backend.services.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/spring/stock")
@CrossOrigin(origins = "*")
public class StockController {

    @Autowired
    private IStockService stockService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JavaMailSender mailSender;


    // Create
    @PostMapping("/add")
    public ResponseEntity<?> addStock(@Valid @RequestBody Stock stock, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errors);
        }
        
        Stock savedStock = stockService.addStock(stock);
        return ResponseEntity.ok(savedStock);
    }

    // Read all
    @GetMapping("/all")
    public List<Stock> getAllStocks() {
        return stockService.getAllStocks();
    }

    //Read by ID
    @GetMapping("/{id}")
    public ResponseEntity<Stock> getStockById(@PathVariable("id") Integer id) {
        Stock stock = stockService.getStockById(id);
        if (stock != null) {
            return ResponseEntity.ok(stock);
        }
        return ResponseEntity.notFound().build();
    }

    // Update
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateStock(@PathVariable("id") Integer id, 
                                       @Valid @RequestBody Stock stock, 
                                       BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            Stock updatedStock = stockService.updateStock(id, stock);
            if (updatedStock != null) {
                return ResponseEntity.ok(updatedStock);
            }
            return ResponseEntity.notFound().build();
        } catch (OptimisticLockingFailureException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Cette ressource a été modifiée par un autre utilisateur. Veuillez rafraîchir et réessayer.");
            return ResponseEntity.status(409).body(error);
        }
    }

    // Delete
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable("id") Integer id) {
        boolean deleted = stockService.deleteStock(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/test-email")
    public String testEmail() {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("Trabelsi.Firas@esprit.tn");
        message.setTo("jamliamine413@gmail.com");
        message.setSubject("Test SMTP");
        message.setText("Ceci est un test");

        try {
            mailSender.send(message);
            return "Email envoyé avec succès !";
        } catch (MailException e) {
            e.printStackTrace();
            return "Erreur d'envoi : " + e.getMessage();
        }
    }

    @GetMapping("/stats/count-by-category")
    public ResponseEntity<Map<String, Long>> getStockCountByCategory() {
        return ResponseEntity.ok(stockService.getStockCountByCategory());
    }

    @GetMapping("/stats/value-by-category")
    public ResponseEntity<Map<String, Double>> getTotalValueByCategory() {
        return ResponseEntity.ok(stockService.getTotalValueByCategory());
    }

    @GetMapping("/stats/low-stock")
    public ResponseEntity<List<Stock>> getLowStockProducts() {
        return ResponseEntity.ok(stockService.getLowStockProducts());
    }

    @GetMapping("/stats/total-value")
    public ResponseEntity<Double> getTotalStockValue() {
        return ResponseEntity.ok(stockService.getTotalStockValue());
    }

    @GetMapping("/stats/average-price-by-category")
    public ResponseEntity<Map<String, Double>> getAveragePriceByCategory() {
        return ResponseEntity.ok(stockService.getAveragePriceByCategory());
    }

    @GetMapping("/test")
    @ResponseBody
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Controller is working!");
    }

    @GetMapping("/stats/test")
    public ResponseEntity<Long> testStats() {
        return ResponseEntity.ok(0L);
    }
}
