export function ms_to_hhmmss(ms: number) {
	const seconds = Math.floor((ms / 1000) % 60);
	const minutes = Math.floor((ms / (1000 * 60)) % 60);
	const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

	const p = (num: number) => String(num).padStart(2, '0');
	return `${hours ? `${p(hours)}:` : ''}${p(minutes)}:${p(seconds)}`;
}
