/**
 * Module containing <%= moduleName %> related components.
 * @module <%= ngModuleName %>
 * @preferred
 */

/***************************************************************************
 * ------------------------------------------------------------------------
 * Copyright 2020 VMware, Inc.  All rights reserved. VMware Confidential
 * ------------------------------------------------------------------------
 */
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  <%= ngComponentName %>,
} from '.';

const <%= moduleName %>Components = [
  <%= ngComponentName %>,
];

/**
 * @description
 *
 * @author <%= authorName %>
 */
@NgModule({
  declarations: [
    ...<%= moduleName %>Components,
  ],
  imports: [
      CommonModule,
      FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class <%= ngModuleName %> {}
