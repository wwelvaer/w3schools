import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { dataset, EntryHeader } from '../classes';
import { DbConnectionService } from '../db-connection.service';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit {
  title: string;
  loading: boolean;
  dataset;
  entries: Object[];
  entryHeaders: EntryHeader[];
  error: string;

  searchTerm: string;

  constructor(
    private route: ActivatedRoute,
    private db: DbConnectionService
  ) {
  }

  filteredEntries = () => {
    return this.entries.filter(u => Object.values(u).join().toLowerCase().indexOf(this.searchTerm) > -1)
  }

  ngOnInit(){
    this.route.params.subscribe((params) => {
      // restore default variables
      this.error = "";
      this.title = "Loading...";
      this.entries = [];
      this.entryHeaders = [];
      this.loading = true;
      this.searchTerm = "";

      if (!params.type || !(params.type in dataset)){
        this.title = "ERROR"
        this.error = "Unkown dataset '" + params.type + "'";
        return;
      }
      this.dataset = dataset[params.type]
      this.db.executeQuery(this.dataset['query']).then(d => {
        if (d['error']){
          this.title = "ERROR"
          this.error = d['error']
          return;
        }
        this.entries = d['data'];
        let k: string[] = Object.keys(this.entries[0]);
        this.entryHeaders = k.map((x: string) => { return {
          name: x,
          width: window.innerWidth / k.length
        }});
        this.loading = false;
        this.title = this.dataset['name']
      });
    })
  }
}
