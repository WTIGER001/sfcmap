(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mapcontainer {\r\n    width: 100%;\r\n    height: 100%;\r\n    margin: 0;\r\n    padding: 0;\r\n    z-index: 1;\r\n    background: #ffffff;\r\n}\r\n\r\n:host {\r\n    position: absolute;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    top: 0;\r\n  }"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--The content below is only a placeholder and can be replaced.-->\r\n<!-- <div *ngIf=\"user; else showLogin\">\r\n    <h1>Hello {{ user.name }}! {{ user.photo }}</h1>\r\n    <img [src]=\"user.photo\">\r\n    <button (click)=\"logout()\">Logout</button>\r\n</div>\r\n<ng-template #showLogin>\r\n    <p>Please login.</p>\r\n    <button (click)=\"login()\">Login with Google</button>\r\n</ng-template> -->\r\n\r\n<!-- <div *ngIf=\"afAuth.user | async as user; else showLogin\">\r\n    <h1>Hello {{ user.displayName }}!</h1>\r\n    <img [src]=\"user.photo\">\r\n    <button (click)=\"logout()\">Logout</button>\r\n</div>\r\n<ng-template #showLogin>\r\n    <p>Please login.</p>\r\n    <button (click)=\"login()\">Login with Google</button>\r\n</ng-template> -->\r\n\r\n<!-- <div class=\"mapcontainer\" leaflet [leafletOptions]=\"options\" [leafletLayers]=\"layers\" (leafletMapReady)=\"onMapReady($event)\"></div> -->\r\n\r\n<app-map></app-map>\r\n<app-tabs></app-tabs>"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var _asymmetrik_ngx_leaflet__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @asymmetrik/ngx-leaflet */ "./node_modules/@asymmetrik/ngx-leaflet/dist/index.js");
/* harmony import */ var angularfire2__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! angularfire2 */ "./node_modules/angularfire2/index.js");
/* harmony import */ var angularfire2_firestore__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! angularfire2/firestore */ "./node_modules/angularfire2/firestore/index.js");
/* harmony import */ var angularfire2_database__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! angularfire2/database */ "./node_modules/angularfire2/database/index.js");
/* harmony import */ var angularfire2_auth__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! angularfire2/auth */ "./node_modules/angularfire2/auth/index.js");
/* harmony import */ var angularfire2_storage__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! angularfire2/storage */ "./node_modules/angularfire2/storage/index.js");
/* harmony import */ var angular_tree_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! angular-tree-component */ "./node_modules/angular-tree-component/dist/angular-tree-component.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/fesm5/angular-fontawesome.js");
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ "./node_modules/@fortawesome/fontawesome-svg-core/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.es.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _map_map_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./map/map.component */ "./src/app/map/map.component.ts");
/* harmony import */ var _tabs_map_selector_map_selector_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./tabs/map-selector/map-selector.component */ "./src/app/tabs/map-selector/map-selector.component.ts");
/* harmony import */ var _tabs_admin_admin_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./tabs/admin/admin.component */ "./src/app/tabs/admin/admin.component.ts");
/* harmony import */ var _tabs_user_side_user_side_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./tabs/user-side/user-side.component */ "./src/app/tabs/user-side/user-side.component.ts");
/* harmony import */ var _tabs_marker_side_marker_side_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./tabs/marker-side/marker-side.component */ "./src/app/tabs/marker-side/marker-side.component.ts");
/* harmony import */ var _tabs_tabs_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./tabs/tabs.component */ "./src/app/tabs/tabs.component.ts");
/* harmony import */ var _map_service__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./map.service */ "./src/app/map.service.ts");
/* harmony import */ var _dialogs_common_dialog_service__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./dialogs/common-dialog.service */ "./src/app/dialogs/common-dialog.service.ts");
/* harmony import */ var _dialogs_input_dialog_input_dialog_component__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./dialogs/input-dialog/input-dialog.component */ "./src/app/dialogs/input-dialog/input-dialog.component.ts");
/* harmony import */ var _dialogs_message_dialog_message_dialog_component__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./dialogs/message-dialog/message-dialog.component */ "./src/app/dialogs/message-dialog/message-dialog.component.ts");
/* harmony import */ var _dialogs_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./dialogs/confirm-dialog/confirm-dialog.component */ "./src/app/dialogs/confirm-dialog/confirm-dialog.component.ts");
/* harmony import */ var _dialogs_marker_dialog_marker_dialog_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./dialogs/marker-dialog/marker-dialog.component */ "./src/app/dialogs/marker-dialog/marker-dialog.component.ts");
/* harmony import */ var _notify_service__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./notify.service */ "./src/app/notify.service.ts");
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./data.service */ "./src/app/data.service.ts");
/* harmony import */ var _mgr_group_mgr_group_component__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./mgr-group/mgr-group.component */ "./src/app/mgr-group/mgr-group.component.ts");
/* harmony import */ var _mgr_marker_mgr_marker_component__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./mgr-marker/mgr-marker.component */ "./src/app/mgr-marker/mgr-marker.component.ts");
/* harmony import */ var _mgr_map_mgr_map_component__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./mgr-map/mgr-map.component */ "./src/app/mgr-map/mgr-map.component.ts");
/* harmony import */ var _dialogs_dialog_service__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./dialogs/dialog.service */ "./src/app/dialogs/dialog.service.ts");
/* harmony import */ var angular_checklist__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! angular-checklist */ "./node_modules/angular-checklist/dist/index.js");
/* harmony import */ var angular_checklist__WEBPACK_IMPORTED_MODULE_36___default = /*#__PURE__*/__webpack_require__.n(angular_checklist__WEBPACK_IMPORTED_MODULE_36__);
/* harmony import */ var _dialogs_access_dialog_access_dialog_component__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./dialogs/access-dialog/access-dialog.component */ "./src/app/dialogs/access-dialog/access-dialog.component.ts");
/* harmony import */ var _dialogs_restrict_service__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./dialogs/restrict.service */ "./src/app/dialogs/restrict.service.ts");
/* harmony import */ var _controls_marker_combo_marker_combo_component__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ./controls/marker-combo/marker-combo.component */ "./src/app/controls/marker-combo/marker-combo.component.ts");
/* harmony import */ var _tabs_layers_tab_layers_tab_component__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./tabs/layers-tab/layers-tab.component */ "./src/app/tabs/layers-tab/layers-tab.component.ts");
/* harmony import */ var _controls_marker_group_combo_marker_group_combo_component__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ./controls/marker-group-combo/marker-group-combo.component */ "./src/app/controls/marker-group-combo/marker-group-combo.component.ts");
/* harmony import */ var _controls_unchecklist_directive__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ./controls/unchecklist.directive */ "./src/app/controls/unchecklist.directive.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











































var AppModule = /** @class */ (function () {
    function AppModule() {
        _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_14__["library"].add(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_15__["fas"]);
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_16__["AppComponent"],
                _map_map_component__WEBPACK_IMPORTED_MODULE_18__["MapComponent"],
                _tabs_map_selector_map_selector_component__WEBPACK_IMPORTED_MODULE_19__["MapSelectorComponent"],
                _tabs_admin_admin_component__WEBPACK_IMPORTED_MODULE_20__["AdminComponent"],
                _tabs_user_side_user_side_component__WEBPACK_IMPORTED_MODULE_21__["UserSideComponent"],
                _tabs_marker_side_marker_side_component__WEBPACK_IMPORTED_MODULE_22__["MarkerSideComponent"],
                _tabs_tabs_component__WEBPACK_IMPORTED_MODULE_23__["TabsComponent"],
                _dialogs_input_dialog_input_dialog_component__WEBPACK_IMPORTED_MODULE_26__["InputDialogComponent"],
                _dialogs_message_dialog_message_dialog_component__WEBPACK_IMPORTED_MODULE_27__["MessageDialogComponent"],
                _dialogs_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_28__["ConfirmDialogComponent"],
                _dialogs_marker_dialog_marker_dialog_component__WEBPACK_IMPORTED_MODULE_29__["MarkerDialogComponent"],
                _mgr_group_mgr_group_component__WEBPACK_IMPORTED_MODULE_32__["MgrGroupComponent"],
                _mgr_marker_mgr_marker_component__WEBPACK_IMPORTED_MODULE_33__["MgrMarkerComponent"],
                _mgr_map_mgr_map_component__WEBPACK_IMPORTED_MODULE_34__["MgrMapComponent"],
                _dialogs_access_dialog_access_dialog_component__WEBPACK_IMPORTED_MODULE_37__["AccessDialogComponent"],
                _controls_marker_combo_marker_combo_component__WEBPACK_IMPORTED_MODULE_39__["MarkerComboComponent"],
                _tabs_layers_tab_layers_tab_component__WEBPACK_IMPORTED_MODULE_40__["LayersTabComponent"],
                _controls_marker_group_combo_marker_group_combo_component__WEBPACK_IMPORTED_MODULE_41__["MarkerGroupComboComponent"],
                _controls_unchecklist_directive__WEBPACK_IMPORTED_MODULE_42__["UnchecklistDirective"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_1__["BrowserAnimationsModule"],
                _angular_http__WEBPACK_IMPORTED_MODULE_2__["HttpModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                angularfire2__WEBPACK_IMPORTED_MODULE_7__["AngularFireModule"].initializeApp(_environments_environment__WEBPACK_IMPORTED_MODULE_17__["environment"].firebase),
                angularfire2_database__WEBPACK_IMPORTED_MODULE_9__["AngularFireDatabaseModule"],
                angularfire2_auth__WEBPACK_IMPORTED_MODULE_10__["AngularFireAuthModule"],
                angularfire2_firestore__WEBPACK_IMPORTED_MODULE_8__["AngularFirestoreModule"],
                angularfire2_storage__WEBPACK_IMPORTED_MODULE_11__["AngularFireStorageModule"],
                _asymmetrik_ngx_leaflet__WEBPACK_IMPORTED_MODULE_6__["LeafletModule"].forRoot(),
                _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_13__["FontAwesomeModule"],
                _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_5__["NgbModule"].forRoot(),
                angular_tree_component__WEBPACK_IMPORTED_MODULE_12__["TreeModule"],
                angular_checklist__WEBPACK_IMPORTED_MODULE_36__["ChecklistModule"]
            ],
            providers: [
                _map_service__WEBPACK_IMPORTED_MODULE_24__["MapService"],
                _dialogs_common_dialog_service__WEBPACK_IMPORTED_MODULE_25__["CommonDialogService"],
                _notify_service__WEBPACK_IMPORTED_MODULE_30__["NotifyService"],
                _data_service__WEBPACK_IMPORTED_MODULE_31__["DataService"],
                _dialogs_dialog_service__WEBPACK_IMPORTED_MODULE_35__["DialogService"],
                _dialogs_restrict_service__WEBPACK_IMPORTED_MODULE_38__["RestrictService"]
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_16__["AppComponent"]],
            entryComponents: [
                _dialogs_input_dialog_input_dialog_component__WEBPACK_IMPORTED_MODULE_26__["InputDialogComponent"],
                _dialogs_message_dialog_message_dialog_component__WEBPACK_IMPORTED_MODULE_27__["MessageDialogComponent"],
                _dialogs_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_28__["ConfirmDialogComponent"],
                _mgr_group_mgr_group_component__WEBPACK_IMPORTED_MODULE_32__["MgrGroupComponent"],
                _mgr_map_mgr_map_component__WEBPACK_IMPORTED_MODULE_34__["MgrMapComponent"],
                _mgr_marker_mgr_marker_component__WEBPACK_IMPORTED_MODULE_33__["MgrMarkerComponent"],
                _dialogs_access_dialog_access_dialog_component__WEBPACK_IMPORTED_MODULE_37__["AccessDialogComponent"]
            ]
        }),
        __metadata("design:paramtypes", [])
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/controls/marker-combo/marker-combo.component.css":
/*!******************************************************************!*\
  !*** ./src/app/controls/marker-combo/marker-combo.component.css ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\nlabel.small {\r\n    font-size: .8em;\r\n    margin-bottom: 4px;\r\n}\r\n\r\n.icon-flow {\r\n    padding: .2em;\r\n    width: 30px;\r\n    display: flex;\r\n}\r\n\r\n.icon-holder {\r\n    display: flex;\r\n    flex-direction: row;\r\n    flex-wrap: wrap;\r\n}\r\n\r\n.dh {\r\n    white-space: normal;\r\n    padding-left: 5px;\r\n}\r\n\r\n.toggle2 {\r\n    border-top-left-radius: 0px;\r\n    border-bottom-left-radius: 0px;\r\n}\r\n\r\n.main {\r\n    display: flex;\r\n    align-items: center;\r\n}"

/***/ }),

/***/ "./src/app/controls/marker-combo/marker-combo.component.html":
/*!*******************************************************************!*\
  !*** ./src/app/controls/marker-combo/marker-combo.component.html ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"input-group\">\n\n  <div class=\"form-control form-control-sm main py-0\" id=\"name\" placeholder=\"Enter Marker Type\">\n      <img *ngIf=\"selected\" [src]=\"selected.url\" height=\"32\" class=\"mr-1\"> {{name()}}\n  </div>\n\n  <div class=\"input-group-append\">\n    <div ngbDropdown placement=\"bottom-right\">\n      <button class=\"btn btn-outline-secondary toggle2\" id=\"dropdownBasic1\" ngbDropdownToggle> </button>\n      <div ngbDropdownMenu class=\"icon-dropdown\" aria-labelledby=\"dropdownBasic1\">\n        <ng-container *ngFor=\"let cat of categories\">\n          <h6 class=\"dropdown-header dh\">{{cat.name}}</h6>\n          <div class=\"icon-holder\">\n            <button *ngFor=\"let t of cat.types\" class=\"dropdown-item btn-sm icon-flow\" placement=\"bottom\" [ngbTooltip]=\"t.name\" (click)=\"select(t)\">\n              <img [src]=\"t.url\" height=30>\n            </button>\n          </div>\n        </ng-container>\n      </div>\n    </div>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/controls/marker-combo/marker-combo.component.ts":
/*!*****************************************************************!*\
  !*** ./src/app/controls/marker-combo/marker-combo.component.ts ***!
  \*****************************************************************/
/*! exports provided: MarkerComboComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MarkerComboComponent", function() { return MarkerComboComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models */ "./src/app/models.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _map_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../map.service */ "./src/app/map.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MarkerComboComponent = /** @class */ (function () {
    function MarkerComboComponent(mapSvc) {
        this.mapSvc = mapSvc;
        this.changed = [];
        this.touched = [];
        this.all = [];
        this.categories = [];
    }
    MarkerComboComponent_1 = MarkerComboComponent;
    Object.defineProperty(MarkerComboComponent.prototype, "map", {
        get: function () {
            return this._map;
        },
        set: function (m) {
            this._map = m;
            this.refresh();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerComboComponent.prototype, "mapType", {
        get: function () {
            return this._mapType;
        },
        set: function (m) {
            this._mapType = m;
            this.refresh();
        },
        enumerable: true,
        configurable: true
    });
    MarkerComboComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.mapSvc.catsLoaded.subscribe(function (v) {
            _this.all = _this.mapSvc.categories;
            _this.refresh();
        });
    };
    MarkerComboComponent.prototype.refresh = function () {
        var mapTypeId = '';
        if (this.map) {
            mapTypeId = this.map.mapType;
        }
        else if (this.mapType) {
            mapTypeId = this.mapType.id;
        }
        if (this.innerValue) {
            this.selected = this.mapSvc.getMarkerType(this.innerValue);
        }
        this.categories = this.all.filter(function (c) {
            if (c.appliesTo && c.appliesTo.length > 0) {
                return c.appliesTo.includes(mapTypeId);
            }
            else {
                return true;
            }
        });
    };
    MarkerComboComponent.prototype.name = function () {
        if (this.value) {
            var mk = this.mapSvc.getMarkerType(this.value);
            if (mk) {
                return mk.name;
            }
            return 'Ugh....';
        }
        else {
            return '';
        }
    };
    MarkerComboComponent.prototype.select = function (type) {
        this.value = type.id;
        this.selected = type;
    };
    Object.defineProperty(MarkerComboComponent.prototype, "value", {
        get: function () {
            return this.innerValue;
        },
        set: function (value) {
            if (this.innerValue !== value) {
                this.innerValue = value;
                this.refresh();
                this.changed.forEach(function (f) { return f(value); });
            }
        },
        enumerable: true,
        configurable: true
    });
    MarkerComboComponent.prototype.registerOnChange = function (fn) {
        this.changed.push(fn);
    };
    MarkerComboComponent.prototype.registerOnTouched = function (fn) {
        this.touched.push(fn);
    };
    MarkerComboComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    MarkerComboComponent.prototype.writeValue = function (obj) {
        this.innerValue = obj;
        this.refresh();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _models__WEBPACK_IMPORTED_MODULE_1__["MapConfig"]),
        __metadata("design:paramtypes", [_models__WEBPACK_IMPORTED_MODULE_1__["MapConfig"]])
    ], MarkerComboComponent.prototype, "map", null);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _models__WEBPACK_IMPORTED_MODULE_1__["MapType"]),
        __metadata("design:paramtypes", [_models__WEBPACK_IMPORTED_MODULE_1__["MapType"]])
    ], MarkerComboComponent.prototype, "mapType", null);
    MarkerComboComponent = MarkerComboComponent_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-marker-combo',
            template: __webpack_require__(/*! ./marker-combo.component.html */ "./src/app/controls/marker-combo/marker-combo.component.html"),
            styles: [__webpack_require__(/*! ./marker-combo.component.css */ "./src/app/controls/marker-combo/marker-combo.component.css")],
            providers: [
                { provide: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALUE_ACCESSOR"], useExisting: MarkerComboComponent_1, multi: true }
            ]
        }),
        __metadata("design:paramtypes", [_map_service__WEBPACK_IMPORTED_MODULE_3__["MapService"]])
    ], MarkerComboComponent);
    return MarkerComboComponent;
    var MarkerComboComponent_1;
}());



/***/ }),

/***/ "./src/app/controls/marker-group-combo/marker-group-combo.component.css":
/*!******************************************************************************!*\
  !*** ./src/app/controls/marker-group-combo/marker-group-combo.component.css ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".toggle2 {\r\n    border-top-left-radius: 0px;\r\n    border-bottom-left-radius: 0px;\r\n}"

/***/ }),

/***/ "./src/app/controls/marker-group-combo/marker-group-combo.component.html":
/*!*******************************************************************************!*\
  !*** ./src/app/controls/marker-group-combo/marker-group-combo.component.html ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"input-group\">\r\n  <input type=\"text\" name=\"markergroup\" class=\"form-control form-control-sm main py-0\" id=\"mg\" placeholder=\"Enter Group Name\"\r\n    [value]=\"name()\" (change)=\"onTextChange($event)\">\r\n  <div class=\"input-group-append\">\r\n    <div ngbDropdown placement=\"bottom-right\">\r\n      <button class=\"btn btn-outline-secondary toggle2\" id=\"dropdownBasic1\" ngbDropdownToggle> </button>\r\n      <div ngbDropdownMenu class=\"icon-dropdown\" aria-labelledby=\"dropdownBasic1\">\r\n        <button *ngFor=\"let t of all\" class=\"dropdown-item btn-sm\" placement=\"bottom\" (click)=\"select(t)\">{{t.name}}</button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>"

/***/ }),

/***/ "./src/app/controls/marker-group-combo/marker-group-combo.component.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/controls/marker-group-combo/marker-group-combo.component.ts ***!
  \*****************************************************************************/
/*! exports provided: MarkerGroupComboComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MarkerGroupComboComponent", function() { return MarkerGroupComboComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../data.service */ "./src/app/data.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _map_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../map.service */ "./src/app/map.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MarkerGroupComboComponent = /** @class */ (function () {
    function MarkerGroupComboComponent(data) {
        this.data = data;
        this.changed = [];
        this.touched = [];
        this.all = [];
        this.options = [];
    }
    MarkerGroupComboComponent_1 = MarkerGroupComboComponent;
    Object.defineProperty(MarkerGroupComboComponent.prototype, "marker", {
        get: function () {
            return this.mk;
        },
        set: function (m) {
            this.mk = m;
            this.innerValue = m.markerGroup;
            this.refresh();
        },
        enumerable: true,
        configurable: true
    });
    MarkerGroupComboComponent.prototype.onTextChange = function ($event) {
        console.log('---------TEXT------');
        console.log($event);
        this.value = event.target['value'];
        console.log(this.innerValue);
        console.log('---------------');
        // this.innerValue.markerGroup = event
    };
    MarkerGroupComboComponent.prototype.refresh = function () {
        var _this = this;
        this.data.getMarkerGroups(this.marker.map)
            .subscribe(function (v) {
            _this.all = v;
            if (_this.innerValue) {
                _this.selected = _this.all.find(function (mg) { return mg.id == _this.innerValue; });
            }
        });
    };
    MarkerGroupComboComponent.prototype.name = function () {
        var _this = this;
        if (this.selected) {
            return this.selected.name;
        }
        else if (this.innerValue) {
            var item = this.all.find(function (mg) { return mg.id == _this.innerValue; });
            if (item) {
                return item.name;
            }
            return this.innerValue;
        }
        return '';
    };
    MarkerGroupComboComponent.prototype.select = function (type) {
        this.value = type.id;
        this.selected = type;
    };
    Object.defineProperty(MarkerGroupComboComponent.prototype, "value", {
        get: function () {
            return this.innerValue;
        },
        set: function (value) {
            console.log("Setting to : " + value);
            if (this.innerValue !== value) {
                this.innerValue = value;
                this.refresh();
                this.changed.forEach(function (f) { return f(value); });
            }
        },
        enumerable: true,
        configurable: true
    });
    MarkerGroupComboComponent.prototype.registerOnChange = function (fn) {
        this.changed.push(fn);
    };
    MarkerGroupComboComponent.prototype.registerOnTouched = function (fn) {
        this.touched.push(fn);
    };
    MarkerGroupComboComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    MarkerGroupComboComponent.prototype.writeValue = function (obj) {
        console.log('---------------');
        console.log(obj);
        console.log('---------------');
        this.innerValue = obj;
        this.refresh();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _map_service__WEBPACK_IMPORTED_MODULE_3__["MyMarker"]),
        __metadata("design:paramtypes", [_map_service__WEBPACK_IMPORTED_MODULE_3__["MyMarker"]])
    ], MarkerGroupComboComponent.prototype, "marker", null);
    MarkerGroupComboComponent = MarkerGroupComboComponent_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-marker-group-combo',
            template: __webpack_require__(/*! ./marker-group-combo.component.html */ "./src/app/controls/marker-group-combo/marker-group-combo.component.html"),
            styles: [__webpack_require__(/*! ./marker-group-combo.component.css */ "./src/app/controls/marker-group-combo/marker-group-combo.component.css")],
            providers: [
                { provide: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALUE_ACCESSOR"], useExisting: MarkerGroupComboComponent_1, multi: true }
            ]
        }),
        __metadata("design:paramtypes", [_data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"]])
    ], MarkerGroupComboComponent);
    return MarkerGroupComboComponent;
    var MarkerGroupComboComponent_1;
}());



