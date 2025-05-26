/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface GenderFieldProps {
	control: any;
}

export function GenderField({ control }: GenderFieldProps) {
	return (
		<FormField
			control={control}
			name='sex'
			render={({ field }) => (
				<FormItem>
					<FormLabel>Gender</FormLabel>
					<Select
						onValueChange={value => field.onChange(parseInt(value))}
						value={field.value.toString()}
					>
						<FormControl>
							<SelectTrigger>
								<SelectValue placeholder='Select gender' />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							<SelectItem value='0'>Male</SelectItem>
							<SelectItem value='1'>Female</SelectItem>
							<SelectItem value='2'>Other</SelectItem>
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
