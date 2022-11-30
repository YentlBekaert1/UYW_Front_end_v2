import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { OfferService } from 'src/app/_services/offer.service';
import { environment } from 'src/environments/environment';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  userOffers: any = [];
  url = environment.apiUrl;

  isLoaded = true;
  viewDelete = false;

  displayedColumns: string[] = ['actions','image', 'title', 'category', 'likes', 'views', 'status', 'created'];
  data: any = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  constructor(private offerservice: OfferService, public dialog: MatDialog,private toastService: HotToastService) { }

  ngOnInit(): void {;
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.getUserItems();
  }

  getUserItems(){
    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.offerservice!.getUserOffers(
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex,
        )
      }),
      map((data : any) => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.isRateLimitReached = data === null;

        if (data === null) {
          return [];
        }

        // Only refresh the result length if there is new data. In case of rate
        // limit errors, we do not want to reset the paginator to zero, as that
        // would prevent users from re-triggering requests.

        this.resultsLength = data.meta.total;
        return data;
      }),
    )
    .subscribe(data => (this.data = data.data));
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
          this.getUserItems();
          this.toastService.success('Item status succefully deleted', {
            position: 'top-right',
            style: {
              border: '2px solid #33b188',
              padding: '16px',
              color: '#33b188',
              background: '#fff'
            },
            iconTheme: {
              primary: '#33b188',
              secondary: '#fff',
            },
          });
          }
        ).catch( err =>
          this.toastService.error('Error, There whent something wrong', {
            position: 'top-right',
            style: {
              border: '2px solid #EF4444',
              padding: '16px',
              color: '#EF4444',
              background: '#fff'
            },
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          })
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
          this.getUserItems();
          this.toastService.success('Item status succefully updated', {
            position: 'top-right',
            style: {
              border: '2px solid #33b188',
              padding: '16px',
              color: '#33b188',
              background: '#fff'
            },
            iconTheme: {
              primary: '#33b188',
              secondary: '#fff',
            },
          });
          }
        ).catch( err =>
          this.toastService.error('Error, There whent something wrong', {
            position: 'top-right',
            style: {
              border: '2px solid #EF4444',
              padding: '16px',
              color: '#EF4444',
              background: '#fff'
            },
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          })
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

