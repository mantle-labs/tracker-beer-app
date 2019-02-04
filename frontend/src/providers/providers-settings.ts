import { Injectable } from '@angular/core';

@Injectable()
export class SettingsProvider {
  public backendUrl: string = 'http://localhost:3000';
  public customerEmail: string = 'EMAIL-OF-ONE-OF-THE-CUSTOMERS';

  constructor() {
  }
}
