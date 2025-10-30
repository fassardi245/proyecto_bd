import { prisma } from '@/lib/prisma'

export default async function AsistenciasPage() {
  const asistencias = await prisma.asistencia.findMany({
    where: { socio: { estado: 'activo' } },
    include: { socio: true, rutina: true },
    orderBy: { fecha: 'desc' },
  })

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date))

  return (
    <main className="flex flex-col items-center justify-start min-h-[85vh] px-6 pt-20 pb-10 bg-white">
      <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight mb-12 text-center">
        Registro de Asistencias
      </h1>

      <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-5xl border border-gray-200">
        <div className="grid grid-cols-3 bg-gradient-to-r from-orange-400 to-orange-500 font-semibold text-black p-3 text-center text-lg">
          <div>Nombre y Apellido</div>
          <div>Rutina</div>
          <div>Fecha</div>
        </div>

        {asistencias.length > 0 ? (
          asistencias.map((a, i) => (
            <div
              key={a.id}
              className={`grid grid-cols-3 items-center text-center text-base font-medium py-3 px-2 transition-all duration-200 ${
                i % 2 === 0 ? 'bg-orange-50' : 'bg-orange-100'
              } hover:bg-orange-200/70 border-b border-gray-300`}
            >
              <div className="font-semibold text-neutral-800">
                {a.socio ? `${a.socio.nombre} ${a.socio.apellido}` : '—'}
              </div>
              <div className="capitalize text-neutral-700">
                {a.rutina?.nombre ?? '—'}
              </div>
              <div className="text-neutral-700">{formatDate(a.fecha)}</div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600 py-8 bg-orange-50 text-lg">
            No hay asistencias registradas.
          </div>
        )}
      </div>
    </main>
  )
}
