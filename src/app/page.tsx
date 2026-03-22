'use client' 
import Image from "next/image";
import { useTransactionHistory } from '@/features/transactions/hooks/usetransactionhistory'
import { TransactionItem } from '@/components/transaction-list/transactionItem'

export default function Home() {
  const { transactions, isLoading, error } = useTransactionHistory({ accountId: 'prueba123' })

  if (isLoading) return <div className="p-4 text-center">Cargando transacciones...</div>
  
  if (error) return (
    <div className="p-4 text-center text-red-500">
      Error: {error.message}
    </div>
  )

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">FlashBank</h1>
      
      <div className="space-y-3">
        {transactions.map((tx) => (
          <TransactionItem
            key={tx.id}
            id={tx.id}
            amount={tx.amount}
            type={tx.type}
            status={tx.status}
            description={tx.description}
            createdAt={tx.createdAt}
          />
        ))}
      </div>
    </main>
  )
}