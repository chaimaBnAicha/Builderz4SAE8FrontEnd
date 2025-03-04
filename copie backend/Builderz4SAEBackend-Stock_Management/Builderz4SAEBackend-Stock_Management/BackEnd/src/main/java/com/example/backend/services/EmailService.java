package com.example.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendStockNotification(String stockName, String recipientEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("Trabelsi.Firas@gmail.com");
        message.setTo(recipientEmail);
        message.setSubject("Nouveau stock ajouté");
        message.setText("Un nouvel élément de stock '" + stockName + "' a été ajouté avec succès.");
        
        mailSender.send(message);
    }

    // Méthode de test
    public boolean testEmailConnection() {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("Trabelsi.Firas@gmail.com");
            message.setTo("jamliamine413@gmail.com");
            message.setSubject("Test Email");
            message.setText("Ceci est un email de test pour vérifier la configuration.");
            
            mailSender.send(message);
            return true;
        } catch (Exception e) {
            // Affichage détaillé de l'erreur
            System.err.println("Erreur détaillée lors de l'envoi d'email: ");
            e.printStackTrace();
            
            // Affichage de la cause racine
            Throwable rootCause = e;
            while (rootCause.getCause() != null) {
                rootCause = rootCause.getCause();
            }
            System.err.println("Cause racine: " + rootCause.getMessage());
            
            return false;
        }
    }
} 