/***/ }),

/***/ "./src/app/controls/unchecklist.directive.ts":
/*!***************************************************!*\
  !*** ./src/app/controls/unchecklist.directive.ts ***!
  \***************************************************/
/*! exports provided: UnchecklistDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UnchecklistDirective", function() { return UnchecklistDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var UnchecklistDirective = /** @class */ (function () {
    function UnchecklistDirective() {
        this.maxSelectedItems = -1;
        this.unchecklistChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    ////////////
    UnchecklistDirective.prototype.ngOnChanges = function () {
        var checklist = this.unchecklist || [];
        this.isChecked = !checklist.includes(this.unchecklistValue);
    };
    UnchecklistDirective.prototype.triggerOnChange = function ($event) {
        var target = $event.target;
        var updatedList;
        var checklist = this.unchecklist || [];
        if (target && target.checked) {
            if (this.maxSelectedItems === -1 || checklist.length < this.maxSelectedItems) {
                // updatedList = [...checklist, this.checklistValue];
                var i = checklist.indexOf(this.unchecklistValue);
                updatedList = checklist.slice(0, i).concat(checklist.slice(i + 1));
                this.unchecklistChange.emit(updatedList);
            }
            else {
                target.checked = false;
            }
        }
        else {
            // const i = checklist.indexOf(this.checklistValue);
            // updatedList = [...checklist.slice(0, i), ...checklist.slice(i + 1)];
            updatedList = checklist.concat([this.unchecklistValue]);
            this.unchecklistChange.emit(updatedList);
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], UnchecklistDirective.prototype, "unchecklist", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], UnchecklistDirective.prototype, "unchecklistValue", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], UnchecklistDirective.prototype, "maxSelectedItems", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], UnchecklistDirective.prototype, "unchecklistChange", void 0);
    UnchecklistDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            host: {
                '(change)': 'triggerOnChange($event)',
                '[checked]': 'isChecked',
            },
            selector: '[unchecklist]',
        })
    ], UnchecklistDirective);
    return UnchecklistDirective;
}());



/***/ }),

/***/ "./src/app/data.service.ts":
/*!*********************************!*\
  !*** ./src/app/data.service.ts ***!
  \*********************************/
/*! exports provided: DataService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataService", function() { return DataService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models */ "./src/app/models.ts");
/* harmony import */ var angularfire2_database__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! angularfire2/database */ "./node_modules/angularfire2/database/index.js");
/* harmony import */ var _notify_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./notify.service */ "./src/app/notify.service.ts");
/* harmony import */ var angularfire2_storage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! angularfire2/storage */ "./node_modules/angularfire2/storage/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var angularfire2_auth__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! angularfire2/auth */ "./node_modules/angularfire2/auth/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var DataService = /** @class */ (function () {
    function DataService(afAuth, db, notify, storage) {
        var _this = this;
        this.afAuth = afAuth;
        this.db = db;
        this.notify = notify;
        this.storage = storage;
        this.ready = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        // The currently logged in user
        this.user = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](new _models__WEBPACK_IMPORTED_MODULE_2__["User"]());
        this.userPrefs = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](new _models__WEBPACK_IMPORTED_MODULE_2__["UserPreferences"]());
        this.mapTypes = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        this.maps = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        this.users = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        this.groups = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        this.markerCategories = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        this.markerTypes = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        this.mapsWithUrls = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        this.mapTypesWithMaps = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        afAuth.authState
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (fireUser) { return _models__WEBPACK_IMPORTED_MODULE_2__["User"].fromFireUser(fireUser); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["mergeMap"])(function (u) { return _this.getUserInfo(u); }))
            .subscribe(function (u) {
            console.log("User Logged in " + u.uid);
            console.log(u);
            _this.user.next(u);
        });
        this.user.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["mergeMap"])(function (u) { return _this.getUserPrefs(u); })).subscribe(function (prefs) { return _this.userPrefs.next(prefs); });
        this.loadAndNotify(this.toMapType, this.mapTypes, 'mapTypes', 'Loading Map Types');
        this.loadAndNotify(this.toMap, this.maps, 'maps', 'Loading Maps');
        this.loadAndNotify(this.toUser, this.users, 'users', 'Loading Users');
        this.loadAndNotify(this.toGroup, this.groups, 'groups', 'Loading User Groups');
        this.loadAndNotify(this.toMarkerCategory, this.markerCategories, 'markerCategories', 'Loading Marker Categories');
        this.loadAndNotify(this.toMarkerType, this.markerTypes, 'markerTypes', 'Loading Marker Types');
        // Load the URLS
        this.maps.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["concatMap"])(function (i) { return i; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["mergeMap"])(function (m) { return _this.fillInMapUrl(m); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["mergeMap"])(function (m) { return _this.fillInMapThumb(m); })).subscribe(function (a) {
        });
        Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["combineLatest"])(this.mapTypes, this.maps)
            .subscribe(function (_a) {
            var mts = _a[0], mps = _a[1];
            var mergedArr = new Array();
            mts.forEach(function (mt) {
                var merged = new _models__WEBPACK_IMPORTED_MODULE_2__["MergedMapType"]();
                merged.name = mt.name;
                merged.order = mt.order;
                merged.id = mt.id;
                merged.defaultMarker = mt.defaultMarker;
                merged.maps = mps.filter(function (m) { return m.mapType == merged.id && _this.canView(m); });
                mergedArr.push(merged);
            });
            var items = mergedArr.sort(function (a, b) { return a.order - b.order; });
            _this.mapTypesWithMaps.next(items);
        });
        Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["combineLatest"])(this.user, this.maps, this.mapTypes, this.markerTypes, this.markerCategories)
            .subscribe(function () {
            _this.ready.next(true);
        });
    }
    DataService.prototype.getMarkers = function (mapid) {
        return this.db.list('markers/' + mapid)
            .snapshotChanges()
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (items) {
            var markers = new Array();
            items.forEach(function (m) {
                markers.push(m.payload.val());
            });
            return markers;
        }));
    };
    DataService.prototype.getMarkerGroups = function (mapid) {
        var _this = this;
        return this.db.list('markerGroups/' + mapid)
            .snapshotChanges()
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (items) {
            var markers = new Array();
            items.forEach(function (m) {
                markers.push(_this.toMarkerGroup(m.payload.val()));
            });
            return markers;
        }));
    };
    DataService.prototype.toObject = function (item) {
        if (_models__WEBPACK_IMPORTED_MODULE_2__["MarkerGroup"].is(item)) {
            return item;
        }
        if (_models__WEBPACK_IMPORTED_MODULE_2__["UserGroup"].is(item)) {
            return item;
        }
        if (_models__WEBPACK_IMPORTED_MODULE_2__["UserPreferences"].is(item)) {
            return item;
        }
    };
    DataService.prototype.dbPath = function (item) {
        if (_models__WEBPACK_IMPORTED_MODULE_2__["MarkerGroup"].is(item)) {
            return _models__WEBPACK_IMPORTED_MODULE_2__["MarkerGroup"].dbPath(item);
        }
        if (_models__WEBPACK_IMPORTED_MODULE_2__["UserGroup"].is(item)) {
            return 'groups/' + item.name;
        }
        if (_models__WEBPACK_IMPORTED_MODULE_2__["UserPreferences"].is(item)) {
            return _models__WEBPACK_IMPORTED_MODULE_2__["UserPreferences"].dbPath(item);
        }
    };
    DataService.prototype.sample = function (item) {
        if (_models__WEBPACK_IMPORTED_MODULE_2__["MarkerGroup"].is(item)) {
            return _models__WEBPACK_IMPORTED_MODULE_2__["MarkerGroup"].SAMPLE;
        }
        if (_models__WEBPACK_IMPORTED_MODULE_2__["UserGroup"].is(item)) {
            return _models__WEBPACK_IMPORTED_MODULE_2__["UserGroup"].SAMPLE;
        }
        if (_models__WEBPACK_IMPORTED_MODULE_2__["UserPreferences"].is(item)) {
            return _models__WEBPACK_IMPORTED_MODULE_2__["UserPreferences"].SAMPLE;
        }
    };
    DataService.prototype.save = function (item) {
        var _this = this;
        // Copy the Item so we only save a normal javascript object, and remove all the bad
        var toSave = this.clean(Object.assign({}, item));
        // Remove the fields that are not part of the object that should be saved in the database
        this.trimExtraneousFields(toSave, this.sample(item));
        // Get path to the object
        var path = this.dbPath(item);
        console.log(toSave);
        this.db.object(path).set(toSave).then(function () {
            _this.notify.success("Saved " + path);
        }).catch(function (reason) {
            _this.notify.showError(reason, "Error Saving " + path);
        });
    };
    DataService.prototype.delete = function (item) {
        var _this = this;
        var path = this.dbPath(item);
        this.db.object(path).remove().then(function () {
            _this.notify.success("Removed ");
        }).catch(function (reason) {
            _this.notify.showError(reason, "Error Deleting Map");
        });
    };
    DataService.prototype.toMapType = function (item) {
        var me = new _models__WEBPACK_IMPORTED_MODULE_2__["MapType"]();
        Object.assign(me, item);
        return me;
    };
    DataService.prototype.toMap = function (item) {
        var me = new _models__WEBPACK_IMPORTED_MODULE_2__["MapConfig"]();
        Object.assign(me, item);
        return me;
    };
    DataService.prototype.toUser = function (item) {
        var me = new _models__WEBPACK_IMPORTED_MODULE_2__["User"]();
        Object.assign(me, item);
        return me;
    };
    DataService.prototype.toGroup = function (item) {
        // let me = new UserGroup()
        // Object.assign(me, item)
        return item;
    };
    DataService.prototype.toMarkerCategory = function (item) {
        var me = new _models__WEBPACK_IMPORTED_MODULE_2__["MarkerCategory"]();
        Object.assign(me, item);
        return me;
    };
    DataService.prototype.toMarkerType = function (item) {
        var me = new _models__WEBPACK_IMPORTED_MODULE_2__["MarkerType"]();
        Object.assign(me, item);
        return me;
    };
    DataService.prototype.toMarkerGroup = function (item) {
        var me = new _models__WEBPACK_IMPORTED_MODULE_2__["MarkerGroup"]();
        Object.assign(me, item);
        return me;
    };
    DataService.prototype.toUserPreferences = function (item) {
        var me = new _models__WEBPACK_IMPORTED_MODULE_2__["UserPreferences"]();
        Object.assign(me, item);
        return me;
    };
    DataService.prototype.loadAndNotify = function (convert, subject, name, errorType, sorter) {
        var _this = this;
        console.log("Working on " + name);
        this.db.list(name).snapshotChanges().subscribe(function (inTypes) {
            var items = new Array();
            inTypes.forEach(function (item) {
                var converted = convert(item.payload.val());
                items.push(converted);
            });
            console.log("Loaded " + items.length + " " + name);
            if (sorter) {
                sorter(items);
            }
            subject.next(items);
        }, function (error) {
            _this.notify.showError(error, errorType);
        });
    };
    DataService.prototype.url = function (item) {
        var path = 'images/' + item.id;
        var ref = this.storage.ref(path);
        return ref.getDownloadURL().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (item) {
            return item;
        }));
    };
    DataService.prototype.fillInUrl = function (item) {
        var path = 'images/' + item.id;
        var ref = this.storage.ref(path);
        return ref.getDownloadURL().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (url) {
            item.url = url;
            return item;
        }));
    };
    DataService.prototype.fillInMapUrl = function (item) {
        var path = 'images/' + item.id;
        var ref = this.storage.ref(path);
        return ref.getDownloadURL().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (url) {
            item.image = url;
            return item;
        }));
    };
    DataService.prototype.fillInMapThumb = function (item) {
        return this.thumb(item).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (url) {
            item.thumb = url;
            return item;
        }));
    };
    DataService.prototype.thumb = function (mapCfg) {
        var path = 'images/' + mapCfg.id + "_thumb";
        var ref = this.storage.ref(path);
        return ref.getDownloadURL();
    };
    DataService.prototype.saveMarker = function (item) {
        var _this = this;
        // Convert the Saved Marker into a regular object
        var toSave = this.clean(Object.assign({}, item));
        console.log(toSave);
        this.db.object('markers/' + item.map + "/" + item.id).set(toSave).then(function () {
            _this.notify.success("Saved " + item.name);
        }).catch(function (reason) {
            _this.notify.showError(reason, "Error Saving Marker");
        });
    };
    DataService.prototype.saveWithImage = function (item) {
        var _this = this;
        var f = item["__FILE"];
        this.storage.upload('images/' + item.id, f)
            .snapshotChanges()
            .subscribe(function (v) { }, function (e) { }, function () {
            _this.saveMarkerTypeNoImage(item);
        });
    };
    DataService.prototype.saveMarkerTypeNoImage = function (item) {
        var _this = this;
        console.log("saving");
        var toSave = this.clean(Object.assign({}, item));
        console.log(toSave);
        this.db.object('markerTypes/' + item.id).set(toSave).then(function () {
            _this.notify.success("Saved " + item.name);
        }).catch(function (reason) {
            _this.notify.showError(reason, "Error Saving Marker");
        });
    };
    DataService.prototype.saveMarkerType = function (item) {
        var f = item["__FILE"];
        if (f) {
            this.saveWithImage(item);
        }
        else {
            this.saveMarkerTypeNoImage(item);
        }
    };
    DataService.prototype.saveMarkerCategory = function (item) {
        var _this = this;
        var toSave = this.clean(Object.assign({}, item));
        console.log(toSave);
        this.db.object('markerCategories/' + item.id).set(toSave).then(function () {
            _this.notify.success("Saved " + item.name);
        }).catch(function (reason) {
            _this.notify.showError(reason, "Error Saving Group");
        });
    };
    DataService.prototype.saveUserGroup = function (item) {
        var _this = this;
        var toSave = this.clean(Object.assign({}, item));
        console.log(toSave);
        this.db.object('groups/' + item.name).set(toSave).then(function () {
            _this.notify.success("Saved " + item.name);
        }).catch(function (reason) {
            _this.notify.showError(reason, "Error Saving Group");
        });
    };
    DataService.prototype.saveMapType = function (item) {
        var _this = this;
        var toSave = this.clean(Object.assign({}, item));
        console.log(toSave);
        this.db.object('mapTypes/' + item.id).set(toSave).then(function () {
            _this.notify.success("Saved " + item.name);
        }).catch(function (reason) {
            _this.notify.showError(reason, "Error Saving Group");
        });
    };
    DataService.prototype.saveMap = function (map, image, thumb) {
        var _this = this;
        console.log("Saving Map a");
        if (thumb && image) {
            console.log("Saving Map b");
            var pathImage = 'images/' + map.id;
            var pathThumb = 'images/' + map.id + "_thumb";
            var obsImage = this.saveImage(image, pathImage);
            var obsThumb = this.saveImage(thumb, pathThumb);
            // Wait for the images to be uploaded
            Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["forkJoin"])(obsImage, obsThumb).subscribe(function (results) {
                _this._saveMap(map);
            }, function (err) {
                console.log("ERROR");
                console.log(err);
            }, function () {
                console.log("Complete");
            });
        }
        else {
            this._saveMap(map);
        }
    };
    DataService.prototype._saveMap = function (item) {
        var _this = this;
        var toSave = this.clean(Object.assign({}, item));
        console.log(toSave);
        this.db.object('maps/' + item.id).set(toSave).then(function () {
            _this.notify.success("Saved " + item.name);
        }).catch(function (reason) {
            _this.notify.showError(reason, "Error Saving Map");
        });
    };
    DataService.prototype.saveImage = function (data, path) {
        console.log("Saving Map Blob " + path);
        var ref = this.storage.ref(path);
        return ref.put(data)
            .snapshotChanges();
    };
    DataService.prototype.saveUser = function (item) {
        var _this = this;
        var toSave = this.clean(Object.assign({}, item));
        console.log(toSave);
        this.db.object('users/' + item.uid).set(toSave).then(function () {
            _this.notify.success("Saved " + item.name);
        }).catch(function (reason) {
            _this.notify.showError(reason, "Error Saving User");
        });
    };
    DataService.prototype.deleteMapType = function (item) {
        var _this = this;
        this.db.object('mapTypes/' + item.id).remove().then(function () {
            _this.notify.success("Removed " + item.name);
        }).catch(function (reason) {
            _this.notify.showError(reason, "Error Deleting Map");
        });
    };
    DataService.prototype.deleteMap = function (item) {
        var _this = this;
        this.db.object('maps/' + item.id).remove().then(function () {
            _this.notify.success("Removed " + item.name);
        }).catch(function (reason) {
            _this.notify.showError(reason, "Error Deleting Map");
        });
        this.storage.ref('images/' + item.id).delete();
        this.storage.ref('images/' + item.id + "_thumb").delete();
    };
    DataService.prototype.deleteMarker = function (item) {
        var _this = this;
        this.db.object('markers/' + item.map + "/" + item.id).remove().then(function () {
            _this.notify.success("Removed " + item.name);
        }).catch(function (reason) {
            _this.notify.showError(reason, "Error Saving Marker");
        });
    };
    DataService.prototype.deleteMarkerCategory = function (item) {
        var _this = this;
        var dbId = '';
        var name = 'Category';
        if (typeof (item) == 'string') {
            dbId = item;
        }
        else {
            dbId = item.id;
            name = item.name;
        }
        this.db.object('markerCategories/' + dbId).remove().then(function () {
            _this.notify.success("Removed " + name);
        }).catch(function (reason) {
            _this.notify.showError(reason, "Error Deleteing " + name);
        });
        this.storage.ref('images/' + dbId).delete();
    };
    DataService.prototype.deleteMarkerType = function (item) {
        var _this = this;
        var dbId = '';
        var name = 'Marker Type';
        if (typeof (item) == 'string') {
            dbId = item;
        }
        else {
            dbId = item.id;
            name = item.name;
        }
        this.db.object('markerTypes/' + dbId).remove().then(function () {
            _this.notify.success("Removed " + name);
        }).catch(function (reason) {
            _this.notify.showError(reason, "Error Deleteing " + name);
        });
        this.storage.ref('images/' + dbId).delete();
    };
    DataService.prototype.deleteUserGroup = function (item) {
        var _this = this;
        this.db.object('groups/' + item.name).remove().then(function () {
            _this.notify.success("Removed " + name);
        }).catch(function (reason) {
            _this.notify.showError(reason, "Error Deleteing " + name);
        });
    };
    DataService.prototype.clean = function (obj) {
        for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined) {
                delete obj[propName];
            }
        }
        return obj;
    };
    DataService.prototype.trimExtraneousFields = function (obj, sample) {
        if (sample) {
            var fields = new Map();
            for (var propName in sample) {
                fields.set(propName, true);
            }
            for (var propName in obj) {
                if (!fields.has(propName)) {
                    delete obj[propName];
                }
            }
        }
    };
    DataService.prototype.copyData = function (dest, src, sample) {
        for (var propName in sample) {
            dest[propName] = src[propName];
        }
    };
    DataService.prototype.isRestricted = function (obj) {
        if (obj.view && obj.view.length > 0) {
            return true;
        }
        if (obj.edit && obj.edit.length > 0) {
            return true;
        }
        return false;
    };
    // User Functions
    DataService.prototype.canView = function (item) {
        if (!item['view']) {
            return true;
        }
        var view = item['view'];
        if (view.length == 0) {
            return true;
        }
        if (this.isReal) {
            return view.includes(this.user.getValue().uid);
        }
        return false;
    };
    DataService.prototype.canEdit = function (item) {
        if (!item['edit']) {
            return true;
        }
        var edit = item['edit'];
        if (edit.length == 0) {
            return true;
        }
        if (this.isReal) {
            return edit.includes(this.user.getValue().uid);
        }
        return false;
    };
    DataService.prototype.isReal = function () {
        return this.user.getValue().uid != "NOBODY";
    };
    DataService.prototype.saveRecentMarker = function (markerId) {
        if (this.isReal()) {
            var u = this.userPrefs.getValue();
            if (u.recentMarkers) {
                u.recentMarkers.unshift(markerId);
                if (u.recentMarkers.length > 5) {
                    u.recentMarkers.splice(5, u.recentMarkers.length - 5);
                }
            }
            else {
                u.recentMarkers = [markerId];
            }
            this.save(u);
        }
    };
    DataService.prototype.saveRecentMap = function (mapId) {
        console.log("Saving Recent Map");
        if (this.isReal()) {
            var u = this.userPrefs.getValue();
            console.log("Found User Prefs");
            if (u.recentMaps) {
                var recent = u.recentMaps.filter(function (item) { return item != mapId; });
                recent.unshift(mapId);
                if (recent.length > 5) {
                    recent.splice(5, recent.length - 5);
                }
                u.recentMaps = recent;
            }
            else {
                u.recentMaps = [mapId];
            }
            console.log("Saving");
            this.save(u);
        }
    };
    DataService.prototype.getUserInfo = function (u) {
        var _this = this;
        console.log("Getting User Information for " + u.uid);
        return this.db.object('users/' + u.uid)
            .snapshotChanges()
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["mergeMap"])(function (result) {
            if (result.payload.exists()) {
                console.log("User Exists");
                console.log(result.payload.val());
                var newUser = result.payload.val();
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(newUser);
            }
            else {
                console.log("User DOESNT ");
                _this.saveUser(u);
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(u);
            }
        }));
    };
    DataService.prototype.getUserPrefs = function (u) {
        var _this = this;
        console.log("Getting User Preferences for " + u.uid);
        return this.db.object(_models__WEBPACK_IMPORTED_MODULE_2__["UserPreferences"].pathTo(u.uid))
            .snapshotChanges()
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["mergeMap"])(function (result) {
            if (result.payload.exists()) {
                console.log("User PRefes Exist");
                var prefs = _this.toUserPreferences(result.payload.val());
                console.log(prefs);
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(prefs);
            }
            else {
                console.log("NO User PRefes Exist");
                var newPrefs = new _models__WEBPACK_IMPORTED_MODULE_2__["UserPreferences"]();
                newPrefs.uid = u.uid;
                _this.save(newPrefs);
                console.log(newPrefs);
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(newPrefs);
            }
        }));
    };
    DataService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [angularfire2_auth__WEBPACK_IMPORTED_MODULE_7__["AngularFireAuth"], angularfire2_database__WEBPACK_IMPORTED_MODULE_3__["AngularFireDatabase"], _notify_service__WEBPACK_IMPORTED_MODULE_4__["NotifyService"], angularfire2_storage__WEBPACK_IMPORTED_MODULE_5__["AngularFireStorage"]])
    ], DataService);
    return DataService;
}());



