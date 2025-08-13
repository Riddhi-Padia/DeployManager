import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-add',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule
  ],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddDeploymentComponent {
  // Deployment options checkboxes
  deploymentFields = [
    { label: "Deploy Webpay Lambda" ,name: 'DEPLOY_WEBPAY_LAMBDA', selected: false },
    { label: "Deploy Backend" ,name: 'DEPLOY_BACKEND', selected: false },
    { label: "Deploy Driver UI" ,name: 'DEPLOY_DRIVER_UI', selected: false },
    { label: "Deploy Admin UI" ,name: 'DEPLOY_ADMIN_UI', selected: false },
    { label: "Deploy Webpay UI" ,name: 'DEPLOY_WEBPAY_UI', selected: false },
    { label: "Update Resources" ,name: 'UPDATE_RESOURCES', selected: false },
    { label: "Deploy Database" ,name: 'DEPLOY_DB', selected: false },
    { label: "Deploy Layers" ,name: 'DEPLOY_LAYERS', selected: false },
  ];

  defaultDeploymentFields = [
    { name: 'DEPLOY_INFRA', selected: false },
    { name: 'DEPLOY_DB_STACK', selected: false },
    { name: 'AutomationScriptExec', selected: false },
    { name: 'UPGRADE_DB', selected: true },
    { name: 'SKIP_APPROVALS', selected: false },
    { name: 'ADMIN_CONFIGURATION', selected: false },
  ];

  // Lambda options and selections
  lambdaOptions = [
    'driver-authorizer',
    'ec2',
    'infra-tail-job',
    'admin-authorizer',
    'fleet-driver-authorizer',
    'da-authorizer',
    'emsp-admin',
    'emsp-data-aggregator',
    'admin',
    'rfid',
    'swagger-internal',
    'swagger-internal-driver',
    'swagger-internal-fleet',
    'cloudfront-invalidation',
    'api-tail-job',
    'global-svc',
    'ocpi/2.1.1',
    'ocpi/2.2',
    'ocpi/2.2.1',
    'ocpi/common',
    'drivers/3.1.0',
    'drivers/3.4.0',
    'drivers/common',
    'drivers/schedulers-queues',
  ];

  selectedLambdas: string[] = [];

  // Scripts options
  scriptsOptions = ['schema', 'function', 'data'];
  scripts: { [key: string]: boolean } = {
    schema: true,
    function: true,
    data: true,
  };

  //regions
  regions = [
    { name: 'US', selected: true },
    { name: 'IN', selected: false },
  ];
  selectedRegion = [];

  // Handle form submission
  submitForm() {
    const regions = [];
    this.regions.forEach(region => {
      if (region.selected) {
        regions.push(region.name);
      }
    });

    const formDataArray = [];

    // Add deployment fields
    this.deploymentFields.forEach(field => {
      formDataArray.push({
        name: field.name,
        value: field.selected ? 'yes' : 'no',
        type: 'PLAINTEXT'
      });
    });

    // Add default deployment fields
    this.defaultDeploymentFields.forEach(field => {
      formDataArray.push({
        name: field.name,
        value: field.selected ? 'yes' : 'no',
        type: 'PLAINTEXT'
      });
    });

    // Add automation version if provided
    formDataArray.push({
      name: 'AutomationVersion',
      value: '',
      type: 'PLAINTEXT'
    });

    // Add lambda selection
    const lambdaValue = this.selectedLambdas.length > 0 ? this.selectedLambdas.join(',') : 'all';
    formDataArray.push({
      name: 'LAMBDA_TO_DEPLOY',
      value: lambdaValue,
      type: 'PLAINTEXT'
    });

    // Add scripts if any are selected
    const selectedScripts = Object.keys(this.scripts).filter(script => this.scripts[script]);
    if (selectedScripts.length > 0) {
      formDataArray.push({
        name: 'SCRIPTS',
        value: selectedScripts.join(','),
        type: 'PLAINTEXT'
      });
    }

    // Convert to JSON string and log
    const jsonOutput = JSON.stringify(formDataArray, null, 2);
    console.log('Deployment Configuration JSON:', jsonOutput);
    console.log('Selected Region:', this.selectedRegion);
  }

  // Form validation helper
  isFormValid(): boolean {
    const hasSelectedDeploymentOption = this.deploymentFields.some(field => field.selected);
    return hasSelectedDeploymentOption;
  }

  // Preview configuration
  previewConfig() {
    const config = {
      deploymentOptions: this.deploymentFields.filter(f => f.selected).map(f => f.name),
      automationVersion: '',
      selectedLambdas: this.selectedLambdas,
      selectedScripts: Object.keys(this.scripts).filter(s => this.scripts[s])
    };

    console.log('Configuration Preview:', config);
    // You can show this in a dialog or separate component
    alert(`Configuration Preview:\n\nDeployment Options: ${config.deploymentOptions.join(', ')}\nAutomation Version: ${config.automationVersion}\nLambdas: ${config.selectedLambdas.join(', ')}\nScripts: ${config.selectedScripts.join(', ')}`);
  }

  // Reset form
  resetForm() {
    this.deploymentFields.forEach(field => field.selected = false);
    this.selectedLambdas = [];
    Object.keys(this.scripts).forEach(script => this.scripts[script] = false);
  }
}
