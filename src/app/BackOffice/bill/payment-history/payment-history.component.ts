import { Component, OnInit } from '@angular/core';
import { PaymentService, PaymentHistoryItem } from '../../../services/payment.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss'],
  providers: [DatePipe]
})
export class PaymentHistoryComponent implements OnInit {
  payments: PaymentHistoryItem[] = [];
  filteredPayments: PaymentHistoryItem[] = [];
  loading = false;
  errorMessage: string | null = null;
  
  filterForm: FormGroup;
  
  // Pour les détails d'un paiement
  selectedPayment: PaymentHistoryItem | null = null;
  
  // Stats
  totalAmount = 0;
  
  constructor(
    private paymentService: PaymentService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      status: ['ALL'],
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    // Charger les données depuis le service
    this.loadPaymentHistory();
    
    // S'abonner aux changements de filtres
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadPaymentHistory(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.paymentService.getPaymentHistory().subscribe({
      next: (data) => {
        console.log('Historique des paiements reçu:', data);
        this.payments = data;
        this.filteredPayments = [...data];
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'historique des paiements:', error);
        this.errorMessage = `Erreur lors du chargement des données: ${error.message}`;
        this.loading = false;
        
        // Offrir la possibilité de charger les données statiques
        setTimeout(() => {
          if (confirm('Impossible de se connecter au serveur. Voulez-vous utiliser des données de démonstration?')) {
            this.loadFallbackData();
          }
        }, 500);
      }
    });
  }

  // Méthode de secours pour charger des données statiques en cas d'erreur API
  loadFallbackData(): void {
    this.paymentService.getStaticPaymentHistory().subscribe(data => {
      this.payments = data;
      this.filteredPayments = [...data];
      this.calculateStats();
      this.errorMessage = "Utilisation des données de démonstration (le serveur n'est pas disponible)";
    });
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    
    let filtered = [...this.payments];
    
    // Filtrer par date de début
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= startDate;
      });
    }
    
    // Filtrer par date de fin
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      // Ajouter un jour pour inclure toute la journée
      endDate.setDate(endDate.getDate() + 1);
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate < endDate;
      });
    }
    
    // Filtrer par statut
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(payment => payment.status === filters.status);
    }
    
    // Filtrer par terme de recherche (numéro de facture ou ID de paiement)
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(payment => 
        payment.billNumber.toLowerCase().includes(searchTerm) ||
        payment.paymentId.toLowerCase().includes(searchTerm)
      );
    }
    
    this.filteredPayments = filtered;
    this.calculateStats();
  }

  clearFilters(): void {
    this.filterForm.reset({
      startDate: '',
      endDate: '',
      status: 'ALL',
      searchTerm: ''
    });
  }

  viewPaymentDetails(payment: PaymentHistoryItem): void {
    // Charger les détails complets du paiement depuis le service
    this.loading = true;
    
    this.paymentService.getPaymentDetails(payment.paymentId).subscribe({
      next: (detailedPayment) => {
        console.log('Détails du paiement reçus:', detailedPayment);
        this.selectedPayment = detailedPayment;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails du paiement:', error);
        this.errorMessage = `Erreur: ${error.message || 'Détails introuvables'}`;
        this.loading = false;
        // Utiliser les données existantes comme fallback
        this.selectedPayment = payment;
      }
    });
  }

  closeDetails(): void {
    this.selectedPayment = null;
  }
  
  getFormattedDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy à HH:mm') || date;
  }
  
  // Calcul des statistiques
  calculateStats(): void {
    this.totalAmount = this.filteredPayments.reduce((sum, payment) => {
      return sum + (payment.amount || 0);
    }, 0);
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'succeeded':
        return 'bg-success';
      case 'processing':
        return 'bg-warning';
      case 'requires_payment_method':
        return 'bg-info';
      case 'canceled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
  
  getStatusDisplay(status: string): string {
    switch (status) {
      case 'succeeded':
        return 'Réussi';
      case 'processing':
        return 'En cours';
      case 'requires_payment_method':
        return 'En attente';
      case 'canceled':
        return 'Annulé';
      default:
        return status;
    }
  }
  
  exportToCsv(): void {
    if (this.filteredPayments.length === 0) {
      this.errorMessage = "Aucune donnée à exporter";
      return;
    }
    
    // Préparer les en-têtes CSV
    let csvContent = "Date,Numéro de facture,ID Paiement,Montant,Statut\n";
    
    // Ajouter les données
    this.filteredPayments.forEach(payment => {
      const row = [
        this.getFormattedDate(payment.date),
        payment.billNumber,
        payment.paymentId,
        payment.amount.toString(),
        this.getStatusDisplay(payment.status)
      ];
      
      // Échapper les virgules dans les champs
      const formattedRow = row.map(field => {
        if (field.includes(',')) {
          return `"${field}"`;
        }
        return field;
      });
      
      csvContent += formattedRow.join(',') + "\n";
    });
    
    // Créer un Blob et le télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `historique-paiements-${new Date().toISOString().split('T')[0]}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
