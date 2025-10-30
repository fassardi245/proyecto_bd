import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function SociosDelPlan({ params }: { params: { planId: string } }) {
  const planId = Number(params.planId);

  // Obtenemos el plan actual (para mostrar su nombre)
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    select: { tipo: true },
  });

  const socios = await prisma.socio.findMany({
    where: { planId },
    include: { pagos: true },
    orderBy: { apellido: "asc" },
  });

  // Calcular deuda y color de fila
  const filas = socios.map((s) => {
    const deudaTotal = s.pagos
      .filter((p) => p.estado === "vencido")
      .reduce((acc, p) => acc + p.monto, 0);

    let tipo = "Al día";
    let color = "bg-green-400";
    if (deudaTotal > 0 && deudaTotal < 30000) {
      tipo = "Deuda leve";
      color = "bg-yellow-300";
    } else if (deudaTotal >= 30000) {
      tipo = "Deuda grave";
      color = "bg-red-500 text-white";
    }

    return {
      id: s.id,
      nombre: `${s.nombre} ${s.apellido}`,
      tipo,
      deudaTotal,
      color,
    };
  });

  return (
    <main className="flex flex-col items-center justify-start min-h-[85vh] px-6 pt-20 pb-10 bg-white">
      {/* TÍTULO CON EL NOMBRE DEL PLAN */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight mb-14 text-center">
        Socios y sus deudas del plan{" "}
        <span className="text-black-500">{plan?.tipo ?? "no encontrado"}</span>
      </h1>

      {/* TABLA */}
      <div className="rounded-xl overflow-hidden shadow-xl w-full max-w-4xl border border-gray-200">
        <div className="grid grid-cols-3 bg-gradient-to-r from-orange-400 to-orange-500 font-semibold text-black p-4 text-center text-lg">
          <div>Nombre</div>
          <div>Tipo de deuda</div>
          <div>Monto que debe</div>
        </div>

        {filas.length > 0 ? (
          filas.map((f) => (
            <Link
              key={f.id}
              href={`/dashboard/planes/${planId}/${f.id}`}
              className={`grid grid-cols-3 items-center p-4 text-center text-base font-medium border-b border-white/20 ${f.color} hover:brightness-95 hover:scale-[1.01] transition-all cursor-pointer`}
            >
              <div className="font-semibold">{f.nombre}</div>
              <div>{f.tipo}</div>
              <div>${f.deudaTotal.toLocaleString("es-AR")}</div>
            </Link>
          ))
        ) : (
          <div className="text-center text-gray-600 py-8 bg-orange-50">
            No hay socios registrados en este plan.
          </div>
        )}
      </div>

      {/* BOTÓN VOLVER */}
      <Link
        href="/dashboard/planes"
        className="mt-10 bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-md font-semibold text-sm shadow-md transition-all"
      >
        Volver a Planes
      </Link>
    </main>
  );
}
