interface TransactionItemProps {
  id: string
  amount: number
  type: 'credit' | 'debit'
  status: 'pending' | 'completed' | 'failed'
  description: string
  createdAt: string
  reviewed?: boolean
  onMarkAsReviewed?: (id: string) => void
  isMarking?: boolean
}

export function TransactionItem({ id, amount, type, status, description, createdAt, reviewed, onMarkAsReviewed, isMarking }: TransactionItemProps) {
  // Formatear monto
  const formattedAmount = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(amount))

  // Color segun tipo
  const amountColor = type === 'credit' ? 'text-green-600' : 'text-red-600'
  const amountSign = type === 'credit' ? '+' : '-'

  // Color segun estado
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  }

  // Texto según estado
  const statusText = {
    pending: 'Pendiente',
    completed: 'Completado',
    failed: 'Fallido',
  }

  // Texto para lectores de pantalla
  const statusAriaLabel = {
    pending: 'Pendiente',
    completed: 'Completado',
    failed: 'Fallido',
  }

  // Fecha relativa
  const getRelativeTime = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours} h`
    return `Hace ${diffDays} d`
  }

  return (
    <div 
      role="listitem"
      aria-label={`Transacción: ${description}, ${type === 'credit' ? 'Crédito' : 'Débito'}, ${Math.abs(amount)} dólares, ${statusAriaLabel[status]}`}
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
    >
      <div className="flex-1">
        <p className="font-medium">{description}</p>
        <p className="text-sm text-gray-500">{getRelativeTime(createdAt)}</p>
        {reviewed && (
          <span className="text-xs text-blue-500" aria-label="Revisada">✓ revisada</span>
        )}
      </div>
      
      <div className="text-right">
        <p className={`text-lg font-semibold ${amountColor}`} aria-label={`Monto: ${amountSign} ${formattedAmount}`}>
          {amountSign} {formattedAmount}
        </p>
        <span 
          className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}
          aria-label={`Estado: ${statusText[status]}`}
        >
          {statusText[status]}
        </span>
        {/* Boton para marcar como revisada */}
        {onMarkAsReviewed && !reviewed && (
          <button
            onClick={() => onMarkAsReviewed(id)}
            disabled={isMarking}
            aria-label={isMarking ? 'marcando como revisada...' : 'marcar transaccion como revisada'}
            className="mt-2 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isMarking ? 'marcando...' : 'marcar como revisada'}
          </button>
        )}
      </div>
    </div>
  )
}