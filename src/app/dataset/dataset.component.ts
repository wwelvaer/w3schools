import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbConnectionService } from '../db-connection.service';
import { QueryService } from '../query.service';

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
  entryHeaders: string[];
  error: string;
  warning: string;
  type: string;

  searchTerm: string;
  searchCol: number = -1;

  constructor(
    private route: ActivatedRoute,
    private db: DbConnectionService,
    private querries: QueryService
  ) {
  }

  // lambda function that filters entries using the searchTerm and searchCol variables (searchCol = -1 means filter over all columns)
  filteredEntries = () => {
    return this.entries.filter(u => this.searchCol < 0
      ? (Object.values(u).join().toString().toLowerCase().indexOf(this.searchTerm.toString().toLowerCase()) > -1)
      : (u[this.entryHeaders[this.searchCol]].toString().toLowerCase().indexOf(this.searchTerm.toString().toLowerCase()) > -1)
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
      this.searchCol = -1;

      // invalid type
      if (!params.type || !(params.type in this.querries.datasets))
        return this.showError("Unkown dataset '" + params.type + "'");
      this.type = params.type;
      this.dataset = this.querries.datasets[params.type]
      this.db.executeQuery(this.dataset['query']).then(d => {
        // database error
        if (d['error'])
          return this.showError(d['error'])
        // query didn't match any data
        if (!d['data'] || d['data'].length === 0)
          return this.showWarning(`Didn't receive any data`)
        // save data
        this.entries = d['data'];
        this.entryHeaders = Object.keys(this.entries[0]);
        this.loading = false;
        this.title = this.type
      });
    })
  }

  showError(err: string){
    this.title = "ERROR"
    this.error = err;
    this.loading = false;
  }

  showWarning(warning: string){
    this.warning = warning;
    this.loading = false;
    this.title = this.type
  }

  deleteEntry(PK: object){
    this.querries.deleteEntry(PK, this.dataset.tableName).then((r) => {
      //database error
      if (r['error'])
        return this.showError(r['error'])
      // checks if database was affected, then deletes entry locally
      if (r['data']['affectedRows'] === 1)
        this.entries = this.entries.filter(x => !Object.entries(PK).every(([k, v]) => x[k] === v))
      else
        this.showError("Something went wrong")
    })
  }

  // extracts All primary keys from entry
  extractPK(e: object):object{
    let obj = {};
    if (typeof this.dataset.PK !== "object")
      obj[this.dataset.PK] = e[this.dataset.PK]
    else
      this.dataset.PK.forEach(x => {obj[x] = e[x]});
    return obj;
  }
}
