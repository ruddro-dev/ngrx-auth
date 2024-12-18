import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { register } from '../../store/actions';
import { RegisterRequestInterface } from '../../types/registerRequest.interface';
import { AuthStateInterface } from '../../types/authState.interface';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { selectIsSubmitting } from '../../store/reducers';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form;
  isSubmitting$: Observable<boolean> | undefined;
  constructor(
    private fb: FormBuilder, 
    private store: Store<{auth: AuthStateInterface}>,
    private authService: AuthService
    ) {
    this.form = this.fb.nonNullable.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }
  ngOnInit(): void {
    this.isSubmitting$ = this.store.select(selectIsSubmitting)
  }
  onSubmit() {
    console.log('form', this.form.getRawValue())
    const request: RegisterRequestInterface = {
      user: this.form.getRawValue(),
    }
    this.store.dispatch(register({request}))
    this.authService.register(request).subscribe(res => console.log('res', res))
  }
}
