import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TaskListService } from '../../services/task-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TableComponent } from '../../../../../common/Tables/component/table/table.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../../../../../common/modals/confirmation/confirmation/confirmation.component';
import { formatType, formPriority } from '../../../../../common/utilities/task-list/tak-utils';
import { MatIconModule } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../../../common/services/auth.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  imports: [TableComponent,MatIconModule,MatMiniFabButton]
})
export class TaskListComponent implements OnInit,OnDestroy {
  columns: {columnDef: string, header: string, sortable: boolean, needsFilter: boolean, filterType: string | null}[] = [
    { columnDef: 'Title', header: 'Title', sortable: true, needsFilter: true, filterType: 'text' },
    { columnDef: 'Status', header: 'Status', sortable: true, needsFilter: true, filterType: 'dropdown' },
    { columnDef: 'Priority', header: 'Priority', sortable: true, needsFilter: true, filterType: 'dropdown' },
    { columnDef: 'Type', header: 'Type', sortable: false, needsFilter: true, filterType: 'dropdown' },
    { columnDef: 'Labels', header: 'Labels', sortable: false, needsFilter: false, filterType: null },
    { columnDef: 'AssignedTo', header: 'Assigned To', sortable: false, needsFilter: false, filterType: null },
    { columnDef: 'DueDate', header: 'Due Date', sortable: true, needsFilter: false , filterType: null},
    { columnDef: 'actions', header: 'Actions', sortable: false, needsFilter: false , filterType: null}
  ];

  destroy$ =  new Subject<void>();

  dataSource: any[] = [];
  readonly dialog = inject(MatDialog);

  constructor(private taskListService: TaskListService,private router: Router,private snackbar: MatSnackBar, private authService: AuthService) {}

  ngOnInit() {
    this.taskListService.getTaskList().pipe(takeUntil(this.destroy$)).subscribe((tasks) => {
      this.dataSource = tasks.map(tasks => ({...tasks,Priority:formPriority(tasks.Priority),Type:formatType(tasks.Type)}));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addTask(): void {
    this.router.navigate(['/add-deploy']);
  }

  editRow(row: any): void {
    //console.log('first');
    this.router.navigate(['/edit-task', row.id]);
  }

  deleteTask(id: number) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '350px',
      data:{id: id, name: 'Delete Task', message:'Are you sure you want delete the task?',yesName:'Yes', cancelName:'Cancel', isTwoButton:true}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if(result.confirmation){
          this.taskListService.deleteTask(id).subscribe({
            next: () => {
              this.snackbar.open('Task deleted successfully', 'Close', {
                duration: 3000,
                panelClass: ['red-popup'],
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
              this.ngOnInit(); // Refresh data after delete
            },
            error: () => {
              this.snackbar.open('Error deleting task', 'Close', {
                duration: 3000,
                panelClass: ['red-popup'],
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
            }
          });
        }
      }
    });
  }
}
