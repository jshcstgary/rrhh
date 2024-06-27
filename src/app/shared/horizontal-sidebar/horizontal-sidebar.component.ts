import { Component, Output } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { RouteInfo } from "./horizontal-sidebar.metadata";
import { HorizontalSidebarService } from "./horizontal-sidebar.service";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { FeatherModule } from "angular-feather";
import { IDropdownOptions } from "src/app/component/dropdown/dropdown.interface";
import { ComponentsModule } from "src/app/component/component.module";
import { VerticalNavigationData } from "../horizontal-header/horizontal-navigation.data";
import { MatMenuModule } from "@angular/material/menu";
import {
  NgbAccordionModule,
  NgbCarouselModule,
  NgbDropdownModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgScrollbarModule } from "ngx-scrollbar";
// import { EventEmitter } from "stream";
import { MatIconModule } from "@angular/material/icon";
import { ScrollingModule } from "@angular/cdk/scrolling";

@Component({
  selector: "app-horizontal-sidebar",
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FeatherModule,
    RouterModule,
    ComponentsModule,
    NgbDropdownModule,
    NgScrollbarModule,
    NgbAccordionModule,
    NgbCarouselModule,
    MatMenuModule,
    MatIconModule,
    ScrollingModule,
  ],
  templateUrl: "./horizontal-sidebar.component.html",
  styleUrls: ["./horizontal-sidebar.component.scss", "./component.scss"],
})
export class HorizontalSidebarComponent {
  showMenu = "";
  showSubMenu = "";
  public sidebarnavItems: RouteInfo[] = [];
  path = "";
  navbar_bg = {
    "background-image": "url(../../../assets/images/background/navbar-bg.png)",
    "background-repeat": "no-repeat",
    "background-size": "cover",
    "background-position": "center"
  };
  //public pagesToSearch: ISelectOptions = [];
  public userName: string = "Vcastro";
  public profile: string = "Supervisor";
  public profiles: IDropdownOptions = [
    { id: "administracion", name: "Administracion" },
    { id: "agricola", name: "Agricola" },
  ];
  public showNotifications = false;
  // @Output() toggleSidebar = new EventEmitter<void>();
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
  public userDropdownOptions: IDropdownOptions = VerticalNavigationData.userDropdownOptions;

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

  // signOut(): string {
  //   localStorage.removeItem("idUsuario");

  //   this.router.navigate(["/login"]);

  //   return "";
  // }

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