/***/ }),

/***/ "./src/app/dialogs/access-dialog/access-dialog.component.css":
/*!*******************************************************************!*\
  !*** ./src/app/dialogs/access-dialog/access-dialog.component.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".choices {\r\n    max-height: 400px;\r\n    overflow: auto;\r\n}"

/***/ }),

/***/ "./src/app/dialogs/access-dialog/access-dialog.component.html":
/*!********************************************************************!*\
  !*** ./src/app/dialogs/access-dialog/access-dialog.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header\">\n  <h4 class=\"modal-title\">\n    <fa-icon icon=\"Lock\" size=\"lg\"></fa-icon> Restrictions</h4>\n  <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"activeModal.dismiss('Cross click')\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n</div>\n<div class=\"modal-body\">\n  <div class=\"container-fluid\">\n    <div class=\"row\">\n      <div class=\"col-6\">\n        <label for=\"checkView\">Viewing Restrictions</label>\n        <select id=\"checkView\" class=\"form-control\" [(ngModel)]=\"viewRestrict\">\n          <option value=\"false\">Everyone</option>\n          <option value=\"true\">Only Some People / Groups</option>\n        </select>\n        <hr />\n        <div *ngIf=\"viewRestrict=='true'\" class=\"choices\">\n          <h6>\n            <fa-icon icon=\"users\"></fa-icon> Groups</h6>\n          <div class=\"member-list\">\n            <div class=\"custom-control custom-checkbox\" *ngFor=\"let opt of groups\">\n              <input type=\"checkbox\" class=\"custom-control-input\" id=\"{{opt.name}}\" [(checklist)]=\"view\" [checklistValue]=\"opt.name\">\n              <label class=\"custom-control-label ml-2\" for=\"{{opt.name}}\"> {{opt.name}}</label>\n            </div>\n          </div>\n          <h6 class=\"mt-2\">\n            <fa-icon icon=\"user\"></fa-icon> Users</h6>\n          <div class=\"member-list\">\n            <div class=\"custom-control custom-checkbox\" *ngFor=\"let opt of users\">\n              <input type=\"checkbox\" class=\"custom-control-input\" id=\"{{opt.uid}}\" [(checklist)]=\"view\" [checklistValue]=\"opt.uid\">\n              <label class=\"custom-control-label  ml-2\" for=\"{{opt.uid}}\"> {{opt.name}}</label>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-6\">\n        <label for=\"checkEdit\">Editing Restrictions</label>\n        <select id=\"checkEdit\" class=\"form-control\" [(ngModel)]=\"editRestrict\">\n          <option value=\"false\">Everyone</option>\n          <option value=\"true\">Only Some People / Groups</option>\n        </select>\n        <hr />\n        <div *ngIf=\"editRestrict=='true'\"  class=\"choices\">\n          <h6>\n            <fa-icon icon=\"users\"></fa-icon> Groups</h6>\n          <div class=\"member-list\">\n            <div class=\"custom-control custom-checkbox\" *ngFor=\"let opt of groups\">\n              <input type=\"checkbox\" class=\"custom-control-input\" id=\"E{{opt.name}}\" [(checklist)]=\"edit\" [checklistValue]=\"opt.name\">\n              <label class=\"custom-control-label\" for=\"E{{opt.name}}\"> {{opt.name}}</label>\n            </div>\n          </div>\n          <h6 class=\"mt-2\">\n            <fa-icon icon=\"user\"></fa-icon> Users</h6>\n          <div class=\"member-list\">\n            <div class=\"custom-control custom-checkbox\" *ngFor=\"let opt of users\">\n              <input type=\"checkbox\" class=\"custom-control-input\" id=\"E{{opt.uid}}\" [(checklist)]=\"edit\" [checklistValue]=\"opt.uid\">\n              <label class=\"custom-control-label\" for=\"E{{opt.uid}}\"> {{opt.name}}</label>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<div class=\"modal-footer\">\n  <button type=\"button\" class=\"btn btn-success dialog\" (click)=\"ok()\">Ok</button>\n  <button type=\"button\" class=\"btn btn-outline-dark dialog\" (click)=\"activeModal.dismiss('Cancel')\">Cancel</button>\n</div>"

/***/ }),

/***/ "./src/app/dialogs/access-dialog/access-dialog.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/dialogs/access-dialog/access-dialog.component.ts ***!
  \******************************************************************/
/*! exports provided: AccessDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccessDialogComponent", function() { return AccessDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../data.service */ "./src/app/data.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AccessDialogComponent = /** @class */ (function () {
    function AccessDialogComponent(data, activeModal) {
        var _this = this;
        this.data = data;
        this.activeModal = activeModal;
        this.edit = [];
        this.view = [];
        this.users = [];
        this.groups = [];
        this.result = new rxjs__WEBPACK_IMPORTED_MODULE_2__["ReplaySubject"]();
        this.data.users.subscribe(function (u) { return _this.users = u; });
        this.data.groups.subscribe(function (g) { return _this.groups = g; });
    }
    AccessDialogComponent.prototype.ngOnInit = function () {
        if (this.inEdit) {
            this.edit = this.inEdit.slice(0);
        }
        if (this.inView) {
            this.view = this.inView.slice(0);
        }
        this.update();
    };
    AccessDialogComponent.prototype.update = function () {
        if (this.view && this.view.length > 0) {
            this.viewRestrict = 'true';
        }
        else {
            this.viewRestrict = 'false';
        }
        if (this.edit && this.edit.length > 0) {
            this.editRestrict = 'true';
        }
        else {
            this.editRestrict = 'false';
        }
    };
    AccessDialogComponent.prototype.ok = function () {
        var myView = [];
        if (this.viewRestrict == 'true') {
            myView = this.view;
        }
        var myEdit = [];
        if (this.editRestrict == 'true') {
            myEdit = this.edit;
        }
        this.result.next([myView, myEdit]);
        this.activeModal.close();
    };
    AccessDialogComponent.prototype.cancel = function () {
        this.activeModal.close();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], AccessDialogComponent.prototype, "inEdit", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], AccessDialogComponent.prototype, "inView", void 0);
    AccessDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-access-dialog',
            template: __webpack_require__(/*! ./access-dialog.component.html */ "./src/app/dialogs/access-dialog/access-dialog.component.html"),
            styles: [__webpack_require__(/*! ./access-dialog.component.css */ "./src/app/dialogs/access-dialog/access-dialog.component.css")]
        }),
        __metadata("design:paramtypes", [_data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"], _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_3__["NgbActiveModal"]])
    ], AccessDialogComponent);
    return AccessDialogComponent;
}());



/***/ }),

/***/ "./src/app/dialogs/common-dialog.service.ts":
/*!**************************************************!*\
  !*** ./src/app/dialogs/common-dialog.service.ts ***!
  \**************************************************/
/*! exports provided: CommonDialogService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommonDialogService", function() { return CommonDialogService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var _message_dialog_message_dialog_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./message-dialog/message-dialog.component */ "./src/app/dialogs/message-dialog/message-dialog.component.ts");
/* harmony import */ var _confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./confirm-dialog/confirm-dialog.component */ "./src/app/dialogs/confirm-dialog/confirm-dialog.component.ts");
/* harmony import */ var _input_dialog_input_dialog_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./input-dialog/input-dialog.component */ "./src/app/dialogs/input-dialog/input-dialog.component.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CommonDialogService = /** @class */ (function () {
    function CommonDialogService(modalSvc) {
        this.modalSvc = modalSvc;
    }
    CommonDialogService.prototype.messageDialog = function (message, title, icon) {
        if (title === void 0) { title = "Message"; }
        if (icon === void 0) { icon = "info-circle"; }
        var modalRef = this.modalSvc.open(_message_dialog_message_dialog_component__WEBPACK_IMPORTED_MODULE_2__["MessageDialogComponent"]);
        modalRef.componentInstance.message = message;
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.icon = icon;
    };
    CommonDialogService.prototype.confirm = function (message, title, yesText, noText) {
        if (title === void 0) { title = "Confirm"; }
        if (yesText === void 0) { yesText = "Yes"; }
        if (noText === void 0) { noText = "No"; }
        var modalRef = this.modalSvc.open(_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_3__["ConfirmDialogComponent"]);
        modalRef.componentInstance.message = message;
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.yesText = yesText;
        modalRef.componentInstance.noText = noText;
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_5__["from"])(modalRef.result);
    };
    CommonDialogService.prototype.inputDialog = function (message, title, value, placeholder, helpText, icon) {
        if (value === void 0) { value = ""; }
        if (placeholder === void 0) { placeholder = ""; }
        if (helpText === void 0) { helpText = ""; }
        if (icon === void 0) { icon = "edit"; }
        var modalRef = this.modalSvc.open(_input_dialog_input_dialog_component__WEBPACK_IMPORTED_MODULE_4__["InputDialogComponent"]);
        modalRef.componentInstance.message = message;
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.icon = icon;
        modalRef.componentInstance.value = value;
        modalRef.componentInstance.placeholder = placeholder;
        modalRef.componentInstance.helpText = helpText;
        modalRef.componentInstance.icon = icon;
        return modalRef.componentInstance.result;
    };
    CommonDialogService.prototype.errorMsg = function (error, title) {
        if (title === void 0) { title = "Error"; }
        this.messageDialog(error, title, 'exclamation-triangle');
    };
    CommonDialogService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NgbModal"]])
    ], CommonDialogService);
    return CommonDialogService;
}());



/***/ }),

/***/ "./src/app/dialogs/confirm-dialog/confirm-dialog.component.css":
/*!*********************************************************************!*\
  !*** ./src/app/dialogs/confirm-dialog/confirm-dialog.component.css ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/dialogs/confirm-dialog/confirm-dialog.component.html":
/*!**********************************************************************!*\
  !*** ./src/app/dialogs/confirm-dialog/confirm-dialog.component.html ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header\">\r\n  <h4 class=\"modal-title\">\r\n    <fa-icon icon=\"question-circle\" size=\"lg\"></fa-icon> {{title}}</h4>\r\n  <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"activeModal.dismiss('Cross click')\">\r\n    <span aria-hidden=\"true\">&times;</span>\r\n  </button>\r\n</div>\r\n<div class=\"modal-body\">\r\n  {{message}}\r\n</div>\r\n<div class=\"modal-footer\">\r\n  <button type=\"button\" class=\"btn btn-success dialog\" (click)=\"anwser(true)\">{{yesText}}</button>\r\n  <button type=\"button\" class=\"btn btn-success dialog\" (click)=\"anwser(false)\">{{noText}}</button>\r\n</div>"

/***/ }),

/***/ "./src/app/dialogs/confirm-dialog/confirm-dialog.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/dialogs/confirm-dialog/confirm-dialog.component.ts ***!
  \********************************************************************/
/*! exports provided: ConfirmDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfirmDialogComponent", function() { return ConfirmDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ConfirmDialogComponent = /** @class */ (function () {
    function ConfirmDialogComponent(activeModal) {
        this.activeModal = activeModal;
        this.title = "Confirm";
        this.message = "Are you sure?";
        this.yesText = "Yes";
        this.noText = "No";
        this.result = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    ConfirmDialogComponent.prototype.ngOnInit = function () {
    };
    ConfirmDialogComponent.prototype.anwser = function (value) {
        this.result.emit(value);
        this.activeModal.close(value);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], ConfirmDialogComponent.prototype, "title", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], ConfirmDialogComponent.prototype, "message", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ConfirmDialogComponent.prototype, "yesText", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ConfirmDialogComponent.prototype, "noText", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ConfirmDialogComponent.prototype, "result", void 0);
    ConfirmDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-confirm-dialog',
            template: __webpack_require__(/*! ./confirm-dialog.component.html */ "./src/app/dialogs/confirm-dialog/confirm-dialog.component.html"),
            styles: [__webpack_require__(/*! ./confirm-dialog.component.css */ "./src/app/dialogs/confirm-dialog/confirm-dialog.component.css")]
        }),
        __metadata("design:paramtypes", [_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NgbActiveModal"]])
    ], ConfirmDialogComponent);
    return ConfirmDialogComponent;
}());



/***/ }),

/***/ "./src/app/dialogs/dialog.service.ts":
/*!*******************************************!*\
  !*** ./src/app/dialogs/dialog.service.ts ***!
  \*******************************************/
/*! exports provided: DialogService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DialogService", function() { return DialogService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var _mgr_marker_mgr_marker_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../mgr-marker/mgr-marker.component */ "./src/app/mgr-marker/mgr-marker.component.ts");
/* harmony import */ var _mgr_group_mgr_group_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../mgr-group/mgr-group.component */ "./src/app/mgr-group/mgr-group.component.ts");
/* harmony import */ var _mgr_map_mgr_map_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../mgr-map/mgr-map.component */ "./src/app/mgr-map/mgr-map.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var DialogService = /** @class */ (function () {
    function DialogService(modalSvc) {
        this.modalSvc = modalSvc;
    }
    DialogService.prototype.openMarkers = function () {
        var modalRef = this.modalSvc.open(_mgr_marker_mgr_marker_component__WEBPACK_IMPORTED_MODULE_2__["MgrMarkerComponent"], { size: 'lg' });
    };
    DialogService.prototype.openGroups = function () {
        var modalRef = this.modalSvc.open(_mgr_group_mgr_group_component__WEBPACK_IMPORTED_MODULE_3__["MgrGroupComponent"], { size: 'lg' });
    };
    DialogService.prototype.openMaps = function () {
        var modalRef = this.modalSvc.open(_mgr_map_mgr_map_component__WEBPACK_IMPORTED_MODULE_4__["MgrMapComponent"], { size: 'lg' });
    };
    DialogService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NgbModal"]])
    ], DialogService);
    return DialogService;
}());



/***/ }),

/***/ "./src/app/dialogs/input-dialog/input-dialog.component.css":
/*!*****************************************************************!*\
  !*** ./src/app/dialogs/input-dialog/input-dialog.component.css ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/dialogs/input-dialog/input-dialog.component.html":
/*!******************************************************************!*\
  !*** ./src/app/dialogs/input-dialog/input-dialog.component.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header\">\r\n  <h4 class=\"modal-title\">\r\n    <fa-icon icon=\"{{icon}}\"></fa-icon> {{title}}</h4>\r\n  <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"activeModal.dismiss('Cross click')\">\r\n    <span aria-hidden=\"true\">&times;</span>\r\n  </button>\r\n</div>\r\n<div class=\"modal-body\">\r\n  <form>\r\n    <div class=\"form-group\">\r\n      <label for=\"pName\">{{message}}</label>\r\n      <input type=\"text\" class=\"form-control\" id=\"pName\" placeholder=\"{{placeholder}}\" [(ngModel)]=\"value\" name=\"name\">\r\n      <small id=\"emailHelp\" class=\"form-text text-muted\">{{helpText}}</small>\r\n    </div>\r\n  </form>\r\n</div>\r\n<div class=\"modal-footer\">\r\n  <button type=\"button\" class=\"btn btn-success dialog\" (click)=\"ok()\">OK</button>\r\n  <button type=\"button\" class=\"btn btn-outline-dark dialog\" (click)=\"activeModal.dismiss('Cancel')\">Cancel</button>\r\n</div>"

/***/ }),

/***/ "./src/app/dialogs/input-dialog/input-dialog.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/dialogs/input-dialog/input-dialog.component.ts ***!
  \****************************************************************/
/*! exports provided: InputDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InputDialogComponent", function() { return InputDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var InputDialogComponent = /** @class */ (function () {
    function InputDialogComponent(activeModal) {
        this.activeModal = activeModal;
        this.icon = "edit";
        this.placeholder = "";
        this.value = "";
        this.helpText = "";
        this.result = new rxjs__WEBPACK_IMPORTED_MODULE_2__["ReplaySubject"]();
    }
    InputDialogComponent.prototype.ngOnInit = function () {
    };
    InputDialogComponent.prototype.ok = function () {
        this.result.next(this.value);
        this.activeModal.close(this.value);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], InputDialogComponent.prototype, "icon", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], InputDialogComponent.prototype, "title", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], InputDialogComponent.prototype, "message", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], InputDialogComponent.prototype, "placeholder", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], InputDialogComponent.prototype, "value", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], InputDialogComponent.prototype, "helpText", void 0);
    InputDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-input-dialog',
            template: __webpack_require__(/*! ./input-dialog.component.html */ "./src/app/dialogs/input-dialog/input-dialog.component.html"),
            styles: [__webpack_require__(/*! ./input-dialog.component.css */ "./src/app/dialogs/input-dialog/input-dialog.component.css")]
        }),
        __metadata("design:paramtypes", [_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NgbActiveModal"]])
    ], InputDialogComponent);
    return InputDialogComponent;
}());



/***/ }),

/***/ "./src/app/dialogs/marker-dialog/marker-dialog.component.css":
/*!*******************************************************************!*\
  !*** ./src/app/dialogs/marker-dialog/marker-dialog.component.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/dialogs/marker-dialog/marker-dialog.component.html":
/*!********************************************************************!*\
  !*** ./src/app/dialogs/marker-dialog/marker-dialog.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header\">\n  <h4 class=\"modal-title\">\n    <fa-icon icon=\"question-circle\" size=\"lg\"></fa-icon> {{title}}</h4>\n  <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"activeModal.dismiss('Cross click')\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n</div>\n<div class=\"modal-body\">\n  <h4>Recent</h4>\n\n  <div *ngFor=\"let category of getCategoriesForMap()\">\n    <h4>{{category}}</h4>\n    <div>\n      <div class=\"selectable-item\" *ngFor=\"let markerType of getTypesIn(category)\">\n        <img [src]=\"markerType.icon\" class=\"icon\">\n        <span class=\"icon-text\">{{markerType.name}}</span>\n      </div>\n    </div>\n  </div>\n\n</div>\n<div class=\"modal-footer\">\n  <button type=\"button\" class=\"btn btn-success dialog\" (click)=\"anwser(true)\">{{yesText}}</button>\n  <button type=\"button\" class=\"btn btn-success dialog\" (click)=\"anwser(false)\">{{noText}}</button>\n</div>"

/***/ }),

/***/ "./src/app/dialogs/marker-dialog/marker-dialog.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/dialogs/marker-dialog/marker-dialog.component.ts ***!
  \******************************************************************/
