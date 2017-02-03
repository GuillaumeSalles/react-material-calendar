export function addDays(date, nbOfDays) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() + nbOfDays);
}

export function diffDays(a,b) {
	return (a.getTime() - b.getTime()) / 1000 / 3600 / 24;
}