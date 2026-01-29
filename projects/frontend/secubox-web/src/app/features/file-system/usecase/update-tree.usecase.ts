import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TreeApiRepository } from '../../../adapters/tree/tree.api.repository';
import { FileSystemObject } from '../file-system.model';

@Injectable()
export class UpdateTreeUsecase {
  private readonly repository = inject(TreeApiRepository);

  execute = (cmd: FileSystemObject): Observable<FileSystemObject> => this.repository.update(cmd);
}
