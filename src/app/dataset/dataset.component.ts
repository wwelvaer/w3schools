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
  searchCol: number = -1;

  constructor(
    private route: ActivatedRoute,
    private db: DbConnectionService
  ) {
  }

  filteredEntries = () => {
    return this.entries.filter(u => this.searchCol < 0
      ? (Object.values(u).join().toString().toLowerCase().indexOf(this.searchTerm.toString().toLowerCase()) > -1)
      : (u[this.entryHeaders[this.searchCol].name].toString().toLowerCase().indexOf(this.searchTerm.toString().toLowerCase()) > -1)
    )
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

  deleteEntry(id){
    this.db.executeQuery(`DELETE FROM ${this.dataset.dataset} WHERE ${this.dataset.id}=${id}`).then((r) => {
      if (r['data']['affectedRows'] === 1)
        this.entries = this.entries.filter(x => x[this.dataset.id] !== id)
    })
  }
}
