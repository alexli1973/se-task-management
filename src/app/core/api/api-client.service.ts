import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environments';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

type ApiQueryParams = Record<string, string | number | boolean | null | undefined>;

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  get<TResponse>(path: string, queryParams?: ApiQueryParams): Observable<TResponse> {
    return this.http.get<TResponse>(this.createUrl(path), {
      params: this.createParams(queryParams)
    });
  }

  post<TResponse, TBody = unknown>(path: string, body: TBody): Observable<TResponse> {
    return this.http.post<TResponse>(this.createUrl(path), body);
  }

  patch<TResponse, TBody = unknown>(path: string, body: TBody): Observable<TResponse> {
    return this.http.patch<TResponse>(this.createUrl(path), body);
  }

  delete<TResponse = void>(path: string): Observable<TResponse> {
    return this.http.delete<TResponse>(this.createUrl(path));
  }


  private createParams(queryParams?: ApiQueryParams): HttpParams | undefined {
    if (!queryParams) {
      return undefined;
    }
    let httpParams = new HttpParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }

  private createUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${normalizedPath}`;
  }

}
