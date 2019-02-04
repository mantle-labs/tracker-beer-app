import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CustomerWalletPage } from '../customerwallet/customerwallet';
import { SettingsProvider } from '../../providers/providers-settings';

@Component({
  selector: 'page-customer-list',
  templateUrl: 'customerlist.html',
  providers: [SettingsProvider]
})
export class CustomerListPage {
  customers: string[] = [];

  constructor(public navCtrl: NavController, public settingsProvider: SettingsProvider) {
    this.customers = [settingsProvider.customerEmail]; // Hard coded user management
  }

  navigateToCustomerWallet() {
    this.navCtrl.setRoot(CustomerWalletPage);
  }
}