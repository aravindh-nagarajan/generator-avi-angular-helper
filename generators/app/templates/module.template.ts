/**
 * Module containing <%= moduleName %> related components.
 * @module <%= ngModuleName %>Module
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
  <%= ngComponentName %>Component,
} from '.';

const <%= moduleName %>Components = [
  <%= ngComponentName %>Component,
];

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
export class <%= ngModuleName %>Module {}
