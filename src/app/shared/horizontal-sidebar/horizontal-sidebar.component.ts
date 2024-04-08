import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { RouteInfo } from "./horizontal-sidebar.metadata";
import { HorizontalSidebarService } from "./horizontal-sidebar.service";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { FeatherModule } from "angular-feather";
import { IDropdownOptions } from "src/app/component/dropdown/dropdown.interface";
import { ComponentsModule } from "src/app/component/component.module";
import { VerticalNavigationData } from "../horizontal-header/horizontal-navigation.data";

@Component({
  selector: "app-horizontal-sidebar",
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FeatherModule,
    RouterModule,
    ComponentsModule,
  ],
  templateUrl: "./horizontal-sidebar.component.html",
  styleUrls: ["./horizontal-sidebar.component.scss"],
})
export class HorizontalSidebarComponent {
  showMenu = "";
  showSubMenu = "";
  public sidebarnavItems: RouteInfo[] = [];
  path = "";
  navbar_bg = {
    "background-image": "url(../../../assets/images/background/navbar-bg.png)",
    "background-repeat": "no-repeat",
    "background-size": "contain",
    "background-position": "center",
  };
  //public pagesToSearch: ISelectOptions = [];
  public userName: string = "Vcastro";
  public profile: string = "Supervisor";
  public profiles: IDropdownOptions = [
    { id: "administracion", name: "Administracion" },
    { id: "agricola", name: "Agricola" },
  ];
  ngOnInit() {
    this.updateBackground();
    window.addEventListener("resize", this.updateBackground);
  }

  ngOnDestroy() {
    window.removeEventListener("resize", this.updateBackground);
  }

  updateBackground = () => {
    const sidebarNavUl = document.querySelector(
      ".sidebar-nav ul"
    ) as HTMLElement; // Type assertion

    if (window.innerWidth < 1024) {
      sidebarNavUl.style.backgroundImage = "none";
    } else {
      sidebarNavUl.style.backgroundImage =
        "url(../../../assets/images/background/navbar-bg.png)";
    }
  };
  public dropdownButtonClasses: string[] =
    VerticalNavigationData.dropdownButtonClasses;
  public userDropdownOptions: IDropdownOptions =
    VerticalNavigationData.userDropdownOptions;

  constructor(
    private menuServise: HorizontalSidebarService,
    private router: Router
  ) {
    this.menuServise.items.subscribe((menuItems) => {
      this.sidebarnavItems = menuItems;

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
}
