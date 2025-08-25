import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DeployService } from '../../services/deploy.service';
import { DeploymentPipeline } from '../../models/DeploymentPipeline';

interface TableColumn {
  columnDef: string;
  header: string;
}

@Component({
  selector: 'app-deploy-list',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule, MatFormFieldModule,
    MatChipsModule,
    MatTableModule, MatInputModule,
    MatCheckboxModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './deploy-list.component.html',
  styleUrls: ['./deploy-list.component.css']
})
export class DeployListComponent implements OnInit {
  UKtabledDataSource = new MatTableDataSource<DeploymentPipeline>([]);
  IStabledDataSource = new MatTableDataSource<DeploymentPipeline>([]);
  displayedColumns: string[] = [
    'executionId',
    'status',
    'sourceAction',
    'trigger',
    'started',
    'duration',
    'completed'
  ];

  isLoading = false;

  columns: TableColumn[] = [
    { columnDef: 'executionId', header: 'Execution ID' },
    { columnDef: 'status', header: 'Status' },
    { columnDef: 'sourceAction', header: 'Source Revisions' },
    { columnDef: 'trigger', header: 'Trigger' },
    { columnDef: 'started', header: 'Started' },
    { columnDef: 'duration', header: 'Duration' },
    { columnDef: 'completed', header: 'Completed' }
  ];

  constructor(private router: Router, private deployService: DeployService) { }

  ngOnInit(): void {
    this.loadDeployments();
  }

  // Load deployment data (simulated)
  loadDeployments(): void {
    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      //api call to fetch data
      const accesskey = this.deployService.getAccessKey();
      const secretkey = this.deployService.getSecretKey();
      const sessionToken = this.deployService.getSessionToken();
      const pipelineUK = this.deployService.getPipelineName('UK');
      const pipelineIS = this.deployService.getPipelineName('IS');
      const JsonUK = {
        access_key_id: accesskey,
        secret_access_key: secretkey,
        region: "eu-west-2",
        session_token: sessionToken,
        pipeline_name: pipelineUK
      };
      const JsonIS = {
        access_key_id: accesskey,
        secret_access_key: secretkey,
        region: "eu-west-1",
        session_token: sessionToken,
        pipeline_name: pipelineIS
      };
      this.deployService.getDeployments(JsonUK).subscribe({
        next: (data: DeploymentPipeline[]) => {
          this.UKtabledDataSource.data = data;
        }
      });
      this.deployService.getDeployments(JsonIS).subscribe({
        next: (data: DeploymentPipeline[]) => {
          this.IStabledDataSource.data = data;
        }
      });
      this.isLoading = false;
    }, 5000);
  }

  // Add new deployment
  addDeployment(): void {
    console.log('Adding new deployment...');
    this.router.navigate(['/add-deploy']);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.UKtabledDataSource.filter = filterValue.trim().toLowerCase();
    this.IStabledDataSource.filter = filterValue.trim().toLowerCase();
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'InProgress': 'status-in-progress',
      'Succeeded': 'status-success',
      'Failed': 'status-failed',
      'Cancelled': 'status-stopped',
      'Stopped': 'status-stopped',
      'Stopping': 'status-stopped',
      'Superseded': 'status-pending'
    };
    return statusMap[status] || 'status-default';
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'InProgress': 'refresh',
      'Succeeded': 'check_circle',
      'Failed': 'error',
      'Cancelled': 'cancel',
      'Stopped': 'cancel',
      'Stopping': 'cancel',
      'Superseded': 'schedule'
    };
    return iconMap[status] || 'help';
  }

  showDetails(executionID: string): void {
    //call API to get details for the execution ID
    console.log(`Showing details for execution ID: ${executionID}`);
  }
}
