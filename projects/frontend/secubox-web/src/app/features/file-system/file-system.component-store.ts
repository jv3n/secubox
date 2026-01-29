import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { finalize, pipe, switchMap, tap } from 'rxjs';
import { TreeApiRepository } from '../../adapters/tree/tree.api.repository';
import { Tree } from './file-system.model';

interface State {
  tree: Tree;
  loading: boolean;
  error: boolean;
}

const initialState: State = {
  tree: {} as Tree,
  loading: false,
  error: false,
};

export const FileSystemComponentStore = signalStore(
  withState(initialState),

  withMethods((store, repository = inject(TreeApiRepository), snackBar = inject(MatSnackBar)) => ({
    load: rxMethod<string | null>(
      pipe(
        tap(() => patchState(store, () => ({ error: false, loading: true }))),
        switchMap((id) =>
          repository.get(id).pipe(
            tap((res) => patchState(store, { tree: res })),
            finalize(() => patchState(store, () => ({ loading: false }))),
          ),
        ),
      ),
    ),
    update: rxMethod<Tree>(
      pipe(
        tap(() => patchState(store, () => ({ loading: true }))),
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

export const FileSystemComponentStoreProviders = [FileSystemComponentStore, TreeApiRepository];
