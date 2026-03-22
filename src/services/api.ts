// Mock api para desarrollo
// simularemos el endpoint GET /accounts/:id/history
export interface Transaction {
  id: string
  accountId: string
  amount: number
  type: 'credit' | 'debit'
  status: 'pending' | 'completed' | 'failed'
  description: string
  createdAt: string
  reviewed?: boolean
}