import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from 'src/app/service/request.service';

@Component({
  selector: 'app-request-management',
  templateUrl: './request-management.component.html',
  styleUrls: ['./request-management.component.css']
})
export class RequestManagementComponent implements OnInit, AfterViewInit {
  requests: any[] = [];
  filteredRequests: any[] = [];
  selectedStatus: string = '';
  map: any;
  markers: any[] = []; 

  constructor(private requestService: RequestService, private router: Router) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  loadRequests() {
    this.requestService.getAllRequest().subscribe((data) => {
      this.requests = data;
      this.filterByStatus(); // Filtrer les projets avant d'ajouter les marqueurs
    }, (error) => {
      console.error('Erreur lors de la récupération des demandes:', error);
    });
  }

  // Filtrer les demandes et mettre à jour la carte
  filterByStatus(): void {
    if (this.selectedStatus) {
      this.filteredRequests = this.requests.filter(req => req.status === this.selectedStatus);
    } else {
      this.filteredRequests = [...this.requests];
    }
    this.addMarkersToMap(); // Met à jour les marqueurs après filtrage
  }

  updateStatus(id_projet: number, status: string): void {
    if (status === 'Approved') {
      this.requestService.approveRequest(id_projet).subscribe(() => {
        this.loadRequests();
      });
    } else if (status === 'Rejected') {
      this.requestService.rejectRequest(id_projet).subscribe(() => {
        this.loadRequests();
      });
    }
  }

  deleteRequest(id_projet: number): void {
    this.requestService.deleteRequest(id_projet).subscribe(() => {
      this.loadRequests();
    });
  }

  viewDetails(id_projet: number) {
    this.router.navigate(['/admin/request-details', id_projet]);
  }

  // Initialisation de la carte
  initMap() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      this.map = new google.maps.Map(mapElement, {
        center: { lat: 36.8181, lng: 10.1655 },
        zoom: 12
      });
    } else {
      console.error('Erreur: élément de la carte introuvable.');
    }
  }

  // Ajouter les marqueurs avec couleurs dynamiques
  addMarkersToMap() {
    // Supprimer les anciens marqueurs avant d'ajouter les nouveaux
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];

    this.filteredRequests.forEach((request) => {
      const coords = request.geographic_location.split(',');
      const lat = parseFloat(coords[0].trim());
      const lng = parseFloat(coords[1].trim());

      // Déterminer la couleur du marqueur selon le statut
      const markerColor = this.getMarkerColor(request.status);

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        title: request.projectName,
        icon: {
          url: `http://maps.google.com/mapfiles/ms/icons/${markerColor}-dot.png`
        }
      });

      this.markers.push(marker);

      // Ajouter un événement au clic sur le marqueur
      marker.addListener('click', () => {
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <h3>Project Name: ${request.projectName}</h3>
              <p>ID: ${request.id_projet}</p>
              <p>Status: <strong style="color:${markerColor}">${request.status}</strong></p>
              <button id="readMoreBtn_${request.id_projet}" class="readMoreBtn" style="color: blue; text-decoration: underline;">Read More</button>
            </div>`
        });

        infoWindow.open(this.map, marker);

        // Ajouter un écouteur pour le bouton Read More
        setTimeout(() => {
          const readMoreBtn = document.getElementById(`readMoreBtn_${request.id_projet}`);
          if (readMoreBtn) {
            readMoreBtn.addEventListener('click', () => {
              this.viewDetails(request.id_projet);
            });
          }
        }, 300);
      });
    });
  }

  // Fonction pour définir la couleur du marqueur
  getMarkerColor(status: string): string {
    switch (status) {
      case 'Approved':
        return 'green';
      case 'Rejected':
        return 'red';
      case 'Pending':
      default:
        return 'blue';
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/request-management']);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Approved':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'black';
    }
  }
}
