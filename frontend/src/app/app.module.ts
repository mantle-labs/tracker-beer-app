import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { CreateBottlesPage } from '../pages/createbottles/createbottles';
import { SellBottlesPage } from '../pages/sellbottles/sellbottles';
import { ReturnBottlesPage } from '../pages/returnbottles/returnbottles';
import { CustomerListPage } from '../pages/customerlist/customerlist';
import { CustomerWalletPage } from '../pages/customerwallet/customerwallet';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { NfcProvider } from '../providers/providers-nfc';
import { SettingsProvider } from '../providers/providers-settings';
import { UtilsProvider } from '../providers/providers-utils';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    MyApp,
    CreateBottlesPage,
    SellBottlesPage,
    ReturnBottlesPage,
    CustomerWalletPage,
    CustomerListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CreateBottlesPage,
    SellBottlesPage,
    ReturnBottlesPage,
    CustomerWalletPage,
    CustomerListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NfcProvider,
    SettingsProvider,
    UtilsProvider
  ]
})
export class AppModule {}
