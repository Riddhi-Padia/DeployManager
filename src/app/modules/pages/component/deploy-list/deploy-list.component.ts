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
  displayedColumns: string[] = ['name', 'status', 'sourceRevisions', 'executionStarted'];
  isLoading = false;

  columns: TableColumn[] = [
    { columnDef: 'name', header: 'Name', sortable: true },
    { columnDef: 'status', header: 'Latest execution status', sortable: true },
    { columnDef: 'sourceRevisions', header: 'Latest source revisions', sortable: false },
    { columnDef: 'executionStarted', header: 'Latest execution started', sortable: true },
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
          executionStarted: 'Just now'
        },
        {
          id: '2',
          name: 'backend-api-deployment',
          status: 'Success',
          sourceRevisions: 'v2.1.0',
          executionStarted: '2 hours ago',
        },
        {
          id: '3',
          name: 'frontend-ui-pipeline',
          status: 'Failed',
          sourceRevisions: 'main@a4b8c9d',
          executionStarted: '1 day ago',
        },
        {
          id: '4',
          name: 'database-migration-pipeline',
          status: 'Success',
          sourceRevisions: 'release/v1.5.2',
          executionStarted: '3 hours ago',
        },
        {
          id: '5',
          name: 'mobile-app-deployment',
          status: 'Cancelled',
          sourceRevisions: 'feature/new-ui',
          executionStarted: '5 hours ago',
        },
        {
          id: '6',
          name: 'mobile-app-deployment',
          status: 'Cancelled',
          sourceRevisions: 'feature/new-ui',
          executionStarted: '5 hours ago',
        },
        {
          id: '7',
          name: 'mobile-app-deployment',
          status: 'Cancelled',
          sourceRevisions: 'feature/new-ui',
          executionStarted: '5 hours ago',
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
