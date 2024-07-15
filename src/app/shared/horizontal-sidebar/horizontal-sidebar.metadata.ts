// Sidebar route metadata
export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  ddclass: string;
  extralink: boolean;
  objeto: string;
  submenu: RouteInfo[];
}
