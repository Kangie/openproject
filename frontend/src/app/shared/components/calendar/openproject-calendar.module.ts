// -- copyright
// OpenProject is an open source project management software.
// Copyright (C) 2012-2021 the OpenProject GmbH
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See COPYRIGHT and LICENSE files for more details.
//++

import { OPSharedModule } from 'core-app/shared/shared.module';
import { NgModule } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { WorkPackagesCalendarEntryComponent } from 'core-app/shared/components/calendar/wp-calendar-entry/wp-calendar-entry.component';
import { WorkPackagesCalendarController } from 'core-app/shared/components/calendar/wp-calendar/wp-calendar.component';
import { OpenprojectWorkPackagesModule } from 'core-app/features/work-packages/openproject-work-packages.module';
import { Ng2StateDeclaration, UIRouterModule } from '@uirouter/angular';
import { TimeEntryCalendarComponent } from 'core-app/shared/components/calendar/te-calendar/te-calendar.component';
import { OpenprojectFieldsModule } from 'core-app/shared/components/fields/openproject-fields.module';
import { OpenprojectTimeEntriesModule } from 'core-app/shared/components/time_entries/openproject-time-entries.module';

const menuItemClass = 'calendar-menu-item';

export const CALENDAR_ROUTES:Ng2StateDeclaration[] = [
  {
    name: 'work-packages.calendar',
    url: '/calendar',
    component: WorkPackagesCalendarEntryComponent,
    reloadOnSearch: false,
    data: {
      bodyClasses: 'router--work-packages-calendar',
      menuItem: menuItemClass,
      parent: 'work-packages',
    },
  },
];

@NgModule({
  imports: [
    // Commons
    OPSharedModule,

    // Routes for /work_packages/calendar
    UIRouterModule.forChild({ states: CALENDAR_ROUTES }),

    // Work Package module
    OpenprojectWorkPackagesModule,

    // Time entry module
    OpenprojectTimeEntriesModule,

    // Editable fields e.g. for modals
    OpenprojectFieldsModule,

    // Calendar component
    FullCalendarModule,
  ],
  declarations: [
    // Work package calendars
    WorkPackagesCalendarEntryComponent,
    WorkPackagesCalendarController,
    TimeEntryCalendarComponent,
  ],
  exports: [
    WorkPackagesCalendarController,
    TimeEntryCalendarComponent,
  ],
})
export class OpenprojectCalendarModule {
}
