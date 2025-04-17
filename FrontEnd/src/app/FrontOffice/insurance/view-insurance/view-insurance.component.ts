import { Component, OnInit } from '@angular/core';
import { InsuranceService } from '../../../BackOffice/insurance/insurance.service';
import { Insurance, Category } from '../../../BackOffice/insurance/insurance.interface';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DomSanitizer } from '@angular/platform-browser';
import { IPayPalConfig, ICreateOrderRequest, ITransactionItem } from 'ngx-paypal';

interface PaymentHistoryItem {
  date: Date;
  insuranceType: string;
  description: string; // Add this property
  transactionId: string;
  amount: number;
  status: string;
}

@Component({
  selector: 'app-view-insurance',
  templateUrl: './view-insurance.component.html',
  styleUrls: ['./view-insurance.component.css']
})
export class ViewInsuranceComponent implements OnInit {
  insurances: Insurance[] = [];
  filteredInsurances: Insurance[] = [];
  categories = Object.values(Category);
  selectedCategory: string = '';
  searchTerm: string = '';
  public payPalConfig?: IPayPalConfig;
  public selectedInsurance: any;
  showPayPalButtons = false;
  showPaymentHistory = false;
  paymentHistory: PaymentHistoryItem[] = [];

  constructor(
    private insuranceService: InsuranceService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadInsurances();
  }

  loadInsurances(): void {
    this.insuranceService.getAllInsurances().subscribe({
      next: (data: Insurance[]) => {
        // Filter for valid insurances (current date is between start and end date)
        const currentDate = new Date();
        this.insurances = data.filter((insurance: Insurance) => {
          const startDate = new Date(insurance.start_Date);
          const endDate = new Date(insurance.end_Date);
          return currentDate >= startDate && currentDate <= endDate;
        });
        this.filteredInsurances = [...this.insurances];
      },
      error: (error: any) => {
        console.error('Error loading insurances:', error);
      }
    });
  }

