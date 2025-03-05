import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Component({
  selector: 'app-get-all-request',
  templateUrl: './get-all-request.component.html',
  styleUrls: ['./get-all-request.component.css']
})
export class GetAllRequestComponent implements OnInit {

  requests: any[] = []; // Utilisez `any[]` ou une interface spécifique si vous en avez une

  constructor(private requestService: RequestService) { }

  ngOnInit(): void {
    this.getAllRequest();
  }

  // Méthode pour récupérer toutes les requêtes
  getAllRequest(): void {
    this.requestService.getAllRequest().subscribe(
      (res: any[]) => {
        console.log('Requêtes reçues:', res);
        this.requests = res; // Affectez les données reçues à la propriété `requests`
      },
      (error) => {
        console.error('Erreur lors de la récupération des requêtes:', error);
      }
    );
  }

  deleteRequest(id_projet: number): void {
    this.requestService.deleteRequest(id_projet).subscribe(
      () => {
        console.log('Requête supprimée avec succès');
        // Mettez à jour la liste des requêtes après la suppression
        this.getAllRequest();
      },
      (error) => {
        console.error('Erreur lors de la suppression de la requête:', error);
      }
    );
  }
  


}