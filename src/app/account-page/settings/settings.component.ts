import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { updateProfile } from 'src/app/store/authstate/auth.actions';
import { Profile } from 'src/app/store/authstate/auth.model';
import { selectProfile } from 'src/app/store/authstate/auth.selector';
import { AuthState } from 'src/app/store/authstate/auth.state';
import { AuthService } from 'src/app/_services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';

export interface deleteDialogData {
  id: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  userData: Profile;
  updateInfoForm: FormGroup;
  updatePassword: FormGroup;

  constructor(
    private authservice: AuthService,
    private fb: FormBuilder,
    private store: Store<AuthState>,
    public dialog: MatDialog,
    private toastService: HotToastService) {
    this.updateInfoForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.updatePassword = this.fb.group({
      current_password: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    this.store.select(selectProfile).subscribe(data =>{
      console.log(data);
      this.userData = data;
      this.updateInfoForm.patchValue({
        name: data.name,
        email: data.email
      })
    })
  }

  onSubmit(){
    console.log(this.updateInfoForm.value);
    this.authservice.updateuserdata(this.updateInfoForm.value, this.userData.id).subscribe(
      {
          next: (data: any )=> {
            this.store.dispatch(updateProfile({profile: data.data, isLoggedIn: true}));
            this.toastService.success('Profile succefully updated', {
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
          },
          error: err => {
            this.toastService.success('Error, There whent something wrong', {
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
            });
          }
        }
      )
  }
  onSubmitPassword(){
    console.log(this.updatePassword.value);
    this.authservice.updatepassword(this.updatePassword.value).subscribe(
      {
          next: (data: any )=> {
            //console.log(data);
            this.updatePassword.patchValue({
              current_password: "",
              password: "",
              password_confirmation: ""
            });
            this.toastService.success('Password succefully updated', {
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
          },
          error: err => {
            this.toastService.success('Error, There whent something wrong', {
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
            });
          }
        }
      )
  }

  openDeleteDialog(userid:number): void {
    const deleteDialog = this.dialog.open(DeleteUserDialog, {data:{id:userid}});
    deleteDialog.afterClosed().subscribe(result => {
      if(result != undefined){
        console.log(result)
        this.authservice.deleteuser(result).subscribe({
          next: (data: any )=> {
            //console.log(data);
            this.authservice.logout();
          },
          error: err => {
            this.toastService.success('Error, There whent something wrong', {
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
            });
          }
        });
      }
    });
  }

}


@Component({
  selector: 'settings-delete-dialog',
  templateUrl: 'settings-delete-dialog.html',
  styleUrls: ['./settings-delete-dialog.scss']
})
export class DeleteUserDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: deleteDialogData,
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
