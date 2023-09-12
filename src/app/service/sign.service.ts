import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Sign } from '../model/sign';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignService extends GenericService<Sign> {

  private patientChange: Subject<Sign[]> = new Subject<Sign[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient){
    super(http, `${environment.HOST}/signs`);
  }

  listPageable(p: number, s: number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  getSignChange(){
    return this.patientChange.asObservable();
  }

  setSignChange(data: Sign[]){
    this.patientChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }
}
