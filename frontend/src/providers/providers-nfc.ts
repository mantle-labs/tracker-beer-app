import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NfcProvider {

  constructor(private socket: Socket) {
  }

  watchNfcTags() {
      let observable = new Observable(observer => {
          this.socket.on('nfc-scan', (data) => {
              observer.next(data);
          });
      });
      
      return observable;
  }

}
