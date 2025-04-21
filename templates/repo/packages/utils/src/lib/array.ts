/**
 * Splits an array into chunks of specified size.
 *
 * @template T - The type of the array elements.
 * @param {T[]} arr - The array to split into chunks.
 * @param {number} size - The maximum number of elements per chunk.
 * @returns {T[][]} An array of chunks, where each chunk is an array of T.
 */
export function chunk<T>(arr: T[], size: number): T[][] {
	return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
		arr.slice(i * size, i * size + size),
	);
}

export function uniq<T>(array: T[]): T[] {
	return array.filter((item, index, self) => self.indexOf(item) === index);
}

export function shuffle(array: any[] | undefined) {
	if (!array) return [];
	return array.sort(() => Math.random() - 0.5);
}

