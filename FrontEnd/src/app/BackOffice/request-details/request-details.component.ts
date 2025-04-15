import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from 'src/app/service/request.service';
import { AnalysisService } from 'src/app/service/analysis-service.service';  // Ton service d'analyse
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { JustificationService } from 'src/app/service/justification-service.service';

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
  analysisResult: any; // Stocker l'analyse de la description
  isDescriptionModalVisible = false; // Contrôle de l'affichage du modal
 justificationText: string = '';  // Champ de texte pour la justification
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef; // Référence à l'élément HTML
  isSubmitted: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private analysisService: AnalysisService,  // Service pour l'analyse
    private justificationService: JustificationService, // Ajouter le service
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
  // Appeler la méthode du service de justification pour l'ajout
  addJustification(id_projet: number): void {
    if (this.justificationText.trim()) {
      this.justificationService.addJustification(id_projet, this.justificationText).subscribe(
        (response) => {
          console.log('Justification ajoutée avec succès:', response);
          this.isSubmitted = true; // Désactiver les modifications après soumission
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la justification:', error);
        }
      );
    } else {
      console.log('Aucune justification à ajouter.');
    }
  }
  
  isDisabled(): boolean {
    return this.isSubmitted; // Désactive si la justification a été soumise
  }
  


  // Nouvelle méthode pour afficher l'analyse
  showDescriptionAnalysis(): void {
    this.analysisService.analyzeDescription(this.requestDetails.description).subscribe(
        (analysis) => {
            console.log('Analyse de la description:', analysis); // Vérifiez que la réponse contient bien les données attendues
            this.analysisResult = analysis;
            this.isDescriptionModalVisible = true;
        },
        (error) => {
            console.error('Erreur dans la récupération de l\'analyse:', error); // Gérer les erreurs
        }
    );
}


  // Méthode pour fermer le modal
  closeDescriptionModal(): void {
    this.isDescriptionModalVisible = false;
  }

  updateStatus(id_projet: number, status: string): void {
    const updateFn = status === 'Approved' ? this.requestService.approveRequest : this.requestService.rejectRequest;
    updateFn.call(this.requestService, id_projet).subscribe(() => {
      this.loadRequestDetails(id_projet);
      this.updateMarkerColor(id_projet, status === 'Approved' ? 'green' : 'red');
      this.addJustification(id_projet);  // Appeler la méthode pour ajouter la justification
      this.isSubmitted = true; // 🔒 Désactiver modification après soumission


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

    // Masquer les boutons avant de générer le PDF
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
      button.style.display = 'none'; // Utilisez display: none pour masquer les boutons
    });

    // Masquer la carte avant de générer le PDF
    const mapElement = document.getElementById('map');
    if (mapElement) {
      mapElement.style.display = 'none';
    }

    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Ajouter l'image du contenu
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      // Ajouter le mot "Signature" en bas à droite
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 10;
      const signatureText = "Signature";
      pdf.text(signatureText, pdf.internal.pageSize.width - margin - pdf.getTextWidth(signatureText), pageHeight - margin);

      // Enregistrer le PDF
      pdf.save('request-details.pdf');

      // Réafficher les éléments masqués
      buttons.forEach((button) => {
        button.style.display = 'inline-block'; // Réafficher les boutons
      });

      if (mapElement) {
        mapElement.style.display = 'block'; // Réafficher la carte
      }
    });
  }
 
}
