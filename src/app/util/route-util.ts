import { Router } from "@angular/router";

export class RouteUtil {
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
        router.navigate(this.upOneLevel(router));
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