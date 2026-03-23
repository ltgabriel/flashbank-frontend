import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTransactionHistory } from './usetransactionhistory'

vi.mock('@/services/api', () => ({
  fetchTransactions: vi.fn(),
}))

import { fetchTransactions } from '@/services/api'

describe('useTransactionHistory', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    vi.clearAllMocks()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }

  it('deberia cargar transacciones correctamente', async () => {
    const mockData = {
      data: [
        {
          id: '1',
          accountId: 'test-123',
          amount: 100,
          type: 'credit',
          status: 'completed',
          description: 'test',
          createdAt: new Date().toISOString(),
        },
      ],
      nextPage: null,
      hasMore: false,
    }

    const mockFetch = fetchTransactions as unknown as ReturnType<typeof vi.fn>
    mockFetch.mockResolvedValue(mockData)

    const { result } = renderHook(() => useTransactionHistory({ accountId: 'test-123' }), { wrapper })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.transactions).toHaveLength(1)
    expect(result.current.transactions[0].amount).toBe(100)
    expect(mockFetch).toHaveBeenCalledWith('test-123', 0)
  })

  it('deberia manejar error al cargar transacciones', async () => {
    const mockFetch = fetchTransactions as unknown as ReturnType<typeof vi.fn>
    mockFetch.mockRejectedValue(new Error('Error de red'))

    const { result } = renderHook(() => useTransactionHistory({ accountId: 'test-123' }), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeDefined()
  })
})