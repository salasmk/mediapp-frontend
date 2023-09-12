import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, map, switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { Sign } from 'src/app/model/sign';
import { PatientService } from 'src/app/service/patient.service';
import { SignService } from 'src/app/service/sign.service';
import { PatientDialogComponent } from '../patient-dialog/patient-dialog.component';

@Component({
  selector: 'app-vital-signs-edit',
  templateUrl: './vital-signs-edit.component.html',
  styleUrls: ['./vital-signs-edit.component.css']
})
export class VitalSignsEditComponent implements OnInit {

  form: FormGroup;
  id: number;
  isEdit: boolean;
  valueButton='ACEPTAR';

  // patientControl: FormControl = new FormControl();
  patientsFiltered$: Observable<Patient[]>;
  patients: Patient[];

  constructor(
    private signService: SignService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private _dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idSign: new FormControl(0),
      patient: new FormControl('',[Validators.required]),
      date: new FormControl(new Date()),
      temperature: new FormControl('',[Validators.required, Validators.minLength(2)]),
      pulse: new FormControl('', [Validators.required, Validators.maxLength(2)]),
      rate: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });

    this.patientService.getPatientChange().subscribe(data => {
      this.patients = data;
    });

    this.patientService.findAll().subscribe(data => this.patients = data);

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });

    this.patientsFiltered$ = this.f['patient'].valueChanges.pipe(map(val => this.filterPatients(val)));      

    
  }

  filterPatients(val: any){
    if(val?.idPatient > 0){
      return this.patients.filter(el => 
        el.firstName.toLowerCase().includes(val.firstName.toLowerCase()) || el.lastName.toLowerCase().includes(val.lastName.toLowerCase()) || el.dni.includes(val)
    );
    }else{
      return this.patients.filter(el => 
        el.firstName.toLowerCase().includes(val?.toLowerCase()) || el.lastName.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
    }      
  }

  showPatient(val: any){
    return val ? `${val.firstName} ${val.lastName}` : val;
  }

  initForm() {
    if (this.isEdit) {
      this.valueButton = "ACTUALIZAR"
      this.signService.findById(this.id).subscribe((data) => {
        const createdAt = moment(data.createdAt,"YYYY-MM-DDTHH:mm:ss").format("YYYY-MM-DDTHH:mm:ss");
        this.form = new FormGroup({
          idSign: new FormControl(data.idSign),
          patient: new FormControl(data.patient, [Validators.required]),
          date: new FormControl(createdAt),
          temperature: new FormControl(data.temperature, [Validators.required, Validators.minLength(2)]),
          pulse: new FormControl(data.pulse, [Validators.required, Validators.maxLength(2)]),
          rate: new FormControl(data.rate, [Validators.required, Validators.minLength(2)]),
        });
      });
    }
  }

  get f(){
    return this.form.controls;
  }

  operate() {
    const patient: Patient = new Patient();
    patient.idPatient = this.f['patient'].value.idPatient;

    const vitalSign: Sign = new Sign();
    vitalSign.patient = patient;
    vitalSign.createdAt = this.f['date'].value;
    vitalSign.temperature = this.f['temperature'].value;
    vitalSign.pulse = this.f['pulse'].value;
    vitalSign.rate = this.f['rate'].value;
    
    console.log("Vital Sign => " + JSON.stringify(vitalSign));
  
    if (this.isEdit) {
      this.signService.update(this.id, vitalSign).pipe(switchMap(() => {
        return this.signService.findAll();
      })).subscribe(data => {
        this.signService.setSignChange(data);
        this.signService.setMessageChange("UPDATED!");
      }) ;
    } else {
      this.signService.save(vitalSign).pipe(switchMap( () => {
        return this.signService.findAll();
      }))
      .subscribe(data => {
        this.signService.setSignChange(data);
        this.signService.setMessageChange('INSERTED!');
      });
    }

    this.router.navigate(['/pages/vital-signs'])
  }

  openDialog() {
    this._dialog.open(PatientDialogComponent, {
      width: '350px'
    });
  }

}
