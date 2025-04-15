import { Component, OnInit } from '@angular/core';
import { EtapeService, Etape } from 'src/app/service/etape.service';
import { TacheService, Tache } from 'src/app/service/tache.service';

@Component({
  selector: 'app-add-etape',
  templateUrl: './add-etape.component.html',
  styleUrls: ['./add-etape.component.css']
})
export class AddEtapeComponent implements OnInit {
  etape: Etape = {
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    statut: 'EN_COURS'
  };
  taches: Tache[] = [];
  selectedTacheId: number = 0;

  constructor(
    private etapeService: EtapeService,
    private tacheService: TacheService
  ) {}

  ngOnInit(): void {
    this.loadTaches();
  }

  loadTaches(): void {
    this.tacheService.getAllTache().subscribe({
      next: (data: Tache[]) => {
        this.taches = data;
        console.log('Taches loaded:', this.taches);
      },
      error: (error: Error) => {
        console.error('Error loading taches:', error);
      }
    });
  }

  getTacheName(tacheId: number | undefined): string {
    if (!tacheId) return 'N/A';
    const tache = this.taches.find(t => t.id === tacheId);
    return tache ? (tache.titre || tache.nom) : 'N/A';
  }
 
  onSubmit(): void {
    if (this.selectedTacheId) {
      const etapeToSubmit = {
        ...this.etape,
        tacheId: this.selectedTacheId
      };

      this.etapeService.ajouterEtape(this.selectedTacheId, etapeToSubmit).subscribe({
        next: () => {
          console.log('Etape added successfully with tacheId:', this.selectedTacheId);
          this.resetForm();
        },
        error: (error: Error) => {
          console.error('Error adding etape:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.etape = {
      nom: '',
      description: '',
      dateDebut: '',
      dateFin: '',
      statut: 'EN_COURS',
      tacheId: undefined
    };
    this.selectedTacheId = 0;
  }
}