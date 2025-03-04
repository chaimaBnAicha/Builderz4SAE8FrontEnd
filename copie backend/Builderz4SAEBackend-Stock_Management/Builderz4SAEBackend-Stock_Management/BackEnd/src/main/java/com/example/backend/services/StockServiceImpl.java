package com.example.backend.services;

import com.example.backend.entities.Stock;
import com.example.backend.repositories.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class StockServiceImpl implements IStockService {

    @Autowired
    private StockRepository stockRepository;
    
    @Autowired
    private EmailService emailService;

    @Override
    public Stock addStock(Stock stock) {
        validateStock(stock);
        Stock savedStock = stockRepository.save(stock);
        
        // Envoyer l'email de notification
        try {
            emailService.sendStockNotification(
                savedStock.getName(),
                "destinataire@email.com" // Email du destinataire
            );
        } catch (Exception e) {
            // Log l'erreur mais ne pas bloquer la création du stock
            System.err.println("Erreur lors de l'envoi de l'email: " + e.getMessage());
        }
        
        return savedStock;
    }

    @Override
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    @Override
    public Stock getStockById(Integer id) {
        return stockRepository.findById(id).orElse(null);
    }

    @Override
    public Stock updateStock(Integer id, Stock stock) {
        Stock existingStock = stockRepository.findById(id).orElse(null);
        if (existingStock != null) {
            validateStock(stock);
            
            existingStock.setName(stock.getName());
            existingStock.setDescription(stock.getDescription());
            existingStock.setQuantity(stock.getQuantity());
            existingStock.setUnitPrice(stock.getUnitPrice());
            existingStock.setCategory(stock.getCategory());
            return stockRepository.save(existingStock);
        }
        return null;
    }

    @Override
    public boolean deleteStock(Integer id_stock) {
        if (stockRepository.existsById(id_stock)) {
            stockRepository.deleteById(id_stock);
            return true;
        }
        return false;
    }

    @Override
    public Map<String, Long> getStockCountByCategory() {
        List<Object[]> results = stockRepository.countByCategory();
        Map<String, Long> countByCategory = new HashMap<>();
        for (Object[] result : results) {
            countByCategory.put(((Stock.Category) result[0]).name(), (Long) result[1]);
        }
        return countByCategory;
    }

    @Override
    public Map<String, Double> getTotalValueByCategory() {
        List<Object[]> results = stockRepository.totalValueByCategory();
        Map<String, Double> valueByCategory = new HashMap<>();
        for (Object[] result : results) {
            valueByCategory.put(((Stock.Category) result[0]).name(), (Double) result[1]);
        }
        return valueByCategory;
    }

    @Override
    public List<Stock> getLowStockProducts() {
        return stockRepository.findLowStockProducts();
    }

    @Override
    public Double getTotalStockValue() {
        return stockRepository.getTotalStockValue();
    }

    @Override
    public Map<String, Double> getAveragePriceByCategory() {
        List<Object[]> results = stockRepository.averagePriceByCategory();
        Map<String, Double> avgByCategory = new HashMap<>();
        for (Object[] result : results) {
            avgByCategory.put(((Stock.Category) result[0]).name(), (Double) result[1]);
        }
        return avgByCategory;
    }

    private void validateStock(Stock stock) {
        if (stock.getQuantity() > 10000) {
            throw new IllegalArgumentException("La quantité ne peut pas dépasser 10000 unités");
        }
        if (stock.getUnitPrice() > 100000) {
            throw new IllegalArgumentException("Le prix unitaire ne peut pas dépasser 100000");
        }
    }
} 