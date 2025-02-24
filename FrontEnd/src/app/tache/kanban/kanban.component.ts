import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TacheService } from 'src/app/service/tache.service';


// Ajouter un type alias pour les statuts
type StatutTache = 'A_FAIRE' | 'EN_COURS' | 'TERMINEE';

export interface Tache {
  id: number;
  titre: string;
  description: string;
  statut: StatutTache; // Utiliser le type alias ici
}

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {
  statuts: StatutTache[] = ['A_FAIRE', 'EN_COURS', 'TERMINEE'];
  
  taches: { 
    [key in StatutTache]: Tache[] 
  } = { 
    A_FAIRE: [], 
    EN_COURS: [], 
    TERMINEE: [] 
  };

  constructor(private tacheService: TacheService) {}

  ngOnInit(): void {
    this.loadTaches();
  }

  loadTaches(): void {
    this.tacheService.getAllTache().subscribe({
      next: (data: Tache[]) => {
        console.log('Données reçues:', data); // Debug
        this.statuts.forEach(statut => {
          this.taches[statut] = data.filter(t => t.statut === statut);
        });
      },
      error: (err) => {
        console.error('Erreur de chargement:', err); // Debug des erreurs
      }
    });
  }

  drop(event: CdkDragDrop<Tache[]>, newStatut: StatutTache) {
    if (event.previousContainer === event.container) {
      // Si on déplace dans la même colonne
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Récupérer la tâche déplacée
      const movedTask = event.previousContainer.data[event.previousIndex];
      
      // Créer une copie de la tâche avec le nouveau statut
      const updatedTask = { ...movedTask, statut: newStatut };
      
      // Mettre à jour le backend
      this.tacheService.updateStatut(movedTask.id, newStatut).subscribe({
        next: (response) => {
          // Supprimer la tâche de l'ancienne colonne
          event.previousContainer.data.splice(event.previousIndex, 1);
          
          // Ajouter la tâche à la nouvelle colonne
          event.container.data.splice(event.currentIndex, 0, updatedTask);
          
          // Forcer la détection des changements
          this.taches = {
            ...this.taches,
            [event.previousContainer.id as StatutTache]: [...event.previousContainer.data],
            [newStatut]: [...event.container.data]
          };
        },
        error: (err) => {
          console.error('Erreur lors du déplacement de la tâche:', err);
          // En cas d'erreur, annuler le déplacement
          this.loadTaches(); // Recharger les données
        }
      });
    }
  }

  trackById(index: number, tache: Tache): number {
    return tache.id;
  }
}
