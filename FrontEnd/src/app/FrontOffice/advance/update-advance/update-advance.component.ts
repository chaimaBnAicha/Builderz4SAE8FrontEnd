import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdvanceService } from 'src/app/Service/advance.service';

@Component({
  selector: 'app-update-advance',
  templateUrl: './update-advance.component.html',
  styleUrls: ['./update-advance.component.css']
})
export class UpdateAdvanceComponent implements OnInit {
  updateAdvanceForm!: FormGroup;
  advanceId!: number;

  constructor(
    private fb: FormBuilder,
    private advanceService: AdvanceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get advance ID from route parameter
    this.advanceId = this.route.snapshot.params['id'];
    
    // Initialize form
    this.updateAdvanceForm = this.fb.group({
      id: [''],
      amount_request: ['', [Validators.required, Validators.min(0)]],
      requestDate: [{value: '', disabled: true}],
      reason: ['', Validators.required],
      status: ['']
    });

    // Load advance data
    this.loadAdvance();
  }

  loadAdvance() {
    this.advanceService.getAdvanceById(this.advanceId).subscribe({
      next: (advance: any) => {
        this.updateAdvanceForm.patchValue({
          id: advance.id,
          amount_request: advance.amount_request,
          requestDate: advance.requestDate,
          reason: advance.reason,
          status: advance.status
        });
      },
      error: (error) => {
        console.error('Error loading advance:', error);
      }
    });
  }

  onSubmit() {
    if (this.updateAdvanceForm.valid) {
      const formValue = {
        ...this.updateAdvanceForm.getRawValue(),
        id: this.advanceId
      };
      
      this.advanceService.updateAdvance(formValue).subscribe({
        next: () => {
          this.router.navigate(['/advance']);
        },
        error: (error) => {
          console.error('Error updating advance:', error);
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/advance']);
  }
}
