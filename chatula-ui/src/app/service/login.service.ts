import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

//  private endpoint: string = 'http://192.168.0.16:8080/chat/api/v1/login';
//  private endpoint: string =  'http://192.168.204.107:8080/chat/api/v1/login';
  private endpoint: string = 'https://cula.io/chat/api/v1/login';
//  private endpoint: string = 'http://localhost:8080/chat/api/v1/login';
  private http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  public login(user: string, pass: string) {
    let creds = JSON.stringify({username: user, password: pass});
    return this.http.post(this.endpoint, creds, this.generateHeaderWithoutAuthorization())
    .map((res: any) => {
      return res;
    });
  }

  protected generateHeaderWithoutAuthorization() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  }
}
