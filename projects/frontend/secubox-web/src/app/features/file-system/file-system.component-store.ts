import { inject } from '@angular/core';
import { FileSystemObject } from './file-system.model';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateTreeUsecase } from './usecase/update-tree.usecase';
import { TreeApiRepository } from '../../adapters/tree/tree.api.repository';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { finalize, pipe, switchMap, tap } from 'rxjs';


interface State {
  tree: FileSystemObject | null
  loading: boolean
  error: boolean
}

const initialState: State = {
tree:null,
  loading: false,
  error: false
};

export const FileSystemComponentStore = signalStore(
  withState(initialState),

  withMethods((store, repository = inject(TreeApiRepository), snackBar = inject(MatSnackBar)) => ({
    loadRootTree: rxMethod<void>(
      pipe(
        tap(() => patchState(store, () => ({ error: false, loading: true }))),
        switchMap(() =>
          repository.getRootTree().pipe(
            tap((res) => patchState(store, { tree: res })),
            finalize(() => patchState(store, () => ({ loading: false }))),
          ),
        ),
      ),
    ),
    update: rxMethod<FileSystemObject>(
      pipe(
        tap(() => patchState(store, () => ({ error: false, loading: true }))),
        switchMap((cmd) =>
          repository.update(cmd).pipe(
            tap((res) => patchState(store, { tree: res })),
            finalize(() => patchState(store, () => ({ loading: false }))),
          ),
        ),
      ),
    ),
  })),
);

export const FileSystemComponentStoreProviders = [
  FileSystemComponentStore,
  TreeApiRepository,
  UpdateTreeUsecase
];
