import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function PostLoader() {
	return (
		<Card className='mx-auto'>
			<CardHeader className='space-y-4'>
				<Skeleton className='h-8 w-3/4' />
				<div className='flex items-center space-x-3'>
					<Skeleton className='h-10 w-10 rounded-full' />
					<Skeleton className='h-4 w-24' />
				</div>
				<div className='flex flex-wrap gap-2'>
					<Skeleton className='h-6 w-16' />
					<Skeleton className='h-6 w-16' />
				</div>
			</CardHeader>
			<CardContent>
				<Skeleton className='h-4 w-full' />
				<Skeleton className='mt-2 h-4 w-5/6' />
			</CardContent>
		</Card>
	);
}
