const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    <table className="w-full mt-4 border-collapse">
      <thead>
        <tr className="text-left text-gray-500 text-sm bg-gray-50">
          {columns.map((col) => (
            <th 
              key={col.accessor} 
              className={`px-4 py-3 font-medium ${col.className || ''}`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {data.length > 0 ? (
          data.map((item, index) => (
            <tr key={index} className="hover:bg-purple-50 transition-colors">
              {renderRow(item)}
            </tr>
          ))
        ) : (
          <tr>
            <td 
              colSpan={columns.length} 
              className="text-center py-8 text-gray-400"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">📋</span>
                <p>No data available</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
