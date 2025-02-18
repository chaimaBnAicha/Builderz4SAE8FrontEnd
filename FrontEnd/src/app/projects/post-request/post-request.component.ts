import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestService } from 'src/app/service/request.service';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';

declare var google: any; // Déclarez google comme global.

@Component({
  selector: 'app-post-request',
  templateUrl: './post-request.component.html',
  styleUrls: ['./post-request.component.css']
})
export class PostRequestComponent implements OnInit, AfterViewInit {
  userInfoForm!: FormGroup;
  projectInfoForm!: FormGroup;
  locationForm!: FormGroup;
  userInfo: any = {};
  map: any; // Variable pour détenir l'instance de la carte
  marker: any; // Variable pour détenir le marqueur
  clickedCoordinates: any = null; // Variable pour stocker les coordonnées du clic

  constructor(
    private requestService: RequestService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.userInfoForm = this.fb.group({
      user_first_name: [{ value: '', disabled: true }],
      user_last_name: [{ value: '', disabled: true }],
      user_email: [{ value: '', disabled: true }],
      user_phone: [{ value: '', disabled: true }],
      user_address: [{ value: '', disabled: true }]
    });

    this.projectInfoForm = this.fb.group({
      project_name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      estimated_budget: [null, [Validators.required, Validators.min(0)]],
      estimated_duration: [null, [Validators.required, Validators.min(1)]],
    });

    this.locationForm = this.fb.group({
      geographic_location: ['', [Validators.required]]
    });

    this.userService.getUserById().subscribe(
      (data) => {
        this.userInfo = data;
        this.userInfoForm.patchValue({
          user_first_name: data.first_name,
          user_last_name: data.last_name,
          user_email: data.email,
          user_phone: data.phone_number,
          user_address: data.adresse,
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
      }
    );
  }

  ngAfterViewInit() {
    // Initialiser la carte après que le DOM est chargé
    this.initMap();
  }

  initMap() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      this.map = new google.maps.Map(mapElement, {
        center: { lat: 36.8181, lng: 10.1655 }, // Example: coordinates of Tunisia
        zoom: 12
      });
  
      // Handle clicks on the map to add a marker and get the geographical location
      this.map.addListener('click', (event: any) => {
        const latLng = event.latLng;
        this.clickedCoordinates = {
          lat: latLng.lat(),
          lng: latLng.lng()
        };
        console.log('Clicked coordinates:', this.clickedCoordinates);
  
        // Add a marker to the clicked location
        if (this.marker) {
          this.marker.setMap(null); // Remove the old marker if it exists
        }
        this.marker = new google.maps.Marker({
          position: latLng,
          map: this.map,
          title: 'Selected location',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' // Green marker icon
          }
        });
  
        // Update the form field with the new coordinates
        this.locationForm.patchValue({
          geographic_location: `${this.clickedCoordinates.lat}, ${this.clickedCoordinates.lng}`,
        });
      });
    } else {
      console.error('Error: map element not found.');
    }
  }
  

  onSubmit() {
    if (this.projectInfoForm.invalid || this.locationForm.invalid) {
      return;
    }

    const payload = {
      project_name: this.projectInfoForm.get('project_name')?.value,
      description: this.projectInfoForm.get('description')?.value,
      estimated_budget: this.projectInfoForm.get('estimated_budget')?.value,
      estimated_duration: this.projectInfoForm.get('estimated_duration')?.value,
      geographic_location: this.clickedCoordinates ? `${this.clickedCoordinates.lat}, ${this.clickedCoordinates.lng}` : '',
      user_id: this.userInfo.id,
    };

    this.requestService.postRequest(payload).subscribe(
      () => {
        console.log('Requête ajoutée avec succès');
        this.router.navigate(['/all-request']);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de la requête:', error);
      }
    );
  }
}
