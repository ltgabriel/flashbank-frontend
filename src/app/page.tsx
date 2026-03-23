'use client' 
import Image from "next/image";
import { useEffect, useRef, useMemo } from 'react'
import { useQueryState } from 'nuqs'
import { useTransactionHistory } from '@/features/transactions/hooks/usetransactionhistory'
import { TransactionItem } from '@/components/transaction-list/transactionItem'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/debounce'

export default function Home() {
  const { 
    transactions, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage,
    isFetchingNextPage,
    markAsReviewed,
    isMarkingAsReviewed
  } = useTransactionHistory({ accountId: 'prueba123' })

  // Filtros con nuqs (se guardan en la URL)
  const [tipo, setTipo] = useQueryState('tipo', { defaultValue: 'todos' })
  const [montoMin, setMontoMin] = useQueryState('montoMin', { defaultValue: '' })
  const [montoMax, setMontoMax] = useQueryState('montoMax', { defaultValue: '' })
  const [busqueda, setBusqueda] = useQueryState('busqueda', { defaultValue: '' })
  const [fechaDesde, setFechaDesde] = useQueryState('fechaDesde', { defaultValue: '' })
  const [fechaHasta, setFechaHasta] = useQueryState('fechaHasta', { defaultValue: '' })
  
  // Debounce solo para busqueda
  const busquedaDebounced = useDebounce(busqueda, 300)

  // filtrado de transacciones con useMemo
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions]

    // filtro por tipo
    if (tipo !== 'todos') {
      filtered = filtered.filter(tx => tx.type === tipo)
    }

    // Filtro por monto minimo
    if (montoMin !== '') {
      const min = parseFloat(montoMin)
      if (!isNaN(min)) {
        filtered = filtered.filter(tx => Math.abs(tx.amount) >= min)
      }
    }

    // Filtro por monto maximo
    if (montoMax !== '') {
      const max = parseFloat(montoMax)
      if (!isNaN(max)) {
        filtered = filtered.filter(tx => Math.abs(tx.amount) <= max)
      }
    }

    // Filtro por rango de fechas
    if (fechaDesde !== '') {
      const desde = new Date(fechaDesde)
      filtered = filtered.filter(tx => new Date(tx.createdAt) >= desde)
    }

    if (fechaHasta !== '') {
      const hasta = new Date(fechaHasta)
      hasta.setDate(hasta.getDate() + 1)
      filtered = filtered.filter(tx => new Date(tx.createdAt) <= hasta)
    }

    // Filtro por busqueda en descripcion
    if (busquedaDebounced !== '') {
      filtered = filtered.filter(tx => 
        tx.description.toLowerCase().includes(busquedaDebounced.toLowerCase())
      )
    }

    return filtered
  }, [transactions, tipo, montoMin, montoMax, busquedaDebounced, fechaDesde, fechaHasta])

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

  // Estado vacio
  if (filteredTransactions.length === 0 && !isLoading) {
    return (
      <main className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">FlashBank</h1>
        <div className="text-center py-10 text-gray-500">
          No hay transacciones para mostrar
        </div>
      </main>
    )
  }

  // Error
  if (error) {
    return (
      <main className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">FlashBank</h1>
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">Error: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            aria-label="Reintentar carga de transacciones"
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
      
      {/* Filtros */}
      <div className="mb-6 space-y-3 p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-4">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            aria-label="Filtrar por tipo de transacción"
            className="px-3 py-2 border rounded"
          >
            <option value="todos">Todos</option>
            <option value="credit">Crédito</option>
            <option value="debit">Débito</option>
          </select>
          
          <input
            type="number"
            placeholder="Monto mínimo"
            value={montoMin}
            onChange={(e) => setMontoMin(e.target.value)}
            aria-label="Monto mínimo a filtrar"
            className="px-3 py-2 border rounded w-32"
          />
          
          <input
            type="number"
            placeholder="Monto máximo"
            value={montoMax}
            onChange={(e) => setMontoMax(e.target.value)}
            aria-label="Monto máximo a filtrar"
            className="px-3 py-2 border rounded w-32"
          />
        </div>
        
        <div className="flex gap-4">
          <input
            type="date"
            placeholder="Desde"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            aria-label="Fecha desde"
            className="px-3 py-2 border rounded"
          />
          
          <input
            type="date"
            placeholder="Hasta"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            aria-label="Fecha hasta"
            className="px-3 py-2 border rounded"
          />
        </div>
        
        <input
          type="text"
          placeholder="Buscar por descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar por descripción"
          className="w-full px-3 py-2 border rounded"
        />
        
        <div className="text-sm text-gray-500">
          Mostrando {filteredTransactions.length} de {transactions.length} transacciones
        </div>
      </div>
      
      <div className="space-y-3">
        {filteredTransactions.map((tx) => (
          <TransactionItem
            key={tx.id}
            id={tx.id}
            amount={tx.amount}
            type={tx.type}
            status={tx.status}
            description={tx.description}
            createdAt={tx.createdAt}
            reviewed={tx.reviewed}
            onMarkAsReviewed={markAsReviewed}
            isMarking={isMarkingAsReviewed}
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