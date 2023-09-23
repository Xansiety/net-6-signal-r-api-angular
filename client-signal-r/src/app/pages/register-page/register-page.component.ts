import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  public userForm: FormGroup = new FormGroup({});
  public submitted = false;
  public apiErrorMessages: string[] = [];
  public openChat = true;

  constructor(private formBuilder: FormBuilder, private notificationUser: NotificationService, private router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]]
    })
  }

  submitForm() {
    this.submitted = true;
    this.apiErrorMessages = [];

    if (this.userForm.valid) {
      this.notificationUser.registerUser(this.userForm.value).subscribe({
        next: () => {
          // this.notificationUser.myName.next(this.userForm.get('name')?.value);
          this.notificationUser.myName = this.userForm.get('name')?.value;
          this.submitted = false;
          this.userForm.reset();
          this.router.navigate(['/home']);
        },
        error: error => {
          if (typeof (error.error) !== 'object') {
            this.apiErrorMessages.push(error.error);
          }
        }
      })
    }
  }

  closeChat() {
    this.openChat = false;
  }

}
