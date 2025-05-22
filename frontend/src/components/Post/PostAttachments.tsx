import { cn, getFileType } from '@/lib/utils';
import { Attachment } from '@/types/types';
import { Paperclip } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PostAttachments({
	attachments,
	width,
	height,
	classname,
}: {
	attachments: Attachment[] | undefined;
	width?: number;
	height?: number;
	classname?: string;
}) {
	return (
		<>
			{attachments?.map(attachment => {
				const fileType = getFileType(attachment.uri);

				return (
					<div key={attachment.id} className={cn('space-y-3', classname)}>
						{fileType === 'image' ? (
							<div className='relative min-h-[80px] min-w-[120px] flex-shrink-0 overflow-hidden rounded-md'>
								<Image
									src={attachment.uri}
									alt={`Attachment ${attachment.number}`}
									width={width}
									height={height}
									fill={width && height ? false : true}
									className='h-auto w-full object-cover'
								/>
							</div>
						) : (
							<div className='flex items-center space-x-3 rounded-md border p-3'>
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
						)}
					</div>
				);
			})}
		</>
	);
}
