import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  username: string;
  roles: string;

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const decodeToken = helper.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME));
    this.username = decodeToken.sub;
    this.roles = decodeToken.role;
  }

}
