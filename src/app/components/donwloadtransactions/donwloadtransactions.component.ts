import { Component, Input } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-donwloadtransactions',
  templateUrl: './donwloadtransactions.component.html',
  styleUrls: ['./donwloadtransactions.component.css']
})
export class DonwloadtransactionsComponent {
  @Input() data: any;
  exportToExcel() {


    // Create a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);

    // Create a workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions'); // 'Transactions' is the sheet name

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'transactions.xlsx'); // 'transactions.xlsx' is the file name
  }

}
