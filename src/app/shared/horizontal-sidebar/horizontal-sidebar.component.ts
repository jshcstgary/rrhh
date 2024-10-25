import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatMenuModule } from "@angular/material/menu";
import { Router, RouterModule } from "@angular/router";
import { NgbAccordionModule, NgbCarouselModule, NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { FeatherModule } from "angular-feather";
import { NgScrollbarModule } from "ngx-scrollbar";
import { ComponentsModule } from "src/app/component/component.module";
import { IDropdownOptions } from "src/app/component/dropdown/dropdown.interface";
import { VerticalNavigationData } from "../horizontal-header/horizontal-navigation.data";
import { RouteInfo } from "./horizontal-sidebar.metadata";
import { HorizontalSidebarService } from "./horizontal-sidebar.service";
// import { EventEmitter } from "stream";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatIconModule } from "@angular/material/icon";
import { LoginServices } from "src/app/auth/services/login.services";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { UtilService } from "src/app/services/util/util.service";
import { Permiso } from "../../types/permiso.type";
import { PageCodes } from "src/app/enums/codes.enum";
import { codigosPerfilReporte } from "src/environments/environment";

@Component({
	selector: "app-horizontal-sidebar",
	standalone: true,
	imports: [TranslateModule, CommonModule, FeatherModule, RouterModule, ComponentsModule, NgbDropdownModule, NgScrollbarModule, NgbAccordionModule, NgbCarouselModule, MatMenuModule, MatIconModule, ScrollingModule],
	templateUrl: "./horizontal-sidebar.component.html",
	styleUrls: ["./horizontal-sidebar.component.scss", "./component.scss"],
})
export class HorizontalSidebarComponent {
	showMenu = "";
	showSubMenu = "";
	public sidebarnavItems: RouteInfo[] = [];
	path = "";
	navbar_bg = {
		height: "100%",
	};

	public permisos: Permiso[] = JSON.parse(sessionStorage.getItem(LocalStorageKeys.Permisos)) || [];
	//public pagesToSearch: ISelectOptions = [];
	public userName: string = "User: " + sessionStorage.getItem(LocalStorageKeys.IdLogin) + " - Perfil: " + sessionStorage.getItem(LocalStorageKeys.Perfil);
	public profile: string = "Supervisor";
	public profiles: IDropdownOptions = [
		{
			id: "administracion",
			name: "Administracion",
		},
		{
			id: "agricola",
			name: "Agricola",
		},
	];
	public showNotifications = false;

	notifications: any[] = [
		{
			btn: "btn-danger",
			icon: "info",
			title: "Luanch Admin",
			subject: "Just see the my new admin!",
			time: "9:30 AM",
		},
		{
			btn: "btn-success",
			icon: "ti-calendar",
			title: "Event today",
			subject: "Just a reminder that you have event",
			time: "9:10 AM",
		},
		{
			btn: "btn-info",
			icon: "ti-settings",
			title: "Settings",
			subject: "You can customize this template as you want",
			time: "9:08 AM",
		},
		{
			btn: "btn-primary",
			icon: "ti-user",
			title: "Pavan kumar",
			subject: "Just see the my admin!",
			time: "9:00 AM",
		},
		{
			btn: "btn-primary",
			icon: "ti-user",
			title: "Pavan kumar",
			subject: "Just see the my admin!",
			time: "9:00 AM",
		},
		{
			btn: "btn-primary",
			icon: "ti-user",
			title: "Pavan kumar",
			subject: "Just see the my admin!",
			time: "9:00 AM",
		},
		{
			btn: "btn-primary",
			icon: "ti-user",
			title: "Pavan kumar",
			subject: "Just see the my admin!",
			time: "9:00 AM",
		},
		{
			btn: "btn-primary",
			icon: "ti-user",
			title: "Pavan kumar",
			subject: "Just see the my admin!",
			time: "9:00 AM",
		},
		{
			btn: "btn-primary",
			icon: "ti-user",
			title: "Pavan kumar",
			subject: "Just see the my admin!",
			time: "9:00 AM",
		},
		{
			btn: "btn-primary",
			icon: "ti-user",
			title: "Pavan kumar",
			subject: "Just see the my admin!",
			time: "9:00 AM",
		},
	];

	ngOnInit() {
		this.updateBackground();
		window.addEventListener("resize", this.updateBackground);
	}

	ngOnDestroy() {
		window.removeEventListener("resize", this.updateBackground);
	}

	updateBackground = () => {
		const sidebarNavUl = document.querySelector(".sidebar-nav ul") as HTMLElement; // Type assertion

		if (window.innerWidth < 1024) {
			sidebarNavUl.style.backgroundImage = "none";
		} else {
			// sidebarNavUl.style.backgroundImage = "url(../../../assets/images/background/navbar-bg.png)";
			sidebarNavUl.style.backgroundColor = "#262863";
		}
	};
	// public dropdownButtonClasses: string[] = VerticalNavigationData.dropdownButtonClasses;
	public dropdownButtonClasses: string[] = ["text-light"];
	public userDropdownOptions: IDropdownOptions = VerticalNavigationData.userDropdownOptions;

	constructor(private menuServise: HorizontalSidebarService, private router: Router, private loginService: LoginServices, private utilService: UtilService) {
		this.menuServise.items.subscribe((menuItems) => {
			this.sidebarnavItems = menuItems.filter((menuItem) => this.permisos.some((permiso) => menuItem.codigo === permiso.codigo));

			this.sidebarnavItems = this.sidebarnavItems.map((menuItem) => {
				menuItem.submenu = menuItem.submenu.filter((sub) => this.permisos.some((permiso) => sub.codigo === permiso.codigo));

				if (menuItem.codigo === PageCodes.Solicitudes) {
					menuItem.submenu = menuItem.submenu.map((sub) => (sub.path.includes("reportes") ? (codigosPerfilReporte.includes(sessionStorage.getItem(LocalStorageKeys.CodigoPefil)) ? sub : null) : sub)).filter((sub) => sub !== null);
				}

				return menuItem;
			});

			// Active menu
			this.sidebarnavItems.filter((m) =>
				m.submenu.filter((s) => {
					if (s.path === this.router.url) {
						this.path = m.title;
					}
				})
			);
			this.addExpandClass(this.path);
		});
	}

	addExpandClass(element: any) {
		if (element === this.showMenu) {
			this.showMenu = element;
		} else {
			this.showMenu = element;
		}
	}

	addActiveClass(element: any) {
		if (element === this.showSubMenu) {
			this.showSubMenu = element;
		} else {
			this.showSubMenu = element;
		}
		window.scroll({
			top: 0,
			left: 0,
			behavior: "smooth",
		});
	}

	public signOut() {
		this.utilService.openLoadingSpinner("Cargando petición...");

		this.loginService.signOut().subscribe({
			next: () => {
				this.router.navigate(["/login"]);
			},
		});

		this.utilService.closeLoadingSpinner();
	}
}
