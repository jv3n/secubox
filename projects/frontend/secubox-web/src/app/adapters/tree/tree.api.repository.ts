import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tree } from '../../features/file-system/file-system.model';
import { TreeApiResponse } from './api-data-transfert-object/tree.api.response';
import { TreeMapper } from './mapper/tree.mapper';

@Injectable()
export class TreeApiRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  get(id: string | null): Observable<Tree> {
    const uri = id ? `${this.baseUrl}/file-tree` : `${this.baseUrl}/file-tree/${id}`;

    return this.http.get<TreeApiResponse>(uri).pipe(map(TreeMapper.toTree));
  }

  update(req: Tree): Observable<Tree> {
    if (!req.id) {
      throw new Error('Tree id is required for update operation');
    }

    return this.http
      .put<TreeApiResponse>(`${this.baseUrl}/file-tree`, TreeMapper.toCommand(req))
      .pipe(map(TreeMapper.toTree));
  }
}
