import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin/admin.service';
import { ExcelService } from 'src/app/services/exportToExcel.service';

@Component({
  selector: 'app-mer-transaction-details',
  templateUrl: './mer-transaction-details.component.html',
  styleUrls: ['./mer-transaction-details.component.css']
})
export class MerTransactionDetailsComponent implements OnInit {

  transactionDetailsFormGroup: FormGroup;
  showSettlementDetails: boolean;
  searchTrasactionsTableData: any;
  loggedInUserInfo = localStorage.getItem('userInfo');
loggedInUserInfoArr = JSON.parse(this.loggedInUserInfo)
  constructor(private modalService: NgbModal, private adminService: AdminService,
    private fb: FormBuilder,
    @Inject(DOCUMENT) private _document: Document, private toastr: ToastrService, private router: Router,
    private excelService:ExcelService) { }

  ngOnInit(): void {
    this.transactionDetailsFormGroup = this.fb.group({
      merchantid: ['', Validators.required],
      fromdate: ['', Validators.required],
      todate: ['', Validators.required],
      transactionTypes: ['']
    });
  }
  exportAsXLSX():void {
    debugger;
    this.excelService.exportAsExcelFile(this.searchTrasactionsTableData, 'transactionDetails');
  }
  onSearchButtonClick(){
    let transactionDetailsByMerchantData =
    {
      "merchant_Id": this.loggedInUserInfoArr.merchant_id,
      "from_date": this.transactionDetailsFormGroup.controls['fromdate'].value,
      "to_date": this.transactionDetailsFormGroup.controls['todate'].value,
      "transaction_Type": this.transactionDetailsFormGroup.controls['transactionTypes'].value,
      "Useragent": "web",
      "Userip": "1",
      "Userid": "1"
    }
  
    this.adminService.transactionDetailsByMerchant(transactionDetailsByMerchantData)
      .subscribe(data => {
        debugger;
        if (data.message.toUpperCase() === 'RECORD FOUND') {
          this.searchTrasactionsTableData = data.data;
          this.showSettlementDetails = true;
        }
      });
  }
  Reset(){
    this.transactionDetailsFormGroup.reset();
    this.showSettlementDetails=false;
  }
}
