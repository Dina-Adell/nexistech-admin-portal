import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;

  beforeEach(async () => {
    localStorage.removeItem('nexistech.remembered-email');

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the sign-in page', () => {
    expect(component).toBeTruthy();
  });

  it('starts with an invalid, empty form', () => {
    expect(component.form.invalid).toBeTrue();
    expect(component.form.controls.email.value).toBe('');
  });

  it('rejects a malformed e-mail address', () => {
    component.form.controls.email.setValue('not-an-email');
    expect(component.form.controls.email.invalid).toBeTrue();
  });

  it('does not call the API while the form is invalid', () => {
    component.onSubmit();
    expect(component.status()).toBe('idle');
    expect(component.form.controls.password.touched).toBeTrue();
  });

  it('reports a failed sign-in attempt', fakeAsync(() => {
    component.form.setValue({
      email: 'admin@nexistech.io',
      password: 'WrongPassword1',
      rememberMe: false,
    });

    component.onSubmit();
    tick(1000);

    expect(component.status()).toBe('error');
    expect(component.errorMessage()).toBeTruthy();
  }));

  it('signs in with valid credentials', fakeAsync(() => {
    component.form.setValue({
      email: 'admin@nexistech.io',
      password: 'NexisTech@2026',
      rememberMe: true,
    });

    component.onSubmit();
    expect(component.isSubmitting()).toBeTrue();

    tick(1000);

    expect(component.isSuccessful()).toBeTrue();
    expect(component.errorMessage()).toBeNull();
  }));

  it('toggles password visibility', () => {
    expect(component.passwordVisible()).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.passwordVisible()).toBeTrue();
  });
});
