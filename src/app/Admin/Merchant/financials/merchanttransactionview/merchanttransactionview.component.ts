import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IRandomUsers } from 'src/app/Admin/admin/location/regionalofficedetail/regionalofficedetail.component';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-merchanttransactionview',
  templateUrl: './merchanttransactionview.component.html',
  styleUrls: ['./merchanttransactionview.component.css']
})
export class MerchanttransactionviewComponent implements OnInit {
  viewEarningBreakupFormGroup:FormGroup;
  private dataArray: any;
    public dataSource: MatTableDataSource<IRandomUsers>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: string[] = ['sno','terminalId', 'batchId', 'settlementDate', 'receivables', 'payables',
    ];
  constructor(private modalService: NgbModal, private adminService: AdminService,
    private fb: FormBuilder,
    @Inject(DOCUMENT) private _document: Document, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.viewEarningBreakupFormGroup=this.fb.group({
      merchantid:[''],
      transactiontype:[''],
      fromDate:[(new Date()).toISOString().substring(0, 10)],
      toDate:[(new Date()).toISOString().substring(0, 10)]
    })
  }
  onSearchButtonClick(){
    debugger;
    let view_merchant_earning_breakupData={
      "merchantid": this.viewEarningBreakupFormGroup.controls.merchantid.value,
      "transactiontype": this.viewEarningBreakupFormGroup.controls.transactiontype.value,
      "from_Date": this.viewEarningBreakupFormGroup.controls.fromDate.value,
      "to_Date": this.viewEarningBreakupFormGroup.controls.toDate.value,
      "userid": "1",
      "useragent": "web",
      "userip": "1"
    }
    this.adminService.view_merchant_earning_breakup(view_merchant_earning_breakupData)
      .subscribe(res=>{
        debugger;
        if (res.message.toUpperCase() === 'RECORD FOUND') {

          this.dataArray = res.data;
          this.dataArray=this.dataArray.sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime());
          this.dataSource = new MatTableDataSource<IRandomUsers>(this.dataArray);
          this.dataSource.paginator = this.paginator;
        }
        else if (res.message.toUpperCase() === 'RECORD NOT FOUND'){
          this.toastr.error("No record found!")
        }
        else if (res.status_Code === 401) {
          this.toastr.error('Looks like your session is expired. Login again to enjoy the features of your app.')
          this.router.navigate(['/'])
        }
      });
    
  }
  onResetButtonClick(){
    this.viewEarningBreakupFormGroup.reset();
    this.dataSource = new MatTableDataSource<IRandomUsers>();
    this.dataSource.paginator = this.paginator;
  }
}
