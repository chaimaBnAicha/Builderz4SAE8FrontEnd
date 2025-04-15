import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Insurance, Category } from '../insurance.interface';
import { InsuranceService } from '../insurance.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-insurance',
  templateUrl: './update-insurance.component.html',
  styleUrls: ['./update-insurance.component.css']
})
export class UpdateInsuranceComponent implements OnInit {
  insuranceForm: FormGroup;
  categories = Object.values(Category);
  insuranceId?: number;
  editorConfig = {
    height: 300,
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    toolbar:
      'undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | help',
    setup: (editor: any) => {
      editor.on('change', () => {
        const content = editor.getContent();
        this.insuranceForm.get('Description')?.setValue(content);
      });
    }
  };

  constructor(
    private fb: FormBuilder,
    private insuranceService: InsuranceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.insuranceForm = this.fb.group({
      Description: ['', Validators.required],
      start_Date: ['', Validators.required],
      end_Date: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.insuranceId = +params['id'];
      if (this.insuranceId) {
        this.loadInsurance(this.insuranceId);
      }
    });
  }

  loadInsurance(id: number): void {
    this.insuranceService.getInsuranceById(id).subscribe({
      next: (insurance) => {
        this.insuranceForm.patchValue({
          Description: insurance.description,
          start_Date: this.formatDate(insurance.start_Date),
          end_Date: this.formatDate(insurance.end_Date),
          amount: insurance.amount,
          category: insurance.category
        });
      },
      error: (error) => {
        console.error('Error loading insurance:', error);
      }
    });
  }

  private formatDate(date: Date | string): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  }

  onSubmit(): void {
    if (this.insuranceForm.valid && this.insuranceId) {
      const insuranceData: Insurance = {
        ...this.insuranceForm.value,
        description: this.insuranceForm.get('Description')?.value
      };

      this.insuranceService.updateInsurance(this.insuranceId, insuranceData).subscribe({
        next: () => {
          this.router.navigate(['/admin/insurance']);
        },
        error: (error: Error) => {
          console.error('Error updating insurance:', error);
        }
      });
    }
  }

  navigateToInsuranceList(): void {
    this.router.navigate(['/admin/insurance']);
  }
} 