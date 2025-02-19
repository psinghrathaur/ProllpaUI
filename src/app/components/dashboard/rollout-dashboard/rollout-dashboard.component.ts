import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiConstantService } from '../../../services/services/api-constant.service';

@Component({
  selector: 'app-rollout-dashboard',
  templateUrl: './rollout-dashboard.component.html',
  styleUrl: './rollout-dashboard.component.css'
})
export class RolloutDashboardComponent {
  selectedFile: File | null = null;
  selectedOption: string | null = null;
  downloadStatus: string = '';
  jsonResponse: any[] = [];
  tableHeaders: string[] = [];
  response:string='';
  errorMessage: string='';
  sheetList: string[] = [];
  faqJson: any[] = [];
  sheetName:string='';
  
  
  

  constructor(private http: HttpClient) {}

  // Handle file selection
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.errorMessage = ''; // Clear previous error message

    // Check if the file is an Excel file
    if (this.selectedFile && !this.isExcelFile(this.selectedFile)) {
      alert('please upload correct file');
      this.errorMessage = 'Please upload a valid Excel file (.xls or .xlsx)';
      this.selectedFile = null; // Reset the selected file
    }
  }
  isExcelFile(file: File): boolean {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return fileExtension === 'xls' || fileExtension === 'xlsx';
  }

  // Upload file and get JSON response
  getExcelToJson() {
    if (!this.selectedFile ) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    const url = this.sheetName
      ? `${environment.apiUrl + ApiConstantService.getExcelToJsonConvert}?sheetName=${encodeURIComponent(this.sheetName)}`
      : `${environment.apiUrl + ApiConstantService.getExcelToJsonConvert}`;

    this.http.post<any[]>(url, formData).subscribe(
      (response) => {
        console.log('Response:', response);
        this.jsonResponse = response;
        
      },
      (error) => {
        console.error('Error:', error);
        alert("upload the correct excel file ! ");
      }
    );
  }
  submitChanges() {
    console.log('Updated Data:', this.jsonResponse);
    // Optionally send the modified data to the server
    // this.http.post('API_URL', this.jsonResponse).subscribe();
  }

  getAllSheetsName(){
    if (!this.selectedFile ) {
      console.error('No file selected');
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    if (this.sheetName) {
      formData.append('sheetName', this.sheetName);
    }
    const url = this.sheetName
      ? `${environment.apiUrl + ApiConstantService.getExcelAllSheet}?sheetName=${encodeURIComponent(this.sheetName)}`
      : `${environment.apiUrl + ApiConstantService.getExcelAllSheet}`;

      this.http.post<any[]>(url, formData).subscribe(
        (sheetList) => {
          console.log('Response:', sheetList);
          this.sheetList = sheetList;
        },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  getFAQJson() {
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<any>(environment.apiUrl + ApiConstantService.getExcelToFAQ, formData, { responseType: 'blob' as 'json' }).subscribe(
      (blob) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'faq.json'; // Ensure you set a proper file extension
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Update the status message on success
        this.downloadStatus = 'File downloaded successfully!';
      },
      (error) => {
        console.error('Error downloading file:', error);
        // Update the status message on error
        this.downloadStatus = 'Error downloading the file.';
      }
    );
  }
  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedFile = file;
  //     this.downloadStatus = '';
  //   }
  // }

  // Handle checkbox selection (Only one at a time)
  selectOption(option: string, event: any) {
    if (event.target.checked) {
      this.selectedOption = option;
    } else {
      this.selectedOption = null;
    }
  }

  // Validate Selection
  validateSelection() {
    if (!this.selectedOption) {
      alert('Please select one option before proceeding.');
    } else {
      alert(`Valid selection: ${this.selectedOption}`);
    }
  }

  // View Selected Option
  viewSelection() {
    if (!this.selectedOption) {
      alert('No option selected.');
    } else {
      console.log('Selected Option:', this.selectedOption);
    }
  }

  // Generate JSON from Excel for FAQ (API Call)
  generate() {
    if (!this.selectedFile) {
      alert('Please select a file before generating.');
      return;
    }
    
    if (!this.selectedOption) {
      alert('Please select an option before generating.');
      return;
    }

    console.log(`Generating data for: ${this.selectedOption}`);

    switch (this.selectedOption) {
      case 'FAQ':
        this.getFAQJson();
        break;
      case 'Privacy Policy':
        alert('privacy policy.');
        break;
      case 'ICR':
        alert('privacy policy.');
        break;
      case 'Appointment letter':
        alert('privacy policy.');
        break;
      default:
        alert('Invalid selection.');
    }
  }

  // Generate JSON based on selected checkbox (API Call)
  
  // Helper function to trigger JSON file download
  private downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    this.downloadStatus = `Downloaded: ${fileName}`;
  }
}
