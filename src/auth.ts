import auth0 from 'auth0-js';
import router from '@/router';

export default class Auth {

  public auth0 = new auth0.WebAuth({
    domain: 'run-track.auth0.com', // e.g., you.auth0.com
    clientID: 'Kd3wUDKM0YjeIpVXH1D7vq6w5SQ8lHnx', // e.g., i473732832832cfgajHYEUqiqwq
    redirectUri: 'http://localhost:8080/callback', // e.g., http://localhost:8080/callback
    audience: 'https://' + 'run-track.auth0.com' + '/api/v2/', // e.g., https://meetupapi.com
    responseType: 'token',
    scope: 'openid profile',
  });

  constructor() {
    this.login = this.login.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.logout = this.logout.bind(this);
  }

  public handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        this.setSession(authResult);
        router.replace('/');
      } else if (err) {
        router.replace('/');
      }
    });
  }

  public setSession(authResult: any) {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('expiresAt', expiresAt);
  }

  public requireAuth(to: any, from: any, next: any) {
    if (!(new Auth().isAuthenticated())) {
      this.login();
      next({
        path: '/',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  }


  public login() {
    this.auth0.authorize();
  }

  public logout() {
    // Clear access token and expiration from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresAt');
    // navigate to the landing page route
    router.push('/');
  }

  public isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expiresAt') || '{}');
    return new Date().getTime() < expiresAt;
  }
}
