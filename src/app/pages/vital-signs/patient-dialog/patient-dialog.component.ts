import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.css']
})
export class PatientDialogComponent implements OnInit {

  patient: Patient;

  constructor(
    //@Inject(MAT_DIALOG_DATA) private data: Patient,
    private _dialogRef: MatDialogRef<PatientDialogComponent>,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.patient = new Patient();
  }

  operate() {
    if (this.patient != null) {
      this.patientService.save(this.patient).pipe(switchMap( () => {
        return this.patientService.findAll();
      }))
      .subscribe(data => {
        this.patientService.setPatientChange(data);
        this.patientService.setMessageChange('INSERTED!');
      });
    }
    this.close();
  }

  close() {
    this._dialogRef.close();
  }
}
