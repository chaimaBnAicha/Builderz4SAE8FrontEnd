import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, delay, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Types pour les réponses de l'API
export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  publicKey?: string;
}

export interface PaymentConfirmationResponse {
  message: string;
  bill: any;
}

export interface StripeConfig {
  publicKey: string;
}

// Nouveau type pour l'historique des paiements
export interface PaymentHistoryItem {
  paymentId: string;
  billId: number;
  billNumber: string;
  date: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  metadata?: {
    stockId?: number;
    stockName?: string;
    processingDate?: string;
    paymentMode?: string;
    paymentStatus?: string;
    [key: string]: any; // Pour d'autres métadonnées
  };
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = environment.apiUrl;
  private stripePublicKey = environment.stripePublicKey;
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { 
    console.log('PaymentService initialized with API URL:', this.apiUrl);
    console.log('Stripe public key configured:', this.stripePublicKey ? 'Yes (hidden for security)' : 'No');
  }

  /**
   * Récupère la configuration de Stripe (clé publique)
   */
  getStripeConfig(): Observable<StripeConfig> {
    // Pour éviter des problèmes de réseau, renvoyer directement la clé provenant de environment
    return of({ publicKey: this.stripePublicKey });
    
    // Si vous voulez toujours essayer de récupérer du serveur d'abord
    /*
    return this.http.get<StripeConfig>(`${this.apiUrl}/payment/config`).pipe(
      tap(config => console.log('Stripe config retrieved successfully')),
      catchError(error => {
        console.error('Error fetching Stripe config:', error);
        // Fallback à la clé locale en cas d'erreur
        return of({ publicKey: this.stripePublicKey });
      })
    );
    */
  }

  /**
   * Crée un PaymentIntent Stripe pour une facture
   */
  createPaymentIntent(billId: number): Observable<PaymentIntentResponse> {
    console.log(`Creating payment intent for bill ${billId} at API endpoint:`, `${this.apiUrl}/payment/create-payment-intent/${billId}`);
    
    return this.http.post<PaymentIntentResponse>(
      `${this.apiUrl}/payment/create-payment-intent/${billId}`, 
      {}, 
      this.httpOptions
    ).pipe(
      tap(response => {
        console.log('Payment intent created:', response);
        // Ensure public key is set
        if (!response.publicKey) {
          console.log('Public key not included in response, using environment value');
          response.publicKey = this.stripePublicKey;
        }
      }),
      catchError(this.handleError('createPaymentIntent'))
    );
  }

  /**
   * Confirme un paiement après qu'il ait été traité avec succès
   */
  confirmPayment(billId: number, paymentIntentId: string): Observable<PaymentConfirmationResponse> {
    return this.http.post<PaymentConfirmationResponse>(
      `${this.apiUrl}/payment/confirm/${billId}/${paymentIntentId}`, 
      {}, 
      this.httpOptions
    ).pipe(
      tap(response => console.log('Payment confirmed successfully')),
      catchError(this.handleError('confirmPayment'))
    );
  }

  /**
   * Annule un paiement en cours
   */
  cancelPayment(paymentIntentId: string): Observable<{ message: string, status: string }> {
    return this.http.post<{ message: string, status: string }>(
      `${this.apiUrl}/payment/cancel/${paymentIntentId}`, 
      {}, 
      this.httpOptions
    ).pipe(
      tap(response => console.log('Payment canceled successfully')),
      catchError(this.handleError('cancelPayment'))
    );
  }

