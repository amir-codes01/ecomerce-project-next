interface Column {
  header: string;
  accessor: string;
}

interface Props {
  columns: Column[];
  data: any[];
}

export default function DataTable({ columns, data }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto">
      <table className="w-full">
        <thead className="border-b">
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} className="p-3 text-left">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.accessor} className="p-3">
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
