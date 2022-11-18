import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OfferService } from 'src/app/_services/offer.service';
import { environment } from 'src/environments/environment';

export interface deleteDialogData {
  id: string;
  name: string;
}
export interface statusDialogData {
  id: string;
  name: string;
  status: number;
}

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.scss']
})
export class MyItemsComponent implements OnInit, AfterViewInit {

  @ViewChild('deleteContainer', { read: ElementRef }) deleteContainer!: ElementRef<HTMLInputElement>;

  userOffers: any = [];
  url = environment.apiUrl;

  isLoaded = false;
  viewDelete = false;


  deleteTop = 0;

  constructor(private offerservice: OfferService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.offerservice.getUserOffers().then((res: any) =>{
      this.userOffers = res.data;
      this.isLoaded = true;
    });
  }

  ngAfterViewInit(): void {
  }

  showActions(event){
    document.querySelectorAll('ul').forEach(element => {
      element.classList.remove('show');
    });
    if(event.target.nextSibling !== null){
      event.target.nextSibling.classList.toggle('show');
    }
  }


  openDeleteDialog(id: number, name:string): void {
    const deleteDialog = this.dialog.open(DeleteDialog, {
      data: {id: id, name: name},
    });
    deleteDialog.afterClosed().subscribe(result => {
      if(result != undefined){
        this.offerservice.deleteOfferById(result).then(res => {
          this.isLoaded = false;
          this.offerservice.getUserOffers().then((res: any) =>{
            this.userOffers = res.data;
            this.isLoaded = true;
          });
          }
        )
      }
    });
  }
  openStatusDialog(id: number, name:string, status: number): void {
    const statusDialog = this.dialog.open(StatusDialog, {
      data: {id: id, name: name, status:status},
    });
    statusDialog.afterClosed().subscribe(result => {
      if(result != undefined){
        console.log(result)
        this.offerservice.statusOfferById(result[0], result[1]).then(res => {
          this.isLoaded = false;
          this.offerservice.getUserOffers().then((res: any) =>{
            this.userOffers = res.data;
            this.isLoaded = true;
          });
          }
        )
      }
    });
  }

}

@Component({
  selector: 'my-items-delete-dialog',
  templateUrl: 'my-items-delete-dialog.html',
  styleUrls: ['./my-items-delete-dialog.scss']
})
export class DeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: deleteDialogData,
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'my-items-status-dialog',
  templateUrl: 'my-items-status-dialog.html',
  styleUrls: ['./my-items-status-dialog.scss']
})
export class StatusDialog {
  constructor(
    public dialogRef: MatDialogRef<StatusDialog>,
    @Inject(MAT_DIALOG_DATA) public data: statusDialogData,
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}

