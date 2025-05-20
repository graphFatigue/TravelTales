import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import avatarPlaceholder from '@/assets/avatar-placeholder.png';
import { Blogger } from '@/types/user';
import { CalendarIcon, Camera } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Resizer from 'react-image-file-resizer';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import CropImageDialog from '@/components/CropImageDialog';
import { format } from 'date-fns';
import {
	UpdateBloggerProfileValues,
	useProfileMutations,
} from '@/hooks/useProfileMutations';
import { useLocationInfo } from '@/hooks/useLocationInfo';
import LoadingButton from '@/components/LoadingButton';

interface EditBloggerProfileDialogProps {
	blogger: Blogger;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function EditBloggerProfileDialog({
	blogger,
	open,
	onOpenChange,
}: EditBloggerProfileDialogProps) {
	const form = useForm<UpdateBloggerProfileValues>({
		defaultValues: {
			firstName: blogger.firstName,
			lastName: blogger.lastName,
			birthDate: blogger.birthDate ? new Date(blogger.birthDate) : undefined,
			sex: blogger.sex,
			bio: blogger.bio || '',
			countryId: blogger.countryId || undefined,
			cityId: blogger.cityId || undefined,
		},
	});

	const [croppedAvatar, setCroppedAvatar] = useState<Blob | null | undefined>(
		undefined,
	);
	const countryId = form.watch('countryId');

	const mutation = useProfileMutations(blogger.id);

	const { countries, cities, loadingCities, loadingCountries } =
		useLocationInfo(countryId);

	async function onSubmit(values: UpdateBloggerProfileValues) {
		try {
			mutation.mutate(
				{
					values,
					blob: croppedAvatar,
				},
				{
					onSuccess: () => {
						setCroppedAvatar(undefined);
						onOpenChange(false);
					},
				},
			);
		} catch (error) {
			console.error('Failed to update profile:', error);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit profile</DialogTitle>
				</DialogHeader>
				<div className='space-y-1.5'>
					<Label>Avatar</Label>
					<AvatarInput
						src={
							croppedAvatar
								? URL.createObjectURL(croppedAvatar)
								: blogger.image || avatarPlaceholder
						}
						onImageCropped={setCroppedAvatar}
					/>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
						<div className='grid grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='firstName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input placeholder='First name' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='lastName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input placeholder='Last name' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name='birthDate'
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormLabel>Date of birth</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={'outline'}
													className={cn(
														'w-[240px] pl-3 text-left font-normal',
														!field.value && 'text-muted-foreground',
													)}
												>
													{field.value ? (
														format(field.value, 'PPP')
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className='w-auto p-0' align='start'>
											<Calendar
												mode='single'
												selected={field.value}
												onSelect={field.onChange}
												disabled={date =>
													date > new Date() || date < new Date('1900-01-01')
												}
												initialFocus
											/>
										</PopoverContent>
									</Popover>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='sex'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Gender</FormLabel>
									<Select
										onValueChange={value => field.onChange(Number(value))}
										value={field.value?.toString()}
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

						<FormField
							control={form.control}
							name='countryId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Country</FormLabel>
									<Select
										onValueChange={value => {
											field.onChange(Number(value));
											form.setValue('cityId', undefined);
										}}
										value={field.value?.toString()}
										disabled={loadingCountries}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select country' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{countries?.map(country => (
												<SelectItem
													key={country.id}
													value={country.id.toString()}
												>
													{country.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='cityId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>City</FormLabel>
									<Select
										onValueChange={value => field.onChange(Number(value))}
										value={field.value?.toString()}
										disabled={!countryId || loadingCities}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select city' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{cities?.map(city => (
												<SelectItem key={city.id} value={city.id.toString()}>
													{city.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='bio'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bio</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Tell us a little bit about yourself'
											className='resize-none'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<LoadingButton type='submit' loading={mutation.isPending}>
								Save
							</LoadingButton>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

interface AvatarInputProps {
	src: string | StaticImageData;
	onImageCropped: (blob: Blob | null) => void;
}

function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
	const [imageToCrop, setImageToCrop] = useState<File>();

	const fileInputRef = useRef<HTMLInputElement>(null);

	function onImageSelected(image: File | undefined) {
		if (!image) return;

		Resizer.imageFileResizer(
			image,
			1024,
			1024,
			'WEBP',
			100,
			0,
			uri => setImageToCrop(uri as File),
			'file',
		);
	}

	return (
		<>
			<input
				type='file'
				accept='image/*'
				onChange={e => onImageSelected(e.target.files?.[0])}
				ref={fileInputRef}
				className='sr-only hidden'
			/>
			<button
				type='button'
				onClick={() => fileInputRef.current?.click()}
				className='group relative block'
			>
				<Image
					src={src}
					alt='Avatar preview'
					width={150}
					height={150}
					className='size-32 flex-none rounded-full object-cover'
				/>
				<span className='absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25'>
					<Camera size={24} />
				</span>
			</button>
			{imageToCrop && (
				<CropImageDialog
					src={URL.createObjectURL(imageToCrop)}
					cropAspectRatio={1}
					onCropped={onImageCropped}
					onClose={() => {
						setImageToCrop(undefined);
						if (fileInputRef.current) {
							fileInputRef.current.value = '';
						}
					}}
				/>
			)}
		</>
	);
}
