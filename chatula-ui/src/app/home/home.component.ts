import { AfterViewInit, Component } from '@angular/core';
import { Title } from './title';
import { LoginService } from '../service/login.service';

@Component({

  selector: 'home',
  providers: [Title, LoginService],
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit {

  public localState = {value: ''};
  public token: string = '';
//  public host: string = 'http://192.168.1.223:3000';
//  public host: string = 'http://192.168.0.16:3000';
  public username: string = 'rafal';
  public password: string = 'rafal';
  public isLoggedIn: boolean = false;

  constructor(private _loginService: LoginService, public title: Title) {
  }

  public ngAfterViewInit() {
    console.log();
  }

  public getJwt() {
    let self = this;
    this._loginService.login(this.username, this.password).subscribe((res: any) => {
      if (res.headers.has('Authorization')) {
        this.token = res.headers.get('Authorization');
        this.chatLogIn();
        setTimeout(function () {
          self.chatGetChannels();
          self.chatGetUsers();
        }, 1000);
        this.isLoggedIn = true;
      }
    });
  }

  public chatGetChannels() {
    let x: any = {};
    x = document.getElementById('chatulaIFrame');
    x.contentWindow.chatulaController.postMessage('GET_CHANNELS');
  }

  public chatGetUsers() {
    let x: any = {};
    x = document.getElementById('chatulaIFrame');
    x.contentWindow.chatulaController.postMessage('GET_USERS');
  }

  public chatLogIn() {
    let x: any = {};
    x = document.getElementById('chatulaIFrame');
    x.contentWindow.chatulaController.postMessage('LOG_IN', {token: this.token});
  }

  public chatLogOut() {
    let x: any = {};
    x = document.getElementById('chatulaIFrame');
    x.contentWindow.chatulaController.postMessage('LOG_OUT');
    this.isLoggedIn = false;
  }
  public chatMinimize() {
    let x: any = {};
    x = document.getElementById('chatulaIFrame');
    x.contentWindow.chatulaController.postMessage('MINIMIZE');
    this.isLoggedIn = false;
  }
  public chatMaximize() {
    let x: any = {};
    x = document.getElementById('chatulaIFrame');
    x.contentWindow.chatulaController.postMessage('MAXIMIZE');
    this.isLoggedIn = false;
  }

}
