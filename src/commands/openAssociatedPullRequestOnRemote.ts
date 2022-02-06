import { TextEditor, Uri } from 'vscode';
import { Commands } from '../constants';
import type { Container } from '../container';
import { GitUri } from '../git/gitUri';
import { Logger } from '../logger';
import { executeCommand } from '../system/command';
import { ActiveEditorCommand, command, getCommandUri } from './base';
import { OpenPullRequestOnRemoteCommandArgs } from './openPullRequestOnRemote';

@command()
export class OpenAssociatedPullRequestOnRemoteCommand extends ActiveEditorCommand {
	constructor(private readonly container: Container) {
		super(Commands.OpenAssociatedPullRequestOnRemote);
	}

	async execute(editor?: TextEditor, uri?: Uri) {
		if (editor == null) return;

		uri = getCommandUri(uri, editor);
		if (uri == null) return;

		const gitUri = await GitUri.fromUri(uri);

		const blameline = editor.selection.active.line;
		if (blameline < 0) return;

		try {
			const blame = await this.container.git.getBlameForLine(gitUri, blameline);
			if (blame == null) return;

			await executeCommand<OpenPullRequestOnRemoteCommandArgs>(Commands.OpenPullRequestOnRemote, {
				clipboard: false,
				ref: blame.commit.sha,
				repoPath: blame.commit.repoPath,
			});
		} catch (ex) {
			Logger.error(ex, 'OpenAssociatedPullRequestOnRemoteCommand', `getBlameForLine(${blameline})`);
		}
	}
}
