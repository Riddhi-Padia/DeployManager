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
import { Router } from '@angular/router';

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
  constructor(private router: Router){}

  // Deployment options checkboxes
  deploymentFields = [
    { label: "Backend", name: 'DEPLOY_BACKEND', selected: false },
    { label: "Driver UI", name: 'DEPLOY_DRIVER_UI', selected: false },
    { label: "Admin UI", name: 'DEPLOY_ADMIN_UI', selected: false },
    { label: "Webpay", name: 'DEPLOY_WEBPAY', selected: false },
    { label: "Database", name: 'DEPLOY_DB', selected: false },
    { label: "Layers", name: 'DEPLOY_LAYERS', selected: false },
    { label: "Update Resources", name: 'UPDATE_RESOURCES', selected: false },
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
    { name: 'UK', selected: true },
    { name: 'IC', selected: false },
  ];
  selectedRegion: string = '';

  KeyId: string = '';
  SecretKey: string = '';
  SessionToken: string = '';
  profileName: string = 'dev-root';

  // Form state
  hideSecretKey: boolean = true;

  get isBackendSelected(): boolean {
    return !!this.deploymentFields.find(f => f.label === 'Backend' && f.selected);
  }

  get isDatabaseSelected(): boolean {
    return !!this.deploymentFields.find(f => f.label === 'Database' && f.selected);
  }

  backbtn() {
    this.router.navigate(['/deploy-list']);
  }

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
      if (field.name == 'DEPLOY_WEBPAY') {
        formDataArray.push({
          name: field.name + '_UI',
          value: field.selected ? 'yes' : 'no',
          type: 'PLAINTEXT'
        });
        formDataArray.push({
          name: field.name + '_LAMBDA',
          value: field.selected ? 'yes' : 'no',
          type: 'PLAINTEXT'
        });
      }
      else {
        formDataArray.push({
          name: field.name,
          value: field.selected ? 'yes' : 'no',
          type: 'PLAINTEXT'
        });
      }
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
    const lambdaValue = this.selectedLambdas.length <= 0 ? '' : this.selectedLambdas.join(',');
    formDataArray.push({
      name: 'LAMBDA_TO_DEPLOY',
      value: this.deploymentFields.find(f => f.label === "Backend" && f.selected)? lambdaValue : "",
      type: 'PLAINTEXT'
    });

    // Add scripts if any are selected
    const selectedScripts = Object.keys(this.scripts).filter(script => this.scripts[script]);
    if (selectedScripts.length > 0) {
      formDataArray.push({
        name: 'SCRIPTS',
        value: this.deploymentFields.find(f => f.label === "Database" && f.selected)? selectedScripts.join(','): "",
        type: 'PLAINTEXT'
      });
    }

    this.selectedRegion = this.regions.filter(region => region.selected).map(region => region.name).join(',') || '';

    // Convert to JSON string and log
    const jsonOutput = JSON.stringify(formDataArray, null, 2);
    console.log('Deployment Configuration JSON:', jsonOutput);
    console.log('Selected Region:', this.selectedRegion);
  }

  // Form validation helper
  isFormValid(): boolean {
    const hasSelectedDeploymentOption = this.deploymentFields.some(field => field.selected);
    const hasCredentials = !!this.KeyId && !!this.SecretKey && !!this.SessionToken;
    return hasSelectedDeploymentOption && hasCredentials;
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
}
