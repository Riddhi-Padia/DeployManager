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
  id: string;
  name: string;
  status: 'In progress' | 'Success' | 'Failed' | 'Cancelled' | 'Pending';
  sourceRevisions: string;
  executionStarted: string;
  recentExecutions: ExecutionStatus[];
}

interface ExecutionStatus {
  status: 'success' | 'failed' | 'cancelled' | 'in-progress' | 'pending';
  tooltip: string;
}

interface TableColumn {
  columnDef: string;
  header: string;
  sortable: boolean;
}

interface StatusFilter {
  value: string;
  label: string;
  checked: boolean;
}

@Component({
  selector: 'app-deploy-list',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,MatFormFieldModule, MatPaginatorModule,
    MatChipsModule,
    MatTableModule,MatInputModule,
    MatCheckboxModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './deploy-list.component.html',
  styleUrls: ['./deploy-list.component.css']
})
export class DeployListComponent implements OnInit {
  dataSource: DeploymentPipeline[] = [];
  filteredDataSource = new MatTableDataSource<DeploymentPipeline>([]);
  displayedColumns: string[] = ['name', 'status', 'sourceRevisions', 'executionStarted', 'recentExecutions'];
  isLoading = false;

  columns: TableColumn[] = [
    { columnDef: 'name', header: 'Name', sortable: true },
    { columnDef: 'status', header: 'Latest execution status', sortable: true },
    { columnDef: 'sourceRevisions', header: 'Latest source revisions', sortable: false },
    { columnDef: 'executionStarted', header: 'Latest execution started', sortable: true },
    { columnDef: 'recentExecutions', header: 'Most recent executions', sortable: false },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadDeployments();
  }

  ngAfterViewInit() {
    this.filteredDataSource.paginator = this.paginator;
    this.filteredDataSource.sort = this.sort;
  }

  // Load deployment data (simulated)
  loadDeployments(): void {
    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.dataSource = [
        {
          id: '1',
          name: 'emspuk-infra-single-pipeline',
          status: 'Success',
          sourceRevisions: '-',
          executionStarted: 'Just now',
          recentExecutions: [
            { status: 'success', tooltip: 'Execution #12 - Completed successfully' },
            { status: 'success', tooltip: 'Execution #11 - Completed successfully' },
            { status: 'failed', tooltip: 'Execution #10 - Failed due to timeout' },
            { status: 'cancelled', tooltip: 'Execution #9 - Cancelled by user' },
            { status: 'in-progress', tooltip: 'Execution #13 - Currently running' }
          ]
        },
        {
          id: '2',
          name: 'backend-api-deployment',
          status: 'Success',
          sourceRevisions: 'v2.1.0',
          executionStarted: '2 hours ago',
          recentExecutions: [
            { status: 'success', tooltip: 'Execution #45 - Completed successfully' },
            { status: 'success', tooltip: 'Execution #44 - Completed successfully' },
            { status: 'success', tooltip: 'Execution #43 - Completed successfully' },
            { status: 'failed', tooltip: 'Execution #42 - Failed validation' },
            { status: 'success', tooltip: 'Execution #41 - Completed successfully' }
          ]
        },
        {
          id: '3',
          name: 'frontend-ui-pipeline',
          status: 'Failed',
          sourceRevisions: 'main@a4b8c9d',
          executionStarted: '1 day ago',
          recentExecutions: [
            { status: 'failed', tooltip: 'Execution #23 - Build failed' },
            { status: 'failed', tooltip: 'Execution #22 - Test failures' },
            { status: 'success', tooltip: 'Execution #21 - Completed successfully' },
            { status: 'success', tooltip: 'Execution #20 - Completed successfully' },
            { status: 'cancelled', tooltip: 'Execution #19 - Cancelled during build' }
          ]
        },
        {
          id: '4',
          name: 'database-migration-pipeline',
          status: 'Success',
          sourceRevisions: 'release/v1.5.2',
          executionStarted: '3 hours ago',
          recentExecutions: [
            { status: 'success', tooltip: 'Execution #8 - Migration completed' },
            { status: 'success', tooltip: 'Execution #7 - Migration completed' },
            { status: 'pending', tooltip: 'Execution #6 - Waiting for approval' },
            { status: 'success', tooltip: 'Execution #5 - Migration completed' },
            { status: 'success', tooltip: 'Execution #4 - Migration completed' }
          ]
        },
        {
          id: '5',
          name: 'mobile-app-deployment',
          status: 'Cancelled',
          sourceRevisions: 'feature/new-ui',
          executionStarted: '5 hours ago',
          recentExecutions: [
            { status: 'cancelled', tooltip: 'Execution #15 - Cancelled by admin' },
            { status: 'failed', tooltip: 'Execution #14 - Build timeout' },
            { status: 'failed', tooltip: 'Execution #13 - Dependencies error' },
            { status: 'success', tooltip: 'Execution #12 - Completed successfully' },
            { status: 'in-progress', tooltip: 'Execution #11 - In progress' }
          ]
        },
        {
          id: '6',
          name: 'mobile-app-deployment',
          status: 'Cancelled',
          sourceRevisions: 'feature/new-ui',
          executionStarted: '5 hours ago',
          recentExecutions: [
            { status: 'cancelled', tooltip: 'Execution #15 - Cancelled by admin' },
            { status: 'failed', tooltip: 'Execution #14 - Build timeout' },
            { status: 'failed', tooltip: 'Execution #13 - Dependencies error' },
            { status: 'success', tooltip: 'Execution #12 - Completed successfully' },
            { status: 'in-progress', tooltip: 'Execution #11 - In progress' }
          ]
        },
        {
          id: '7',
          name: 'mobile-app-deployment',
          status: 'Cancelled',
          sourceRevisions: 'feature/new-ui',
          executionStarted: '5 hours ago',
          recentExecutions: [
            { status: 'cancelled', tooltip: 'Execution #15 - Cancelled by admin' },
            { status: 'failed', tooltip: 'Execution #14 - Build timeout' },
            { status: 'failed', tooltip: 'Execution #13 - Dependencies error' },
            { status: 'success', tooltip: 'Execution #12 - Completed successfully' },
            { status: 'in-progress', tooltip: 'Execution #11 - In progress' }
          ]
        }
      ];

      this.filteredDataSource.data = this.dataSource;
      this.isLoading = false;
    }, 1500);
  }

  // Add new deployment
  addDeployment(): void {
    console.log('Adding new deployment...');
    this.router.navigate(['/add-deploy']);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
    if (this.filteredDataSource.paginator) {
      this.filteredDataSource.paginator.firstPage();
    }
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

  getExecutionIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'success': 'check_circle',
      'failed': 'error',
      'cancelled': 'cancel',
      'in-progress': 'refresh',
      'pending': 'schedule'
    };
    return iconMap[status] || 'help';
  }

  formatTime(time: string): string {
    if (!time) return '-';
    if (time.includes('ago') || time === 'Just now') {
      return time;
    }
    return time;
  }
}
