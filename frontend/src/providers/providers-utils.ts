import { Injectable } from '@angular/core';

@Injectable()
export class UtilsProvider {
  public getBottleName(bottle: any) {
    return bottle.name ? `Bottle #${bottle.name}` : "Bottle doesn't exist";
  }

  public getBottleNameWithOwnership(bottle: any) {
    return bottle.name ? (!bottle.owned ? `Bottle #${bottle.name} (not owned by user)` : `Bottle #${bottle.name}`) : "Bottle doesn't exist";
  }

  public getBottleIngredients(bottle: any) {
    return bottle.name && bottle.specs["INGREDIENT"] && bottle.specs["INGREDIENT"].length > 0 ? bottle.specs["INGREDIENT"].map(x => x.name).join(', ') : "N/A";
  }
  
  public getBottleBeerType(bottle: any) {
    return bottle.name && bottle.specs["BEER_TYPE"] && bottle.specs["BEER_TYPE"].length > 0 ? bottle.specs["BEER_TYPE"][0].name : "N/A";
  }

  public getPrettySpecName(spec: string) {
    return spec.replace('_', ' ').toLowerCase();
  }

  public getPrettyMultiSpecName(spec) {
    return this.getPrettySpecName(spec) + "s";
  }
}
