function Warehouse() {
  return (
    <div>
      <h1>Warehouse Page</h1>
      <HomeAdmin />   {/* ❌ Error karena HomeAdmin tidak di-import */}
    </div>
  );
}

export default Warehouse;