/*! exports provided: MarkerDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MarkerDialogComponent", function() { return MarkerDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var MarkerDialogComponent = /** @class */ (function () {
    function MarkerDialogComponent(activeModal) {
        this.activeModal = activeModal;
        this.result = new rxjs__WEBPACK_IMPORTED_MODULE_2__["ReplaySubject"]();
    }
    MarkerDialogComponent.prototype.ngOnInit = function () {
    };
    MarkerDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-marker-dialog',
            template: __webpack_require__(/*! ./marker-dialog.component.html */ "./src/app/dialogs/marker-dialog/marker-dialog.component.html"),
            styles: [__webpack_require__(/*! ./marker-dialog.component.css */ "./src/app/dialogs/marker-dialog/marker-dialog.component.css")]
        }),
        __metadata("design:paramtypes", [_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NgbActiveModal"]])
    ], MarkerDialogComponent);
    return MarkerDialogComponent;
}());



/***/ }),

/***/ "./src/app/dialogs/message-dialog/message-dialog.component.css":
/*!*********************************************************************!*\
  !*** ./src/app/dialogs/message-dialog/message-dialog.component.css ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/dialogs/message-dialog/message-dialog.component.html":
/*!**********************************************************************!*\
  !*** ./src/app/dialogs/message-dialog/message-dialog.component.html ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header\">\r\n  <h4 class=\"modal-title\">\r\n    <fa-icon *ngIf=\"icon\" icon=\"{{icon}}\"></fa-icon> {{title}}</h4>\r\n  <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"activeModal.dismiss('Cross click')\">\r\n    <span aria-hidden=\"true\">&times;</span>\r\n  </button>\r\n</div>\r\n<div class=\"modal-body\">\r\n  {{message}}\r\n</div>\r\n<div class=\"modal-footer\">\r\n  <button type=\"button\" class=\"btn btn-success dialog\" (click)=\"activeModal.close('ok')\">OK</button>\r\n</div>"

/***/ }),

/***/ "./src/app/dialogs/message-dialog/message-dialog.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/dialogs/message-dialog/message-dialog.component.ts ***!
  \********************************************************************/
/*! exports provided: MessageDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MessageDialogComponent", function() { return MessageDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MessageDialogComponent = /** @class */ (function () {
    function MessageDialogComponent(activeModal) {
        this.activeModal = activeModal;
    }
    MessageDialogComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], MessageDialogComponent.prototype, "icon", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], MessageDialogComponent.prototype, "message", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], MessageDialogComponent.prototype, "title", void 0);
    MessageDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-message-dialog',
            template: __webpack_require__(/*! ./message-dialog.component.html */ "./src/app/dialogs/message-dialog/message-dialog.component.html"),
            styles: [__webpack_require__(/*! ./message-dialog.component.css */ "./src/app/dialogs/message-dialog/message-dialog.component.css")]
        }),
        __metadata("design:paramtypes", [_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NgbActiveModal"]])
    ], MessageDialogComponent);
    return MessageDialogComponent;
}());



/***/ }),

/***/ "./src/app/dialogs/restrict.service.ts":
/*!*********************************************!*\
  !*** ./src/app/dialogs/restrict.service.ts ***!
  \*********************************************/
/*! exports provided: RestrictService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RestrictService", function() { return RestrictService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var _access_dialog_access_dialog_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./access-dialog/access-dialog.component */ "./src/app/dialogs/access-dialog/access-dialog.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var RestrictService = /** @class */ (function () {
    function RestrictService(modalSvc) {
        this.modalSvc = modalSvc;
    }
    RestrictService.prototype.openRestrict = function (view, edit) {
        var modalRef = this.modalSvc.open(_access_dialog_access_dialog_component__WEBPACK_IMPORTED_MODULE_2__["AccessDialogComponent"], { size: 'lg' });
        modalRef.componentInstance.inView = view;
        modalRef.componentInstance.inEdit = edit;
        return modalRef.componentInstance.result;
    };
    RestrictService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NgbModal"]])
    ], RestrictService);
    return RestrictService;
}());



/***/ }),

/***/ "./src/app/leaflet/box-select.js":
/*!***************************************!*\
  !*** ./src/app/leaflet/box-select.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
 * L.Handler.ShiftDragZoom is used to add shift-drag zoom interaction to the map
  * (zoom to a selected bounding box), enabled by default.
 */

L.Map.mergeOptions({
    boxSelect: true
});

L.Map.BoxSelect = L.Handler.extend({
    initialize: function (map) {
        this._map = map;
        this._container = map._container;
        this._pane = map._panes.overlayPane;
    },

    addHooks: function () {
        L.DomEvent.on(this._container, 'mousedown', this._onMouseDown, this);
    },

    removeHooks: function () {
        L.DomEvent.off(this._container, 'mousedown', this._onMouseDown);
    },

    _onMouseDown: function (e) {
        console.log("Mouse DOwn ");
        console.log(e);

        if (!e.ctrlKey || ((e.which !== 1) && (e.button !== 1))) { return false; }

        L.DomUtil.disableTextSelection();

        this._startLayerPoint = this._map.mouseEventToLayerPoint(e);

        this._box = L.DomUtil.create('div', 'select-box', this._pane);
        L.DomUtil.setPosition(this._box, this._startLayerPoint);

        //TODO refactor: move cursor to styles
        this._container.style.cursor = 'crosshair';

        L.DomEvent
            .on(document, 'mousemove', this._onMouseMove, this)
            .on(document, 'mouseup', this._onMouseUp, this)
            .on(document, 'keydown', this._onKeyDown, this)
            .preventDefault(e);


        this._map.fire('boxzoomstart');
    },

    _onMouseMove: function (e) {
        var startPoint = this._startLayerPoint,
            box = this._box,

            layerPoint = this._map.mouseEventToLayerPoint(e),
            offset = layerPoint.subtract(startPoint),

            newPos = new L.Point(
                Math.min(layerPoint.x, startPoint.x),
                Math.min(layerPoint.y, startPoint.y));

        L.DomUtil.setPosition(box, newPos);

        // TODO refactor: remove hardcoded 4 pixels
        box.style.width = (Math.max(0, Math.abs(offset.x) - 4)) + 'px';
        box.style.height = (Math.max(0, Math.abs(offset.y) - 4)) + 'px';
    },

    _finish: function () {
        this._pane.removeChild(this._box);
        this._container.style.cursor = '';

        L.DomUtil.enableTextSelection();

        L.DomEvent
            .off(document, 'mousemove', this._onMouseMove)
            .off(document, 'mouseup', this._onMouseUp)
            .off(document, 'keydown', this._onKeyDown);
    },

    _onMouseUp: function (e) {

        this._finish();

        var map = this._map,
            layerPoint = map.mouseEventToLayerPoint(e);

        if (this._startLayerPoint.equals(layerPoint)) { return; }

        var bounds = new L.LatLngBounds(
            map.layerPointToLatLng(this._startLayerPoint),
            map.layerPointToLatLng(layerPoint));

        console.log("SUCCESS " + bounds);

        map.fire('boxselect', {
            boxZoomBounds: bounds
        });
    },

    _onKeyDown: function (e) {
        if (e.keyCode === 27) {
            this._finish();
        }
    }
});

L.Map.addInitHook('addHandler', 'boxSelect', L.Map.BoxSelect);

/***/ }),

/***/ "./src/app/map.service.ts":
/*!********************************!*\
  !*** ./src/app/map.service.ts ***!
  \********************************/
/*! exports provided: MapService, MyMarker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapService", function() { return MapService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyMarker", function() { return MyMarker; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! leaflet */ "./node_modules/leaflet/dist/leaflet-src.js");
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./models */ "./src/app/models.ts");
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./data.service */ "./src/app/data.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var angular2_uuid__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular2-uuid */ "./node_modules/angular2-uuid/index.js");
/* harmony import */ var angular2_uuid__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(angular2_uuid__WEBPACK_IMPORTED_MODULE_6__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var MapService = /** @class */ (function () {
    function MapService(zone, data) {
        var _this = this;
        this.zone = zone;
        this.data = data;
        // Observables
        this.selection = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        this.markerReady = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        this.markerRemove = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        // public selection = new ReplaySubject<Marker>()
        this.updates = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        // Core Data
        this.map = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        this.mapConfig = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        this.maps = [];
        this.groups = [];
        this.markers = [];
        this.myMarkers = new Map();
        this.myMarks = [];
        this.markersObs = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        this.types = new Map();
        this.lGroups = new Map();
        this.categories = new Array();
        this.markerTypes = new Map();
        this.catsLoaded = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
        this.allMarkersLayer = Object(leaflet__WEBPACK_IMPORTED_MODULE_2__["layerGroup"])();
        this.newMarkersLayer = Object(leaflet__WEBPACK_IMPORTED_MODULE_2__["layerGroup"])();
        this.data.maps.subscribe(function (maps) { return _this.maps = maps; });
        var prefsObs = this.data.userPrefs.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (prefs) { return _this.prefs = prefs; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (prefs) {
            if (!_this._mapCfg) {
                if (prefs.recentMaps && prefs.recentMaps.length > 0) {
                    var mapId_1 = prefs.recentMaps[0];
                    var mapConfig = _this.maps.find(function (m) { return m.id == mapId_1; });
                    if (mapConfig) {
                        _this.setConfig(mapConfig);
                    }
                }
            }
        }));
        // Load the Map Types
        this.data.mapTypes.subscribe(function (t) { return _this.mapTypes = t; });
        // Load the Categories
        this.data.markerCategories.subscribe(function (cats) {
            var mycats = new Array();
            cats.forEach(function (cat) {
                var c = new Category();
                c.id = cat.id;
                c.name = cat.name;
                c.appliesTo = cat.appliesTo;
                mycats.push(c);
            });
            _this.categories = mycats;
            _this.catsLoaded.next(true);
        });
        // Load each of the icons
        this.catsLoaded.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["mergeMap"])(function (v) {
            _this.defaultMarker = undefined;
            return _this.data.markerTypes;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["concatMap"])(function (items) {
            _this.categories.forEach(function (c) {
                c.types = [];
            });
            return items;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["mergeMap"])(function (value, index) { return _this.data.fillInUrl(value); }, 5)).subscribe(function (markerType) {
            var icn = Object(leaflet__WEBPACK_IMPORTED_MODULE_2__["icon"])({
                iconUrl: markerType.url,
                iconSize: markerType.iconSize,
                iconAnchor: markerType.iconAnchor
            });
            _this.types.set(markerType.id, markerType);
            _this.markerTypes.set(markerType.id, icn);
            var cat = _this.categories.find(function (c) { return c.id == markerType.category; });
            if (cat) {
                cat.types.push(markerType);
            }
            else {
                console.log("No Cat found for " + markerType.category);
            }
            if (_this.defaultMarker == undefined) {
                _this.defaultMarker = markerType.id;
            }
        });
        var mapMarkerGroupsObs = this.mapConfig
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (mapCfg) { return _this._mapCfg = mapCfg; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["mergeMap"])(function (newMap) { return _this.data.getMarkerGroups(newMap.id); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["mergeMap"])(function (mgs) {
            _this.groups = mgs;
            // Make LayerGroups
            _this.makeLayerGroups(mgs);
            return _this.data.getMarkers(_this._mapCfg.id);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (markers) {
            console.log("checking Markers " + markers.length);
            _this.markers = markers;
            var localMarkers = new Array();
            markers.forEach(function (marker) {
                if (_this.data.canView(marker)) {
                    var m = _this.fromSavedMarker(marker);
                    if (m) {
                        localMarkers.push(m);
                    }
                }
            });
            _this.myMarks = localMarkers;
            _this.markersObs.next(localMarkers);
        }));
        Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["combineLatest"])(prefsObs, mapMarkerGroupsObs)
            .subscribe(function () {
            console.log("BUILDING LAYERS");
            _this.allMarkersLayer.clearLayers();
            // Loop through the groups. Add each group to the map
            _this.groups.forEach(function (g) {
                _this.addGroup(g.id);
            });
            _this.addGroup(MapService_1.UNCATEGORIZED);
            // Loop through the markers. Add each marker to the group layer
            // 
            _this.myMarks.forEach(function (mm) {
                if (!_this.prefs.isHiddenMarker(_this._mapCfg.id, mm.id)) {
                    if (mm.markerGroup) {
                        var g = _this.lGroups.get(mm.markerGroup);
                        _this.addEventListeners(mm);
                        mm.marker.addTo(g);
                    }
                    else {
                        var g = _this.lGroups.get(MapService_1.UNCATEGORIZED);
                        _this.addEventListeners(mm);
                        mm.marker.addTo(g);
                    }
                }
            });
        });
    }
    MapService_1 = MapService;
    MapService.prototype.addGroup = function (groupId) {
        if (!this.prefs.isHiddenGroup(this._mapCfg.id, groupId)) {
            var lGroup = this.lGroups.get(groupId);
            if (lGroup) {
                lGroup.clearLayers();
                lGroup.addTo(this.allMarkersLayer);
            }
        }
    };
    MapService.prototype.addEventListeners = function (m) {
        var _this = this;
        m.marker.addEventListener('click', function (event) {
            _this.zone.run(function () {
                var m = event.target;
                var marker = new MyMarker(m);
                marker.selected = true;
                _this.select(new MyMarker(m));
            });
        });
        m.marker.on('add', function (event) {
            _this.zone.run(function () {
                _this.markerAdded(m);
            });
        });
        m.marker.on('remove', function (event) {
            _this.zone.run(function () {
                _this.markerRemoved(m);
            });
        });
    };
    MapService.prototype.makeLayerGroups = function (mgs) {
        var _this = this;
        this.lGroups.clear();
        this.lGroups.set(MapService_1.UNCATEGORIZED, Object(leaflet__WEBPACK_IMPORTED_MODULE_2__["layerGroup"])());
        mgs.forEach(function (g) {
            var lg = Object(leaflet__WEBPACK_IMPORTED_MODULE_2__["layerGroup"])();
            _this.lGroups.set(g.id, lg);
        });
    };
    /**
     * Add a temporary marker, ready for editing. This needs to be saved if the user wants it persisted to the database
     * @param marker
     */
    MapService.prototype.addTempMarker = function (marker) {
        var _this = this;
        this.newMarkersLayer.clearLayers();
        marker.marker.addTo(this.newMarkersLayer);
        marker.marker.addEventListener('click', function (event) {
            _this.zone.run(function () {
                var m = event.target;
                var marker = new MyMarker(m);
                marker.selected = true;
                _this.select(new MyMarker(m));
            });
        });
    };
    /**
     * Create a new Temporary Marker (one that has not been saved yet)
     */
    MapService.prototype.newTempMarker = function () {
        var markerTypeId = this.getDefaultMarker(this._mapCfg);
        var loc = this.getCenter();
        var icn = this.markerTypes.get(markerTypeId);
        if (icn == undefined) {
            console.log("ERROR NO ICON");
        }
        var m = new MyMarker(Object(leaflet__WEBPACK_IMPORTED_MODULE_2__["marker"])(loc, { icon: icn, draggable: false }));
        m.id = angular2_uuid__WEBPACK_IMPORTED_MODULE_6__["UUID"].UUID().toString();
        m.name = "New Marker";
        m.type = markerTypeId;
        m.map = this._mapCfg.id;
        return m;
    };
    MapService.prototype.openMap = function (mapId) {
        var me = this.maps.find(function (m) { return m.id == mapId; });
        if (me) {
            this.setConfig(me);
        }
    };
    MapService.prototype.setConfig = function (mapCfg) {
        this._mapCfg = mapCfg;
        this.mapConfig.next(mapCfg);
    };
    MapService.prototype.setMap = function (map) {
        this._map = map;
        this.map.next(map);
    };
    MapService.prototype.panTo = function (location) {
        if (this._map !== undefined) {
            this._map.panTo(location);
        }
    };
    MapService.prototype.getCenter = function () {
        if (this._map !== undefined) {
            return this._map.getCenter();
        }
    };
    MapService.prototype.fit = function (bounds) {
        if (this._map !== undefined) {
            return this._map.fitBounds(bounds);
        }
    };
    MapService.prototype.select = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        this.selection.next(new _models__WEBPACK_IMPORTED_MODULE_3__["Selection"](items));
    };
    MapService.prototype.markerAdded = function (marker) {
        this.markerReady.next(marker);
    };
    MapService.prototype.markerRemoved = function (marker) {
        this.markerRemove.next(marker);
    };
    MapService.prototype.getMarkerType = function (id) {
        return this.types.get(id);
    };
    MapService.prototype.update = function (me) {
        this.updates.next(me);
    };
    MapService.prototype.getDefaultMarker = function (item) {
        if (item.defaultMarker) {
            return item.defaultMarker;
        }
        var mt = this.mapTypes.find(function (mt) { return mt.id == item.mapType; });
        if (mt && mt.defaultMarker) {
            return mt.defaultMarker;
        }
        return this.defaultMarker;
    };
    MapService.prototype.getMarkerTypes = function () {
        return this.markerTypes;
    };
    MapService.prototype.saveMarker = function (m) {
        var s = this.toSavedMarker(m);
        console.log(s);
        this.data.saveMarker(s);
    };
    MapService.prototype.deleteMarker = function (m) {
        this.data.deleteMarker(this.toSavedMarker(m));
    };
    MapService.prototype.toMyMarker = function (m) {
        return new MyMarker(m);
    };
    MapService.prototype.fromSavedMarker = function (saved) {
        // Get the Icon
        var icn = this.markerTypes.get(saved.type);
        if (icn == undefined) {
            console.log("Cannot find Maerk Type with id of " + saved.type);
            return undefined;
        }
        var loc = Object(leaflet__WEBPACK_IMPORTED_MODULE_2__["latLng"])(saved.location[0], saved.location[1]);
        // Generate the marker 
        var mk = Object(leaflet__WEBPACK_IMPORTED_MODULE_2__["marker"])(loc, { icon: icn, draggable: false });
        var m = new MyMarker(mk);
        m.id = saved.id;
        m.name = saved.name;
        m.type = saved.type;
        m.view = saved.view;
        m.edit = saved.edit;
        m.map = saved.map;
        m.mapLink = saved.mapLink;
        m.markerGroup = saved.markerGroup;
        m.description = saved.description;
        return m;
    };
    MapService.prototype.toSavedMarker = function (m) {
        var location = [m.marker.getLatLng().lat, m.marker.getLatLng().lng];
        var saved = new _models__WEBPACK_IMPORTED_MODULE_3__["SavedMarker"]();
        saved.id = m.id;
        saved.name = m.name;
        saved.description = m.description;
        saved.location = location;
        saved.type = m.type;
        saved.edit = m.edit;
        saved.view = m.view;
        saved.map = m.map;
        saved.mapLink = m.mapLink;
        saved.markerGroup = m.markerGroup;
        return saved;
    };
    MapService.UNCATEGORIZED = "UNGROUPED";
    MapService = MapService_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"], _data_service__WEBPACK_IMPORTED_MODULE_4__["DataService"]])
    ], MapService);
    return MapService;
    var MapService_1;
}());

