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
import { DeployService } from '../../services/deploy.service';

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
  constructor(private router: Router, private deployService : DeployService){}

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
    { label:'UK',  name: 'eu-west-2', selected: false },
    { label: 'IS', name: 'eu-west-1', selected: false },
  ];
  selectedRegions: string[] = [];

  KeyId: string = '';
  SecretKey: string = '';
  SessionToken: string = '';
  profileNameUK: string = 'emspuk-infra-dynamic-pipeline';
  profileNameIS: string = 'emspis-infra-dynamic-pipeline';

  // Form state
  hideAccessKey: boolean = true;
  hideSecretKey: boolean = true;
  hideSessionToken: boolean = true;

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
  // Get selected regions
  const selectedRegions = this.regions.filter(r => r.selected);

  // Prepare environment variables (same for both calls)
  const environmentVariables: { name: string; value: string }[] = [];

  // Add deployment fields
  this.deploymentFields.forEach(field => {
    if (field.name === 'DEPLOY_WEBPAY') {
      environmentVariables.push({
        name: field.name + '_UI',
        value: field.selected ? 'yes' : 'no',
      });
      environmentVariables.push({
        name: field.name + '_LAMBDA',
        value: field.selected ? 'yes' : 'no',
      });
    } else {
      environmentVariables.push({
        name: field.name,
        value: field.selected ? 'yes' : 'no',
      });
    }
  });

  // Add default deployment fields
  this.defaultDeploymentFields.forEach(field => {
    environmentVariables.push({
      name: field.name,
      value: field.selected ? 'yes' : 'no',
    });
  });

  // Add automation version if provided
  environmentVariables.push({
    name: 'AutomationVersion',
    value: '',
  });

  // Add lambda selection
  const lambdaValue =
    this.selectedLambdas.length <= 0 ? '' : this.selectedLambdas.join(', ');
  environmentVariables.push({
    name: 'LAMBDA_TO_DEPLOY',
    value: this.deploymentFields.find(f => f.label === 'Backend' && f.selected)
      ? lambdaValue
      : '',
  });

  // Add scripts if any are selected
  const selectedScripts = Object.keys(this.scripts).filter(
    script => this.scripts[script]
  );
  if (selectedScripts.length > 0) {
    environmentVariables.push({
      name: 'SCRIPTS',
      value: this.deploymentFields.find(f => f.label === 'Database' && f.selected)
        ? selectedScripts.join(',')
        : '',
    });
  }

  // Helper to call API for a region/profile
  const callDeployment = (region: string, projectName: string) => {
    const finalJson = {
      access_key_id: this.KeyId,
      secret_access_key: this.SecretKey,
      region,
      session_token: this.SessionToken,
      project_name: projectName,
      environment_variables: environmentVariables,
    };

    console.log('Final JSON:', JSON.stringify(finalJson, null, 2));

    this.deployService.addDeployment(finalJson).subscribe({
      next: (response: any) => {
        console.log(`Deployment started successfully for ${projectName}:`, response);
        // Navigate only after both calls if both selected
        if (selectedRegions.length === 1 || region === selectedRegions[selectedRegions.length - 1].name) {
          this.router.navigate(['/deploy-list']);
        }
      },
      error: (error: { message: string }) => {
        console.error(`Error starting deployment for ${projectName}:`, error);
        alert('Error starting deployment: ' + error.message);
      }
    });
    localStorage.setItem('AccessKey', this.KeyId);
    localStorage.setItem('SecretKey', this.SecretKey);
    localStorage.setItem('SessionToken', this.SessionToken);
  };

  // Call API based on selected regions
  selectedRegions.forEach(regionObj => {
    if (regionObj.label === 'UK') {
      callDeployment('eu-west-2', this.profileNameUK);
    }
    if (regionObj.label === 'IS') {
      callDeployment('eu-west-1', this.profileNameIS);
    }
  });
}

  // Form validation helper
  isFormValid(): boolean {
    const hasSelectedDeploymentOption = this.deploymentFields.some(field => field.selected);
    const hasCredentials = !!this.KeyId && !!this.SecretKey;
    // const hasCredentials = !!this.KeyId && !!this.SecretKey && !!this.SessionToken;
    const backendCredentials = this.isBackendSelected ? this.selectedLambdas.length > 0 : true;
    const regionSelected = this.regions.some(region => region.selected);
    return hasSelectedDeploymentOption && hasCredentials && backendCredentials && regionSelected;
  }
}
