import * as React from "react"
import { formatPhoneNumber, fromE164, toE164 } from "../../lib/phone"
import { cn } from "../../lib/utils"
import { Input, type InputProps } from "./input"

export interface PhoneInputProps
	extends Omit<InputProps, "type" | "value" | "onChange"> {
	value?: string
	onChange?: (value: string) => void
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
	({ className, value, onChange, ...props }, ref) => {
		// Track both the E.164 format (for the actual value) and the formatted display value
		const [formattedValue, setFormattedValue] = React.useState<string>("")

		// Initialize formatted value from provided value
		React.useEffect(() => {
			if (value) {
				setFormattedValue(fromE164(value))
			}
		}, [value])

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			// Get the new formatted value
			const newFormattedValue = formatPhoneNumber(e.target.value)
			setFormattedValue(newFormattedValue)

			// Convert to E.164 and call the onChange handler
			if (onChange) {
				const e164Value = toE164(newFormattedValue)
				onChange(e164Value)
			}
		}

		return (
			<Input
				type="tel"
				className={cn("font-mono", className)}
				value={formattedValue}
				onChange={handleInputChange}
				ref={ref}
				{...props}
			/>
		)
	}
)

PhoneInput.displayName = "PhoneInput"

export { PhoneInput }
