import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import axios from 'axios';
import { NfcProvider } from '../../providers/providers-nfc';
import { UtilsProvider } from '../../providers/providers-utils';
import { SettingsProvider } from '../../providers/providers-settings';
import { LoadingController, AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'returnbottles.html',
  providers: [NfcProvider, UtilsProvider, SettingsProvider]
})
export class ReturnBottlesPage {
  customerEmail: string = "";
  bottles: any[] = [];
  bottleIds: string[] = [];

  constructor(public navCtrl: NavController, public nfcProvider: NfcProvider, public utilsProvider: UtilsProvider, public loadingCtrl: LoadingController, public settingsProvider: SettingsProvider, public alertCtrl: AlertController) {
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

      axios.get(`${this.settingsProvider.backendUrl}/bottles/ownership`).then(response => {
        const ownerships = response.data.ownerships.map(x => x.name);

        this.bottles.forEach(bottle => {
            bottle.owned = ownerships.some(x => x == bottle.name);
        });
        
        loader.dismiss();
      });
    });
  }

  returnBottles(){
    const returnRequest = {
      bottleIds: this.bottles.filter(x => x.name && x.owned).map(x => x.name)
    }

    if (returnRequest.bottleIds.length === 0) {
      this.alertCtrl.create({
        title: 'Oops',
        subTitle: 'No bottle has been validated',
        buttons: ['Ok']
      }).present();

      return;
    }

    const loader = this.loadingCtrl.create({ content: "Returning bottles..." });
    loader.present();

    axios.post(`${this.settingsProvider.backendUrl}/bottles/return`, returnRequest).then(response => {
      loader.dismiss();

      this.alertCtrl.create({
        title: 'Success',
        subTitle: 'Beer bottles have been returned successfully!',
        buttons: ['Great!']
      }).present();

      this.resetBottles();
    }).catch(error => {
      loader.dismiss();

      this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Sorry, we couldn\'t return the beer bottles',
        buttons: ['Ok']
      }).present();
    })
  }
  
  getBottleName(bottle: any) {
    return this.utilsProvider.getBottleNameWithOwnership(bottle);
  }

  getBottleIngredients(bottle: any) {
    return this.utilsProvider.getBottleIngredients(bottle);
  }
  
  getBottleBeerType(bottle: any) {
    return this.utilsProvider.getBottleBeerType(bottle);
  }
}
