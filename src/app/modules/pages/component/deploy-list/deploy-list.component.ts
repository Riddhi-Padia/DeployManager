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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface DeploymentPipeline {
  executionID: string;
  status: 'In progress' | 'Success' | 'Failed' | 'Cancelled' | 'Pending';
  sourceRevisions: string;
  trigger: string;
  started: string;
  Duration: string;
  Completed: string;
}

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
    MatIconModule, MatFormFieldModule, MatPaginatorModule,
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
  UKdataSource: DeploymentPipeline[] = [];
  ISdataSource: DeploymentPipeline[] = [];
  UKtabledDataSource = new MatTableDataSource<DeploymentPipeline>([]);
  IStabledDataSource = new MatTableDataSource<DeploymentPipeline>([]);
  displayedColumns: string[] = [
    'executionID',
    'status',
    'sourceRevisions',
    'trigger',
    'started',
    'Duration',
    'Completed'
  ];
  isLoading = false;

  columns: TableColumn[] = [
    { columnDef: 'id', header: 'Execution ID' },
    { columnDef: 'status', header: 'Status' },
    { columnDef: 'sourceRevisions', header: 'Source Revisions' },
    { columnDef: 'trigger', header: 'Trigger' },
    { columnDef: 'started', header: 'Started' },
    { columnDef: 'duration', header: 'Duration' },
    { columnDef: 'completed', header: 'Completed' }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadDeployments();
  }

  // Load deployment data (simulated)
  loadDeployments(): void {
    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      //api call to fetch data
      this.UKdataSource = [
        {
          executionID: 'UK-001',
          status: 'Success',
          sourceRevisions: 'v2.1.0',
          trigger: 'Manual',
          started: 'Just now',
          Duration: '2m 10s',
          Completed: 'Just now'
        },
        {
          executionID: 'IS-002',
          status: 'Success',
          sourceRevisions: 'v2.1.0',
          trigger: 'Manual',
          started: 'Just now',
          Duration: '2m 12s',
          Completed: 'Just now'
        },
        {
          executionID: 'UK-003',
          status: 'Failed',
          sourceRevisions: 'main@a4b8c9d',
          trigger: 'Schedule',
          started: '1 day ago',
          Duration: '1m 45s',
          Completed: '1 day ago'
        },
        {
          executionID: 'IS-004',
          status: 'Cancelled',
          sourceRevisions: 'release/v1.5.2',
          trigger: 'Manual',
          started: '3 hours ago',
          Duration: '0m 30s',
          Completed: '3 hours ago'
        },
        {
          executionID: 'UK-005',
          status: 'In progress',
          sourceRevisions: 'feature/new-ui',
          trigger: 'Manual',
          started: '5 minutes ago',
          Duration: '0m 50s',
          Completed: '-'
        }
      ];
      this.UKtabledDataSource.data = this.UKdataSource;
      this.ISdataSource = [
        {
          executionID: 'UK-001',
          status: 'Success',
          sourceRevisions: 'v2.1.0',
          trigger: 'Manual',
          started: 'Just now',
          Duration: '2m 10s',
          Completed: 'Just now'
        },
        {
          executionID: 'IS-002',
          status: 'Success',
          sourceRevisions: 'v2.1.0',
          trigger: 'Manual',
          started: 'Just now',
          Duration: '2m 12s',
          Completed: 'Just now'
        },
        {
          executionID: 'UK-003',
          status: 'Failed',
          sourceRevisions: 'main@a4b8c9d',
          trigger: 'Schedule',
          started: '1 day ago',
          Duration: '1m 45s',
          Completed: '1 day ago'
        },
        {
          executionID: 'IS-004',
          status: 'Cancelled',
          sourceRevisions: 'release/v1.5.2',
          trigger: 'Manual',
          started: '3 hours ago',
          Duration: '0m 30s',
          Completed: '3 hours ago'
        },
        {
          executionID: 'UK-005',
          status: 'In progress',
          sourceRevisions: 'feature/new-ui',
          trigger: 'Manual',
          started: '5 minutes ago',
          Duration: '0m 50s',
          Completed: '-'
        }
      ];
      this.IStabledDataSource.data = this.ISdataSource;
      this.isLoading = false;
    }, 1200);
    // }, 120000);
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
      'In progress': 'status-in-progress',
      'Success': 'status-success',
      'Failed': 'status-failed',
      'Cancelled': 'status-cancelled',
      'Pending': 'status-pending'
    };
    return statusMap[status] || 'status-default';
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'In progress': 'refresh',
      'Success': 'check_circle',
      'Failed': 'error',
      'Cancelled': 'cancel',
      'Pending': 'schedule'
    };
    return iconMap[status] || 'help';
  }

  showDetails(executionID: string): void {
    //call API to get details for the execution ID
    console.log(`Showing details for execution ID: ${executionID}`);
  }

  formatTime(time: string): string {
    if (!time) return '-';
    if (time.includes('ago') || time === 'Just now') {
      return time;
    }
    return time;
  }
}
