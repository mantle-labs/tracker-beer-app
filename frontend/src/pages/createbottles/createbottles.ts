import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NfcProvider } from '../../providers/providers-nfc';
import { UtilsProvider } from '../../providers/providers-utils';
import { SettingsProvider } from '../../providers/providers-settings';
import axios from 'axios';
import { beerSpecTypes } from '../../enums/beerSpecTypes';
import { LoadingController, AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'createbottles.html',
  providers: [NfcProvider, UtilsProvider, SettingsProvider]
})
export class CreateBottlesPage {
  specs: any = {};
  selectedSpecs: any = {};
  newSpecs: any = {};
  objectKeys = Object.keys;
  bottleIds: string[] = [];

  constructor(public navCtrl: NavController, public nfcProvider: NfcProvider, public settingsProvider: SettingsProvider, public utilsProvider: UtilsProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.nfcProvider.watchNfcTags().subscribe(nfcTag => {
      this.bottleIds.push(nfcTag as string);
    });

    this.loadSpecs();
  }

  loadSpecs(){
    const loader = this.loadingCtrl.create({ content: "Loading specifications..." });
    loader.present();

    axios.get(`${this.settingsProvider.backendUrl}/beerspecs`).then(response => {
        Object.keys(beerSpecTypes).forEach(beerSpec => {
          this.specs[beerSpec] = (response.data[beerSpec] || []).map(x => x.name);
          this.selectedSpecs[beerSpec] = [];
          this.newSpecs[beerSpec] = "";
        });

        loader.dismiss();
    });
  }

  createSpec(spec: beerSpecTypes) {
    const name = this.newSpecs[spec].trim();

    if (!this.specs[spec].some(x => x.toLowerCase() === name.toLowerCase())) {
      this.specs[spec] = this.specs[spec].concat([name]);
      this.selectedSpecs[spec] = this.selectedSpecs[spec].concat([name]);
    }
    
    this.newSpecs[spec] = "";
  }

  createBottles(){
    const loader = this.loadingCtrl.create({ content: "Creating bottles..." });
    loader.present();

    let allSpecs = [];
    Object.keys(this.selectedSpecs).forEach(spec => {
        allSpecs = allSpecs.concat(this.selectedSpecs[spec].map(x => { return { type: spec, name: x};}));
    })

    const createRequest = {
      specs: allSpecs,
      bottleIds: Array.from(new Set(this.bottleIds))
    };

    axios.post(`${this.settingsProvider.backendUrl}/bottles`, createRequest).then(response => {
      loader.dismiss();
    
      this.alertCtrl.create({
        title: 'Success',
        subTitle: 'Beer bottles have been created successfully!',
        buttons: [{ 
          text: 'Great!',
          handler: () => { this.loadSpecs(); }}]
      }).present();

      this.selectedSpecs = {};
      this.bottleIds = [];
    }).catch(error => {
      loader.dismiss();

      this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Sorry, we couldn\'t create beer bottles',
        buttons: ['Ok']
      }).present();
    });
  }
  
  resetBottles() {
    this.bottleIds = [];
  }

  getPrettySpecName(spec: string) {
    return this.utilsProvider.getPrettySpecName(spec);
  }

  getPrettyMultiSpecName(spec: string) {
    return this.utilsProvider.getPrettyMultiSpecName(spec);
  }
}