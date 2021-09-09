import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
      // restore default variables
      this.loading = true;
      this.id = -1;
      this.title = "Loading...";
      this.error = "";

      // invalid type
      if (!params.type || !(params.type in this.querries.datasets))
        return this.showError("Unkown dataset '" + params.type + "'");
      this.type = params.type;
      this.dataset = this.querries.datasets[params.type];
      // dataset has to contain form attribute
      if (!this.dataset.form)
        return this.showError("Dataset '" + params.type + "' has no form attribute");
      // initialize input fields
      this.inputFields = Object.entries(this.dataset.form).map(([k, v])=> {
        // InputField.Reference(v)
        if (typeof v === "string"){
          let l = [];
          /** data for dropdowns is loaded asynchrone
           *  @var l used as reference address, will be initially empty and filled when the data is received
           */
          this.db.executeQuery(v).then((r) => {
            // database error
            if (r["error"])
              return this.showError(r["error"])
            // query didn't match any data
            if (!r["data"] || r["data"].length === 0)
              return this.showError(`Didn't receive any data`)
            //
            if (!(Object.keys(r["data"][0]).length === 2 && k in r["data"][0]))
              return this.showError("A reference must contain a query that returns 2 fields: ID and a string value")
            // loads data using push to keep the address (reassigning would change the address)
            let nameKey = Object.keys(r["data"][0]).filter(x => x !== k)[0]
            r["data"].forEach(x => {
              l.push({id: x[k], name: x[nameKey]})
            });
          })
          return [k, l];
        } else // InputField.Text, InputField.Number, InputField.Date
          return [k, v];
      });
      // Initialize formGroup
      let fg = {}
      Object.entries(this.dataset.form).forEach(([k, v]) => {
        fg[k] = new FormControl('');
      })
      this.form = new FormGroup(fg);

      // id parameter is given when editing an already existing entry
      if (params.id){
        this.id = params.id;
        // dataset has to contain dataset and id attribute
        if (!(this.dataset.dataset && this.dataset.id))
          return this.showError("Dataset '" + params.type + "' has no dataset or id attribute");
        // fetch entry data using id
        this.querries.getEntry(params.id, this.dataset.dataset, this.dataset.id).then((r) => {
          // database error
          if (r["error"])
            return this.showError(r["error"])
          // empty response
          if (!(r["data"] && r["data"][0]))
            return this.showError(`No entry in ${this.dataset.dataset} found with id ${params.id}`)
          // fill out form fields
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

  onSubmit(){
    // collects data and filters out empty fields
    let d = {}
    Object.entries(this.form.getRawValue()).forEach(([k, v]) => {
      if (v)
        d[k] = typeof v === "string" ? this.sanitizeString(v) : v;
    });
    // id == -1 when no id param is given
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
    // database error
    if (r['error'])
      return this.showError(r['error']);
    // checks if database was affected
    if (r['data']['affectedRows'] === 1)
      this.back();
    else
      this.showError("Something went wrong")
  }

  // go back to dataset
  back(){
    this.router.navigateByUrl(`/dataset/${this.type}`)
  }

  isNumber(val): boolean { return typeof val === 'number'; }
}
