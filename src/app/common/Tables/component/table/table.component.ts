import { Component, Input, ViewChild, AfterViewInit, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../../../modules/pages/task-list/models/task';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  imports:[CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormField,
    MatInputModule,
    MatLabel,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class TableComponent implements OnInit, OnChanges {

  @Input() data: Task[] = [];
  @Input() columns: { columnDef: string; header: string; sortable: boolean, needsFilter: boolean, filterType: string | null }[] = [];

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();

  displayedColumns: string[] = [];
  filterColumns: any;
  dataSource = new MatTableDataSource<any>([]); // ✅ Ensure initialization

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.displayedColumns = this.columns.map(c => c.columnDef);
    this.filterColumns = this.columns.filter(column=>{return column.needsFilter;});
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      this.dataSource = new MatTableDataSource(this.data); 
      this.setPaginationAndSorting();
    }
  }

  setPaginationAndSorting() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(row: any) {
    this.edit.emit(row);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }
}
