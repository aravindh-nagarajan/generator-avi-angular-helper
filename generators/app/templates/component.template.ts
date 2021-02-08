/**
 * @module <%= ngModuleName %>
 */

/***************************************************************************
 * ------------------------------------------------------------------------
 * Copyright 2020 VMware, Inc.  All rights reserved. VMware Confidential
 * ------------------------------------------------------------------------
 */

import { Component } from '@angular/core';

import './<%= componentName %>.component.less';

/**
 * @description
 *
 * @author <%= authorName %>
 */
@Component({
    selector: '<%= componentName %>',
    templateUrl: './<%= componentName %>.component.html',
})
export class <%= ngComponentName %> {}
