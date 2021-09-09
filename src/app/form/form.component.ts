import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputField } from '../classes';
import { DbConnectionService } from '../db-connection.service';
import { QueryService } from '../query.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @ViewChild('select') selectPicker;

  form: FormGroup;
  inputFields= []

  type: string;
  title: string;
  error: string;
  loading: boolean;
  id: number;
  dataset;

  constructor(private route: ActivatedRoute,
    private querries: QueryService,
    private router: Router,
    private db: DbConnectionService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.loading = true;
      this.id = -1;
      this.title = "Loading...";
      this.error = "";

      if (!params.type || !(params.type in this.querries.datasets))
        return this.showError("Unkown dataset '" + params.type + "'");
      this.type = params.type;
      this.dataset = this.querries.datasets[params.type];
      if (!this.dataset.form)
        return this.showError("Dataset '" + params.type + "' has no form attribute");

      this.inputFields = Object.entries(this.dataset.form).map(([k, v])=> {
        if (typeof v === "string"){
          let l = [];
          this.db.executeQuery(v).then((r) => {
            if (r["error"])
              return this.showError(r["error"])
            if (!(r["data"] && Object.keys(r["data"][0]).length === 2 && k in r["data"][0]))
              return this.showError("A reference must contain a query that returns 2 fields: ID and a string value")
            let nameKey = Object.keys(r["data"][0]).filter(x => x !== k)[0]
            r["data"].forEach(x => {
              l.push({id: x[k], name: x[nameKey]})
            });
          })
          return [k, l];
        } else
          return [k, v];
      });
      let fg = {}
      Object.entries(this.dataset.form).forEach(([k, v]) => {
        fg[k] = new FormControl('');
      })
      this.form = new FormGroup(fg);


      if (params.id){
        this.id = params.id;
        this.querries.getEntry(params.id, this.dataset.dataset, this.dataset.id).then((r) => {
          if (r["error"])
            return this.showError(r["error"])
          if (!(r["data"] && r["data"][0]))
            return this.showError(`No entry in ${this.dataset.dataset} found with id ${params.id}`)
          Object.entries(r["data"][0]).forEach(([k, v])=> {
            if (k in this.dataset.form)
              this.form.get(k).setValue(v);
          })
        })
        this.title = `Edit entry of ${this.type}`
      } else
        this.title = `Create entry for ${this.type}`
      this.loading = false;
    })
  }

  showError(err: string){
      this.title = "ERROR"
      this.error = err;
      this.loading = false;
  }

  generateForm(inputFields: Object){
    this.inputFields = Object.entries(inputFields);
    let fg = {}
    Object.entries(inputFields).forEach(([k, v]) => {
      fg[k] = new FormControl();
    })
    this.form = new FormGroup(fg);
    this.loading = false;
  }

  onSubmit(){
    let d = {}
    Object.entries(this.form.getRawValue()).forEach(([k, v]) => {
      if (v)
        d[k] = typeof v === "string" ? this.sanitizeString(v) : v;
    });
    if (this.id < 0)
      this.querries.createEntry(this.dataset.dataset, d).then(this.afterSubmit);
    else
      this.querries.editEntry(this.dataset.dataset, d, this.dataset.id, this.id).then(this.afterSubmit);
  }

  // prevents SQL injections
  sanitizeString(s: string): string{
    return s.replace("\"", "");
  }

  afterSubmit = (r) => {
    if (r['error']){
      this.error = r['error'];
      return;
    }
    if (r['data']['affectedRows'] === 1)
      this.back();
    else
      this.error = "Something went wrong"
  }

  back(){
    this.router.navigateByUrl(`/dataset/${this.type}`)
  }

  isNumber(val): boolean { return typeof val === 'number'; }
}
