import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-configuration',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatExpansionModule,
    MatChipsModule
  ],
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent {
  // Form fields
  KeyId: string = '';
  SecretKey: string = '';
  SessionToken: string = '';
  profileName: string = 'dev-root';

  // Form state
  isEditing: boolean = false;
  hideSecretKey: boolean = true;
  statusMessage: string = '';
  statusType: 'success' | 'error' | 'warning' | 'info' = 'info';

  // Original values for cancel functionality
  private originalValues: any = {};

  // AWS Regions
  awsRegions = [
    { code: 'us-east-1', name: 'US East (N. Virginia)' },
    { code: 'ap-south-1', name: 'Asia Pacific (Mumbai)' }
  ];

  constructor() {
    // Initialize with some demo data
    this.loadConfiguration();
  }

  // Enable edit mode
  enableEdit(): void {
    this.isEditing = true;
    this.storeOriginalValues();
    this.clearStatus();
  }

  // Save configuration
  saveConfiguration(): void {
    if (!this.isConfigurationValid()) {
      this.setStatus('Please fill in all required fields', 'error');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      this.isEditing = false;
      this.setStatus('Configuration saved successfully', 'success');

      // Store in localStorage for demo purposes
      this.storeConfiguration();
    }, 1000);
  }

  // Cancel edit mode
  cancelEdit(): void {
    this.restoreOriginalValues();
    this.isEditing = false;
    this.clearStatus();
  }

  // Clear all form fields
  clearForm(): void {
    this.KeyId = '';
    this.SecretKey = '';
    this.SessionToken = '';
    this.setStatus('Form cleared', 'info');
  }

  // Test connection
  testConnection(): void {
    if (!this.isConfigurationValid()) {
      this.setStatus('Please configure valid credentials first', 'warning');
      return;
    }

    this.setStatus('Testing connection...', 'info');
    console.log(this.statusMessage);

    // Simulate connection test
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% success rate for demo
      if (isSuccess) {
        this.setStatus('Connection successful!', 'success');
      } else {
        this.setStatus('Connection failed. Please check your credentials.', 'error');
      }
    }, 2000);
  }

  // Check if configuration is valid
  isConfigurationValid(): boolean {
    return !!(this.KeyId.trim() && this.SecretKey.trim());
  }

  // Get status of configuration below header
  getStatusClass(): string {
    if (!this.KeyId || !this.SecretKey) {
      return 'disconnected';
    }
    return 'connected';
  }

  getStatusIcon(): string {
    if (!this.KeyId || !this.SecretKey) {
      return 'cloud_off';
    }
    return 'cloud_done';
  }

  getStatusMessage(): string {
    if (!this.KeyId || !this.SecretKey) {
      return 'Configuration incomplete';
    }
    return 'Configuration ready';
  }

  // Set status message
  private setStatus(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    this.statusMessage = message;
    this.statusType = type;

    // Auto-clear success and info messages after 5 seconds
    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        this.clearStatus();
      }, 5000);
    }
  }

  // Clear status message
  clearStatus(): void {
    this.statusMessage = '';
  }

  // Store original values for cancel functionality
  private storeOriginalValues(): void {
    this.originalValues = {
      KeyId: this.KeyId,
      SecretKey: this.SecretKey,
      SessionToken: this.SessionToken,
      profileName: this.profileName,
    };
  }

  // Restore original values
  private restoreOriginalValues(): void {
    if (this.originalValues) {
      this.KeyId = this.originalValues.KeyId;
      this.SecretKey = this.originalValues.SecretKey;
      this.SessionToken = this.originalValues.SessionToken;
      this.profileName = this.originalValues.profileName;
    }
  }

  // Store configuration (demo - using localStorage)
  private storeConfiguration(): void {
    const config = {
      KeyId: this.KeyId,
      SecretKey: '***', // Don't store actual secret key
      SessionToken: this.SessionToken ? '***' : '',
      profileName: this.profileName,
    };

    console.log('Storing configuration:', config);
  }

  // Load configuration (demo)
  private loadConfiguration(): void {
    // Demo data - in real app, load from service/localStorage
    this.KeyId = '';
    this.SecretKey = '';
    this.SessionToken = '';
    this.profileName = 'default';
  }
}
