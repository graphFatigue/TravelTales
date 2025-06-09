import { Globe } from "lucide-react";

export function MainLoader() {
	return (
		<div className='relative flex h-screen flex-col items-center justify-center overflow-hidden'>
			<div className='relative h-32 w-32'>
				<Globe className='animate-spin-slow h-32 w-32 text-green-500' />
			</div>
		</div>
	);
}
