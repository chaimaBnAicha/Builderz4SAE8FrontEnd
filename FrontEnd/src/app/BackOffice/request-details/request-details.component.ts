import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from 'src/app/service/request.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']
})
export class RequestDetailsComponent implements OnInit {
  requestDetails: any;
  userInfo: any;
  map!: google.maps.Map;
  markers: any[] = []; // Stocker les marqueurs de la carte

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef; // Référence à l'élément HTML

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id_projet = this.route.snapshot.paramMap.get('id_projet');
    if (id_projet) {
      this.loadRequestDetails(Number(id_projet));
      this.loadUserInfo();
    }
  }

  loadRequestDetails(id_projet: number): void {
    this.requestService.getRequestDetails(id_projet).subscribe((data) => {
      this.requestDetails = data;
      if (this.requestDetails?.geographic_location) {
        this.loadMap(this.requestDetails.geographic_location);
      }
    });
  }

  loadUserInfo(): void {
    this.requestService.getUserInfo().subscribe((data) => {
      this.userInfo = data;
    });
  }

  loadMap(location: string): void {
    if (!location) {
      console.error('La localisation est vide');
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const mapOptions: google.maps.MapOptions = {
          center: results[0].geometry.location,
          zoom: 15
        };

        const mapElement = document.getElementById('map');
        if (mapElement) {
          this.map = new google.maps.Map(mapElement, mapOptions);

          const marker = new google.maps.Marker({
            position: results[0].geometry.location,
            map: this.map,
            title: location,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          });

          this.markers.push({ id_projet: this.requestDetails.id_projet, marker });
        } else {
          console.error("L'élément de la carte est introuvable");
        }
      } else {
        console.error('La géolocalisation a échoué : ' + status);
      }
    });
  }

  updateStatus(id_projet: number, status: string): void {
    const updateFn = status === 'Approved' ? this.requestService.approveRequest : this.requestService.rejectRequest;
    updateFn.call(this.requestService, id_projet).subscribe(() => {
      this.loadRequestDetails(id_projet);
      this.updateMarkerColor(id_projet, status === 'Approved' ? 'green' : 'red');
    });
  }

  updateMarkerColor(id_projet: number, color: string): void {
    const markerData = this.markers.find(m => m.id_projet === id_projet);
    if (markerData) {
      markerData.marker.setIcon(`http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`);
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/project-manager']);
  }

  downloadPDF(): void {
    const element = this.pdfContent.nativeElement;
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('request-details.pdf');
    });
  }
}
