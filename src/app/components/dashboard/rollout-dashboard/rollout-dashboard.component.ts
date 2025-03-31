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
  selectedCheckboxes: string[] = [];
  selectedFile: File | null = null;
  selectedOption: string | null = null;
  downloadStatus: string = '';
  jsonResponse: any[] = [];
  tableHeaders: string[] = [];
  response: string = '';
  errorMessage: string = '';
  sheetList: string[] = [];
  faqJson: any[] = [];
  sheetName: string = '';
  selectedItems1: boolean[] = [];
  

  selectedSheet: string = '';
  columnA: string = 'B'; // Default Column A
  columnB: string = 'C'; // Default Column B
  jsonData: any;
  isChecked: boolean = true;
  privacyPolicy: boolean = false;
  selectedFilesName: string[] = [];

  constructor(private http: HttpClient) {}

  // Handle file selection
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.errorMessage = ''; // Clear previous error message

    if (this.selectedFile && !this.isExcelFile(this.selectedFile)) {
      alert('Please upload a valid Excel file.');
      this.errorMessage = 'Please upload a valid Excel file (.xls or .xlsx)';
      this.selectedFile = null;
    }
  }

  isExcelFile(file: File): boolean {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return fileExtension === 'xls' || fileExtension === 'xlsx';
  }

  onSelectionChange(value: string) {
    this.selectedOption = value;
  }

  
  getExcelToJson() {
    this.onSheetSelect();
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const url = this.selectedSheet
      ? `${environment.apiUrl + ApiConstantService.getExcelToJsonConvert}?sheetName=${encodeURIComponent(this.selectedSheet)}&labelName=${encodeURIComponent(this.columnA)}&valueName=${encodeURIComponent(this.columnB)}`
      : `${environment.apiUrl + ApiConstantService.getExcelToJsonConvert}`;

    this.http.post<any[]>(url, formData).subscribe(
      (response) => {
        console.log('Response:', response);
        this.jsonResponse = response;
      },
      (error) => {
        console.error('Error:', error);
        alert('Upload the correct Excel file!');
      }
    );
  }

  getAllSheetsName() {
    if (!this.selectedFile) {
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
        a.download = 'faq.json';
        a.click();
        window.URL.revokeObjectURL(url);

        this.downloadStatus = 'File downloaded successfully!';
      },
      (error) => {
        console.error('Error downloading file:', error);
        this.downloadStatus = 'Error downloading the file.';
      }
    );
  }

  selectOption(option: string, event: any) {
    if (event.target.checked) {
      this.selectedOption = option;
    } else {
      this.selectedOption = null;
    }
  }

  validateSelection() {
    if (!this.selectedOption) {
      alert('Please select one option before proceeding.');
    } else {
      alert(`Valid selection: ${this.selectedOption}`);
    }
  }

  viewSelection() {
    if (!this.selectedOption) {
      alert('No option selected.');
    } else {
      console.log('Selected Option:', this.selectedOption);
    }
  }

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
      case 'JSON':
        this.getExcelToJson();
        break;
      case 'FAQ':
        this.getFAQJson();
        break;
      case 'Privacy Policy':
      case 'ICR':
      case 'Appointment letter':
        alert(`${this.selectedOption} processing.`);
        break;
      default:
        alert('Invalid selection.');
    }
  }

  private downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    this.downloadStatus = `Downloaded: ${fileName}`;
  }

  selectOptionSheet(event: any) {
    this.selectedOption = event.target.checked ? 'JSON' : '';
    if (this.selectedOption === 'JSON') {
      this.getAllSheetsName();
    }
  }

  onSheetSelect() {
    if (this.selectedSheet) {
      console.log('File:', this.selectedFile?.name || 'No file selected', 'Selected Sheet:', this.selectedSheet);
      this.sheetName = this.selectedSheet;
    }
  }

  getZipForUI() {
    
    this.onSheetSelect();
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }
    
  
    // Extract file name without extension
    const originalFileName = this.selectedFile.name;
    const fileNameWithoutExt = originalFileName.replace(/\.[^/.]+$/, ""); // Removes extension
    const zipFileName = fileNameWithoutExt + ".zip"; // Final ZIP file name
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('jsonRequiredList', JSON.stringify(this.selectedFilesName));
    if(this.privacyPolicy===true){
        // Fetch and download the JSON file
      this.http.post(environment.apiUrl + ApiConstantService.uploadIndividual, formData, { responseType: 'blob' })
  .subscribe(
    (response: Blob) => {
      console.log('ZIP file received:', response);

      // Create a blob for the ZIP file
      const blob = new Blob([response], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);

      // Create a download link
      const a = document.createElement('a');
      a.href = url;
      a.download = 'output.zip'; // File name
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    (error) => {
      console.error('Error:', error);
      alert('Download failed! Please check your authorization.');
    }
  );

      
    }else{
      
    this.http.post(environment.apiUrl + ApiConstantService.getZipForUI, formData, { responseType: 'blob' }).subscribe(
      (response: Blob) => {
        console.log('ZIP file received:', response);
  
        const blob = new Blob([response], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = zipFileName; // Use dynamic name for ZIP file
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      (error) => {
        console.error('Error:', error);
        alert('Upload failed! Please check your authorization.');
      }
    );
  }
  this.privacyPolicy=false;
  }
  

  submitChanges1() {
    const selectedData = this.jsonResponse.filter((_, index) => this.selectedItems1[index]);
    console.log('Selected JSON:', selectedData);
    alert('Selected JSON sent for processing!');
  }
  onCheckboxChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedCheckboxes.push(value);
    } else {
      this.selectedCheckboxes = this.selectedCheckboxes.filter(item => item !== value);
    }
  }
  onCheckboxChange1(event: Event, value: string): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedCheckboxes.push(value);
    } else {
      this.selectedCheckboxes = this.selectedCheckboxes.filter(item => item !== value);
    }
    this.privacyPolicy=true;
    console.log('Selected items:', this.selectedCheckboxes);
    this.selectedFilesName=this.selectedCheckboxes;
  }
  onCheckboxChangePrivacyPolicy(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    
    if (checkbox.checked) {
      this.privacyPolicy=true;
      console.log("Privacy Policy Page selected");
      // Perform action when checked
    } else {
      console.log("Privacy Policy Page deselected");
      // Perform action when unchecked
    }
  }
  
}
