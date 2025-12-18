import React, { useState } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { MdClose, MdInfoOutline, MdWarning } from 'react-icons/md';
import Cookies from 'js-cookie';
import { ExternalLink, ReactIcon } from 'src/components';
import { APP, COOKIES } from 'src/constants/app';

const ICONS = {
	discord: FaDiscord,
	info: MdInfoOutline,
	warning: MdWarning,
};

export function Announcement() {
	const { announcement } = APP;
	const [dismissed, setDismissed] = useState(() => !shouldDisplay());

	function shouldDisplay() {
		if (!announcement?.enabled) return false;
		if (!announcement.dismissible) return true;

		const cookie = Cookies.get(COOKIES.dismissAnnouncementDate);
		if (!cookie) return true;

		try {
			const dismissDate = new Date(JSON.parse(cookie));
			const today = new Date();
			if (dismissDate > today) return true;
			const cooldownMs = (announcement.dismissCooldownDays) * 24 * 60 * 60 * 1000;
			return (today - dismissDate) > cooldownMs;
		} catch {
			return true;
		}
	}

	function handleDismiss() {
		setDismissed(true);
		Cookies.set(
			COOKIES.dismissAnnouncementDate,
			JSON.stringify(new Date().toJSON()),
			{ expires: 365 }
		);
	}

	if (dismissed || !announcement?.enabled) return null;

	const IconComponent = announcement.icon ? ICONS[announcement.icon] : null;

	return (
		<div className="p-2 mb-1 box-shadow" style={{ backgroundColor: announcement.backgroundColor || 'var(--theme-secondary)' }}>
			<div className="h-flex align-items-center">
				{IconComponent && (
					<ReactIcon icon={IconComponent} />
				)}
				<span className="font-bold mx-2">{announcement.text}</span>
				{announcement.linkUrl && (
					<ExternalLink href={announcement.linkUrl} className="link mr-2">
						{announcement.linkText || 'Learn more'}
					</ExternalLink>
				)}
				{announcement.dismissible && (
					<button className="ml-auto" onClick={handleDismiss}>
						<ReactIcon icon={MdClose} clickable />
					</button>
				)}
			</div>
		</div>
	);
}