  filterInsurances(): void {
    this.filteredInsurances = this.insurances.filter(insurance => {
      const matchesCategory = !this.selectedCategory || insurance.category === this.selectedCategory;
      const matchesSearch = !this.searchTerm || 
        insurance.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  onCategoryChange(): void {
    this.filterInsurances();
  }

  onSearch(): void {
    this.filterInsurances();
  }

  getCategoryClass(category: Category): string {
    switch (category) {
      case Category.RCPro:
        return 'category-rcpro';
      case Category.TRC:
        return 'category-trc';
      case Category.CIVIL_EXPLOITATION:
        return 'category-civil';
      default:
        return '';
    }
  }

  getRemainingDays(endDate: Date | string): number {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private stripHtmlTags(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  }

  generatePDF(): void {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Insurance Details Report', 14, 15);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
    
    // Prepare data for the table
    const tableData = this.filteredInsurances.map(insurance => [
      insurance.category,
      this.stripHtmlTags(insurance.description),
      new Date(insurance.start_Date).toLocaleDateString(),
      new Date(insurance.end_Date).toLocaleDateString(),
      `$${insurance.amount}`,
      `${this.getRemainingDays(insurance.end_Date)} days`
    ]);
    
    // Add table
    autoTable(doc, {
      head: [['Category', 'Description', 'Start Date', 'End Date', 'Amount', 'Remaining Days']],
      body: tableData,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 }
    });
    
    // Save the PDF
    doc.save('insurance-report.pdf');
  }

  generateInsurancePDF(insurance: Insurance): void {
    const doc = new jsPDF();
    
    // Set default font
    doc.setFont('helvetica', 'bold');
    
    // Add header with yellow background
    doc.setFillColor(255, 191, 0);
    doc.rect(0, 0, 210, 30, 'F');
    
    // Add title in black
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text('Insurance Details', 105, 20, { align: 'center' });
    
    // Add category with icon
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Category:', 20, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(insurance.category, 65, 50);
    
    // Add dates section
    doc.setFont('helvetica', 'bold');
    doc.text('Validity Period:', 20, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(`Start: ${new Date(insurance.start_Date).toLocaleDateString()}`, 20, 80);
    doc.text(`End: ${new Date(insurance.end_Date).toLocaleDateString()}`, 20, 90);
    
    // Add remaining days with color
    const remainingDays = this.getRemainingDays(insurance.end_Date);
    doc.setFont('helvetica', 'bold');
    doc.text('Remaining Days:', 20, 110);
    doc.setFont('helvetica', 'normal');
    if (remainingDays < 30) {
      doc.setTextColor(231, 76, 60);
    } else {
      doc.setTextColor(46, 204, 113);
    }
    doc.text(`${remainingDays} days`, 75, 110);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Add amount with currency symbol
    doc.setFont('helvetica', 'bold');
    doc.text('Coverage Amount:', 20, 130);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(52, 152, 219);
    doc.text(`$${insurance.amount}`, 75, 130);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Add description section with border
    doc.setFont('helvetica', 'bold');
    doc.text('Description:', 20, 150);
    
    // Draw border around description
    doc.setDrawColor(41, 128, 185);
    doc.rect(20, 155, 170, 80);
    
    // Add description text - Remove HTML tags
    const cleanDescription = this.stripHtmlTags(this.sanitizer.sanitize(1, insurance.description) || '');
    const splitText = doc.splitTextToSize(cleanDescription, 160);
    doc.setFont('helvetica', 'normal');
    doc.text(splitText, 25, 165);

    // Add Builderz logo
    // Create yellow background for logo
    doc.setFillColor(255, 191, 0);
    doc.rect(0, 250, 210, 40, 'F');

    // Add Builderz text as logo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text('Builderz', 105, 275, { align: 'center' });
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 245, { align: 'center' });
    
    // Save the PDF
    doc.save(`insurance-${insurance.category.toLowerCase()}-details.pdf`);
  }

  proceedToPayment(insurance: any): void {
    this.selectedInsurance = insurance;
    this.showPayPalButtons = true;
    this.initPayPalConfig();
    
    // Scroll to payment section or open a modal
    setTimeout(() => {
      const paymentElement = document.getElementById('paypal-button-container');
      if (paymentElement) {
        paymentElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
  
  private initPayPalConfig(): void {
    const currency = 'USD';
    
    this.payPalConfig = {
      currency: currency,
      clientId: 'AZCV6I_QYws-IvxDftBwv8sghn4jT6lCkaE4HCO-0X0iMqr9EqJlyy-BZ4GAQ6xPyWjD_04YObOPvy7T',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: this.selectedInsurance.amount.toString(),
              breakdown: {
                item_total: {
                  currency_code: currency,
                  value: this.selectedInsurance.amount.toString()
                }
              }
            },
            items: [
              {
                name: `Insurance - ${this.selectedInsurance.category}`,
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: currency,
                  value: this.selectedInsurance.amount.toString(),
                },
                description: `Insurance coverage from ${new Date(this.selectedInsurance.start_Date).toLocaleDateString()} to ${new Date(this.selectedInsurance.end_Date).toLocaleDateString()}`
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
          this.onPaymentSuccess(details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.onPaymentSuccess(data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showPayPalButtons = false;
      },
      onError: err => {
        console.log('OnError', err);
        alert('There was an error processing your payment. Please try again.');
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
  
  onPaymentSuccess(details: any): void {
    // Here you would update your backend to record the payment
    alert(`Payment successful! Transaction ID: ${details.id}`);
    this.showPayPalButtons = false;
    
    // Add the payment to history with description
    this.paymentHistory.unshift({
      date: new Date(),
      insuranceType: this.selectedInsurance.category,
      description: this.selectedInsurance.description, // Add the description field
      transactionId: details.id || 'TRX' + Math.floor(Math.random() * 1000000000),
      amount: this.selectedInsurance.amount,
      status: 'Completed'
    });
    
    // You might want to call a service to update the payment status in your backend
    // this.insuranceService.recordPayment(this.selectedInsurance.id, details.id).subscribe(...)
  }

  exportPaymentHistory(): void {
    // Get actual amounts from filtered insurances where available
    const rcProAmount = this.filteredInsurances.find(i => i.category === 'RCPro')?.amount || 0;
    const trcAmount = this.filteredInsurances.find(i => i.category === 'TRC')?.amount || 0;
    const civilAmount = this.filteredInsurances.find(i => i.category === 'CIVIL_EXPLOITATION')?.amount || 0;
    
    this.paymentHistory = [
      {
        date: new Date(2023, 10, 15),
        insuranceType: 'RCPro',
        description: this.filteredInsurances.find(i => i.category === 'RCPro')?.description || 'Professional liability insurance coverage',
        transactionId: 'INS-75392-RC',
        amount: rcProAmount, // Use actual amount
        status: 'Completed'
      },
      {
        date: new Date(2023, 8, 22),
        insuranceType: 'TRC',
        description: this.filteredInsurances.find(i => i.category === 'TRC')?.description || 'All risks construction insurance',
        transactionId: 'INS-68471-TRC',
        amount: trcAmount, // Use actual amount
        status: 'Completed'
      },
      {
        date: new Date(2023, 6, 10),
        insuranceType: 'CIVIL_EXPLOITATION',
        description: this.filteredInsurances.find(i => i.category === 'CIVIL_EXPLOITATION')?.description || 'Civil exploitation insurance',
        transactionId: 'INS-54328-CE',
        amount: civilAmount, // Use actual amount
        status: 'Completed'
      },
      {
        date: new Date(2023, 3, 5),
        insuranceType: 'RCPro',
        description: this.filteredInsurances.find(i => i.category === 'RCPro')?.description || 'Professional liability insurance coverage',
        transactionId: 'INS-41209-RC',
        amount: rcProAmount, // Use actual amount
        status: 'Completed'
      },
      {
        date: new Date(),
        insuranceType: 'TRC',
        description: this.filteredInsurances.find(i => i.category === 'TRC')?.description || 'All risks construction insurance',
        transactionId: 'INS-82104-TRC',
        amount: trcAmount, // Use actual amount
        status: 'Pending'
      }
    ];
    
    this.showPaymentHistory = true;
  }
  
  downloadExcel(): void {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Date,Insurance Type,Description,Transaction ID,Amount,Status\n";
    
    // Add data rows with description
    this.paymentHistory.forEach(item => {
      // Get clean description (remove HTML tags)
      const cleanDescription = item.description.replace(/<[^>]*>/g, '');
      
      const row = [
        item.date.toLocaleDateString(),
        item.insuranceType,
        `"${cleanDescription}"`, // Quote the description to handle commas
        item.transactionId,
        `$${item.amount.toFixed(2)}`,
        item.status
      ];
      csvContent += row.join(",") + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "insurance-payment-history.csv");
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  }
}