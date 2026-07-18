function DashboardAdmin() {
    const usuario = JSON.parse(
        localStorage.getItem("usuarioClassHub")
    );
return (
    <main>
        <h1>Dashboard del Administrador</h1>

        <p>
            Bienvenido, {usuario?.nombre || "Administrador"}
        </p>
    </main>
);
}

export default DashboardAdmin