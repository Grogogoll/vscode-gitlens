import { QuickPickItem } from 'vscode';
import type { Subscription } from '../../subscription';

export enum Directive {
	Back,
	Cancel,
	LoadMore,
	Noop,
	RequiresVerification,
	RequiresFreeSubscription,
	RequiresPaidSubscription,
}

export namespace Directive {
	export function is<T>(value: Directive | T): value is Directive {
		return typeof value === 'number' && Directive[value] != null;
	}
}

export interface DirectiveQuickPickItem extends QuickPickItem {
	directive: Directive;
}

export namespace DirectiveQuickPickItem {
	export function create(
		directive: Directive,
		picked?: boolean,
		options?: { label?: string; description?: string; detail?: string; subscription?: Subscription },
	) {
		let label = options?.label;
		let detail = options?.detail;
		if (label == null) {
			switch (directive) {
				case Directive.Back:
					label = 'Back';
					break;
				case Directive.Cancel:
					label = 'Cancel';
					break;
				case Directive.LoadMore:
					label = 'Load more';
					break;
				case Directive.Noop:
					label = 'Try again';
					break;
				case Directive.RequiresVerification:
					label = 'Resend Verification Email';
					detail = 'You must verify your account email address before you can continue';
					break;
				case Directive.RequiresFreeSubscription:
					label = 'Create a Free+ Account';
					detail = 'To unlock all premium features for public code';
					break;
				case Directive.RequiresPaidSubscription:
					label = 'Upgrade to a paid subscription';
					detail = 'To unlock all premium features for private code';
					break;
			}
		}

		const item: DirectiveQuickPickItem = {
			label: label,
			description: options?.description,
			detail: detail,
			alwaysShow: true,
			picked: picked,
			directive: directive,
		};

		return item;
	}

	export function is(item: QuickPickItem): item is DirectiveQuickPickItem {
		return item != null && 'directive' in item;
	}
}