var MyMarker = /** @class */ (function () {
    function MyMarker(m) {
        this.m = m;
        this.objType = MyMarker.TYPE;
    }
    MyMarker.is = function (obj) {
        return obj.objType && obj.objType == MyMarker.TYPE;
    };
    Object.defineProperty(MyMarker.prototype, "marker", {
        get: function () {
            return this.m;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyMarker.prototype, "id", {
        get: function () {
            return this.m["__id"];
        },
        set: function (myId) {
            this.m["__id"] = myId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyMarker.prototype, "name", {
        get: function () {
            return this.m.options.title;
        },
        set: function (myName) {
            this.m.options.title = myName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyMarker.prototype, "description", {
        get: function () {
            return this.m["__description"];
        },
        set: function (my) {
            this.m["__description"] = my;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyMarker.prototype, "type", {
        get: function () {
            return this.m["__type"];
        },
        set: function (my) {
            this.m["__type"] = my;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyMarker.prototype, "markerGroup", {
        get: function () {
            return this.m["__markerGroup"];
        },
        set: function (my) {
            this.m["__markerGroup"] = my;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyMarker.prototype, "pageUrl", {
        get: function () {
            return this.m["__pageUrl"];
        },
        set: function (my) {
            this.m["__pageUrl"] = my;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyMarker.prototype, "mapLink", {
        get: function () {
            return this.m["__mapLink"];
        },
        set: function (my) {
            this.m["__mapLink"] = my;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyMarker.prototype, "view", {
        get: function () {
            return this.m["__view"];
        },
        set: function (my) {
            this.m["__view"] = my;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyMarker.prototype, "edit", {
        get: function () {
            return this.m["__edit"];
        },
        set: function (my) {
            this.m["__edit"] = my;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyMarker.prototype, "x", {
        get: function () {
            return this.m["__x"];
        },
        set: function (my) {
            this.m["__x"] = my;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyMarker.prototype, "y", {
        get: function () {
            return this.m["__y"];
        },
        set: function (my) {
            this.m["__y"] = my;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyMarker.prototype, "maxZoom", {
        get: function () {
            return this.m["__maxZoom"];
        },
        set: function (my) {
            this.m["__maxZoom"] = my;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyMarker.prototype, "minZoom", {
        get: function () {
            return this.m["__minZoom"];
        },
        set: function (my) {
            this.m["__minZoom"] = my;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyMarker.prototype, "map", {
        get: function () {
            return this.m["__map"];
        },
        set: function (id) {
            this.m["__map"] = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyMarker.prototype, "selected", {
        get: function () {
            return this.m["__selected"];
        },
        set: function (id) {
            this.m["__selected"] = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyMarker.prototype, "iconUrl", {
        get: function () {
            // console.log("this.m " + this.m);
            // console.log("this.m.options" + this.m.options);
            // console.log("this.m.options.icon " + this.m.options.icon);
            // console.log("this.m.options.icon.options " + this.m.options.icon.options);
            // console.log("this.m.options.icon.options.iconUrl " + this.m.options.icon.options.iconUrl);
            return this.m.options.icon.options.iconUrl;
        },
        enumerable: true,
        configurable: true
    });
    MyMarker.TYPE = "markers.MyMarker";
    return MyMarker;
}());

var Category = /** @class */ (function () {
    function Category() {
        this.types = [];
    }
    return Category;
}());


/***/ }),

/***/ "./src/app/map/map.component.css":
/*!***************************************!*\
  !*** ./src/app/map/map.component.css ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mapcontainer {\r\n    width: 100%;\r\n    height: 100%;\r\n    margin: 0;\r\n    padding: 0;\r\n    z-index: 1;\r\n    background: #ffffff;\r\n}\r\n\r\n:host {\r\n    position: absolute;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    top: 0;\r\n  }"

/***/ }),

/***/ "./src/app/map/map.component.html":
/*!****************************************!*\
  !*** ./src/app/map/map.component.html ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"mapcontainer\" leaflet [leafletOptions]=\"options\" [leafletLayers]=\"layers\" (leafletMapReady)=\"onMapReady($event)\">\r\n</div>"

/***/ }),

/***/ "./src/app/map/map.component.ts":
/*!**************************************!*\
  !*** ./src/app/map/map.component.ts ***!
  \**************************************/
/*! exports provided: MapComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapComponent", function() { return MapComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! leaflet */ "./node_modules/leaflet/dist/leaflet-src.js");
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var angularfire2_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! angularfire2/auth */ "./node_modules/angularfire2/auth/index.js");
/* harmony import */ var _map_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../map.service */ "./src/app/map.service.ts");
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../data.service */ "./src/app/data.service.ts");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../models */ "./src/app/models.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _node_modules_leaflet_coordinates_dist_Leaflet_Coordinates_0_1_5_src_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../node_modules/leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.src.js */ "./node_modules/leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.src.js");
/* harmony import */ var _node_modules_leaflet_coordinates_dist_Leaflet_Coordinates_0_1_5_src_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_node_modules_leaflet_coordinates_dist_Leaflet_Coordinates_0_1_5_src_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _leaflet_box_select_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../leaflet/box-select.js */ "./src/app/leaflet/box-select.js");
/* harmony import */ var _leaflet_box_select_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_leaflet_box_select_js__WEBPACK_IMPORTED_MODULE_8__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var MapComponent = /** @class */ (function () {
    function MapComponent(zone, afAuth, mapSvc, data) {
        var _this = this;
        this.zone = zone;
        this.afAuth = afAuth;
        this.mapSvc = mapSvc;
        this.data = data;
        this.bounds = Object(leaflet__WEBPACK_IMPORTED_MODULE_1__["latLngBounds"])([[0, 0], [1536, 2048]]);
        this.mainMap = Object(leaflet__WEBPACK_IMPORTED_MODULE_1__["imageOverlay"])('./assets/missing.png', this.bounds);
        this.options = {
            zoom: 1,
            minZoom: -2,
            // maxZoom: 3,
            continousWorld: false,
            crs: leaflet__WEBPACK_IMPORTED_MODULE_1__["CRS"].Simple
        };
        this.layers = [];
        this.currentSelection = new _models__WEBPACK_IMPORTED_MODULE_5__["Selection"]([]);
        this.mapSvc.mapConfig.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["mergeMap"])(function (m) {
            _this.mapCfg = m;
            return _this.data.url(m);
        })).subscribe(function (url) {
            var bounds = Object(leaflet__WEBPACK_IMPORTED_MODULE_1__["latLngBounds"])([[0, 0], [_this.mapCfg.height, _this.mapCfg.width]]);
            var mapLayer = Object(leaflet__WEBPACK_IMPORTED_MODULE_1__["imageOverlay"])(url, bounds);
            _this.layers.splice(0, _this.layers.length);
            _this.layers.push(mapLayer);
            _this.layers.push(_this.mapSvc.allMarkersLayer);
            _this.layers.push(_this.mapSvc.newMarkersLayer);
            _this.mapSvc.fit(bounds);
        });
        this.mapSvc.selection.subscribe(function (sel) {
            var removed = sel.removed(_this.currentSelection);
            var added = sel.added(_this.currentSelection);
            var same = sel.same(_this.currentSelection);
            removed.forEach(function (item) {
                if (_map_service__WEBPACK_IMPORTED_MODULE_3__["MyMarker"].is(item)) {
                    item.selected = false;
                    if (item.marker["_icon"]) {
                        leaflet__WEBPACK_IMPORTED_MODULE_1__["DomUtil"].removeClass(item.marker["_icon"], 'iconselected');
                    }
                }
            });
            added.forEach(function (item) {
                if (_map_service__WEBPACK_IMPORTED_MODULE_3__["MyMarker"].is(item)) {
                    item.selected = true;
                    if (item.marker["_icon"]) {
                        leaflet__WEBPACK_IMPORTED_MODULE_1__["DomUtil"].addClass(item.marker["_icon"], 'iconselected');
                    }
                }
            });
            _this.currentSelection = sel;
        });
    }
    MapComponent.prototype.onMapReady = function (map) {
        var _this = this;
        this.map = map;
        // Install plugins
        leaflet__WEBPACK_IMPORTED_MODULE_1__["control"].coordinates({
            decimals: 2,
            position: "bottomleft",
            labelTemplateLat: "Y: {y}",
            labelTemplateLng: "X: {x}",
            enableUserInput: false
        }).addTo(map);
        // L.Map.addInitHook
        // L.Map.addInitHook('addHandler', 'boxSelect', L.Map.BoxSelect);
        // this.map.addHandler('boxSelect', L.BoxSelect)
        this.zone.run(function () {
            _this.mapSvc.setMap(map);
        });
    };
    MapComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-map',
            template: __webpack_require__(/*! ./map.component.html */ "./src/app/map/map.component.html"),
            styles: [__webpack_require__(/*! ./map.component.css */ "./src/app/map/map.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"], angularfire2_auth__WEBPACK_IMPORTED_MODULE_2__["AngularFireAuth"],
            _map_service__WEBPACK_IMPORTED_MODULE_3__["MapService"], _data_service__WEBPACK_IMPORTED_MODULE_4__["DataService"]])
    ], MapComponent);
    return MapComponent;
}());



/***/ }),

/***/ "./src/app/mgr-group/mgr-group.component.css":
/*!***************************************************!*\
  !*** ./src/app/mgr-group/mgr-group.component.css ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".cat-style {\r\n    padding: 5px 2px;\r\n}\r\n\r\n.tree {\r\n    height: 500px;\r\n    overflow: auto;\r\n}\r\n\r\n.member-list {\r\n    max-height: 400px;\r\n    overflow: auto;\r\n}\r\n\r\n.selected {\r\n    outline: 2px solid blue;\r\n    outline: 5px auto -webkit-focus-ring-color;\r\n}"

/***/ }),

/***/ "./src/app/mgr-group/mgr-group.component.html":
/*!****************************************************!*\
  !*** ./src/app/mgr-group/mgr-group.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header\">\n  <h4 class=\"modal-title\">\n    <fa-icon icon=\"users\" size=\"lg\"></fa-icon> Group Manager</h4>\n  <div>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"activeModal.dismiss('Cross click')\" placement=\"bottom\" ngbTooltip=\"Close\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"delete()\" placement=\"bottom\" ngbTooltip=\"Delete\">\n      <fa-icon icon=\"trash-alt\" size=\"lg\"></fa-icon>\n    </button>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"newGroup()\" placement=\"bottom\" ngbTooltip=\"New Group\">\n      <fa-icon icon=\"plus\" size=\"lg\"></fa-icon>\n    </button>\n  </div>\n</div>\n<div class=\"modal-body\">\n  <div class=\"container-fluid\">\n    <div class=\"row\">\n      <div class=\"tree col-3\">\n        <ng-container *ngFor=\"let grp of groups\">\n          <button [class.selected]=\"selected==grp\" class=\"dropdown-item btn-sm cat-style\" (click)=\"setGrp(grp)\">\n            <fa-icon icon=\"users\" fixedWidth=\"true\"></fa-icon> {{grp.name}}</button>\n        </ng-container>\n      </div>\n      <div class=\"col-9\">\n        <ng-container *ngIf=\"selected\">\n          <div class=\"form-group\">\n            <label for=\"name\">Name</label>\n            <input type=\"text\" class=\"form-control \" id=\"name\" placeholder=\"Enter Group Name\" [(ngModel)]=\"selected.name\">\n          </div>\n          <div class=\"form-group\">\n            <label for=\"description\">Description</label>\n            <textarea class=\"form-control form-control-sm\" rows=\"3\" id=\"description\" placeholder=\"Enter Description\" [(ngModel)]=\"selected.description\"></textarea>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"name\">Members</label>\n            <div class=\"member-list\">\n              <div class=\"custom-control custom-checkbox\" *ngFor=\"let opt of users\">\n                <input type=\"checkbox\" class=\"custom-control-input\" id=\"{{opt.uid}}\" [(checklist)]=\"members\" [checklistValue]=\"opt.uid\">\n                <label class=\"custom-control-label\" for=\"{{opt.uid}}\"> {{opt.name}}</label>\n              </div>\n            </div>\n          </div>\n          <button type=\"button\" class=\"btn btn-outline-secondary\" aria-label=\"Close\" (click)=\"save()\">\n            <fa-icon icon=\"save\" size=\"lg\"></fa-icon> Save\n          </button>\n        </ng-container>\n      </div>\n    </div>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/mgr-group/mgr-group.component.ts":
/*!**************************************************!*\
  !*** ./src/app/mgr-group/mgr-group.component.ts ***!
  \**************************************************/
/*! exports provided: MgrGroupComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MgrGroupComponent", function() { return MgrGroupComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data.service */ "./src/app/data.service.ts");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models */ "./src/app/models.ts");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var _dialogs_common_dialog_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dialogs/common-dialog.service */ "./src/app/dialogs/common-dialog.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MgrGroupComponent = /** @class */ (function () {
    function MgrGroupComponent(data, activeModal, cd) {
        var _this = this;
        this.data = data;
        this.activeModal = activeModal;
        this.cd = cd;
        this.groups = [];
        this.users = [];
        this.members = [];
        this.data.groups.subscribe(function (grps) {
            _this.groups = grps;
        });
        this.data.users.subscribe(function (usrs) {
            _this.users = usrs;
        });
    }
    MgrGroupComponent.prototype.ngOnInit = function () {
    };
    MgrGroupComponent.prototype.setGrp = function (g) {
        var copy = JSON.parse(JSON.stringify(g));
        this.selected = copy;
        console.log(this.selected);
        if (this.selected.members) {
            this.members = this.selected.members;
        }
        else {
            this.members = [];
        }
    };
    MgrGroupComponent.prototype.newGroup = function () {
        var g = new _models__WEBPACK_IMPORTED_MODULE_2__["UserGroup"]();
        g.name = "New Group";
        this.selected = g;
    };
    MgrGroupComponent.prototype.save = function () {
        this.selected.members = this.members;
        console.log(this.selected);
        this.data.saveUserGroup(this.selected);
    };
    MgrGroupComponent.prototype.delete = function () {
        var _this = this;
        if (this.selected) {
            this.cd.confirm("Are you sure you want to delete " + this.selected.name + "?", "Confirm Delete").subscribe(function (r) {
                if (r) {
                    _this.data.deleteUserGroup(_this.selected);
                    _this.selected = undefined;
                }
            });
        }
    };
    MgrGroupComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-mgr-group',
            template: __webpack_require__(/*! ./mgr-group.component.html */ "./src/app/mgr-group/mgr-group.component.html"),
            styles: [__webpack_require__(/*! ./mgr-group.component.css */ "./src/app/mgr-group/mgr-group.component.css")]
        }),
        __metadata("design:paramtypes", [_data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"], _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_3__["NgbActiveModal"], _dialogs_common_dialog_service__WEBPACK_IMPORTED_MODULE_4__["CommonDialogService"]])
    ], MgrGroupComponent);
    return MgrGroupComponent;
}());



/***/ }),

/***/ "./src/app/mgr-map/mgr-map.component.css":
/*!***********************************************!*\
  !*** ./src/app/mgr-map/mgr-map.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".tree {\r\n    height: 500px;\r\n    overflow: auto;\r\n}\r\nh6 {\r\n    margin-top: .4em;\r\n}\r\n.cat-style {\r\n    padding: 5px 2px;\r\n}\r\n.auto {\r\n    margin: 0 auto;\r\n}\r\n.selected {\r\n    outline: 2px solid blue;\r\n    outline: 5px auto -webkit-focus-ring-color;\r\n}\r\n.custom-file-upload {\r\n    border: 1px solid #ccc;\r\n    display: inline-block;\r\n    padding: 6px 12px;\r\n    cursor: pointer;\r\n}\r\n.inputfile {\r\n\twidth: 0.1px;\r\n\theight: 0.1px;\r\n\topacity: 0;\r\n\toverflow: hidden;\r\n\tposition: absolute;\r\n\tz-index: -1;\r\n}\r\n.file-div {\r\n    border: 3px solid rgb(150, 150, 150);\r\n    box-sizing: border-box;\r\n    display: flex;\r\n    justify-content: center; /* align horizontal */\r\n    align-items: center; /* align vertical */\r\n}\r\n\r\n"

/***/ }),

/***/ "./src/app/mgr-map/mgr-map.component.html":
/*!************************************************!*\
  !*** ./src/app/mgr-map/mgr-map.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header\">\n  <h4 class=\"modal-title\">\n    <fa-icon icon=\"map-marker-alt\" size=\"lg\"></fa-icon> Map Manager</h4>\n  <div>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"activeModal.dismiss('Cross click')\" placement=\"bottom\" ngbTooltip=\"Close\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"delete()\" placement=\"bottom\" ngbTooltip=\"Delete\" [disabled]=\"!this.selected\">\n      <fa-icon icon=\"trash-alt\" size=\"lg\"></fa-icon>\n    </button>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"newMap()\" placement=\"bottom\" ngbTooltip=\"New Map\" [disabled]=\"!this.selected\">\n      <fa-icon icon=\"plus\" size=\"lg\"></fa-icon>\n    </button>\n\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"newMapType()\" placement=\"bottom\" ngbTooltip=\"New Map Type\">\n      <fa-icon icon=\"folder\" size=\"lg\"></fa-icon>\n    </button>\n    <button *ngIf=\"restricted == false\" type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"showAccess()\" placement=\"bottom\"\n      ngbTooltip=\"Restrict Access (Not Restricted)\">\n      <fa-icon icon=\"unlock\" size=\"lg\"></fa-icon>\n    </button>\n    <button *ngIf=\"restricted == true\" type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"showAccess()\" placement=\"bottom\"\n      ngbTooltip=\"Restrict Access (Restricted)\">\n      <fa-icon icon=\"lock\" size=\"lg\"></fa-icon>\n    </button>\n  </div>\n</div>\n<div class=\"modal-body\">\n  <div class=\"container-fluid\">\n    <div class=\"row\">\n      <div class=\"tree col-3\">\n        <ng-container *ngFor=\"let mt of merged\">\n          <div [class.selected]=\"selected==mt\" class=\"dropdown-item btn-sm cat-style noselect\" (click)=\"setType(mt)\" (dblclick)=\"isCollapsed[mt.name] = !isCollapsed[mt.name]\">\n            <fa-icon class=\"pointer\" (click)=\"isCollapsed[mt.name] = !isCollapsed[mt.name]\" [fixedWidth]=\"true\" size=\"lg\" [icon]=\"isCollapsed[mt.name] ? 'caret-right' : 'caret-down'\"></fa-icon>{{mt.name}}\n          </div>\n          <div id=\"{{mt.name}}\" [ngbCollapse]=\"isCollapsed[mt.name]\">\n            <button *ngFor=\"let m of mt.maps\" [class.selected]=\"selected==m\" class=\"dropdown-item btn-sm\" (click)=\"setMap(m)\">\n              <fa-icon icon=\"map\" size=\"lg\"></fa-icon>\n              {{m.name}}</button>\n          </div>\n        </ng-container>\n      </div>\n      <div class=\"col-9\">\n        <ng-container *ngIf=\"selected\">\n          <ng-container *ngIf=\"sType=='map'\">\n            <div class=\"form-group\">\n              <label for=\"name\">Name</label>\n              <input type=\"text\" class=\"form-control \" id=\"name\" placeholder=\"Enter Map Name\" [(ngModel)]=\"selected.name\">\n              <small id=\"emailHelp\" class=\"form-text text-muted\">{{selected.id}}</small>\n            </div>\n            <div class=\"container-fluid\">\n              <div class=\"row p-0\">\n                <div class=\"col-6 p-0\">\n                  <div class=\"form-group  mb-0\">\n                    <label for=\"name\">Map Image</label>\n                  </div>\n                  <div class=\"form-group\">\n                    <label for=\"file\" class=\"custom-file-upload p-0\" (click)=\"getFile()\">\n                      <canvas #mycanvas class=\"file-div\" src=\"./assets/missing.png\" width=\"150\"></canvas>\n                    </label>\n                    <input id=\"file\" #filecontrol type=\"file\" class=\"inputfile \" id=\"name\" accept=\".jpg,.png\" placeholder=\"select map image\"\n                      (change)=\"setFile($event)\">\n                  </div>\n                </div>\n                <div class=\"col-6 p-0\">\n                  <div class=\"form-group mb-0\">\n                    <label for=\"name\">Dimensions</label>\n                  </div>\n                  <div class=\"form-group\">\n                    <label for=\"dim\">Height</label>\n                    <input id=\"dim\" type=\"text\" class=\"form-control \" id=\"name\" placeholder=\"Enter Height\" [(ngModel)]=\"selected.height\">\n                  </div>\n                  <div class=\"form-group\">\n                    <label for=\"dim\">Width</label>\n                    <input id=\"dim\" type=\"text\" class=\"form-control \" id=\"name\" placeholder=\"Enter Width\" [(ngModel)]=\"selected.width\">\n                  </div>\n                </div>\n              </div>\n            </div>\n            <div class=\"form-group\">\n              <label for=\"name\">Default Marker</label>\n              <app-marker-combo [(ngModel)]=\"selected.defaultMarker\" [map]=\"selected\"></app-marker-combo>\n            </div>\n            <div class=\"form-group\">\n              <label for=\"description\">Description</label>\n              <textarea class=\"form-control form-control-sm\" rows=\"3\" id=\"description\" placeholder=\"Enter Description\" [(ngModel)]=\"selected.description\"></textarea>\n            </div>\n          </ng-container>\n          <ng-container *ngIf=\"sType=='type'\">\n            <div class=\"form-group\">\n              <label for=\"name\">Name</label>\n              <input type=\"text\" class=\"form-control \" id=\"name\" placeholder=\"Enter Map Type Name\" [(ngModel)]=\"selected.name\">\n              <small id=\"emailHelp\" class=\"form-text text-muted\">ID:{{selected.id}}</small>\n            </div>\n            <div class=\"form-group\">\n              <label for=\"name\">Default Marker</label>\n              <app-marker-combo [(ngModel)]=\"selected.defaultMarker\" [mapType]=\"selected\"></app-marker-combo>\n            </div>\n            <div class=\"form-group\">\n              <label for=\"name\">Order</label>\n              <input type=\"text\" class=\"form-control\" id=\"name\" placeholder=\"Enter Marker Name\" [(ngModel)]=\"selected.order\">\n            </div>\n          </ng-container>\n          <button type=\"button\" class=\"btn btn-outline-secondary\" aria-label=\"Close\" (click)=\"save()\">\n            <fa-icon icon=\"save\" size=\"lg\"></fa-icon> Save\n          </button>\n        </ng-container>\n      </div>\n    </div>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/mgr-map/mgr-map.component.ts":
/*!**********************************************!*\
  !*** ./src/app/mgr-map/mgr-map.component.ts ***!
  \**********************************************/
/*! exports provided: MgrMapComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MgrMapComponent", function() { return MgrMapComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data.service */ "./src/app/data.service.ts");
/* harmony import */ var _dialogs_common_dialog_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dialogs/common-dialog.service */ "./src/app/dialogs/common-dialog.service.ts");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models */ "./src/app/models.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var angular2_uuid__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular2-uuid */ "./node_modules/angular2-uuid/index.js");
/* harmony import */ var angular2_uuid__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(angular2_uuid__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _dialogs_restrict_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../dialogs/restrict.service */ "./src/app/dialogs/restrict.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var MgrMapComponent = /** @class */ (function () {
    function MgrMapComponent(zone, activeModal, cd, data, dialog) {
        var _this = this;
        this.zone = zone;
        this.activeModal = activeModal;
        this.cd = cd;
        this.data = data;
        this.dialog = dialog;
        this.restricted = false;
        this.merged = [];
        this.isCollapsed = new Map();
        this.thumbnail = "./assets/missing.png";
        this.data.mapTypesWithMaps.subscribe(function (items) {
            _this.merged = items;
        });
    }
    MgrMapComponent.prototype.getFile = function () {
        console.log(this.fileButton);
        this.fileButton.nativeElement.click();
    };
    MgrMapComponent.prototype.setFile = function (event) {
        var _this = this;
        if (this.selected) {
            var f = event.target.files[0];
            this.processFile(f).subscribe(function (val) {
                _this.zone.run(function () {
                    _this.result = val;
                    _this.selected.height = val.height;
                    _this.selected.width = val.width;
                });
            });
        }
    };
    MgrMapComponent.prototype.processFile = function (f) {
        console.log("Processing");
        // let thumbImg = this.myimagethumb
        var bigCanvas = document.createElement('canvas');
        var canvas = this.canvas.nativeElement;
        var result = new ImageResult();
        var val = new rxjs__WEBPACK_IMPORTED_MODULE_5__["ReplaySubject"]();
        var reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onloadend = function () {
            console.log("Load End");
            var url = reader.result;
            var img = new Image();
            img.src = url;
            img.onload = function () {
                console.log("On Load");
                bigCanvas.width = img.naturalWidth;
                bigCanvas.height = img.naturalHeight;
                bigCanvas.getContext('2d').drawImage(img, 0, 0);
                bigCanvas.toBlob(function (b) { return result.image = b; });
                // set size proportional to image
                var w = 150 * (img.width / img.height);
                canvas.width = 150;
                canvas.height = canvas.width * (img.height / img.width);
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                result.height = img.height;
                result.width = img.width;
                canvas.toBlob(function (b) { return result.thumb = b; });
                console.log(result);
                val.next(result);
            };
        };
        return val;
    };
    MgrMapComponent.prototype.save = function () {
        if (this.selected) {
            if (this.sType == 'map') {
                if (this.result) {
                    this.data.saveMap(this.selected, this.result.image, this.result.thumb);
                }
                else {
                    this.data.saveMap(this.selected);
                }
            }
            else {
                console.log(this.selected);
                this.data.saveMapType(this.selected);
            }
        }
    };
    MgrMapComponent.prototype.setType = function (t) {
        this.restricted = false;
        this.selected = t;
        this.sType = 'type';
    };
    MgrMapComponent.prototype.setMap = function (t) {
        var _this = this;
        this.selected = t;
        this.sType = 'map';
        this.restricted = this.data.isRestricted(this.selected);
        this.data.url(this.selected).subscribe(function (url) {
            console.log("Got URL : " + url);
            _this.thumbnail;
            _this.loadImage(url);
        });
    };
    MgrMapComponent.prototype.loadImage = function (url) {
        var canvas = this.canvas.nativeElement;
        var img = new Image();
        img.src = url;
        img.onload = function () {
            console.log("On Load");
            // set size proportional to image
            var w = 150 * (img.width / img.height);
            canvas.width = 150;
            canvas.height = canvas.width * (img.height / img.width);
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    };
    MgrMapComponent.prototype.ngOnInit = function () {
    };
    MgrMapComponent.prototype.newMap = function () {
        if (this.selected) {
            var type = '';
            if (this.sType == 'map') {
                type = this.selected.mapType;
            }
            else {
                type = this.selected.id;
            }
            var map = new _models__WEBPACK_IMPORTED_MODULE_4__["MapConfig"]();
            map.mapType = type;
            map.id = angular2_uuid__WEBPACK_IMPORTED_MODULE_6__["UUID"].UUID().toString();
            console.log(map);
            this.sType = 'map';
            this.selected = map;
            if (this.canvas) {
                var canvas = this.canvas.nativeElement;
                var context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };
    MgrMapComponent.prototype.newMapType = function () {
        var mt = new _models__WEBPACK_IMPORTED_MODULE_4__["MapType"]();
        mt.id = angular2_uuid__WEBPACK_IMPORTED_MODULE_6__["UUID"].UUID().toString();
        mt.name = "New Map";
        mt.order = 1000;
        this.sType = 'type';
        this.selected = mt;
    };
    MgrMapComponent.prototype.delete = function () {
        if (this.sType = 'map') {
            this.data.deleteMap(this.selected);
        }
        else {
            this.data.deleteMapType(this.selected);
        }
    };
    MgrMapComponent.prototype.showAccess = function () {
        var _this = this;
        if (this.selected && this.sType == 'map') {
            this.dialog.openRestrict(this.selected.view, this.selected.edit).subscribe(function (result) {
                _this.selected.view = result[0];
                _this.selected.edit = result[1];
                console.log(_this.selected);
                _this.restricted = _this.data.isRestricted(_this.selected);
            });
        }
    };
    MgrMapComponent.prototype.escape = function (str) {
        var newStr = JSON.stringify(str);
        var newStr2 = newStr.substring(1, newStr.length - 2);
        return newStr2;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('filecontrol'),
        __metadata("design:type", Object)
    ], MgrMapComponent.prototype, "fileButton", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('mycanvas'),
        __metadata("design:type", Object)
    ], MgrMapComponent.prototype, "canvas", void 0);
    MgrMapComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-mgr-map',
            template: __webpack_require__(/*! ./mgr-map.component.html */ "./src/app/mgr-map/mgr-map.component.html"),
            styles: [__webpack_require__(/*! ./mgr-map.component.css */ "./src/app/mgr-map/mgr-map.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"], _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_3__["NgbActiveModal"], _dialogs_common_dialog_service__WEBPACK_IMPORTED_MODULE_2__["CommonDialogService"], _data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"], _dialogs_restrict_service__WEBPACK_IMPORTED_MODULE_7__["RestrictService"]])
    ], MgrMapComponent);
    return MgrMapComponent;
}());

