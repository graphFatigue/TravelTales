'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	useCategories,
	useCreateCategory,
	useDeleteCategory,
	useUpdateCategory,
} from '@/hooks/useCategories';
import { Category } from '@/types/types';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CategoryForm } from './CategoryForm';
import { CategoryFormValues } from '@/lib/validation';

export function CategoryList() {
	const { data: categories, isLoading, error } = useCategories();
	const deleteCategory = useDeleteCategory();

	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);

	const createCategory = useCreateCategory();
	const updateCategory = useUpdateCategory();

	const handleCreateSubmit = (values: CategoryFormValues) => {
		createCategory.mutate(values, {
			onSuccess: () => {
				setIsCreateDialogOpen(false);
			},
		});
	};

	const handleUpdateSubmit = (values: CategoryFormValues) => {
		if (!editingCategory) return;

		updateCategory.mutate(
			{ id: editingCategory.id, data: values },
			{
				onSuccess: () => {
					setEditingCategory(null);
				},
			},
		);
	};

	if (isLoading) {
		return (
			<div className='flex h-64 items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	if (error) {
		return (
			<div className='text-red-500'>
				Error loading categories: {error.message}
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Categories</h1>
				<Button onClick={() => setIsCreateDialogOpen(true)}>
					<Plus className='mr-2 h-4 w-4' />
					Add Category
				</Button>
			</div>

			<div className='divide-y rounded-lg border'>
				{categories?.map(category => (
					<div
						key={category.id}
						className='flex items-center justify-between p-4 hover:bg-gray-50'
					>
						<div>
							<div>
								<h3 className='font-medium'>{category.name}</h3>
								<p className='text-sm text-gray-500'>{category.description}</p>
							</div>
							<div>
								<h3 className='font-medium'>{category.nameUa}</h3>
								<p className='text-sm text-gray-500'>
									{category.descriptionUa}
								</p>
							</div>
						</div>
						<div className='flex space-x-2'>
							<Button
								variant='outline'
								size='sm'
								onClick={() => setEditingCategory(category)}
							>
								Edit
							</Button>
							<Button
								variant='destructive'
								size='sm'
								onClick={() => deleteCategory.mutate(category.id)}
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						</div>
					</div>
				))}
			</div>

			<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Category</DialogTitle>
					</DialogHeader>
					<CategoryForm
						onSubmit={handleCreateSubmit}
						isSubmitting={createCategory.isPending}
					/>
				</DialogContent>
			</Dialog>

			<Dialog
				open={!!editingCategory}
				onOpenChange={open => !open && setEditingCategory(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Category</DialogTitle>
					</DialogHeader>
					{editingCategory && (
						<CategoryForm
							defaultValues={{
								name: editingCategory.name,
								description: editingCategory.description,
								nameUa: editingCategory.nameUa,
								descriptionUa: editingCategory.descriptionUa,
							}}
							onSubmit={handleUpdateSubmit}
							isSubmitting={updateCategory.isPending}
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
