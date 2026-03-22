// src/features/transactions/hooks/useTransactionHistory.ts

import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchTransactions } from '@/services/api'

export function useTransactionHistory({ accountId }: { accountId: string }) {
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
    staleTime: 1000 * 60 * 5, // 5 minutos sin recargar
  })

  const transactions = data?.pages.flatMap(page => page.data) ?? []

  return {
    transactions,
    isLoading,
    error: error as Error | null,
    hasNextPage: !!hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  }
}