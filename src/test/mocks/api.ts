import { Transaction } from '@/services/api'

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    accountId: 'test-123',
    amount: 150,
    type: 'credit',
    status: 'completed',
    description: 'Transferencia',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    accountId: 'test-123',
    amount: -50,
    type: 'debit',
    status: 'pending',
    description: 'Compra',
    createdAt: new Date().toISOString(),
  },
]

export const fetchTransactions = async (accountId: string, page: number = 0, pageSize: number = 20) => {
  await new Promise(resolve => setTimeout(resolve, 100))
  const filtered = mockTransactions.filter(tx => tx.accountId === accountId)
  const start = page * pageSize
  const data = filtered.slice(start, start + pageSize)
  const hasMore = start + pageSize < filtered.length
  
  return {
    data,
    nextPage: hasMore ? page + 1 : null,
    hasMore,
  }
}