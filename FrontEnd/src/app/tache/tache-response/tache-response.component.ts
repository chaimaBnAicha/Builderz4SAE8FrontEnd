import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TacheService } from 'src/app/service/tache.service';

@Component({
  selector: 'app-tache-response',
  template: '<div>Traitement de votre réponse...</div>'
})
export class TacheResponseComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private tacheService: TacheService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const taskId = +params['taskId']; // Le + convertit en nombre
      const response = params['response'];
      
      console.log('Traitement de la réponse:', { taskId, response });
      
      this.tacheService.respondToTask(taskId, response as 'oui' | 'non').subscribe({
        next: (result) => {
          console.log('Réponse traitée avec succès:', result);
          // Forcer un rafraîchissement des données
          this.tacheService.getAllTache().subscribe(() => {
            // Naviguer vers la liste des tâches après le rafraîchissement
            this.router.navigate(['/get-all-tache']).then(() => {
              window.location.reload(); // Force le rafraîchissement de la page
            });
          });
        },
        error: (error) => {
          console.error('Erreur lors du traitement de la réponse:', error);
        }
      });
    });
  }
} 