  /**
   * Vérifie le statut d'un payment intent
   */
  checkPaymentStatus(paymentIntentId: string): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(
      `${this.apiUrl}/payment/status/${paymentIntentId}`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError('checkPaymentStatus'))
    );
  }

  /**
   * Récupère l'historique des paiements
   */
  getPaymentHistory(): Observable<PaymentHistoryItem[]> {
    const apiEndpoint = `${this.apiUrl}/payment/history`;
    console.log('Fetching payment history from API endpoint:', apiEndpoint);
    
    return this.http.get<any>(
      apiEndpoint,
      this.httpOptions
    ).pipe(
      map(response => {
        console.log('Raw payment history response:', response);
        
        // Transform the API response into our PaymentHistoryItem format
        if (response && response.payments) {
          return response.payments.map((payment: any) => {
            // Generate a payment ID if not provided
            const paymentId = payment.paymentId || `pi_${payment.billId}_${this.generateRandomHash()}`;
            
            return {
              paymentId: paymentId,
              billId: payment.billId,
              billNumber: payment.billNumber || `BILL-${payment.billId}`,
              date: payment.date,
              amount: payment.amount,
              status: payment.status || 'succeeded',
              paymentMethod: payment.paymentMethod || 'Carte bancaire',
              metadata: payment.metadata || {
                stockId: payment.stock?.id || null,
                stockName: payment.stock?.name || 'Non spécifié',
                processingDate: payment.date,
                paymentMode: payment.paymentMode || 'PAID',
                paymentStatus: payment.status || 'completed'
              }
            } as PaymentHistoryItem;
          });
        }
        
        return [];
      }),
      tap(data => console.log('Payment history processed. Items:', data.length)),
      catchError(error => {
        console.error('Error fetching payment history:', error);
        
        let errorMessage = 'Une erreur est survenue lors de la récupération des données';
        
        if (error.status === 0) {
          errorMessage = `Impossible de se connecter au serveur à l'adresse ${apiEndpoint}. Vérifiez que le serveur est en cours d'exécution sur le port 8081.`;
        } else if (error.status === 404) {
          errorMessage = `L'endpoint API pour l'historique des paiements n'est pas trouvé à l'adresse ${apiEndpoint}.`;
        } else if (error.error) {
          errorMessage = `Erreur: ${error.error.message || error.statusText || 'Erreur serveur'}`;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Récupère les détails d'un paiement spécifique
   */
  getPaymentDetails(paymentId: string): Observable<PaymentHistoryItem> {
    console.log(`Récupération des détails du paiement ${paymentId} depuis l'API`);
    return this.http.get<any>(
      `${this.apiUrl}/payment/details/${paymentId}`,
      this.httpOptions
    ).pipe(
      map(payment => {
        console.log('Raw payment details:', payment);
        return this.mapPaymentFromApi(payment);
      }),
      tap(details => console.log('Payment details retrieved:', details)),
      catchError(error => {
        console.error('Error fetching payment details, using fallback:', error);
        return this.getStaticPaymentDetails(paymentId);
      })
    );
  }
  
  /**
   * Map API payment data to PaymentHistoryItem format
   * @private
   */
  private mapPaymentFromApi(payment: any): PaymentHistoryItem {
    return {
      paymentId: payment.paymentId || `pi_${payment.billId}_${this.generateRandomHash()}`,
      billId: payment.billId,
      billNumber: payment.billNumber || `BILL-${payment.billId}`,
      date: payment.date,
      amount: payment.amount || 0,
      status: payment.status || 'succeeded',
      paymentMethod: payment.paymentMethod || 'Carte bancaire',
      metadata: payment.metadata || {
        stockId: payment.stock?.id || null,
        stockName: payment.stock?.name || 'Non spécifié',
        processingDate: payment.date,
        paymentMode: 'PAID',
        paymentStatus: 'completed'
      }
    } as PaymentHistoryItem;
  }

  /**
   * Fallback method to get payment details statically when API fails
   */
  private getStaticPaymentDetails(paymentId: string): Observable<PaymentHistoryItem> {
    const staticData = this.generateStaticPaymentData();
    const payment = staticData.find(p => p.paymentId === paymentId);
    
    if (payment) {
      return of(payment).pipe(delay(300));
    }
    
    return throwError(() => new Error('Payment details not found'));
  }

  /**
   * Helper method to generate a random hash for payment IDs
   */
  private generateRandomHash(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Méthode de secours pour obtenir des données statiques d'historique des paiements
   * À utiliser uniquement quand l'API n'est pas disponible
   */
  getStaticPaymentHistory(): Observable<PaymentHistoryItem[]> {
    console.log('Utilisation des données STATIQUES d\'historique des paiements (mode fallback)');
    const staticData = this.generateStaticPaymentData();
    return of(staticData).pipe(
      delay(800), // Simuler un délai réseau
      tap(data => console.log('Static payment history provided:', data.length, 'items'))
    );
  }

  /**
   * Génère des données statiques pour l'historique des paiements
   * @private
   */
  private generateStaticPaymentData(): PaymentHistoryItem[] {
    // Cette méthode sera appelée par les méthodes publiques pour obtenir des données statiques
    return [
      {
        paymentId: 'pi_1NqXYXKZ6Ga4ZnJ5H8hZfFvV',
        billId: 1,
        billNumber: 'BILL-2023-001',
        date: new Date().toISOString(),
        amount: 1250.50,
        status: 'succeeded',
        paymentMethod: 'Carte bancaire',
        metadata: {
          stockId: 1,
          stockName: 'Matériaux de construction',
          processingDate: new Date().toISOString(),
          paymentMode: 'PAID',
          paymentStatus: 'completed'
        }
      },
      // Ajouter plus de données selon vos besoins...
      // Ces données correspondent à celles dans le composant pour assurer la cohérence
    ];
  }

  /**
   * Gestionnaire d'erreur générique pour les opérations de paiement
   */
  private handleError(operation = 'operation') {
    return (error: any): Observable<any> => {
      console.error(`${operation} failed:`, error);
      const message = error.error?.message || error.message || `Une erreur est survenue lors de l'opération ${operation}`;
      return throwError(() => new Error(message));
    };
  }

  /**
   * Gestionnaire d'erreur spécifique pour l'historique des paiements
   */
  private handleHistoryError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Une erreur est survenue lors de la récupération des données';
    
    console.error('API Error Details:', error);
    
    if (error.status === 0) {
      errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet ou assurez-vous que le serveur est en cours d\'exécution.';
    } else if (error.status === 404) {
      errorMessage = 'L\'endpoint API pour l\'historique des paiements n\'est pas trouvé.';
    } else if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Le serveur a retourné le code ${error.status}: ${error.error?.message || error.statusText}`;
    }
    
    console.error('Error in payment history:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
