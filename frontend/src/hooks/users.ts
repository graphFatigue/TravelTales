'use client';

import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import api from '../lib/api/api';
import { AssignRoleRequest, Role, UsersResponse } from '@/types/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useUsers(filters: Record<string, any> = {}) {
	return useInfiniteQuery<UsersResponse, Error>({
		queryKey: ['users', filters],
		queryFn: async context => {
			const pageParam =
				typeof context.pageParam === 'number' ? context.pageParam : 1;
			const params = new URLSearchParams();
			params.set('Page', pageParam.toString());
			params.set('PageSize', '10');

			if (filters.field && filters.value) {
				const backendField = filters.field.toLowerCase();
				params.set('Filters', `${backendField}@=*${filters.value}`);
			}

			const { data } = await api.get<UsersResponse>(
				`/api/Users/filter?${params}`,
			);
			return data;
		},
		getNextPageParam: lastPage => {
			return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
		},
		initialPageParam: 1,
	});
}

export const useDeleteUser = () => {
	return useMutation({
		mutationFn: async (userId: string) => {
			await api.delete(`/api/Users/${userId}`);
		},
	});
};

export const useRoles = () => {
	return useQuery<Role[]>({
		queryKey: ['roles'],
		queryFn: async () => {
			const { data } = await api.get(`/api/Roles`);
			return data;
		},
	});
};

export const useAssignRole = () => {
	return useMutation({
		mutationFn: async (request: AssignRoleRequest) => {
			await api.post(`/api/Users/assign-role`, request);
		},
	});
};
