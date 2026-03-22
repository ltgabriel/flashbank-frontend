// src/features/transactions/hooks/useTransactionHistory.ts

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTransactions, type Transaction } from '@/services/api'

export function useTransactionHistory({ accountId }: { accountId: string }) {
  const queryClient = useQueryClient()

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['transactions', accountId],
    queryFn: ({ pageParam = 0 }) => fetchTransactions(accountId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
  })

  // Mutación para marcar como revisada
  const markAsReviewedMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      // Simular llamada al API
      await new Promise(resolve => setTimeout(resolve, 500))
      return { success: true, transactionId }
    },
    onMutate: async (transactionId) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: ['transactions', accountId] })

      // Guardar estado anterior
      const previousTransactions = queryClient.getQueryData(['transactions', accountId])

      // Actualizar UI optimistamente
      queryClient.setQueryData(['transactions', accountId], (old: any) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((tx: Transaction) =>
              tx.id === transactionId ? { ...tx, reviewed: true } : tx
            ),
          })),
        }
      })

      return { previousTransactions }
    },
    onError: (err, transactionId, context) => {
      // Rollback si falla
      if (context?.previousTransactions) {
        queryClient.setQueryData(['transactions', accountId], context.previousTransactions)
      }
    },
  })

  const transactions = data?.pages.flatMap(page => page.data) ?? []

  return {
    transactions,
    isLoading,
    error: error as Error | null,
    hasNextPage: !!hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    markAsReviewed: markAsReviewedMutation.mutate,
    isMarkingAsReviewed: markAsReviewedMutation.isPending,
  }
}