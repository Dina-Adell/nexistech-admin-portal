import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { NexisLogoComponent } from '../../../shared/components/nexis-logo/nexis-logo.component';

type FormStatus = 'idle' | 'submitting' | 'error' | 'success';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NexisLogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly rememberedEmail = this.auth.readRememberedEmail();

  readonly form = this.formBuilder.nonNullable.group({
    email: [
      this.rememberedEmail,
      [Validators.required, Validators.email],
    ],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [this.rememberedEmail.length > 0],
  });

  readonly status = signal<FormStatus>('idle');
  readonly errorMessage = signal<string | null>(null);
  readonly passwordVisible = signal(false);

  readonly isSubmitting = computed(() => this.status() === 'submitting');
  readonly isSuccessful = computed(() => this.status() === 'success');

  /** Only show a field error once the user has left the field or submitted. */
  showError(field: 'email' | 'password'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  emailError(): string {
    const control = this.form.controls.email;
    if (control.hasError('required')) {
      return 'Enter the e-mail address linked to your account.';
    }
    return 'Use a full e-mail address, for example name@company.com.';
  }

  passwordError(): string {
    const control = this.form.controls.password;
    if (control.hasError('required')) {
      return 'Enter your password.';
    }
    return 'Passwords are at least 8 characters.';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  onSubmit(): void {
    if (this.isSubmitting()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.status.set('idle');
      this.errorMessage.set(null);
      return;
    }

    this.status.set('submitting');
    this.errorMessage.set(null);

    this.auth
      .signIn(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.status.set('success');
          // Hand over to the dashboard shell here, e.g.
          // this.router.navigateByUrl('/overview');
        },
        error: (error: unknown) => {
          this.status.set('error');
          this.errorMessage.set(
            error instanceof Error
              ? error.message
              : 'Sign-in failed. Try again in a moment.',
          );
        },
      });
  }
}
