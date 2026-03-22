'use client' 
import Image from "next/image";
import { useEffect, useRef } from 'react'
import { useTransactionHistory } from '@/features/transactions/hooks/usetransactionhistory'
import { TransactionItem } from '@/components/transaction-list/transactionItem'
import { Skeleton } from '@/components/ui/skeleton'

export default function Home() {
  const { 
    transactions, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage,
    isFetchingNextPage 
  } = useTransactionHistory({ accountId: 'prueba123' })

  const loaderRef = useRef<HTMLDivElement>(null)

  // Scroll infinito
  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Skeleton loading
  if (isLoading) {
    return (
      <main className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">FlashBank</h1>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} />
          ))}
        </div>
      </main>
    )
  }

  // Estado vacío
  if (transactions.length === 0) {
    return (
      <main className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">FlashBank</h1>
        <div className="text-center py-10 text-gray-500">
          No hay transacciones para mostrar
        </div>
      </main>
    )
  }

  // Error con botón reintentar
  if (error) {
    return (
      <main className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">FlashBank</h1>
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">Error: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </main>
    )
  }

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

      {/* Loader para scroll infinito */}
      <div ref={loaderRef} className="py-4 text-center">
        {isFetchingNextPage && <span>Cargando más transacciones...</span>}
        {!hasNextPage && transactions.length > 0 && (
          <span className="text-gray-500">No hay más transacciones</span>
        )}
      </div>
    </main>
  )
}