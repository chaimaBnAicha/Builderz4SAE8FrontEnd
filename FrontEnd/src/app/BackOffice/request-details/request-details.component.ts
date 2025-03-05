import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from 'src/app/service/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']
})
export class RequestDetailsComponent implements OnInit {
  requestDetails: any;
  userInfo: any;
  map!: google.maps.Map;
  markers: any[] = [];  // Tableau pour stocker les marqueurs de la carte

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id_projet = this.route.snapshot.paramMap.get('id_projet');
    if (id_projet) {
      this.loadRequestDetails(Number(id_projet));
      this.loadUserInfo();  // Charger les informations de l'utilisateur
    }
  }

  loadRequestDetails(id_projet: number): void {
    this.requestService.getRequestDetails(id_projet).subscribe((data) => {
      this.requestDetails = data;
      this.loadMap(this.requestDetails?.geographic_location);
    });
  }

  loadUserInfo(): void {
    this.requestService.getUserInfo().subscribe((data) => {
      this.userInfo = data;  // Assigner les informations de l'utilisateur récupérées
    });
  }

  loadMap(location: string): void {
    if (!location) {
      console.error('La localisation est vide');
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const mapOptions: google.maps.MapOptions = {
          center: results[0].geometry.location,
          zoom: 15
        };

        // Assurez-vous que l'élément 'map' existe au moment où vous créez la carte
        const mapElement = document.getElementById('map');
        if (mapElement) {
          this.map = new google.maps.Map(mapElement, mapOptions);

          new google.maps.Marker({
            position: results[0].geometry.location,
            map: this.map,
            title: location
          });
        } else {
          console.error('L\'élément de la carte est introuvable');
        }
      } else {
        console.error('La géolocalisation a échoué pour la raison suivante : ' + status);
      }
    });
  }

  updateStatus(id_projet: number, status: string): void {
    if (status === 'Approved') {
      this.requestService.approveRequest(id_projet).subscribe(() => {
        this.loadRequestDetails(id_projet);  // Recharge les détails après mise à jour
        this.updateMarkerColor(id_projet, 'green');  // Marqueur vert après approbation
      });
    } else if (status === 'Rejected') {
      this.requestService.rejectRequest(id_projet).subscribe(() => {
        this.loadRequestDetails(id_projet);  // Recharge les détails après mise à jour
        this.updateMarkerColor(id_projet, 'red');  // Marqueur rouge après rejet
      });
    }
  }
  

 // Mettre à jour la couleur du marqueur en fonction du statut
 updateMarkerColor(id_projet: number, color: string): void {
  // Chercher le marqueur correspondant à l'ID du projet
  const marker = this.markers.find(m => m.id_projet === id_projet);
  if (marker) {
    marker.setIcon({
      url: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`
    });
  }
}


  goBack(): void {
    this.router.navigate(['/admin/project-manager']);  // Revenir à la liste des demandes
  }
}