var ImageResult = /** @class */ (function () {
    function ImageResult() {
    }
    return ImageResult;
}());


/***/ }),

/***/ "./src/app/mgr-marker/mgr-marker.component.css":
/*!*****************************************************!*\
  !*** ./src/app/mgr-marker/mgr-marker.component.css ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".tree {\r\n    height: 500px;\r\n    overflow: auto;\r\n}\r\nh6 {\r\n    margin-top: .4em;\r\n}\r\n.cat-style {\r\n    padding: 5px 2px;\r\n}\r\n.auto {\r\n    margin: 0 auto;\r\n}\r\n.selected {\r\n    outline: 2px solid blue;\r\n    outline: 5px auto -webkit-focus-ring-color;\r\n}\r\n"

/***/ }),

/***/ "./src/app/mgr-marker/mgr-marker.component.html":
/*!******************************************************!*\
  !*** ./src/app/mgr-marker/mgr-marker.component.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header\">\n  <h4 class=\"modal-title\">\n    <fa-icon icon=\"map-marker-alt\" size=\"lg\"></fa-icon> Marker Manager</h4>\n  <div>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"activeModal.dismiss('Cross click')\" placement=\"bottom\" ngbTooltip=\"Close\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"delete()\" placement=\"bottom\" ngbTooltip=\"Delete\">\n      <fa-icon icon=\"trash-alt\" size=\"lg\"></fa-icon>\n    </button>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"newMarkerType()\" placement=\"bottom\" ngbTooltip=\"New Marker Type\">\n      <fa-icon icon=\"plus\" size=\"lg\"></fa-icon>\n    </button>\n\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"newMarkerCategory()\" placement=\"bottom\" ngbTooltip=\"New Category\">\n      <fa-icon icon=\"folder\" size=\"lg\"></fa-icon>\n    </button>\n  </div>\n</div>\n<div class=\"modal-body\">\n  <div class=\"container-fluid\">\n    <div class=\"row\">\n      <div class=\"tree col-3\">\n        <ng-container *ngFor=\"let cat of categories\">\n          <!-- <button [class.selected]=\"selected==cat\" class=\"dropdown-item btn-sm cat-style\" (click)=\"setCat(cat)\" (dblclick)=\"isCollapsed[cat.name] = !isCollapsed[cat.name]\">{{cat.name}}</button> -->\n          <div [class.selected]=\"selected==cat\" class=\"dropdown-item btn-sm cat-style noselect\" (click)=\"setCat(cat)\" (dblclick)=\"isCollapsed[cat.name] = !isCollapsed[cat.name]\"><fa-icon (click)=\"isCollapsed[cat.name] = !isCollapsed[cat.name]\" [fixedWidth]=\"true\" size=\"lg\" [icon]=\"isCollapsed[cat.name] ? 'caret-right' : 'caret-down'\"></fa-icon> {{cat.name}}</div>\n          <div id=\"{{cat}}\" [ngbCollapse]=\"isCollapsed[cat.name]\">\n            <button *ngFor=\"let t of cat.types\" [class.selected]=\"selected==t\" class=\"dropdown-item btn-sm\" (click)=\"setType(t)\">\n              <img [src]=\"t.url\" height=30> {{t.name}}</button>\n          </div>\n        </ng-container>\n      </div>\n      <div class=\"col-9\">\n        <ng-container *ngIf=\"selected\">\n          <div class=\"form-group\">\n            <label for=\"name\">Name</label>\n            <input type=\"text\" class=\"form-control \" id=\"name\" placeholder=\"Enter Category Name\" [(ngModel)]=\"selected.name\">\n            <small id=\"emailHelp\" class=\"form-text text-muted\">{{selected.id}}</small>\n          </div>\n          <ng-container *ngIf=\"sType=='cat'\">\n            <div class=\"form-group\">\n              <label for=\"name\">Applies To:</label>\n              <div class=\"member-list\">\n                  <div class=\"custom-control custom-checkbox\" *ngFor=\"let opt of mapTypes\">\n                    <input type=\"checkbox\" class=\"custom-control-input\" id=\"{{opt.id}}\" [(checklist)]=\"selected.appliesTo\" [checklistValue]=\"opt.id\">\n                    <label class=\"custom-control-label\" for=\"{{opt.id}}\"> {{opt.name}}</label>\n                  </div>\n                </div>\n            </div>\n  \n            <div class=\"form-group\">\n              <label for=\"name\">Category Image</label>\n              <input type=\"file\" class=\"form-control \" id=\"name\" placeholder=\"select category image\" (change)=\"setFile($event)\">\n            </div>\n          </ng-container>\n          <ng-container *ngIf=\"sType=='type'\">\n            <div class=\"form-group\">\n              <label for=\"name\">Icon</label>\n              <input type=\"file\" class=\"form-control\" id=\"name\" placeholder=\"select icon file\" (change)=\"setFile($event)\" accept=\"image/png\">\n            </div>\n            <div class=\"form-group\">\n              <label for=\"name\">Size</label>\n              <input type=\"text\" class=\"form-control\" id=\"name\" placeholder=\"Height, Width\" [(ngModel)]=\"selected.iconSize\">\n            </div>\n            <div class=\"form-group\">\n              <label for=\"name\">Anchor</label>\n              <input type=\"text\" class=\"form-control \" id=\"name\" placeholder=\"Height, Width\" [(ngModel)]=\"selected.iconAnchor\">\n            </div>\n          </ng-container>\n          <button type=\"button\" class=\"btn btn-outline-secondary\" aria-label=\"Close\" (click)=\"save()\">\n            <fa-icon icon=\"save\" size=\"lg\"></fa-icon> Save\n          </button>\n        </ng-container>\n      </div>\n    </div>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/mgr-marker/mgr-marker.component.ts":
/*!****************************************************!*\
  !*** ./src/app/mgr-marker/mgr-marker.component.ts ***!
  \****************************************************/
/*! exports provided: MgrMarkerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MgrMarkerComponent", function() { return MgrMarkerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var _dialogs_common_dialog_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dialogs/common-dialog.service */ "./src/app/dialogs/common-dialog.service.ts");
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../data.service */ "./src/app/data.service.ts");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models */ "./src/app/models.ts");
/* harmony import */ var angular2_uuid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! angular2-uuid */ "./node_modules/angular2-uuid/index.js");
/* harmony import */ var angular2_uuid__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(angular2_uuid__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _map_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../map.service */ "./src/app/map.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var MgrMarkerComponent = /** @class */ (function () {
    function MgrMarkerComponent(mapSvc, activeModal, cd, data) {
        var _this = this;
        this.mapSvc = mapSvc;
        this.activeModal = activeModal;
        this.cd = cd;
        this.data = data;
        this.isCollapsed = new Map();
        this.categories = [];
        this.mapTypes = [];
        this.mapSvc.catsLoaded.subscribe(function (v) {
            _this.categories = _this.mapSvc.categories;
        });
        this.data.mapTypes.subscribe(function (types) { return _this.mapTypes = types; });
    }
    MgrMarkerComponent.prototype.ngOnInit = function () {
    };
    MgrMarkerComponent.prototype.setFile = function (event) {
        var _this = this;
        if (this.selected) {
            var f = event.target.files[0];
            this.selected["__FILE"] = f;
            this.getDimensions(f).subscribe(function (val) {
                _this.selected.iconSize = val;
                _this.selected.iconAnchor = [Math.round(val[0] / 2), val[1]];
            });
            console.log("FILE");
            console.log(this.selected["__FILE"]);
        }
    };
    MgrMarkerComponent.prototype.getDimensions = function (f) {
        var val = new rxjs__WEBPACK_IMPORTED_MODULE_6__["ReplaySubject"]();
        var reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onloadend = function () {
            var url = reader.result;
            var img = new Image();
            img.src = url;
            img.onload = function () {
                val.next([img.width, img.height]);
            };
        };
        return val;
    };
    MgrMarkerComponent.prototype.delete = function () {
        var _this = this;
        if (this.sType == 'cat') {
            if (this.selected.types.length > 0) {
                this.cd.confirm("Are you sure you want to delete " + this.selected.name + "? If you do then you will not be able to access the markers in this category any longer. Don't worry existing markers will continue to work.", "Confirm Delete").subscribe(function (r) {
                    if (r) {
                        _this.data.deleteMarkerCategory(_this.selected);
                    }
                });
            }
            else {
                this.data.deleteMarkerCategory(this.selected);
            }
        }
        else {
            this.cd.confirm("Are you sure you want to delete " + this.selected.name + "? If you do then you will not be able to display markers of this type.", "Confirm Delete").subscribe(function (r) {
                if (r) {
                    _this.data.deleteMarkerType(_this.selected);
                }
            });
        }
    };
    MgrMarkerComponent.prototype.newMarkerCategory = function () {
        this.sType = 'cat';
        var item = new _models__WEBPACK_IMPORTED_MODULE_4__["MarkerCategory"]();
        item.id = angular2_uuid__WEBPACK_IMPORTED_MODULE_5__["UUID"].UUID().toString();
        item.name = "New Category";
        this.selected = item;
    };
    MgrMarkerComponent.prototype.newMarkerType = function () {
        if (this.selected) {
            var cat = '';
            if (this.sType == 'cat') {
                cat = this.selected.id;
            }
            else {
                cat = this.selected.category;
            }
            this.sType = 'type';
            var item = new _models__WEBPACK_IMPORTED_MODULE_4__["MarkerType"]();
            item.id = angular2_uuid__WEBPACK_IMPORTED_MODULE_5__["UUID"].UUID().toString();
            item.category = cat;
            item.name = "New Type";
            this.selected = item;
        }
    };
    MgrMarkerComponent.prototype.save = function () {
        console.log("SAVING");
        console.log(this.selected);
        if (this.sType == 'cat') {
            this.data.saveMarkerCategory(this.selected);
        }
        else {
            this.selected.iconSize = this.split(this.selected.iconSize);
            this.selected.iconAnchor = this.split(this.selected.iconAnchor);
            this.data.saveMarkerType(this.selected);
        }
    };
    MgrMarkerComponent.prototype.split = function (item) {
        if (typeof (item) == 'string') {
            var items = item.split(",");
            var lat = +items[0];
            var lng = +items[1];
            return [lat, lng];
        }
        else {
            return item;
        }
    };
    MgrMarkerComponent.prototype.setType = function (t) {
        this.selected = t;
        this.sType = 'type';
    };
    MgrMarkerComponent.prototype.setCat = function (t) {
        this.selected = t;
        this.sType = 'cat';
    };
    MgrMarkerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-mgr-marker',
            template: __webpack_require__(/*! ./mgr-marker.component.html */ "./src/app/mgr-marker/mgr-marker.component.html"),
            styles: [__webpack_require__(/*! ./mgr-marker.component.css */ "./src/app/mgr-marker/mgr-marker.component.css")]
        }),
        __metadata("design:paramtypes", [_map_service__WEBPACK_IMPORTED_MODULE_7__["MapService"], _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NgbActiveModal"], _dialogs_common_dialog_service__WEBPACK_IMPORTED_MODULE_2__["CommonDialogService"], _data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"]])
    ], MgrMarkerComponent);
    return MgrMarkerComponent;
}());



/***/ }),

/***/ "./src/app/models.ts":
/*!***************************!*\
  !*** ./src/app/models.ts ***!
  \***************************/
/*! exports provided: User, MarkerCategory, MarkerType, SavedMarker, MapType, MapConfig, UserGroup, MergedMapType, MarkerGroup, Selection, UserPreferences, MapPrefs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MarkerCategory", function() { return MarkerCategory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MarkerType", function() { return MarkerType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SavedMarker", function() { return SavedMarker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapType", function() { return MapType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapConfig", function() { return MapConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserGroup", function() { return UserGroup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MergedMapType", function() { return MergedMapType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MarkerGroup", function() { return MarkerGroup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Selection", function() { return Selection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserPreferences", function() { return UserPreferences; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapPrefs", function() { return MapPrefs; });
/**
 * A user in the
 */
var User = /** @class */ (function () {
    function User() {
        this.name = "no one";
        this.uid = "NOBODY";
    }
    User.prototype.isAdmin = function () {
        return this.groups.includes("admin");
    };
    User.fromFireUser = function (fireUser) {
        var u = new User();
        if (fireUser !== null) {
            console.log("Logged in user : " + fireUser.uid);
            u.uid = fireUser.uid;
            u.name = fireUser.displayName;
            u.email = fireUser.email;
            u.photo = fireUser.photoURL;
        }
        else {
            console.log("No User loged in");
        }
        return u;
    };
    return User;
}());

/**
 * A Marker Category is a group that markers are placed into.
*/
var MarkerCategory = /** @class */ (function () {
    function MarkerCategory() {
    }
    return MarkerCategory;
}());

/**
 * A Marker Type is a type of marker that can be placed. This type brings with it the icon and category
 */
var MarkerType = /** @class */ (function () {
    function MarkerType() {
    }
    return MarkerType;
}());

var SavedMarker = /** @class */ (function () {
    function SavedMarker() {
    }
    return SavedMarker;
}());

/**
 * A type of map. For example: World / Continent, City / Town, Building Interior,
 */
var MapType = /** @class */ (function () {
    function MapType() {
    }
    return MapType;
}());

/**
 * A configuration for a map.
 */
var MapConfig = /** @class */ (function () {
    function MapConfig() {
    }
    return MapConfig;
}());

var UserGroup = /** @class */ (function () {
    function UserGroup() {
        this.objType = UserGroup.TYPE;
    }
    // TypeScript guard
    UserGroup.is = function (obj) {
        return obj.objType !== undefined && obj.objType === UserGroup.TYPE;
    };
    UserGroup.TYPE = 'db.UserGroup';
    UserGroup.SAMPLE = new UserGroup();
    return UserGroup;
}());

var MergedMapType = /** @class */ (function () {
    function MergedMapType() {
    }
    return MergedMapType;
}());

var MarkerGroup = /** @class */ (function () {
    function MarkerGroup() {
        this.objType = MarkerGroup.TYPE;
    }
    // TypeScript guard
    MarkerGroup.is = function (obj) {
        return obj.objType !== undefined && obj.objType === MarkerGroup.TYPE;
    };
    MarkerGroup.dbPath = function (obj) {
        return MarkerGroup.FOLDER + '/' + obj.map + "/" + obj.id;
    };
    MarkerGroup.TYPE = 'db.MarkerGroup';
    MarkerGroup.FOLDER = 'markerGroups';
    MarkerGroup.SAMPLE = {
        objType: '',
        id: 'string',
        name: 'string',
        description: 'string',
        map: 'string',
        edit: [],
        view: [],
    };
    return MarkerGroup;
}());

var Selection = /** @class */ (function () {
    function Selection(items, type) {
        this.items = items;
        this.type = type;
        console.log("Created Select of " + this.items.length);
    }
    Object.defineProperty(Selection.prototype, "first", {
        get: function () {
            if (this.items && this.items.length > 0) {
                return this.items[0];
            }
        },
        enumerable: true,
        configurable: true
    });
    Selection.prototype.isEmpty = function () {
        return !(this.items && this.items.length > 0);
    };
    Selection.prototype.removed = function (previous) {
        var _this = this;
        var found = previous.items.filter(function (prevItem) { return !_this.items.includes(prevItem); });
        if (found) {
            return found;
        }
        return [];
    };
    Selection.prototype.added = function (previous) {
        var found = this.items.filter(function (item) { return !previous.items.includes(item); });
        if (found) {
            return found;
        }
        return [];
    };
    Selection.prototype.same = function (previous) {
        var _this = this;
        var found = previous.items.filter(function (prevItem) { return _this.items.includes(prevItem); });
        if (found) {
            return found;
        }
        return [];
    };
    Selection.MARKER = 'marker';
    return Selection;
}());

