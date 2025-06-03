import { cn, getFileType } from '@/lib/utils';
import { Attachment } from '@/types/types';
import { Paperclip } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PostAttachments({
	attachments,
	classname,
	variant = 'default',
}: {
	attachments: Attachment[] | undefined;
	classname?: string;
	variant?: 'default' | 'preview' | 'card';
}) {
	const containerClasses = cn(
		'relative flex-shrink-0 overflow-hidden rounded-md bg-gray-100',
		{
			'w-full aspect-video': variant === 'card',
			'w-[160px] aspect-video': variant === 'preview',
		},
		classname,
	);
	return (
		<>
			{attachments?.map(attachment => {
				const fileType = getFileType(attachment.uri);
				return (
					<div key={attachment.id} className={containerClasses}>
						{fileType === 'image' ? (
							<Image
								src={attachment.uri}
								alt={`Attachment ${attachment.number}`}
								fill
								className='object-cover'
								sizes={
									variant === 'preview'
										? '(max-width: 768px) 160px, 160px'
										: '(max-width: 768px) 100vw, 800px'
								}
							/>
						) : fileType === 'video' ? (
							<video controls className='h-full w-full bg-black object-contain'>
								<source
									src={attachment.uri}
									type={`video/${attachment.uri.split('.').pop()}`}
								/>
								Your browser does not support the video tag.
							</video>
						) : (
							<div className='flex h-full items-center justify-center p-4'>
								<div className='flex items-center space-x-3'>
									<Paperclip className='h-8 w-8 text-muted-foreground' />
									<div className='overflow-hidden'>
										<p className='truncate font-medium'>
											Attachment {attachment.number} ({fileType})
										</p>
										<Link
											href={attachment.uri}
											className='text-sm text-blue-600 hover:underline'
											target='_blank'
											rel='noopener noreferrer'
										>
											Download
										</Link>
									</div>
								</div>
							</div>
						)}
					</div>
				);
			})}
		</>
	);
}
