import { faStar as SOLID_STAR, faPlus, faBookmark, faShield, faShieldAlt, faCaretRight, faCaretLeft, faCaretDown, faCaretUp, faDiceSix, faDiceD20, faTrash, faTrashAlt, faArrowUp, faArrowDown, faArrowLeft, faArrowRight, faArrows, faPaperclip, 
  faLayerGroup, faTimes, faUnlink, faLink, faPencilAlt, faCheck, faPencil, faSortAmountUp, faSort, faSortAmountDown, faHome, faCog, faSlidersH, faSearch, faSignOut, faSignOutAlt, faSave, faLock, faUnlock, faRuler, faBroadcastTower, faEar, 
  faLightbulb, faMap, faSun, faCloudSun, faCloudMoon, faEye, faEyeSlash, faMoon, faMapMarkerAlt, faRectanglePortrait, faRectangleWide, faDoorOpen, faCampfire, faSignature, faVectorSquare, faDrawCircle, faDrawPolygon, faDrawSquare, faImage,
   faUserShield, faHelmetBattle, faDragon, faThumbtack, faGlobe, faSwords, faDice, faSquare, faToggleOff, faToggleOn, faPencilRuler, faBars, faLightbulbOn, faLightbulbSlash, faFastForward, faStepForward, faHeart, faQuestionCircle, faThLarge,
    faFilter, faFileImport, faHistory, faTh, faEdit, faLocation, faRandom, faCloudUpload, faAddressCard, faSkullCrossbones, faSyncAlt, faHandPointer, faUsers, faUserSecret, faUsersCrown, faDoorClosed, faCloudDownload, faEllipsisV, faCheckDouble, 
  faMousePointer, faUserCrown, faUser, faFolderPlus, faMapMarkerPlus, faTombstone, faTreasureChest, faArrowAltRight, faPaste, faDungeon } from '@fortawesome/pro-solid-svg-icons';
import { faStar, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faGoogle, faGithub, fab } from '@fortawesome/free-brands-svg-icons';
import { faQuestionSquare} from '@fortawesome/pro-light-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';


export class Icons {
  constructor(private library: FaIconLibrary) {
    this.addIcons(library)
  }

  addIcons(l : FaIconLibrary) {

    this.solidPro(l)
    this.regularPro(l)
    this.brandsFree(l)
  }

  solidPro(l : FaIconLibrary) {
    l.addIcons(
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
      faArrowAltRight,
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
      faDoorClosed,
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
      SOLID_STAR,
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
      faCloudDownload,
      faAddressCard,
      faSkullCrossbones, 
      faSyncAlt,
      faHandPointer, 
      faUsers,
      faUserSecret,
      faUsersCrown,
      faEllipsisV,
      faCheckDouble,
      faMousePointer,
      faUserCrown,
      faUser,
      faFolderPlus,
      faMapMarkerPlus,
      faTombstone,
      faTreasureChest, 
      faPaste,
      faDungeon
    )
  }


  lightPro(l: FaIconLibrary) {
    l.addIcons(faQuestionSquare)
  }

  regularPro(l: FaIconLibrary) {
    l.addIcons(faStar, faCircle)

  }

  brandsFree(l: FaIconLibrary) {
    l.addIcons(faGoogle, faGithub)

  }

}