import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';

@Component({
  selector: 'app-get-all-request',
  templateUrl: './get-all-request.component.html',
  styleUrls: ['./get-all-request.component.css']
})
export class GetAllRequestComponent implements OnInit {

  requests: any[] = []; // Toutes les requêtes
  filteredRequests: any[] = []; // Requêtes filtrées
  searchText: string = '';

  constructor(private requestService: RequestService) { }

  ngOnInit(): void {
    this.getAllRequest();
  }

  getAllRequest(): void {
    this.requestService.getAllRequest().subscribe(
      (res: any[]) => {
        console.log('Requêtes reçues:', res);
        this.requests = res;
        this.filteredRequests = res;
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
        this.getAllRequest();
      },
      (error) => {
        console.error('Erreur lors de la suppression de la requête:', error);
      }
    );
  }

  filterRequests(): void {
    this.filteredRequests = this.requests.filter(request =>
      request.projectName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      request.description.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}