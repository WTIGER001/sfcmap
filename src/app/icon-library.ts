import { Library } from "@fortawesome/fontawesome-svg-core";

import { faPlus, faBookmark, faShield, faShieldAlt, faCaretRight, faCaretLeft, faCaretDown, faCaretUp, faDiceSix, faDiceD20, faTrash, faTrashAlt, faArrowUp, faArrowDown, faArrowLeft, faArrowRight, faArrows, faPaperclip, faLayerGroup, faTimes, faUnlink, faLink, faPencilAlt, faCheck, faPencil, faSortAmountUp, faSort, faSortAmountDown, faHome, faCog, faSlidersH, faSearch, faSignOut, faSignOutAlt, faSave, faLock, faUnlock, faRuler, faBroadcastTower, faEar, faLightbulb, faMap, faSun, faCloudSun, faCloudMoon, faEye, faEyeSlash, faMoon, faMapMarkerAlt, faRectanglePortrait, faRectangleWide, faDoorOpen, faCampfire, faSignature, faVectorSquare, faDrawCircle, faDrawPolygon, faDrawSquare, faImage, faUserShield, faHelmetBattle, faDragon, faThumbtack, faGlobe, faSwords, faDice, faSquare, faToggleOff, faToggleOn, faPencilRuler, faBars, faLightbulbOn, faLightbulbSlash, faFastForward, faStepForward, faHeart, faQuestionCircle, faThLarge, faFilter, faFileImport, faHistory, faTh, faEdit, faLocation, faRandom, faCloudUpload, faAddressCard, faSkullCrossbones } from '@fortawesome/pro-solid-svg-icons';
import { faStar, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faGoogle, faGithub, fab } from '@fortawesome/free-brands-svg-icons';


export class Icons {
  constructor(private library: Library) {
    this.addIcons(library)
  }

  addIcons(l : Library) {

    this.solidFree(l)
    this.solidPro(l)
    this.regularFree(l)
    this.regularPro(l)
    this.brandsFree(l)

  }

  solidFree(l : Library) {
    l.add(
      faLayerGroup, 
      faPlus, 
      faBookmark,
      faShield,
      faShieldAlt,
      faCaretRight,
      faCaretLeft,
      faCaretDown,
      faCaretUp,
      faDiceSix,
      faDiceD20,
      faTrash,
      faTrashAlt,
      faArrowUp,
      faArrowDown,
      faArrowLeft,
      faArrowRight,
      faArrows,
      faPaperclip,
      faTimes,
      faUnlink,
      faLink,
      faPencilAlt,
      faPencil,
      faCheck,
      faSortAmountUp,
      faSortAmountDown,
      faSort,
      faHome,
      faCog,
      faSlidersH,
      faSearch,
      faSignOutAlt,
      faSave,
      faLock,
      faUnlock,
      faRuler,
      faBroadcastTower,
      faEar,
      faMap,
      faLightbulb,
      faSun,
      faCloudSun,
      faMoon,
      faCloudMoon,
      faEye,
      faEyeSlash,
      faMapMarkerAlt,
      faRectangleWide,
      faDoorOpen,
      faCampfire,
      faSignature,
      faVectorSquare,
      faDrawCircle,
      faDrawPolygon,
      faDrawSquare,
      faImage,
      faUserShield,
      faDragon,
      faHelmetBattle,
      faThumbtack,
      faGlobe,
      faSwords,
      faDice,
      faSquare,
      faToggleOff,
      faToggleOn,
      faStar,
      faPencilRuler,
      faBars,
      faLightbulbOn,
      faLightbulbSlash,
      faFastForward,
      faStepForward,
      faHeart,
      faQuestionCircle,
      faThLarge,
      faTh,
      faFilter,
      faFileImport,
      faHistory,
      faEdit,
      faLocation,
      faRandom,
      faCloudUpload,
      faAddressCard,
      faSkullCrossbones
    )
  }

  solidPro(l : Library) {

  }

  regularFree(l: Library) {
    l.add(faStar, faCircle)
  }

  regularPro(l: Library) {

  }

  brandsFree(l: Library) {
    l.add(faGoogle, faGithub)

  }

}