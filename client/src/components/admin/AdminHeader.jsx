export default function AdminHeader({ title }) {
  return (
    <header className="mb-8 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-700">{title}</h1>
      {/* Add logout/profile buttons here if you want */}
    </header>
  );
}
