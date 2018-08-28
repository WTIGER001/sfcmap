import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

export class RouteUtil {
    static getParam(router: Router, param: string): string {
        console.log("URL : ", router.url);
        console.log("TREE", router.createUrlTree([router.url]))
        console.log("MAP", router.createUrlTree([router.url]).queryParamMap)
        console.log("PARAM", param, router.createUrlTree([router.url]).queryParamMap.get(param))

        return router.createUrlTree([router.url]).queryParamMap.get(param);
    }

    static setParamsNoReload(router: Router, location: Location, params: any) {
        location.go(router.createUrlTree([router.url], { queryParams: params }).toString())
    }

    static upOneLevel(router: Router): string[] {
        const parts = router.url.split("/")
        parts[0] = '/'
        return parts.slice(0, parts.length - 1)
    }

    static upTwoLevels(router: Router): string[] {
        const parts = router.url.split("/")
        parts[0] = '/'
        return parts.slice(0, parts.length - 1)
    }

    static goUpOneLevel(router: Router) {
        router.navigate(this.upOneLevel(router));
    }

    static goUpTwoLevels(router: Router) {
      router.navigate(this.upTwoLevels(router));
    }
    
    static getGameId(router: Router) {

    }

    static getGamesystemId(router: Router) {

    }

    static toGame(router: Router) {

    }

    static toGamesystem(router: Router) {

    }
}