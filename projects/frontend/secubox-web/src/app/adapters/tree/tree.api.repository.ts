import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FileSystemObject } from '../../features/file-system/file-system.model';
import { TreeApiResponse } from './api-data-transfert-object/tree.api.response';
import { TreeMapper } from './mapper/tree.mapper';
import { environment } from '../../../environments/environment';

@Injectable()
export class TreeApiRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getRootTree(): Observable<FileSystemObject> {
    return this.http
      .get<TreeApiResponse>(`${this.baseUrl}/file-tree/root`)
      .pipe(map(TreeMapper.toTree));
  }

  update(req: FileSystemObject): Observable<FileSystemObject> {
    const endpoint = req.id === 'root'
      ? `${this.baseUrl}/file-tree/root`
      : `${this.baseUrl}/file-tree/${req.id}`;

    return this.http
      .put<TreeApiResponse>(endpoint, TreeMapper.toCommand(req))
      .pipe(map(TreeMapper.toTree));
  }
}
