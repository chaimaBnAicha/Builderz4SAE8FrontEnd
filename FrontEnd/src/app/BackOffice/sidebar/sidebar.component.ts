import { Component, OnInit } from '@angular/core';

declare const $: any;

interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  group?: string;
}

type MenuGroups = {
  [key: string]: string;
};

export const ROUTES: RouteInfo[] = [
  // Main Group
  {
    path: 'dashboard',
    title: 'Dashboard',
    icon: 'pe-7s-graph',
    class: '',
    group: 'main'
  },
  
  // Management Group
  {
    path: 'user',
    title: 'User Management', 
    icon: 'pe-7s-user',
    class: '',
    group: 'management'
  },
  {
    path: 'table',
    title: 'Project Management',
    icon: 'pe-7s-portfolio',
    class: '',
    group: 'management'
  },
  {
    path: 'typography',
    title: 'Task Management',
    icon: 'pe-7s-note',
    class: '',
    group: 'management'
  },
  
  // Resources Group
  {
    path: 'icons',
    title: 'Stock Management',
    icon: 'pe-7s-box2',
    class: '',
    group: 'resources'
  },
  {
    path: 'icons',
    title: 'Leave Management',
    icon: 'pe-7s-date',
    class: '',
    group: 'resources'
  },
  
  // Finance Group
  {
    path: 'icons',
    title: 'Advance Management',
    icon: 'pe-7s-cash',
    class: '',
    group: 'finance'
  },
  {
    path: 'icons',
    title: 'Insurance Management',
    icon: 'pe-7s-shield',
    class: '',
    group: 'finance'
  },
  {
    path: 'icons',
    title: 'Claims Management',
    icon: 'pe-7s-file',
    class: '',
    group: 'finance'
  }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: { [key: string]: RouteInfo[] } = {};
  menuGroups: MenuGroups = {
    main: 'Main',
    management: 'Management',
    resources: 'Resources',
    finance: 'Finance'
  };

  constructor() {}

  ngOnInit() {
    // Organize items by group
    this.menuItems = ROUTES.reduce((groups: { [key: string]: RouteInfo[] }, item) => {
      const group = item.group || 'other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {});
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}