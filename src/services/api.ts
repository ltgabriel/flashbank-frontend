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
// Simularemos datos fijos 
const mockTransactions: Transaction[] = [
  {
    id: '1',
    accountId: 'prueba123',  
    amount: 150.00,
    type: 'credit',
    status: 'completed',
    description: 'Transferencia recibida',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    accountId: 'prueba123',  
    amount: -50.00,
    type: 'debit',
    status: 'completed',
    description: 'Compra supermercado',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    accountId: 'prueba123', 
    amount: -200.00,
    type: 'debit',
    status: 'pending',
    description: 'Pago servicios',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    accountId: 'prueba123', 
    amount: 500.00,
    type: 'credit',
    status: 'completed',
    description: 'Depósito',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '5',
    accountId: 'prueba123',  
    amount: -30.00,
    type: 'debit',
    status: 'failed',
    description: 'Retiro atm',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
]

// Simular API con datos fijos
export const fetchTransactions = async (accountId: string, page: number = 0, pageSize: number = 20) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Filtrar por accountId
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