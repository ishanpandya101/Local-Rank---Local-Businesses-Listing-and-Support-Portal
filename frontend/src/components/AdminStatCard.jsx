function AdminStatCard({ title, value }) {
  return (
    <div className="
      bg-glass border border-white/10 rounded-xl p-6
      transition-transform duration-300 hover:scale-[1.02]
    ">
      <p className="text-white/70">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}

export default AdminStatCard;
