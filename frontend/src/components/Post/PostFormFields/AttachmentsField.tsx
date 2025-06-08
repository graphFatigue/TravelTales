/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { Plus, Trash } from 'lucide-react';
import Image from 'next/image';

interface Attachment {
	id?: number;
	number: number;
	previewUrl?: string;
	type?: string;
	file?: File;
}

interface AttachmentsFieldProps {
	attachments: Attachment[];
	handleFileChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number,
	) => void;
	removeAttachment: (index: number) => void;
	addAttachmentField: () => void;
	errors?: any;
	t: (key: string) => string;
}

export function AttachmentsField({
	attachments,
	handleFileChange,
	removeAttachment,
	addAttachmentField,
	errors,
	t,
}: AttachmentsFieldProps) {
	return (
		<div>
			<FormLabel>{t('post.attachments')}</FormLabel>
			<div className='space-y-4'>
				{attachments?.map((attachment, index) => (
					<div key={index || attachment.id}>
						<div className='flex items-center gap-4'>
							<input
								type='file'
								id={`attachment-${index}`}
								className='hidden'
								onChange={e => handleFileChange(e, index)}
								accept='image/jpeg, image/png, video/mp4, video/mov'
							/>
							<label
								htmlFor={`attachment-${index}`}
								className='flex-1 cursor-pointer rounded-md border p-4 hover:bg-accent'
							>
								{attachment.previewUrl ? (
									<div className='relative h-40 w-full'>
										{attachment.type === 'video' ? (
											<video controls className='h-full w-full object-contain'>
												<source
													src={attachment.previewUrl}
													type={attachment.file?.type}
												/>
											</video>
										) : (
											<Image
												src={attachment.previewUrl}
												alt={`Preview ${attachment.number}`}
												fill
												className='object-contain'
												sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
											/>
										)}
									</div>
								) : (
									<div className='text-center text-muted-foreground'>
										<Plus className='mx-auto h-8 w-8' />
										<p>
											{t('post.addAttachments')} {attachment.number}
										</p>
									</div>
								)}
							</label>

							<Button
								type='button'
								variant='ghost'
								size='icon'
								onClick={() => removeAttachment(index)}
							>
								<Trash className='h-4 w-4 text-destructive' />
							</Button>
						</div>
						{errors?.[index]?.file && (
							<p className='text-sm text-destructive'>
								{errors[index]?.file?.message}
							</p>
						)}
					</div>
				))}
				<Button type='button' variant='outline' onClick={addAttachmentField}>
					<Plus className='mr-2 h-4 w-4' />
					{t('post.addAttachmentsButton')}
				</Button>
			</div>
		</div>
	);
}
