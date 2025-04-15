import { Component, OnInit } from '@angular/core';
import { EtapeService, Etape } from 'src/app/service/etape.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-etape-filter',
  templateUrl: './etape-filter.component.html',
  styleUrls: ['./etape-filter.component.css']
})
export class EtapeFilterComponent implements OnInit {
  etapes: Etape[] = [];
  tacheId: number | null = null;

  constructor(
    private etapeService: EtapeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.tacheId = params['tacheId'] ? Number(params['tacheId']) : null;
      if (this.tacheId) {
        this.loadFilteredEtapes();
      }
    });
  }

  loadFilteredEtapes() {
    if (this.tacheId) {
      this.etapeService.getEtapesByTacheId(this.tacheId).subscribe({
        next: (data) => {
          this.etapes = data;
        },
        error: (error) => {
          console.error('Error loading filtered etapes:', error);
        }
      });
    }
  }
}
