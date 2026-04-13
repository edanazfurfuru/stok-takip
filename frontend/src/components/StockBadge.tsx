interface Props {
  quantity: number;
  isLowStock: boolean;
}

export default function StockBadge({ quantity, isLowStock }: Props) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
      isLowStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
    }`}>
      {isLowStock && <span>⚠️</span>}
      {quantity}
    </span>
  );
}
