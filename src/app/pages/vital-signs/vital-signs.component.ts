import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Sign } from 'src/app/model/sign';
import { SignService } from 'src/app/service/sign.service';

@Component({
  selector: 'app-vital-signs',
  templateUrl: './vital-signs.component.html',
  styleUrls: ['./vital-signs.component.css']
})
export class VitalSignsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'patient', 'createdAt', 'temperature', 'pulse', 'rate', 'actions']
  dataSource: MatTableDataSource<Sign>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalElements: number = 0;

  constructor(
    private route: ActivatedRoute,
    private signService: SignService,
    private _snackBar: MatSnackBar
    ) {}

  ngOnInit(): void {
    this.signService.getSignChange().subscribe(data => {
      this.createTable(data);
    });

    this.signService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
    });

    this.signService.listPageable(0, 2).subscribe(data => {
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });
  }

  createTable(data: Sign[]){
    this.dataSource = new MatTableDataSource(data);    
  }

  delete(idSign: number) {
    this.signService.delete(idSign)
    .pipe(switchMap(()=> this.signService.findAll()))
    .subscribe(data => {
      this.createTable(data);
      this.signService.setMessageChange('DELETED!');
    });
  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value.trim();
  }

  showMore(e: any){
    this.signService.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });
  }

  checkChildren(): boolean{
    return this.route.children.length != 0;
  }
}
