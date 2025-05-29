export default function SummaryCard({ title, value }) {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col items-center justify-center">
      <p className="text-gray-500 uppercase text-sm">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
