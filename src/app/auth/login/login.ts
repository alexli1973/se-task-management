import {Component, inject, OnInit, signal} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ROUTE_URLS} from '../../core/constants/routes.constants';
import {finalize} from 'rxjs';
import {HttpErrorStateService} from '../../core/api/http-error-state.service';
import {InfraInput} from '../../shared/infra-input/infra-input';
import {InfraButton} from '../../shared/infra-button/infra-button';
import {LOGIN_TEXTS} from '../../core/constants/texts.constants';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    InfraInput,
    InfraButton
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly httpErrorState = inject(HttpErrorStateService);

  protected readonly texts = LOGIN_TEXTS;

  readonly loading = signal(false);

  readonly loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl(ROUTE_URLS.DASHBOARD).catch(() => {
        this.httpErrorState.setMessage(this.texts.errors.navigationFailed);
      });
    }
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.httpErrorState.clear();

    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.httpErrorState.clear();

          const rawReturnUrl =
            this.route.snapshot.queryParamMap.get('returnUrl') ??
            ROUTE_URLS.DASHBOARD;

          const safeReturnUrl = rawReturnUrl.startsWith('/')
            ? rawReturnUrl
            : ROUTE_URLS.DASHBOARD;

          this.router.navigateByUrl(safeReturnUrl).catch(() => {
            this.httpErrorState.setMessage(this.texts.errors.navigationFailed);
          });
        },
        error: () => {
          this.httpErrorState.setMessage(this.texts.errors.invalidCredentials);
        },
      });
  }
}
