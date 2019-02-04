import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import axios from 'axios';
import { NfcProvider } from '../../providers/providers-nfc';
import { UtilsProvider } from '../../providers/providers-utils';
import { SettingsProvider } from '../../providers/providers-settings';
import { LoadingController, AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'sellbottles.html',
  providers: [NfcProvider, UtilsProvider, SettingsProvider]
})
export class SellBottlesPage {
  customerEmail: string = "";
  bottles: any[] = [];
  bottleIds: string[] = [];

  constructor(public navCtrl: NavController, public nfcProvider: NfcProvider, public settingsProvider: SettingsProvider, public utilsProvider: UtilsProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.customerEmail = settingsProvider.customerEmail;
    
    this.nfcProvider.watchNfcTags().subscribe(nfcTag => {
      this.bottleIds.push(nfcTag as string);
    });
  }

  resetBottles(){
    this.bottleIds = [];
    this.bottles = [];
  }

  validateBottles(){
    const loader = this.loadingCtrl.create({ content: "Validating bottles..." });
    loader.present();
    
    const validateRequest = {
      bottleIds: Array.from(new Set(this.bottleIds))
    };

    axios.post(`${this.settingsProvider.backendUrl}/bottles/validate`, validateRequest).then(response => {
      this.bottles = response.data;
      loader.dismiss();
    });
  }

  sellBottles(){
    const sellRequest = {
      bottleIds: this.bottles.map(x => x.name).filter(x => x)
    }

    if (sellRequest.bottleIds.length === 0) {
      this.alertCtrl.create({
        title: 'Oops',
        subTitle: 'No bottle has been validated',
        buttons: ['Ok']
      }).present();

      return;
    }

    const loader = this.loadingCtrl.create({ content: "Selling bottles..." });
    loader.present();

    axios.post(`${this.settingsProvider.backendUrl}/bottles/sell`, sellRequest).then(response => {
      loader.dismiss();
      this.resetBottles();

      this.alertCtrl.create({
        title: 'Success',
        subTitle: 'Beer bottles have been sold successfully!',
        buttons: ['Great!']
      }).present();
    }).catch(error => {
      loader.dismiss();

      this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Sorry, we couldn\'t sell the beer bottles',
        buttons: ['Ok']
      }).present();
    })
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
