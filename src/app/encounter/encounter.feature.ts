import { NgModule } from "@angular/core";
import { DbConfig } from "../models/database-config";
import { Encounter } from "./model/encounter";
import { Tabs } from "../tabs/tabs";

@NgModule({
    imports: [],
    exports: [],
    providers: []
})
export class EncounterFeature {
    static initialize() : void{
        DbConfig.register("Encounter", Encounter.is, Encounter.to, Encounter.folder, Encounter.path)
        // Tabs.register("Encounters", "paw", "", "app-encounters-tab", 50)
        return
    }
}
