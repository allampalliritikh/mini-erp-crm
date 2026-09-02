interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  keyField: keyof T;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export default function Table<T>({
  columns,
  rows,
  keyField,
  onRowClick,
  emptyMessage = "No data found.",
}: TableProps<T>) {
  return (
    <table className="w-full bg-white rounded shadow-sm">
      <thead>
        <tr className="border-b text-left text-sm text-gray-600">
          {columns.map((col, i) => (
            <th key={i} className="p-3">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={String(row[keyField])}
            className={`border-b ${onRowClick ? "hover:bg-gray-50 cursor-pointer" : ""}`}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((col, i) => (
              <td key={i} className="p-3">
                {col.render(row)}
              </td>
            ))}
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td colSpan={columns.length} className="p-6 text-center text-gray-400">
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}