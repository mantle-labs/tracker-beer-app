import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CreateBottlesPage } from '../pages/createbottles/createbottles';
import { SellBottlesPage } from '../pages/sellbottles/sellbottles';
import { ReturnBottlesPage } from '../pages/returnbottles/returnbottles';
import { CustomerListPage } from '../pages/customerlist/customerlist';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = CreateBottlesPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Create Bottles', component: CreateBottlesPage },
      { title: 'Sell Bottles', component: SellBottlesPage },
      { title: 'Return Bottles', component: ReturnBottlesPage },
      { title: 'Customers', component: CustomerListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
