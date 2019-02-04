import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import axios from 'axios';
import { LoadingController, AlertController } from 'ionic-angular';
import { SettingsProvider } from '../../providers/providers-settings';
import { UtilsProvider } from '../../providers/providers-utils';

@Component({
  templateUrl: 'customerwallet.html',
  providers: [SettingsProvider, UtilsProvider]
})
export class CustomerWalletPage {
  walletEntries: any = [];
  membershipCoin: number = 0;
  newMembershipCoin: number = 0;
  customerEmail: string = '';

  constructor(public navCtrl: NavController, public settingsProvider: SettingsProvider, public utilsProvider: UtilsProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.loadWallet();
    this.customerEmail = this.settingsProvider.customerEmail;
  }

  loadWallet() {
    const loader = this.loadingCtrl.create({ content: "Loading wallet..." });
    loader.present();

    axios.get(`${this.settingsProvider.backendUrl}/bottles/ownership/detailed`).then(response => {
        this.walletEntries = response.data.ownerships;
        this.membershipCoin = response.data.membershipLimit;
        this.newMembershipCoin = response.data.membershipLimit;
        loader.dismiss();
    }).catch(error => {
      loader.dismiss();
      this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Sorry, we couldn\'t fetch the customer\'s ownership',
        buttons: ['Ok']
      }).present();
    });
  }

  updateMembership() {
    if (this.newMembershipCoin < this.walletEntries.length) {
      this.alertCtrl.create({
        title: 'Error',
        subTitle: 'The new membership limit cannot be less than the total of bottles owned',
        buttons: ['Ok']
      }).present();
      return;
    }

    const membershipCoinChange = this.newMembershipCoin - this.membershipCoin;
    const loader = this.loadingCtrl.create({ content: "Updating membership..." });
    loader.present();

    axios.put(`${this.settingsProvider.backendUrl}/memberships`, { membershipCoinChange }).then(response => {
        this.membershipCoin += membershipCoinChange;
        loader.dismiss();

        this.alertCtrl.create({
          title: 'Success',
          subTitle: 'Membership was updated successfully!',
          buttons: ['Great!']
        }).present();
    }).catch(error => {
        loader.dismiss();

        this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Sorry, we couldn\'t update the customer\'s membership',
          buttons: ['Ok']
        }).present();
    });
  }

  getBottleName(bottle: any) {
    return this.utilsProvider.getBottleName(bottle);
  }

  getBottleIngredients(bottle: any) {
    return this.utilsProvider.getBottleIngredients(bottle);
  }
  
  getBottleBeerType(bottle: any) {
    return this.utilsProvider.getBottleBeerType(bottle);
  }
}