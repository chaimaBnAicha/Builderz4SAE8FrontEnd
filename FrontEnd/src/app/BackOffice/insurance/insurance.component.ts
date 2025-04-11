import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InsuranceService } from './insurance.service';
import { Insurance, Category } from './insurance.interface';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {
  insurances: Insurance[] = [];
  insuranceForm: FormGroup;
  categories = Object.values(Category);
  isEditing = false;
  submitted = false;
  currentInsuranceId?: number;

  constructor(
    private insuranceService: InsuranceService,
    private formBuilder: FormBuilder
  ) {
    this.insuranceForm = this.formBuilder.group({
      id_Insurance: [''],
      description: ['', [Validators.required, Validators.minLength(3)]],
      start_Date: ['', Validators.required],
      end_Date: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      category: [Category.RCPro, Validators.required]
    });
  }

  ngOnInit(): void {
    // Test the proxy connection
    this.testProxyConnection();
    this.loadInsurances();
  }

  private testProxyConnection(): void {
    console.log('Testing proxy connection...');
    this.insuranceService.getAllInsurances().subscribe({
      next: (data) => {
        console.log('Proxy test successful:', data);
      },
      error: (error) => {
        console.error('Proxy test failed:', error);
      }
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.insuranceForm.controls; }

  loadInsurances(): void {
    this.insuranceService.getAllInsurances().subscribe(
      data => {
        console.log('Raw data from backend:', data);
        try {
          this.insurances = data.map(insurance => {
            console.log('Processing insurance:', insurance);
            return {
              ...insurance,
              start_Date: new Date(insurance.start_Date),
              end_Date: new Date(insurance.end_Date)
            };
          });
          console.log('Processed insurances:', this.insurances);
        } catch (error) {
          console.error('Error processing insurance data:', error);
        }
      },
      error => {
        console.error('Error loading insurances:', error);
        console.error('Error details:', error.error);
        console.error('Error status:', error.status);
      }
    );
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.insuranceForm.invalid) {
      return;
    }

    const insuranceData = this.insuranceForm.value;
    console.log('Form submitted with data:', insuranceData);

    const insuranceToSend = {
      ...insuranceData,
      start_Date: this.formatDate(insuranceData.start_Date),
      end_Date: this.formatDate(insuranceData.end_Date)
    };

    console.log('Sending insurance data:', insuranceToSend);

    if (this.isEditing && this.currentInsuranceId) {
      this.insuranceService.updateInsurance(this.currentInsuranceId, insuranceToSend).subscribe({
        next: (response) => {
          console.log('Insurance updated successfully:', response);
          this.loadInsurances();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating insurance:', error);
          alert('Error updating insurance: ' + error);
        }
      });
    } else {
      this.insuranceService.createInsurance(insuranceToSend).subscribe({
        next: (response) => {
          console.log('Insurance created successfully:', response);
          this.loadInsurances();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating insurance:', error);
          alert('Error creating insurance: ' + error);
        }
      });
    }
  }

  private formatDate(date: Date | string): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }
    return date;
  }

  editInsurance(insurance: Insurance): void {
    this.isEditing = true;
    this.currentInsuranceId = insurance.id_Insurance;
    this.insuranceForm.patchValue({
      id_Insurance: insurance.id_Insurance,
      description: insurance.description,
      start_Date: this.formatDate(insurance.start_Date),
      end_Date: this.formatDate(insurance.end_Date),
      amount: insurance.amount,
      category: insurance.category
    });
  }

  deleteInsurance(id: number): void {
    if (confirm('Are you sure you want to delete this insurance?')) {
      this.insuranceService.deleteInsurance(id).subscribe({
        next: (response) => {
          console.log('Insurance deleted successfully:', response);
          this.loadInsurances();
        },
        error: (error) => {
          console.error('Error deleting insurance:', error);
          alert('Error deleting insurance: ' + error);
        }
      });
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.isEditing = false;
    this.currentInsuranceId = undefined;
    this.insuranceForm.reset({
      category: Category.RCPro
    });
  }
} 