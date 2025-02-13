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

import { ConfigurationService } from 'core-app/core/config/configuration.service';
import {
  input,
  State,
} from 'reactivestates';
import { Injectable } from '@angular/core';
import { UploadInProgress } from 'core-app/core/file-upload/op-file-upload.service';
import {
  IHalErrorBase,
  IHalMultipleError,
} from 'core-app/features/hal/resources/error-resource';
import { HttpErrorResponse } from '@angular/common/http';

export function removeSuccessFlashMessages() {
  jQuery('.flash.notice').remove();
}

export type NotificationType = 'success'|'error'|'warning'|'info'|'upload';
export const OPNotificationEvent = 'op:notifications:add';

export interface INotification {
  message:string;
  link?:{ text:string, target:Function };
  type:NotificationType;
  data?:any;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  // The current stack of notifications
  private stack = input<INotification[]>([]);

  constructor(readonly configurationService:ConfigurationService) {
    jQuery(window)
      .on(OPNotificationEvent,
        (event:JQuery.TriggeredEvent, notification:INotification) => {
          this.add(notification);
        });
  }

  /**
   * Get a read-only view of the current stack of notifications.
   */
  public get current():State<INotification[]> {
    return this.stack;
  }

  public add(notification:INotification, timeoutAfter = 5000):INotification {
    // Remove flash messages
    removeSuccessFlashMessages();

    this.stack.doModify((current) => {
      const nextValue = [notification].concat(current);
      _.remove(nextValue, (n, i) => i > 0 && (n.type === 'success' || n.type === 'error'));
      return nextValue;
    });

    // auto-hide if success
    if (notification.type === 'success' && this.configurationService.autoHidePopups()) {
      setTimeout(() => this.remove(notification), timeoutAfter);
    }

    return notification;
  }

  public addError(obj:HttpErrorResponse|INotification|string, additionalErrors:unknown[]|string = []):INotification {
    let message:INotification|string;
    let errors = [...additionalErrors];

    if (obj instanceof HttpErrorResponse && (obj.error as IHalMultipleError)?._embedded.errors) {
      errors = [
        ...additionalErrors,
        ...(obj.error as IHalMultipleError)._embedded.errors.map((el:IHalErrorBase) => el.message),
      ];
      message = obj.message;
    } else {
      message = obj as INotification|string;
    }

    const notification:INotification = this.createNotification(message, 'error');
    notification.data = errors;

    return this.add(notification);
  }

  public addWarning(message:INotification|string):INotification {
    return this.add(this.createNotification(message, 'warning'));
  }

  public addSuccess(message:INotification|string):INotification {
    return this.add(this.createNotification(message, 'success'));
  }

  public addNotice(message:INotification|string):INotification {
    return this.add(this.createNotification(message, 'info'));
  }

  public addAttachmentUpload(message:INotification|string, uploads:UploadInProgress[]):INotification {
    return this.add(this.createAttachmentUploadNotification(message, uploads));
  }

  public remove(notification:INotification):void {
    this.stack.doModify((current) => {
      _.remove(current, (n) => n === notification);
      return current;
    });
  }

  public clear():void {
    this.stack.putValue([]);
  }

  private createNotification(message:INotification|string, type:NotificationType):INotification {
    if (typeof message === 'string') {
      return { message, type };
    }
    message.type = type;

    return message;
  }

  private createAttachmentUploadNotification(message:INotification|string, uploads:UploadInProgress[]) {
    if (!uploads.length) {
      throw new Error('Cannot create an upload notification without uploads!');
    }

    const notification = this.createNotification(message, 'upload');
    notification.data = uploads;

    return notification;
  }
}
