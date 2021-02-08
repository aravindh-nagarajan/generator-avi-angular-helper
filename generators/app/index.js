'use strict';

const Generator = require('yeoman-generator');
const fs = require("fs");
const fsPromises = fs.promises;
const stringUtils = require('./string-utils.js');

const angularFolderPath = 'src/angular/modules';

module.exports = class extends Generator {
  /**
   * Prompts user for module name and component name
   */
  async getUserInput() {
    const prompts = [
      {
        type: 'input',
        name: 'moduleName',
        message: 'Please enter the module name? (in camelCase)',
        validate: async function(input) {
            if (!input) {
                return 'Sorry, Need module name to proceed.';
            }

            return true;
        },
      },
      {
        type: 'input',
        name: 'componentName',
        message: 'Please enter the Component name? (in camelCase)',
        validate: async function(input) {
            if (!input) {
                return 'Sorry, Need component name to proceed.';
            }

            return true;
        },
      }, {
        type: 'input',
        name: 'authorName',
        message: 'Please enter your name?',
        default: '',
      },
    ];

    this.config = await this.prompt(prompts);
  }

  /**
   * Sets template name variables.
   */
  setTemplateNameVariables() {
    this.log('Setting template name variables...');

    this.moduleTemplateName = 'module.template.ts';
    this.componentsIndexTemplateName = 'components-index.template.ts';
    this.componentsBulkIndexTemplateName = 'components-import-index.template.ts';
    this.componentTsTemplateName = 'component.template.ts';
    this.componentHtmlTemplateName = 'component.template.html';
    this.componentLessTemplateName = 'component.template.less';
    this.componentIndexTemplateName = 'component-index.template.ts';
  }

  /**
   * Sets module and component path variables.
   */
  setGlobalVariables() {
    this.log('Setting path variables...');

    const {
      moduleName,
      componentName,
    } = this.config;

    this.moduleNameInDashCase = stringUtils.camelToDashCase(moduleName);
    this.componentNameInDashCase = stringUtils.camelToDashCase(componentName);

    this.ngComponentName =
      `${stringUtils.capitalizeFirstLetter(componentName)}Component`;
    this.ngModuleName =
      `${stringUtils.capitalizeFirstLetter(moduleName)}Module`;

    this.moduleFolderPath = `${angularFolderPath}/${this.moduleNameInDashCase}`;
    this.moduleFilePath = `${this.moduleFolderPath}/${this.moduleNameInDashCase}.module.ts`;

    this.componentFolderPath = `${this.moduleFolderPath}/components/${this.componentNameInDashCase}`;
    this.componentTsFilePath = `${this.componentFolderPath}/${this.componentNameInDashCase}.component.ts`;
    this.componentLessFilePath = `${this.componentFolderPath}/${this.componentNameInDashCase}.component.less`;
    this.componentHtmlFilePath = `${this.componentFolderPath}/${this.componentNameInDashCase}.component.html`;
    this.componentIndexFilePath = `${this.componentFolderPath}/index.ts`;

    this.componentsImportIndexPath = `${this.moduleFolderPath}/components/index.ts`;
  }

  /**
   * Create files.
   */
  async create() {
    this.log('Creating files now... :)');

    this._createModuleFiles();
    this._createComponentFiles();
    this._importComponentToModule();
  }

  /**
   * Private helper method to import component into module.
   * If module exists, tries to add the import statement using Regex,
   * otherwise use template file to create one.
   * @private
   */
  async _importComponentToModule() {
    try {
      await fsPromises.stat(`${this.componentsImportIndexPath}`);

      let exportedComponentsContent = await fsPromises.readFile(`${this.componentsImportIndexPath}`);
      exportedComponentsContent = exportedComponentsContent.toString();

      exportedComponentsContent += `export * from './${this.componentNameInDashCase}';\n`;

      fsPromises.writeFile(`${this.componentsImportIndexPath}`, exportedComponentsContent)

    } catch(e) {
      this._createNewFile(
        this.componentsIndexTemplateName,
        this.componentsImportIndexPath,
        {
          componentName: this.componentNameInDashCase,
        }
      );
    }
  }

  /**
   * Private reusable method to create files from Templates.
   * @private
   */
  _createNewFile(templatePath, destinationPath, bindings = {}) {
    this.fs.copyTpl(
      this.templatePath(templatePath),
      this.destinationPath(destinationPath),
      bindings,
    );
  }

  /**
   * Creates module file.
   * @private
   */
  async _createModuleFiles() {
    try {
      await fsPromises.stat(this.moduleFolderPath);

      this.log(`Yay, we already have a module named ${this.moduleNameInDashCase}`);

      // if we have module, try to import new component here..
      try {
        this.log(`Trying to update ${this.moduleNameInDashCase}.module.ts`);

        await this._updateExistingModuleFile();
      } catch(e) {
        console.error(e);
      }
    }
    catch (e) {
      this.log('New module - creating module.ts file now');

      this._createNewModuleFile();

      this._createNewFile(this.componentsBulkIndexTemplateName, `${this.moduleFolderPath}/index.ts`);
    }
  }

  /**
   * Creates components (ts, less, html, index) files.
   * @private
   */
  _createComponentFiles() {
    const { moduleName, authorName } = this.config;

    this._createNewFile(
      this.componentTsTemplateName,
      `${this.componentTsFilePath}`,
      {
        moduleName,
        ngModuleName: this.ngModuleName,
        componentName: this.componentNameInDashCase,
        ngComponentName: this.ngComponentName,
        authorName,
      }
    );

    this._createNewFile(
      this.componentHtmlTemplateName,
      `${this.componentHtmlFilePath}`,
      {
       componentName: this.componentNameInDashCase,
      }
    );

    this._createNewFile(
      this.componentLessTemplateName,
      `${this.componentLessFilePath}`,
      {
       componentName: this.componentNameInDashCase,
      }
    );

    this._createNewFile(
      this.componentIndexTemplateName,
      `${this.componentIndexFilePath}`,
      {
       componentName: this.componentNameInDashCase,
      }
    );
  }

  /**
   * Create new module file.
   * @private
   */
  _createNewModuleFile() {
    const { moduleName, authorName } = this.config;

    this._createNewFile(
      this.moduleTemplateName,
      `${this.moduleFilePath}`,
      {
        moduleName,
        ngModuleName: this.ngModuleName,
        ngComponentName: this.ngComponentName,
        authorName,
      }
    );
  }

  /**
   * Updates existing module to import newly created component.
   * @private
   */
  async _updateExistingModuleFile() {
    const {
      config: {
        moduleName,
      },
      moduleFilePath,
      ngComponentName,
    } = this;

    let moduleFileContent = await fsPromises.readFile(`${moduleFilePath}`);

    moduleFileContent = moduleFileContent.toString();

    this.log(`Importing ${ngComponentName} to module: ${moduleName}`);

    // Import component
    if (/import \{\r\n([^;*]*)\} from \'\.\'/.test(moduleFileContent)) {

      moduleFileContent = moduleFileContent
        .replace(/import \{([^;*]*)\} from \'\.\'/,
            `import {$1\t${ngComponentName},\n} from '.'`);
    } else if (moduleFileContent.match(/import \{([^;*]*)\} from \'\.\'/)) {

      moduleFileContent = moduleFileContent
        .replace(/import \{\s([^;*]*)\s\} from \'\.\'/,
            `import {\r\n\t$1,\n\t${ngComponentName},\n} from '.'`);
    } else {
      this.log(`Unable to import component, returning now`);

      return;
    }


    const moduleComponentListVariableName = `${moduleName}Components`;

    this.log(`Adding ${ngComponentName} to module: ${moduleName} declarations`);

    // Add to declarations
    moduleFileContent = moduleFileContent
      .replace(new RegExp(`const ${moduleComponentListVariableName} = \\[\\r\\n([^;*]*)\\]`),
        `const ${moduleComponentListVariableName} = [\r\n$1\t${ngComponentName},\n]`);

    this.log(`Saving ${moduleFilePath}..`);

    fsPromises.writeFile(`${moduleFilePath}`, moduleFileContent);
  }
};
