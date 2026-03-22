'use client' 
import Image from "next/image";
import { useTransactionHistory } from '@/features/transactions/hooks/usetransactionhistory'
  
export default function Home() {
  const { transactions, isLoading, error } = useTransactionHistory({ accountId: 'prueba123' })

  if (isLoading) return <div className="p-4">Cargando...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">FlashBank</h1>
      <p>Transacciones: {transactions.length}</p>
      <pre className="text-xs mt-4">{JSON.stringify(transactions, null, 2)}</pre>
    </main>
  )
}