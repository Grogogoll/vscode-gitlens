import { Uri, window } from 'vscode';
import { Commands } from '../constants';
import type { Container } from '../container';
import { Logger } from '../logger';
import { Messages } from '../messages';
import { RepositoryPicker } from '../quickpicks';
import { Arrays } from '../system';
import { findOrOpenEditors } from '../system/utils';
import { Command, command } from './base';

export interface OpenChangedFilesCommandArgs {
	uris?: Uri[];
}

@command()
export class OpenChangedFilesCommand extends Command {
	constructor(private readonly container: Container) {
		super(Commands.OpenChangedFiles);
	}

	async execute(args?: OpenChangedFilesCommandArgs) {
		args = { ...args };

		try {
			if (args.uris == null) {
				const repository = await RepositoryPicker.getRepositoryOrShow('Open All Changed Files');
				if (repository == null) return;

				const status = await this.container.git.getStatusForRepo(repository.uri);
				if (status == null) {
					void window.showWarningMessage('Unable to open changed files');

					return;
				}

				args.uris = Arrays.filterMap(status.files, f => (f.status !== 'D' ? f.uri : undefined));
			}

			findOrOpenEditors(args.uris);
		} catch (ex) {
			Logger.error(ex, 'OpenChangedFilesCommand');
			void Messages.showGenericErrorMessage('Unable to open all changed files');
		}
	}
}