var UserPreferences = /** @class */ (function () {
    function UserPreferences() {
        this.objType = UserPreferences.TYPE;
        this.maps = {};
    }
    // TypeScript guard
    UserPreferences.is = function (obj) {
        return obj.objType !== undefined && obj.objType === UserPreferences.TYPE;
    };
    UserPreferences.dbPath = function (obj) {
        return UserPreferences.FOLDER + '/' + obj.uid;
    };
    UserPreferences.pathTo = function (userId) {
        return UserPreferences.FOLDER + '/' + userId;
    };
    UserPreferences.prototype.getMapPref = function (mapId) {
        if (!this.maps) {
            this.maps = new Map();
        }
        if (!this.maps[mapId]) {
            var mp = new MapPrefs();
            mp.mapId = mapId;
            this.maps[mapId] = new MapPrefs();
        }
        return this.maps[mapId];
    };
    UserPreferences.prototype.isHiddenMarker = function (mapId, markerId) {
        var mp = this.getMapPref(mapId);
        if (mp.hiddenMarkers) {
            return mp.hiddenMarkers.includes(markerId);
        }
        return false;
    };
    UserPreferences.prototype.isHiddenGroup = function (mapId, groupId) {
        var mp = this.getMapPref(mapId);
        if (mp.hiddenGroups) {
            return mp.hiddenGroups.includes(groupId);
        }
        return false;
    };
    UserPreferences.TYPE = 'db.UserPreferences';
    UserPreferences.FOLDER = 'userPreferences';
    UserPreferences.SAMPLE = {
        objType: '',
        uid: 'string',
        maps: {},
        recentMarkers: [],
        recentMaps: [],
        assumedGroups: []
    };
    return UserPreferences;
}());

var MapPrefs = /** @class */ (function () {
    function MapPrefs() {
        this.hiddenGroups = [];
        this.hiddenMarkers = [];
    }
    return MapPrefs;
}());



/***/ }),

/***/ "./src/app/notify.service.ts":
/*!***********************************!*\
  !*** ./src/app/notify.service.ts ***!
  \***********************************/
/*! exports provided: NotifyService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotifyService", function() { return NotifyService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var NotifyService = /** @class */ (function () {
    function NotifyService() {
    }
    NotifyService.prototype.success = function (message) {
        console.log(message);
    };
    NotifyService.prototype.showError = function (error, operation, code) {
        console.log("ERRORS: " + error);
    };
    NotifyService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], NotifyService);
    return NotifyService;
}());



/***/ }),

/***/ "./src/app/tabs/admin/admin.component.css":
/*!************************************************!*\
  !*** ./src/app/tabs/admin/admin.component.css ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".admin-btn {\r\n    width: 90%;\r\n    margin-bottom: .5em;\r\n}\r\n\r\n.centered {\r\n    display: flex;\r\n    align-items: center;\r\n    flex-direction: column;\r\n\r\n}"

/***/ }),

/***/ "./src/app/tabs/admin/admin.component.html":
/*!*************************************************!*\
  !*** ./src/app/tabs/admin/admin.component.html ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h4>Adminstration</h4>\r\n\r\n<div class=\"centered\">\r\n<button type=\"button\" class=\"btn btn-outline-secondary admin-btn\" (click)=\"openMarker()\"><fa-icon icon=\"map-marker-alt\" fixedWidth=\"true\"></fa-icon> Marker Manager</button>\r\n<button type=\"button\" class=\"btn btn-outline-secondary admin-btn\" (click)=\"openMap()\"><fa-icon icon=\"map\" fixedWidth=\"true\"></fa-icon> Maps Manager</button>\r\n<button type=\"button\" class=\"btn btn-outline-secondary admin-btn\" (click)=\"openGroup()\"><fa-icon icon=\"user\" fixedWidth=\"true\"></fa-icon> Group Manager</button>\r\n</div>"

/***/ }),

/***/ "./src/app/tabs/admin/admin.component.ts":
/*!***********************************************!*\
  !*** ./src/app/tabs/admin/admin.component.ts ***!
  \***********************************************/
/*! exports provided: AdminComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminComponent", function() { return AdminComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _dialogs_dialog_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../dialogs/dialog.service */ "./src/app/dialogs/dialog.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AdminComponent = /** @class */ (function () {
    function AdminComponent(dialogs) {
        this.dialogs = dialogs;
    }
    AdminComponent.prototype.ngOnInit = function () {
    };
    AdminComponent.prototype.openMarker = function () {
        this.dialogs.openMarkers();
    };
    AdminComponent.prototype.openMap = function () {
        this.dialogs.openMaps();
    };
    AdminComponent.prototype.openGroup = function () {
        this.dialogs.openGroups();
    };
    AdminComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-admin',
            template: __webpack_require__(/*! ./admin.component.html */ "./src/app/tabs/admin/admin.component.html"),
            styles: [__webpack_require__(/*! ./admin.component.css */ "./src/app/tabs/admin/admin.component.css")]
        }),
        __metadata("design:paramtypes", [_dialogs_dialog_service__WEBPACK_IMPORTED_MODULE_1__["DialogService"]])
    ], AdminComponent);
    return AdminComponent;
}());



/***/ }),

/***/ "./src/app/tabs/layers-tab/layers-tab.component.css":
/*!**********************************************************!*\
  !*** ./src/app/tabs/layers-tab/layers-tab.component.css ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".pack {\r\n    display: flex;\r\n    flex-direction: row\r\n}\r\n.temph {\r\n    /* max-height: 200px; */\r\n}\r\n.scroll-v {\r\n    overflow: auto;\r\n}\r\n#style-1::-webkit-scrollbar-track\r\n{\r\n    width: 8px;  /* for vertical scrollbars */\r\n\t-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);\r\n\t/* border-radius: 10px; */\r\n    background-color: rgba(0, 0, 0, .8);\r\n}\r\n#style-1::-webkit-scrollbar\r\n{\r\n\twidth: 12px;\r\n\tbackground-color: #F5F5F5;\r\n}\r\n#style-1::-webkit-scrollbar-thumb\r\n{\r\n\tborder-radius: 10px;\r\n\t-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);\r\n\tbackground-color: #555;\r\n}\r\n\r\n"

/***/ }),

/***/ "./src/app/tabs/layers-tab/layers-tab.component.html":
/*!***********************************************************!*\
  !*** ./src/app/tabs/layers-tab/layers-tab.component.html ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h4>Layers</h4>\r\n<small class=\"form-text text-muted mb-2\">Select the data to show on the map</small>\r\n\r\n<div id=\"style-1\" class=\"scroll-v \">\r\n    <ng-container *ngFor=\"let g of groups\">\r\n        <div class=\"pack\">\r\n            <fa-icon (click)=\"isCollapsed[g.id] = !isCollapsed[g.id]\" [fixedWidth]=\"true\" size=\"lg\" [icon]=\"isCollapsed[g.id] ? 'caret-right' : 'caret-down'\"></fa-icon>\r\n            <div class=\"custom-control custom-checkbox\">\r\n                <input type=\"checkbox\" class=\"custom-control-input\" id=\"{{g.id}}\" [(unchecklist)]=\"shownGroups\" [unchecklistValue]=\"g.id\">\r\n                <label class=\"custom-control-label\" for=\"{{g.id}}\">{{g.name}}</label>\r\n            </div>\r\n        </div>\r\n        <div [ngbCollapse]=\"isCollapsed[g.id]\" class=\"ml-5\">\r\n            <div class=\"custom-control custom-checkbox\" *ngFor=\"let m of getMarkers(g)\">\r\n                <input type=\"checkbox\" class=\"custom-control-input\" id=\"{{m.id}}\" [(unchecklist)]=\"shownMarkers\" [unchecklistValue]=\"m.id\">\r\n                <label class=\"custom-control-label\" for=\"{{m.id}}\"> {{m.name}}</label>\r\n            </div>\r\n        </div>\r\n    </ng-container>\r\n    <div class=\"pack\">\r\n        <fa-icon (click)=\"isCollapsed['UNGROUPED'] = !isCollapsed['UNGROUPED']\" [fixedWidth]=\"true\" size=\"lg\" [icon]=\"isCollapsed['UNGROUPED'] ? 'caret-right' : 'caret-down'\"></fa-icon>\r\n        <div class=\"custom-control custom-checkbox\">\r\n            <input type=\"checkbox\" class=\"custom-control-input\" id=\"U\" [(unchecklist)]=\"shownGroups\" [unchecklistValue]=\"'UNGROUPED'\">\r\n            <label class=\"custom-control-label\" for=\"U\">Ungrouped</label>\r\n        </div>\r\n    </div>\r\n    <div [ngbCollapse]=\"isCollapsed['UNGROUPED']\" class=\"ml-5\">\r\n        <div class=\"custom-control custom-checkbox\" *ngFor=\"let m of getUngroupedMarkers(g)\">\r\n            <input type=\"checkbox\" class=\"custom-control-input\" id=\"{{m.id}}\" [(unchecklist)]=\"shownMarkers\" [unchecklistValue]=\"m.id\">\r\n            <label class=\"custom-control-label\" for=\"{{m.id}}\"> {{m.name}}</label>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./src/app/tabs/layers-tab/layers-tab.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/tabs/layers-tab/layers-tab.component.ts ***!
  \*********************************************************/
/*! exports provided: LayersTabComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LayersTabComponent", function() { return LayersTabComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _map_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../map.service */ "./src/app/map.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../data.service */ "./src/app/data.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var LayersTabComponent = /** @class */ (function () {
    function LayersTabComponent(mapSvc, data) {
        var _this = this;
        this.mapSvc = mapSvc;
        this.data = data;
        this.groups = [];
        this.markers = [];
        this.layers = [];
        this.items = [];
        this.groupIds = [];
        this.markerIds = [];
        this.isCollapsed = {};
        this.options = {
            useCheckbox: true
        };
        this._shownGroups = [];
        this._shownMarkers = [];
        this.mapSvc.map
            .subscribe(function (m) {
            _this.map = m;
            _this.layers = _this.mapSvc.layers;
        });
        var prefObs = this.data.userPrefs.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (prefs) { return _this.prefs = prefs; }));
        var mapObs = this.mapSvc.mapConfig.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (mapConfig) { return _this.mapConfig = mapConfig; }));
        var allObs = this.mapSvc.mapConfig
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["mergeMap"])(function (mapConfig) {
            _this.mapConfig = mapConfig;
            return _this.data.getMarkerGroups(mapConfig.id);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["mergeMap"])(function (groups) {
            _this.groups = groups;
            _this.groups.forEach(function (g) {
                _this.isCollapsed[g.id] = true;
            });
            _this.isCollapsed[_map_service__WEBPACK_IMPORTED_MODULE_1__["MapService"].UNCATEGORIZED] = true;
            return _this.data.getMarkers(_this.mapConfig.id);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (marks) {
            _this.markers = marks;
        }));
        Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["combineLatest"])(prefObs, allObs)
            .subscribe(function () {
            _this._shownGroups = _this.prefs.getMapPref(_this.mapConfig.id).hiddenGroups;
            _this._shownMarkers = _this.prefs.getMapPref(_this.mapConfig.id).hiddenMarkers;
            console.log("ALL DONE");
        });
    }
    LayersTabComponent.prototype.getMarkers = function (g) {
        return this.markers.filter(function (m) {
            if (m.markerGroup) {
                return m.markerGroup == g.id;
            }
            return false;
        });
    };
    LayersTabComponent.prototype.getUngroupedMarkers = function () {
        return this.markers.filter(function (m) {
            if (m.markerGroup) {
                return false;
            }
            return true;
        });
    };
    LayersTabComponent.prototype.ngOnInit = function () {
    };
    LayersTabComponent.prototype.name = function (item) {
        if (item.options && item.options.title) {
            return item.options.title;
        }
        if (item['__name']) {
            return item['__name'];
        }
        return '--unknown--';
    };
    LayersTabComponent.prototype.id = function (item) {
        if (item['__id']) {
            return item['__id'];
        }
        return this.name(item);
    };
    LayersTabComponent.prototype.isFeatureGroup = function (item) {
        console.log(item);
        return item.eachLayer;
    };
    LayersTabComponent.prototype.activate = function (event) {
        console.log(event);
        var me = event.node;
        if (me) {
            var item = me.data.data;
            if (item['__id']) {
                var m = new _map_service__WEBPACK_IMPORTED_MODULE_1__["MyMarker"](item);
                this.mapSvc.panTo(item['_latlng']);
            }
        }
    };
    LayersTabComponent.prototype.groupCheckChange = function ($event) {
        console.log($event);
        // this.shownGroups = $event
        if (this.prefs) {
            var mPrefs = this.prefs.getMapPref(this.mapConfig.id);
            mPrefs.hiddenGroups = $event;
            console.log("Hidden Groups");
            console.log(mPrefs.hiddenGroups);
            this.data.save(this.prefs);
        }
    };
    LayersTabComponent.prototype.markerCheckChange = function ($event) {
        console.log($event);
        if (this.prefs) {
            if (!this.prefs.maps) {
                this.prefs.maps = new Map();
            }
            var mPrefs = this.prefs.getMapPref(this.mapConfig.id);
            mPrefs.hiddenMarkers = $event;
            console.log("Hidden Markers");
            console.log(mPrefs.hiddenMarkers);
            this.data.save(this.prefs);
        }
    };
    LayersTabComponent.prototype.diff = function (all, some) {
        return all.filter(function (allItem) { return !some.includes(allItem); });
    };
    Object.defineProperty(LayersTabComponent.prototype, "shownGroups", {
        get: function () {
            return this._shownGroups;
        },
        set: function (v) {
            this._shownGroups = v;
            this.groupCheckChange(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayersTabComponent.prototype, "shownMarkers", {
        get: function () {
            return this._shownMarkers;
        },
        set: function (v) {
            this._shownMarkers = v;
            this.markerCheckChange(v);
        },
        enumerable: true,
        configurable: true
    });
    LayersTabComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-layers-tab',
            template: __webpack_require__(/*! ./layers-tab.component.html */ "./src/app/tabs/layers-tab/layers-tab.component.html"),
            styles: [__webpack_require__(/*! ./layers-tab.component.css */ "./src/app/tabs/layers-tab/layers-tab.component.css")]
        }),
        __metadata("design:paramtypes", [_map_service__WEBPACK_IMPORTED_MODULE_1__["MapService"], _data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"]])
    ], LayersTabComponent);
    return LayersTabComponent;
}());



/***/ }),

/***/ "./src/app/tabs/map-selector/map-selector.component.css":
/*!**************************************************************!*\
  !*** ./src/app/tabs/map-selector/map-selector.component.css ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".scroller {\r\n    overflow: auto\r\n}\r\n.map-item {\r\n    display: block;\r\n    cursor: pointer;\r\n    /* float: left; */\r\n}\r\n.map-title{\r\n    display: block;\r\n}"

/***/ }),

/***/ "./src/app/tabs/map-selector/map-selector.component.html":
/*!***************************************************************!*\
  !*** ./src/app/tabs/map-selector/map-selector.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\r\n  Map\r\n</div>\r\n<div class=\"white scroller\" *ngIf=\"merged\">\r\n  <div *ngFor=\"let mt of merged \">\r\n    <h4>{{mt.name}}</h4>\r\n    <div class=\"map-item\" *ngFor=\"let m of mt.maps\">\r\n      <ng-container>\r\n        <!-- <img src=\"./assets/missing.png\" height=\"100\"> -->\r\n        <img [src]='m.thumb' width=\"150\" (click)=\"select(m)\">\r\n        <span class=\"map-title\">{{m.name}}</span>\r\n      </ng-container>\r\n    </div>\r\n  </div>\r\n</div>"

/***/ }),

/***/ "./src/app/tabs/map-selector/map-selector.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/tabs/map-selector/map-selector.component.ts ***!
  \*************************************************************/
/*! exports provided: MapSelectorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapSelectorComponent", function() { return MapSelectorComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../data.service */ "./src/app/data.service.ts");
/* harmony import */ var _map_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../map.service */ "./src/app/map.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var MapSelectorComponent = /** @class */ (function () {
    function MapSelectorComponent(data, mapSvc) {
        var _this = this;
        this.data = data;
        this.mapSvc = mapSvc;
        this.data.mapTypesWithMaps.subscribe(function (items) {
            _this.merged = items;
        });
    }
    MapSelectorComponent.prototype.ngOnInit = function () {
    };
    MapSelectorComponent.prototype.select = function (map) {
        this.mapSvc.setConfig(map);
        this.data.saveRecentMap(map.id);
    };
    MapSelectorComponent.prototype.getUrl = function (map) {
        return this.data.url(map);
    };
    MapSelectorComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-map-selector',
            template: __webpack_require__(/*! ./map-selector.component.html */ "./src/app/tabs/map-selector/map-selector.component.html"),
            styles: [__webpack_require__(/*! ./map-selector.component.css */ "./src/app/tabs/map-selector/map-selector.component.css")]
        }),
        __metadata("design:paramtypes", [_data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"], _map_service__WEBPACK_IMPORTED_MODULE_2__["MapService"]])
    ], MapSelectorComponent);
    return MapSelectorComponent;
}());



/***/ }),

/***/ "./src/app/tabs/marker-side/marker-side.component.css":
/*!************************************************************!*\
  !*** ./src/app/tabs/marker-side/marker-side.component.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".editbtn {\r\n    position: absolute;\r\n    left: 40px;\r\n    top: 10px;\r\n    color: white;\r\n    cursor: pointer;\r\n}\r\n\r\n.checkbtn {\r\n    position: absolute;\r\n    left: 10px;\r\n    top: 10px;\r\n    color: white;\r\n    cursor: pointer;\r\n}\r\n\r\n.closebtn {\r\n    position: absolute;\r\n    left: 40px;\r\n    top: 10px;\r\n    color: white;\r\n    cursor: pointer;\r\n}\r\n\r\n.newbtn {\r\n    position: absolute;\r\n    left: 10px;\r\n    top: 10px;\r\n    color: white;\r\n    cursor: pointer;\r\n}\r\n\r\n.deletebtn {\r\n    position: absolute;\r\n    left: 70px;\r\n    top: 10px;\r\n    color: white;\r\n    cursor: pointer;\r\n}\r\n\r\n.unlockbtn {\r\n    position: absolute;\r\n    left: 100px;\r\n    top: 10px;\r\n    color: white;\r\n    cursor: pointer;\r\n}\r\n\r\n.lockbtn {\r\n    position: absolute;\r\n    left: 100px;\r\n    top: 10px;\r\n    color: red;\r\n    cursor: pointer;\r\n}\r\n\r\n.marker-container {\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    flex-direction: column;\r\n}\r\n\r\n.title {\r\n    text-align: center;\r\n    font-size: 14pt;\r\n    width: 100%;\r\n    display: block;\r\n    margin: 10px 10px, 0px, 10px;\r\n}\r\n\r\n.description {\r\n    text-align: center;\r\n    font-size: 10pt;\r\n    width: 100%;\r\n    display: block;\r\n}\r\n\r\n.type {\r\n    text-align: center;\r\n    font-size: 10pt;\r\n    width: 100%;\r\n    display: block;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.page {\r\n    margin-top: 10px;\r\n    text-align: center;\r\n    font-size: 10pt;\r\n    width: 100%;\r\n    display: block;\r\n}\r\n\r\n.coords {\r\n    margin-top: 10px;\r\n    text-align: center;\r\n    font-size: 10pt;\r\n    width: 100%;\r\n    display: block;\r\n    color: white;\r\n}\r\n\r\n.centered {\r\n    display: block;\r\n    margin: 0 auto ;\r\n}\r\n\r\n.edit-container {\r\n    position: absolute;\r\n    top: 70px;\r\n}\r\n\r\nlabel.small {\r\n    font-size: .8em;\r\n    margin-bottom: 4px;\r\n}\r\n\r\n.icon-flow {\r\n    padding: .2em;\r\n    width: 30px;\r\n    display: flex;\r\n}\r\n\r\n.icon-holder {\r\n    display: flex;\r\n    flex-direction: row;\r\n    flex-wrap: wrap;\r\n}\r\n\r\n.dh {\r\n    white-space: normal;\r\n    padding-left: 5px;\r\n}\r\n"

/***/ }),

