import ora, { Ora } from "ora"

export function spinner<T>(label: string, fn: () => Promise<T>) {
	let spinner: Ora
	if (label) spinner = ora(label).start()

	return fn()
		.then((res) => {
			spinner?.succeed(`${label} ... DONE`)
			return res
		})
		.catch((err) => {
			spinner?.fail(`${label}`)
			console.error(err)
		})
		.finally(() => spinner?.stop())
}
