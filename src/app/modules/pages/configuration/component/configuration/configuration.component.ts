import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ConfigurationService } from '../../services/configuration.service';
import { dropdownItem } from '../../models/dropdown-item/dropdown-item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-configuration',
  imports: [CommonModule, MatIconModule,FormsModule, MatFormFieldModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent implements OnInit{

  KeyId = 0;
  SecretKey = "";
  SessionToken = "";

  status!: dropdownItem[];
  types!: dropdownItem[];
  priority!: dropdownItem[];
  statusEditMode = false;
  typesEditMode = false;
  priorityEditMode = false;
  isSubmittedStatus = false;
  isSubmittedType = false;
  isSubmittedPriority = false;
  maxStatusId!: string;
  maxTypeId!: string;
  maxPriorityId!: string;

  constructor(private configurationService: ConfigurationService, private snackbar: MatSnackBar){}

  ngOnInit(): void {
    this.configurationService.getAllTaskStatus().subscribe((status)=> {
      this.maxStatusId = status.length > 0 ? Math.max(...status.map(res => Number(res.id))).toString() : '1211';
      this.status = status;
    });

    this.configurationService.getAllTaskPriority().subscribe((priority)=>{
      this.priority = priority;
    });

    this.configurationService.getAllTaskTypes().subscribe((type)=>{
      this.types = type;
    });

    this.isSubmittedStatus = false;
    this.isSubmittedType = false;
    this.isSubmittedPriority = false;
    this.statusEditMode = false;
    this.typesEditMode = false;
    this.priorityEditMode = false;
  }

  closeStatusEdit(): void{
    this.ngOnInit();
  }

  addStatus(): void{
    if(!this.status.some(res=>res.id == "")){
      this.status.push({id: '', value:''});
    }
  }

  addType(): void{
    if(!this.types.some(temp=>temp.id == "")){
      this.types.push({id:'',value:''});
    }
  }

  addPriority(): void{
    this.priority.push({id:'',value:''});
  }


  saveStatus(){
    this.isSubmittedStatus = true;
    if(!this.status.some(status => !status.value.trim())){
      this.status.forEach((item)=>{
        if(item.id == ''){
          item.id = (+this.maxStatusId + 1).toString();
          this.configurationService.addTaskStatus(item).subscribe(newStatus => {
            item.id = newStatus.id;
            this.maxStatusId = newStatus.id;
          });
        }
        else{
          this.configurationService.updateTaskStatus(item).subscribe({
            next: () => {
              this.snackbar.open('Status updated successfully', 'Close', {
                duration: 3000,
                panelClass: ['green-popup'],
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
              this.ngOnInit(); // Refresh data after delete
            },
            error: () => {
              this.snackbar.open('Error updates status', 'Close', {
                duration: 3000,
                panelClass: ['error-popup'],
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
            }
          });
        }
      });
    }
  }


  saveType(){
    this.isSubmittedType = true;
    if(!this.types.some(type => !type.value.trim())){
      this.types.forEach((item)=>{
        if(item.id == ''){
          item.id = (+this.maxTypeId + 1).toString();
          this.configurationService.addTaskType(item).subscribe(newStatus => {
            item.id = newStatus.id;
            this.maxStatusId = newStatus.id;
          });
        }
        else{
          this.configurationService.updateTaskType(item).subscribe({
            next: () => {
              this.snackbar.open('Type updated successfully', 'Close', {
                duration: 3000,
                panelClass: ['green-popup'],
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
              this.ngOnInit(); // Refresh data after delete
            },
            error: () => {
              this.snackbar.open('Error updates type', 'Close', {
                duration: 3000,
                panelClass: ['error-popup'],
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
            }
          });
        }
      });
    }
  }


  savePriority(){
    this.isSubmittedPriority = true;
    if(!this.priority.some(priority => !priority.value.trim())){
      this.priority.forEach((item)=>{
        if(item.id == ''){
          item.id = (+this.maxPriorityId + 1).toString();
          this.configurationService.addTaskPriority(item).subscribe(newStatus => {
            item.id = newStatus.id;
            this.maxStatusId = newStatus.id;
          });
        }
        else{
          this.configurationService.updateTaskPriority(item).subscribe({
            next: () => {
              this.snackbar.open('Priority updated successfully', 'Close', {
                duration: 3000,
                panelClass: ['green-popup'],
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
              this.ngOnInit(); // Refresh data after delete
            },
            error: () => {
              this.snackbar.open('Error updates priority', 'Close', {
                duration: 3000,
                panelClass: ['error-popup'],
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
            }
          });
        }
      });
    }
  }

  deleteStatus(event: dropdownItem){
    this.status = this.status.filter((data)=> data.id != event.id);
    this.configurationService.deleteTaskStatus(event).subscribe({
      next: () => {
        this.snackbar.open('Status deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['green-popup'],
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.ngOnInit(); // Refresh data after delete
      },
      error: () => {
        this.snackbar.open('Error deleting status', 'Close', {
          duration: 3000,
          panelClass: ['error-popup'],
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }



  deleteType(event: dropdownItem){
    this.status = this.types.filter((data)=> data.id != event.id);
    this.configurationService.deleteTaskType(event).subscribe({
      next: () => {
        this.snackbar.open('Type deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['green-popup'],
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.ngOnInit(); // Refresh data after delete
      },
      error: () => {
        this.snackbar.open('Error deleting Type', 'Close', {
          duration: 3000,
          panelClass: ['error-popup'],
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }



  deletePriority(event: dropdownItem){
    this.status = this.priority.filter((data)=> data.id != event.id);
    this.configurationService.deleteTaskPriority(event).subscribe({
      next: () => {
        this.snackbar.open('priority deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['green-popup'],
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.ngOnInit(); // Refresh data after delete
      },
      error: () => {
        this.snackbar.open('Error deleting priority', 'Close', {
          duration: 3000,
          panelClass: ['error-popup'],
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }
}