/***/ "./src/app/tabs/marker-side/marker-side.component.html":
/*!*************************************************************!*\
  !*** ./src/app/tabs/marker-side/marker-side.component.html ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"white\">\r\n  <fa-icon icon=\"pencil-alt\" size=\"lg\" (click)=\"editstart()\" class=\"editbtn\" *ngIf=\"edit==false\"></fa-icon>\r\n  <fa-icon icon=\"check\" size=\"lg\" (click)=\"save()\" class=\"checkbtn\" *ngIf=\"edit==true\"></fa-icon>\r\n  <fa-icon icon=\"times\" size=\"lg\" (click)=\"cancel()\" class=\"closebtn\" *ngIf=\"edit==true\"></fa-icon>\r\n  <fa-icon icon=\"plus\" size=\"lg\" (click)=\"newMarker()\" class=\"newbtn\" *ngIf=\"edit==false\"></fa-icon>\r\n  <fa-icon icon=\"trash-alt\" size=\"lg\" (click)=\"delete()\" class=\"deletebtn\"></fa-icon>\r\n  <fa-icon *ngIf=\"restricted == true\" icon=\"lock\" size=\"lg\" (click)=\"permissions()\" class=\"lockbtn\"></fa-icon>\r\n  <fa-icon *ngIf=\"restricted == false\" icon=\"unlock\" size=\"lg\" (click)=\"permissions()\" class=\"unlockbtn\"></fa-icon>\r\n\r\n  <ng-container *ngIf=\"marker\">\r\n    <div class=\"marker-container\" *ngIf=\"edit==false\">\r\n      <img [src]=\"marker?.iconUrl\" class=\"centered  mt-4  iconselected\">\r\n      <span class=\"title\">{{marker?.name}}</span>\r\n      <span class=\"type\">{{name()}}</span>\r\n      <span class=\"description\">{{marker?.description}}</span>\r\n      <a href=\"{{marker?.pageUrl}}\">{{marker?.pageUrl}}</a>\r\n      <a href=\"#\" class=\"coords\" (click)=\"pan()\">{{marker?.marker._latlng.lat}}, {{marker?.marker._latlng.lng}}</a>\r\n      <button *ngIf=\"marker.mapLink \" type=\"button\" class=\"btn btn-outline-secondary admin-btn mt-2\" (click)=\"openLinkedMap()\">\r\n        <fa-icon icon=\"map\" fixedWidth=\"true\"></fa-icon> Open Linked Map</button>\r\n    </div>\r\n    <div *ngIf=\"edit==true\">\r\n      <img [src]=\"marker?.iconUrl\" class=\"centered mt-4 iconselected\">\r\n\r\n      <div class=\"form-group\">\r\n        <label for=\"name\" class=\"small\">Name</label>\r\n        <input type=\"text\" class=\"form-control form-control-sm\" id=\"name\" placeholder=\"Enter Marker Name\" [(ngModel)]=\"marker.name\">\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <label for=\"type\" class=\"small\">Type</label>\r\n        <app-marker-combo [(ngModel)]=\"marker.type\" [map]=\"map\"></app-marker-combo>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <label for=\"type\" class=\"small\">Group</label>\r\n        <app-marker-group-combo [(ngModel)]=\"marker.markerGroup\" [marker]=\"marker\"></app-marker-group-combo>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <label for=\"mapLink\" class=\"small\">Map Link</label>\r\n        <select class=\"form-control\" id=\"mapLink\" [(ngModel)]=\"marker.mapLink\">\r\n          <optgroup *ngFor=\"let mt of merged\" [label]=\"mt.name\">\r\n            <option *ngFor=\"let map of mt.maps\" [value]=\"map.id\">{{map.name}}</option>\r\n          </optgroup>\r\n        </select>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <label for=\"description\" class=\"small\">Description</label>\r\n        <textarea class=\"form-control form-control-sm\" rows=\"3\" id=\"description\" placeholder=\"Enter Description\" [(ngModel)]=\"marker.description\"></textarea>\r\n      </div>\r\n    </div>\r\n  </ng-container>\r\n</div>"

/***/ }),

/***/ "./src/app/tabs/marker-side/marker-side.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/tabs/marker-side/marker-side.component.ts ***!
  \***********************************************************/
/*! exports provided: MarkerSideComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MarkerSideComponent", function() { return MarkerSideComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _map_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../map.service */ "./src/app/map.service.ts");
/* harmony import */ var _dialogs_common_dialog_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../dialogs/common-dialog.service */ "./src/app/dialogs/common-dialog.service.ts");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../models */ "./src/app/models.ts");
/* harmony import */ var _dialogs_restrict_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../dialogs/restrict.service */ "./src/app/dialogs/restrict.service.ts");
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../data.service */ "./src/app/data.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var angular2_uuid__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! angular2-uuid */ "./node_modules/angular2-uuid/index.js");
/* harmony import */ var angular2_uuid__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(angular2_uuid__WEBPACK_IMPORTED_MODULE_7__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var MarkerSideComponent = /** @class */ (function () {
    function MarkerSideComponent(mapSvc, CDialog, restrict, data) {
        var _this = this;
        this.mapSvc = mapSvc;
        this.CDialog = CDialog;
        this.restrict = restrict;
        this.data = data;
        this.edit = false;
        this.categories = [];
        this.groups = [];
        this.ready = new Map();
        this.restricted = false;
        this.merged = [];
        this.data.mapTypesWithMaps.subscribe(function (items) {
            _this.merged = items;
        });
        // Handle Selections
        this.mapSvc.selection.subscribe(function (sel) {
            if (_this.marker != undefined) {
                _this.disable();
            }
            if (!sel.isEmpty()) {
                if (_map_service__WEBPACK_IMPORTED_MODULE_1__["MyMarker"].is(sel.first)) {
                    _this.restricted = _this.data.isRestricted(sel.first);
                    _this.marker = sel.first;
                    _this.edit = false;
                }
            }
        });
        // Get Data
        this.mapSvc.mapConfig
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["mergeMap"])(function (m) {
            _this.map = m;
            return _this.data.getMarkerGroups(m.id);
        }))
            .subscribe(function (v) {
            _this.groups = v;
        });
        this.mapSvc.catsLoaded.subscribe(function (v) {
            _this.categories = _this.mapSvc.categories;
        });
    }
    MarkerSideComponent.prototype.pan = function () {
        if (this.marker !== undefined) {
            this.mapSvc.panTo(this.marker.marker["_latlng"]);
        }
    };
    MarkerSideComponent.prototype.ngOnInit = function () {
    };
    MarkerSideComponent.prototype.newMarker = function () {
        var m = this.mapSvc.newTempMarker();
        this.mapSvc.addTempMarker(m);
        this.marker = m;
        this.restricted = false;
        this.editstart();
    };
    MarkerSideComponent.prototype.name = function () {
        var mk = this.mapSvc.getMarkerType(this.marker.type);
        if (mk) {
            return mk.name;
        }
        return 'Ugh....';
    };
    MarkerSideComponent.prototype.mapId = function () {
        return this.map.id;
    };
    MarkerSideComponent.prototype.iconImg = function () {
        if (this.marker !== undefined) {
            return this.marker.marker;
        }
    };
    MarkerSideComponent.prototype.editstart = function () {
        if (this.marker !== undefined) {
            this.edit = true;
            this.enable();
        }
    };
    MarkerSideComponent.prototype.cancel = function () {
        this.edit = false;
        this.disable();
    };
    MarkerSideComponent.prototype.save = function () {
        var _this = this;
        this.edit = false;
        this.disable();
        console.log('--------SAVING-------');
        console.log('Marker Group = ' + this.marker.markerGroup);
        // Determine if a new Marker group was used
        if (this.marker.markerGroup) {
            var type = this.groups.find(function (mg) { return mg.id == _this.marker.markerGroup; });
            console.log(type);
            if (type == undefined) {
                console.log('--------NOT FOUND-------');
                var newGroup = new _models__WEBPACK_IMPORTED_MODULE_3__["MarkerGroup"]();
                newGroup.id = angular2_uuid__WEBPACK_IMPORTED_MODULE_7__["UUID"].UUID().toString();
                newGroup.name = this.marker.markerGroup;
                newGroup.map = this.map.id;
                this.marker.markerGroup = newGroup.id;
                console.log(newGroup);
                this.data.save(newGroup);
            }
        }
        console.log(this.marker);
        this.mapSvc.saveMarker(this.marker);
        this.mapSvc.newMarkersLayer.clearLayers();
    };
    MarkerSideComponent.prototype.delete = function () {
        var _this = this;
        if (this.marker != undefined) {
            this.CDialog.confirm("Are you sure you want to delete this marker?", "Delete " + this.marker.name + "?").subscribe(function (result) {
                if (result) {
                    _this.mapSvc.deleteMarker(_this.marker);
                    _this.edit = false;
                    _this.marker = undefined;
                }
            });
        }
    };
    MarkerSideComponent.prototype.enable = function () {
        if (this.marker && this.marker.m.dragging) {
            this.marker.m.dragging.enable();
        }
        else {
        }
    };
    MarkerSideComponent.prototype.disable = function () {
        if (this.marker && this.marker.m.dragging) {
            this.marker.m.dragging.disable();
        }
    };
    MarkerSideComponent.prototype.setType = function (t) {
        this.marker.type = t.id;
        var icn = this.mapSvc.markerTypes.get(t.id);
        this.marker.marker.setIcon(icn);
    };
    MarkerSideComponent.prototype.openLinkedMap = function () {
        if (this.marker && this.marker.mapLink) {
            this.mapSvc.openMap(this.marker.mapLink);
        }
    };
    MarkerSideComponent.prototype.permissions = function () {
        var _this = this;
        if (this.marker) {
            this.restrict.openRestrict(this.marker.view, this.marker.edit).subscribe(function (_a) {
                var view = _a[0], edit = _a[1];
                if (_this.data.canEdit(_this.marker)) {
                    console.log("edit " + edit);
                    console.log("view " + view);
                    _this.marker.edit = edit;
                    _this.marker.view = view;
                    _this.mapSvc.saveMarker(_this.marker);
                }
            });
        }
    };
    MarkerSideComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-marker-side',
            template: __webpack_require__(/*! ./marker-side.component.html */ "./src/app/tabs/marker-side/marker-side.component.html"),
            styles: [__webpack_require__(/*! ./marker-side.component.css */ "./src/app/tabs/marker-side/marker-side.component.css")]
        }),
        __metadata("design:paramtypes", [_map_service__WEBPACK_IMPORTED_MODULE_1__["MapService"], _dialogs_common_dialog_service__WEBPACK_IMPORTED_MODULE_2__["CommonDialogService"], _dialogs_restrict_service__WEBPACK_IMPORTED_MODULE_4__["RestrictService"], _data_service__WEBPACK_IMPORTED_MODULE_5__["DataService"]])
    ], MarkerSideComponent);
    return MarkerSideComponent;
}());



/***/ }),

/***/ "./src/app/tabs/tabs.component.css":
/*!*****************************************!*\
  !*** ./src/app/tabs/tabs.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".close {\r\n    position: absolute;\r\n    right: 2px;\r\n    top: 2px;\r\n    color: lightgray;\r\n    cursor: pointer;\r\n    font-weight: 300;\r\n}\r\n.hide {\r\n    display: none;\r\n    transition: display 2s step-end\r\n}\r\n.user-tab {\r\n    top: 10px;\r\n}\r\n.map-tab {\r\n    top: 50px;\r\n}\r\n.marker-tab {\r\n    top: 90px;\r\n}\r\n.info-tab {\r\n    top: 130px;\r\n}\r\n.admin-tab {\r\n    top: 170px;\r\n}\r\n.visible {\r\n    display: block;\r\n}\r\n.side-nav {\r\n    background-color: rgba(0, 0, 0, .8);\r\n    display: block;\r\n    position: fixed;\r\n    right: -25%;\r\n    top: 0;\r\n    width: 25%;\r\n    height: 100%;\r\n    max-height: 100%;\r\n    z-index: 2;\r\n    padding: 10px;\r\n    box-sizing: border-box;\r\n}\r\n.side-container {\r\n    padding: 10px;\r\n    color: white\r\n}\r\n.sideshow {\r\n    right: 0;\r\n    transition: right .8s\r\n}\r\n.sideshow-hide {\r\n    transition: right .8s\r\n}\r\n.tab-icon {\r\n    position: absolute;\r\n    left: -30px;\r\n    z-index: 2;\r\n}\r\n.tab {\r\n    position: absolute;\r\n    left: -30px;\r\n    /* background-color: #605f5d; */\r\n    background-color: rgba(96, 96, 93, 1);\r\n    opacity: .8;\r\n    border-bottom-left-radius: 4px;\r\n    border-top-left-radius: 4px;\r\n    padding: 5px;\r\n    color: white;\r\n    cursor: pointer;\r\n}\r\n.tab-selected {\r\n    background-color: #9ed485;\r\n}\r\n"

/***/ }),

/***/ "./src/app/tabs/tabs.component.html":
/*!******************************************!*\
  !*** ./src/app/tabs/tabs.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"side-nav\" [class.sideshow]=\"expanded==true\" [class.sideshow-hide]=\"expanded==false\">\r\n  <div class=\"tab user-tab\" (click)=\"toggle('user')\" [class.tab-selected]=\"selected==='user'\">\r\n    <fa-icon icon=\"user\" fixedWidth=\"true\"></fa-icon>\r\n  </div>\r\n  <div class=\"tab map-tab\" (click)=\"toggle('map')\" [class.tab-selected]=\"selected==='map'\">\r\n      <fa-icon icon=\"map\" fixedWidth=\"true\"></fa-icon>\r\n    </div>\r\n  <div class=\"tab marker-tab\" (click)=\"toggle('marker')\" [class.tab-selected]=\"selected==='marker'\">\r\n    <fa-icon icon=\"map-marker-alt\" fixedWidth=\"true\"></fa-icon>\r\n  </div>\r\n  <div class=\"tab info-tab\" (click)=\"toggle('layers')\" [class.tab-selected]=\"selected==='layers'\">\r\n    <fa-icon icon=\"info\" [fixedWidth]=\"true\"></fa-icon>\r\n  </div>\r\n  <div class=\"tab admin-tab\" (click)=\"toggle('admin')\" [class.tab-selected]=\"selected==='admin'\">\r\n    <fa-icon icon=\"cog\" [fixedWidth]=\"true\"></fa-icon>\r\n  </div>\r\n  <!-- <fa-icon icon=\"times\" (click)=\"close()\" class=\"close\" [class.hide]=\"expanded==false\"></fa-icon> -->\r\n  <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"expanded=false\" [class.hide]=\"expanded==false\">\r\n      <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n  <app-user-side  class=\"side-container\"  [class.visible]=\"selected==='user'\" [class.hide]=\"selected!=='user'\"></app-user-side>\r\n  <app-marker-side  class=\"side-container\"  [class.visible]=\"selected==='marker'\"  [class.hide]=\"selected!=='marker'\"></app-marker-side>\r\n  <app-map-selector  class=\"side-container\" [class.visible]=\"selected==='map'\" [class.hide]=\"selected!=='map'\"></app-map-selector>\r\n  <app-admin  class=\"side-container\" [class.visible]=\"selected==='admin'\" [class.hide]=\"selected!=='admin'\"></app-admin>\r\n  <app-layers-tab    class=\"side-container\"  [class.visible]=\"selected==='layers'\" [class.hide]=\"selected!=='layers'\"></app-layers-tab>\r\n</div>"

/***/ }),

/***/ "./src/app/tabs/tabs.component.ts":
/*!****************************************!*\
  !*** ./src/app/tabs/tabs.component.ts ***!
  \****************************************/
/*! exports provided: TabsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TabsComponent", function() { return TabsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _map_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../map.service */ "./src/app/map.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var TabsComponent = /** @class */ (function () {
    function TabsComponent(zone, mapSvc) {
        var _this = this;
        this.zone = zone;
        this.mapSvc = mapSvc;
        this.expanded = false;
        this.selected = "";
        this.mapSvc.selection.subscribe(function (sel) {
            if (sel.isEmpty()) {
            }
            else {
                if (_map_service__WEBPACK_IMPORTED_MODULE_1__["MyMarker"].is(sel.first)) {
                    _this.expanded = true;
                    _this.selected = 'marker';
                }
            }
        });
    }
    TabsComponent.prototype.ngOnInit = function () {
    };
    TabsComponent.prototype.close = function () {
        this.selected = "";
        this.expanded = false;
    };
    TabsComponent.prototype.toggle = function (tab) {
        var _this = this;
        console.log("Toggle");
        if (this.selected === tab) {
            this.expanded = false;
            // this.selected = ""
            setTimeout(function () { _this.selected = ""; }, 800);
        }
        else {
            this.selected = tab;
            this.expanded = true;
        }
    };
    TabsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-tabs',
            template: __webpack_require__(/*! ./tabs.component.html */ "./src/app/tabs/tabs.component.html"),
            styles: [__webpack_require__(/*! ./tabs.component.css */ "./src/app/tabs/tabs.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"], _map_service__WEBPACK_IMPORTED_MODULE_1__["MapService"]])
    ], TabsComponent);
    return TabsComponent;
}());



/***/ }),

/***/ "./src/app/tabs/user-side/user-side.component.css":
/*!********************************************************!*\
  !*** ./src/app/tabs/user-side/user-side.component.css ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".user-tab {\r\n    top: 10px;\r\n}\r\n\r\nh2 {\r\n    font-weight: 300;\r\n}\r\n\r\n.user-photo {\r\n    height: 64px;\r\n    width: 64px;\r\n    border-radius: 50%;\r\n    border: 3px solid lightgray;\r\n    box-sizing: content-box\r\n}\r\n\r\n.logoutlink {\r\n    font-size: .8em;\r\n}\r\n\r\n.user-title {\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    flex-direction: column;\r\n}"

/***/ }),

/***/ "./src/app/tabs/user-side/user-side.component.html":
/*!*********************************************************!*\
  !*** ./src/app/tabs/user-side/user-side.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n<div *ngIf=\"isValid(); else showLogin\" class=\"side-container\">\r\n  <div class=\"user-title\">\r\n    <img [src]=\"user.photo\" class=\"user-photo user-item \">\r\n    <h2 class=\"user-name mb-0 pb-0 \">{{ user.name }}</h2>\r\n    <!-- <fa-icon icon=\"sign-out-alt\" size=\"2x\" (click)=\"logout()\" class=\"user-logout user-item \"></fa-icon> -->\r\n    <a href=\"#\" (click)=\"logout()\" class=\"logoutlink mt-0 pt-0\">Log Out</a>\r\n  </div>\r\n\r\n  <label class=\"mt-2 mb-0\" for=\"name\">My Groups</label>\r\n  <small class=\"form-text text-muted mb-2\">These are the groups you are in. Check any group that you want to be currently active.</small>\r\n\r\n  <div class=\"group-list\">\r\n    <div class=\"custom-control custom-checkbox\" *ngFor=\"let g of groups\">\r\n      <input type=\"checkbox\" class=\"custom-control-input\" id=\"{{g.name}}\" [(checklist)]=\"user.assumedGroups\" [checklistValue]=\"g.name\"\r\n        (checklistChange)=\"save()\">\r\n      <label class=\"custom-control-label\" for=\"{{g.name}}\">{{g.name}}</label>\r\n      <small *ngIf=\"g.description\" class=\"form-text text-muted\">{{g.description}}</small>\r\n    </div>\r\n  </div>\r\n</div>\r\n<ng-template #showLogin class=\"side-container\">\r\n  <p>Please login.</p>\r\n  <img src=\"./assets/signin_with_google.png\" (click)=\"loginGoogle()\">\r\n</ng-template>"

/***/ }),

/***/ "./src/app/tabs/user-side/user-side.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/tabs/user-side/user-side.component.ts ***!
  \*******************************************************/
/*! exports provided: UserSideComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserSideComponent", function() { return UserSideComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var angularfire2_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! angularfire2/auth */ "./node_modules/angularfire2/auth/index.js");
/* harmony import */ var firebase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase */ "./node_modules/firebase/dist/index.cjs.js");
/* harmony import */ var firebase__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(firebase__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../data.service */ "./src/app/data.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _map_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../map.service */ "./src/app/map.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var UserSideComponent = /** @class */ (function () {
    function UserSideComponent(afAuth, mapSvc, data) {
        var _this = this;
        this.afAuth = afAuth;
        this.mapSvc = mapSvc;
        this.data = data;
        this.groups = [];
        Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["combineLatest"])(this.data.user, this.data.groups).subscribe(function (_a) {
            var u = _a[0], g = _a[1];
            _this.user = u;
            var newGroups = [];
            g.forEach(function (grp) {
                if (grp.members.includes(u.uid)) {
                    newGroups.push(grp);
                }
            });
            _this.groups = newGroups;
        });
    }
    UserSideComponent.prototype.ngOnInit = function () {
    };
    UserSideComponent.prototype.loginGoogle = function () {
        this.afAuth.auth.signInWithPopup(new firebase__WEBPACK_IMPORTED_MODULE_2__["auth"].GoogleAuthProvider());
    };
    UserSideComponent.prototype.logout = function () {
        this.afAuth.auth.signOut();
    };
    UserSideComponent.prototype.isValid = function () {
        return this.user && this.user.uid != "NOBODY";
    };
    UserSideComponent.prototype.save = function () {
        this.data.saveUser(this.user);
    };
    UserSideComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-user-side',
            template: __webpack_require__(/*! ./user-side.component.html */ "./src/app/tabs/user-side/user-side.component.html"),
            styles: [__webpack_require__(/*! ./user-side.component.css */ "./src/app/tabs/user-side/user-side.component.css")]
        }),
        __metadata("design:paramtypes", [angularfire2_auth__WEBPACK_IMPORTED_MODULE_1__["AngularFireAuth"], _map_service__WEBPACK_IMPORTED_MODULE_5__["MapService"], _data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"]])
    ], UserSideComponent);
    return UserSideComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false,
    firebase: {
        apiKey: "AIzaSyDtGtQCZWLD5FPEsJvbUp-HKp3ZqPIEXFA",
        authDomain: "sfcmap.firebaseapp.com",
        databaseURL: "https://sfcmap.firebaseio.com",
        projectId: "sfcmap",
        storageBucket: "sfcmap.appspot.com",
        messagingSenderId: "273084079541"
    }
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\dev\projects\sfcmap\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map