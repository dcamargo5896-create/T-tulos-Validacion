const { useState, useEffect } = React;

function generateId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function generateUuid() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function makeEmptyForm() {
  return {
    id: generateId(),
    nombre: '',
    curp: '',
    nivel: 'PREPARATORIA',
    cct: '09DEX0001S',
    folio: 'H ' + Math.floor(1000000 + Math.random() * 9000000),
    lugarExpedicion: 'ATIZAPÁN DE ZARAGOZA, EDO. MEX.',
    fechaExpedicion: new Date().toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).toUpperCase(),
    director: 'BEATRIZ JUMENEZ AGUILAR',
    cargoDirector: 'DIRECTORA DE SISTEMAS ABIERTOS',
    fotoUrl: '',
    uuid: generateUuid(),
    hashSello: 'SHA256-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
  };
}

function App() {
  const [vista, setVista] = useState('admin');
  const [busqueda, setBusqueda] = useState('');

  const [listaAlumnos, setListaAlumnos] = useState(() => {
    try {
      const persistencia = localStorage.getItem('cefa_independent_db');
      return persistencia ? JSON.parse(persistencia) : [];
    } catch {
      return [];
    }
  });

  const [materias, setMaterias] = useState([
    { id: 1, nombre: 'MATEMÁTICAS I', calif: 9 },
    { id: 2, nombre: 'INGLÉS I', calif: 8 },
    { id: 3, nombre: 'TALLER DE REDACCIÓN I', calif: 9 },
    { id: 4, nombre: 'METODOLOGÍA DEL APRENDIZAJE', calif: 10 },
  ]);

  const [formData, setFormData] = useState(() => makeEmptyForm());
  const [promedioNum, setPromedioNum] = useState('0.0');
  const [promedioTexto, setPromedioTexto] = useState('CERO');

  useEffect(() => {
    localStorage.setItem('cefa_independent_db', JSON.stringify(listaAlumnos));
  }, [listaAlumnos]);

  useEffect(() => {
    if (materias.length === 0) {
      setPromedioNum('0.0');
      setPromedioTexto('CERO');
      return;
    }

    const suma = materias.reduce((acc, curr) => acc + Number(curr.calif || 0), 0);
    const prom = (suma / materias.length).toFixed(1);
    setPromedioNum(prom);

    const textos = {
      '5': 'CINCO',
      '6': 'SEIS',
      '7': 'SIETE',
      '8': 'OCHO',
      '9': 'NUEVE',
      '10': 'DIEZ',
    };

    const entero = Math.floor(parseFloat(prom)).toString();
    const decimal = Math.round((parseFloat(prom) % 1) * 10);

    let textoFinal = textos[entero] || 'SEIS';
    if (decimal > 0) {
      const decimalesTexto = [
        'CERO',
        'PUNTO UNO',
        'PUNTO DOS',
        'PUNTO TRES',
        'PUNTO CUATRO',
        'PUNTO CINCO',
        'PUNTO SEIS',
        'PUNTO SIETE',
        'PUNTO OCHO',
        'PUNTO NUEVE',
      ];
      textoFinal += ` ${decimalesTexto[decimal]}`;
    } else {
      textoFinal += ' PUNTO CERO';
    }

    setPromedioTexto(textoFinal);
  }, [materias]);

  const cambiarCampo = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const agregarMateria = () => {
    setMaterias((prev) => [
      ...prev,
      { id: Date.now(), nombre: `MATERIA ${prev.length + 1}`, calif: 0 },
    ]);
  };

  const actualizarCalificacion = (id, nuevaCalif) => {
    setMaterias((prev) =>
      prev.map((m) => (m.id === id ? { ...m, calif: Number(nuevaCalif) } : m))
    );
  };

  const quitarMateria = (id) => {
    setMaterias((prev) => prev.filter((m) => m.id !== id));
  };

  const registrarOActualizarAlumno = () => {
    if (!formData.nombre || !formData.curp) {
      alert('Error de Control Escolar: El Nombre y la CURP son campos requeridos.');
      return;
    }

    const expedienteCompleto = {
      ...formData,
      materias,
      promedio: promedioNum,
      promedioTexto,
    };

    const index = listaAlumnos.findIndex((a) => a.curp === formData.curp);

    if (index !== -1) {
      const clon = [...listaAlumnos];
      clon[index] = expedienteCompleto;
      setListaAlumnos(clon);
    } else {
      setListaAlumnos([expedienteCompleto, ...listaAlumnos]);
    }

    alert('Expediente escolar guardado e indexado de forma permanente.');
  };

  const cargarMuestraDemo = () => {
    setFormData({
      id: generateId(),
      nombre: 'MARCO ANTONIO BOLAÑOS ALCALA',
      curp: 'BOAM040726HMNLLRA3',
      nivel: 'PREPARATORIA',
      cct: '09DEX0001S',
      folio: 'H 8754968',
      lugarExpedicion: 'ATIZAPÁN DE ZARAGOZA, EDO. MEX.',
      fechaExpedicion: '24 DE OCTUBRE DE 2026',
      director: 'BEATRIZ JUMENEZ AGUILAR',
      cargoDirector: 'DIRECTORA DE SISTEMAS ABIERTOS',
      fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      uuid: 'e3b0c442-98fc-4c14-951c-07226756464f',
      hashSello: 'SHA256-D7A3E9F8B2C4E6A1B0C44298FC4C1495',
    });

    setMaterias([
      { id: 1, nombre: 'MATEMÁTICAS I', calif: 8 },
      { id: 2, nombre: 'INGLÉS I', calif: 8 },
      { id: 3, nombre: 'TALLER DE REDACCIÓN I', calif: 9 },
      { id: 4, nombre: 'METODOLOGÍA DE LA LECTURA', calif: 8 },
      { id: 5, nombre: 'HISTORIA MODERNA DE OCCIDENTE', calif: 8 },
      { id: 6, nombre: 'METODOLOGÍA DEL APRENDIZAJE', calif: 10 },
      { id: 7, nombre: 'PRINCIPIOS DE QUÍMICA GENERAL', calif: 8 },
      { id: 8, nombre: 'BIOLOGÍA', calif: 9 },
    ]);
  };

  const limpiarPantalla = () => {
    setFormData(makeEmptyForm());
    setMaterias([]);
  };

  const borrarExpediente = (id) => {
    if (window.confirm('¿Está seguro de eliminar este registro permanente de la base de datos?')) {
      setListaAlumnos((prev) => prev.filter((a) => a.id !== id));
      limpiarPantalla();
    }
  };

  const filtrados = listaAlumnos.filter((a) => {
    const nombre = (a.nombre || '').toLowerCase();
    const curp = (a.curp || '').toLowerCase();
    const q = busqueda.toLowerCase();
    return nombre.includes(q) || curp.includes(q);
  });

  const alumnoSeleccionado = filtrados[0] || null;

  const renderCertificado = (alumno) => {
    if (!alumno) return null;

    return (
      <div className="print-container bg-white text-slate-900 rounded-3xl border-8 border-emerald-900 cert-border cert-shadow mx-auto max-w-5xl p-8">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),transparent_55%)]"></div>
          <div className="relative">
            <div className="flex items-center justify-between border-b-2 border-emerald-900 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-900 text-white font-black text-2xl flex items-center justify-center shadow-lg">CE</div>
                <div>
                  <p className="text-xs font-bold tracking-[0.35em] text-emerald-900">CEFA</p>
                  <h2 className="text-lg font-black uppercase">Sistema Independiente de Certificación Escolar</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Folio</p>
                <p className="text-sm font-black text-emerald-900">{alumno.folio || 'N/A'}</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6">
              <div className="flex items-center justify-center">
                {alumno.fotoUrl ? (
                  <img
                    src={alumno.fotoUrl}
                    alt={alumno.nombre}
                    className="w-36 h-44 object-cover rounded-2xl border-4 border-slate-700 shadow-lg"
                  />
                ) : (
                  <div className="w-36 h-44 rounded-2xl border-4 border-slate-700 bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                    FOTO
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Certificado emitido a</p>
                  <h3 className="text-3xl font-black uppercase text-emerald-900 mt-1">{alumno.nombre}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl bg-slate-100 p-3">
                    <p className="text-[10px] uppercase text-slate-500">CURP</p>
                    <p className="font-bold text-slate-800">{alumno.curp}</p>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3">
                    <p className="text-[10px] uppercase text-slate-500">NIVEL</p>
                    <p className="font-bold text-slate-800">{alumno.nivel}</p>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3">
                    <p className="text-[10px] uppercase text-slate-500">CCT</p>
                    <p className="font-bold text-slate-800">{alumno.cct}</p>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3">
                    <p className="text-[10px] uppercase text-slate-500">F. EXPEDICIÓN</p>
                    <p className="font-bold text-slate-800">{alumno.fechaExpedicion}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-7">
                  Por este medio se certifica que el(a) estudiante arriba mencionado(a) ha concluido
                  satisfactoriamente los procesos y requisitos académicos establecidos por la institución
                  con un promedio general oficial de <span className="font-black text-emerald-900">{alumno.promedio || '0.0'}</span>,
                  equivalente en texto a <span className="font-black text-emerald-900">{alumno.promedioTexto || 'CERO'}</span>.
                </p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Resumen Académico</p>
                <div className="mt-4 space-y-2">
                  {(alumno.materias || []).map((m, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{m.nombre}</span>
                      <span className="font-black text-slate-900">{m.calif}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-emerald-50 p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-800">Autoridad institucional</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Director(a)</p>
                    <p className="font-black text-slate-900">{alumno.director}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Cargo</p>
                    <p className="font-bold text-slate-800">{alumno.cargoDirector}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Sello digital</p>
                    <p className="font-mono text-[11px] text-slate-700 break-all">{alumno.hashSello}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="border-t-2 border-slate-300 pt-3">
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Lugar</p>
                <p className="font-bold text-slate-800">{alumno.lugarExpedicion}</p>
              </div>
              <div className="border-t-2 border-slate-300 pt-3">
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">UUID</p>
                <p className="font-mono text-[10px] text-slate-800 break-all">{alumno.uuid}</p>
              </div>
              <div className="border-t-2 border-slate-300 pt-3">
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Firma</p>
                <p className="font-black text-slate-900">_________________</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <header className="no-print bg-slate-950 border-b border-slate-800 sticky top-0 z-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-900/30">CE</div>
          <div>
            <h1 className="text-sm font-bold tracking-wider uppercase text-white">CEFA Portal Privado</h1>
            <p className="text-[11px] text-slate-400">Infraestructura Autónoma de Certificación</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={cargarMuestraDemo}
            className="bg-slate-800 hover:bg-slate-700 text-xs font-bold py-2 px-4 rounded-xl border border-slate-700 transition cursor-pointer"
          >
            ✨ Cargar Muestra
          </button>

          <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block"></div>

          <button
            onClick={() => setVista('admin')}
            className={`text-xs font-bold py-2 px-4 rounded-xl border transition cursor-pointer ${vista === 'admin' ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'}`}
          >
            Panel de Captura
          </button>

          <button
            onClick={() => setVista('certificado')}
            className={`text-xs font-bold py-2 px-4 rounded-xl border transition cursor-pointer ${vista === 'certificado' ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'}`}
          >
            Vista de Certificado
          </button>

          <button
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold py-2 px-4 rounded-xl border border-emerald-500 transition cursor-pointer"
          >
            🖨️ Imprimir / PDF
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {vista === 'admin' && (
          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
            <section className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-premium">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-400">Control escolar</p>
                  <h2 className="text-2xl font-black text-white">Registro de expediente</h2>
                </div>
                <button
                  onClick={limpiarPantalla}
                  className="bg-slate-800 hover:bg-slate-700 text-xs font-bold py-2 px-4 rounded-xl border border-slate-700 text-slate-200"
                >
                  Limpiar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-xs uppercase tracking-[0.18em] text-slate-400">
                  Nombre completo
                  <input
                    value={formData.nombre}
                    onChange={(e) => cambiarCampo('nombre', e.target.value.toUpperCase())}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 text-white px-3 py-3 outline-none focus:border-emerald-500"
                    placeholder="NOMBRE COMPLETO"
                  />
                </label>

                <label className="block text-xs uppercase tracking-[0.18em] text-slate-400">
                  CURP
                  <input
                    value={formData.curp}
                    onChange={(e) => cambiarCampo('curp', e.target.value.toUpperCase())}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 text-white px-3 py-3 outline-none focus:border-emerald-500"
                    placeholder="CURP"
                  />
                </label>

                <label className="block text-xs uppercase tracking-[0.18em] text-slate-400">
                  Nivel
                  <select
                    value={formData.nivel}
                    onChange={(e) => cambiarCampo('nivel', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 text-white px-3 py-3 outline-none focus:border-emerald-500"
                  >
                    <option>PREPARATORIA</option>
                    <option>BACHILLERATO</option>
                    <option>TÉCNICO</option>
                    <option>PROFESIONAL</option>
                  </select>
                </label>

                <label className="block text-xs uppercase tracking-[0.18em] text-slate-400">
                  CCT
                  <input
                    value={formData.cct}
                    onChange={(e) => cambiarCampo('cct', e.target.value.toUpperCase())}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 text-white px-3 py-3 outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block text-xs uppercase tracking-[0.18em] text-slate-400">
                  Folio
                  <input
                    value={formData.folio}
                    onChange={(e) => cambiarCampo('folio', e.target.value.toUpperCase())}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 text-white px-3 py-3 outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block text-xs uppercase tracking-[0.18em] text-slate-400">
                  Lugar de expedición
                  <input
                    value={formData.lugarExpedicion}
                    onChange={(e) => cambiarCampo('lugarExpedicion', e.target.value.toUpperCase())}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 text-white px-3 py-3 outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block text-xs uppercase tracking-[0.18em] text-slate-400">
                  Fecha de expedición
                  <input
                    value={formData.fechaExpedicion}
                    onChange={(e) => cambiarCampo('fechaExpedicion', e.target.value.toUpperCase())}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 text-white px-3 py-3 outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block text-xs uppercase tracking-[0.18em] text-slate-400">
                  Director(a)
                  <input
                    value={formData.director}
                    onChange={(e) => cambiarCampo('director', e.target.value.toUpperCase())}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 text-white px-3 py-3 outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block text-xs uppercase tracking-[0.18em] text-slate-400 md:col-span-2">
                  Cargo del director(a)
                  <input
                    value={formData.cargoDirector}
                    onChange={(e) => cambiarCampo('cargoDirector', e.target.value.toUpperCase())}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 text-white px-3 py-3 outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block text-xs uppercase tracking-[0.18em] text-slate-400 md:col-span-2">
                  URL de la fotografía
                  <input
                    value={formData.fotoUrl}
                    onChange={(e) => cambiarCampo('fotoUrl', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 text-white px-3 py-3 outline-none focus:border-emerald-500"
                    placeholder="https://..."
                  />
                </label>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-300">Materias y calificaciones</p>
                  <button
                    onClick={agregarMateria}
                    className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold py-2 px-3 rounded-xl"
                  >
                    + Agregar materia
                  </button>
                </div>

                <div className="space-y-3">
                  {materias.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center text-slate-500">
                      No hay materias registradas.
                    </div>
                  ) : (
                    materias.map((materia) => (
                      <div key={materia.id} className="grid grid-cols-[1fr_120px_60px] gap-3 items-center rounded-2xl border border-slate-700 bg-slate-900 p-3">
                        <input
                          value={materia.nombre}
                          onChange={(e) =>
                            setMaterias((prev) =>
                              prev.map((m) =>
                                m.id === materia.id ? { ...m, nombre: e.target.value.toUpperCase() } : m
                              )
                            )
                          }
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 text-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
                        />
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          value={materia.calif}
                          onChange={(e) => actualizarCalificacion(materia.id, e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 text-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={() => quitarMateria(materia.id)}
                          className="bg-red-600 hover:bg-red-500 text-xs font-bold py-2 rounded-xl"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-900 border border-slate-700 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Promedio institucional</p>
                  <p className="text-3xl font-black text-emerald-400">{promedioNum}</p>
                  <p className="text-xs text-slate-400">{promedioTexto}</p>
                </div>

                <button
                  onClick={registrarOActualizarAlumno}
                  className="bg-emerald-600 hover:bg-emerald-500 text-sm font-black py-3 px-6 rounded-xl shadow-lg shadow-emerald-900/30"
                >
                  Guardar expediente
                </button>
              </div>
            </section>

            <aside className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-premium">
              <div className="mb-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-400">Base de datos escolar</p>
                <h3 className="text-2xl font-black text-white">Alumnos indexados</h3>
              </div>

              <div className="mb-4">
                <input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por nombre o CURP"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 text-white px-3 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="custom-scroll max-h-[780px] overflow-y-auto space-y-3 pr-1">
                {filtrados.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center text-slate-500">
                    No se encontraron registros.
                  </div>
                ) : (
                  filtrados.map((alumno) => (
                    <div key={alumno.id} className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-white">{alumno.nombre}</p>
                          <p className="text-xs text-slate-400">{alumno.curp}</p>
                        </div>
                        <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">
                          {alumno.promedio || '0.0'}
                        </span>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => {
                            setFormData(alumno);
                            setMaterias(alumno.materias || []);
                            setVista('admin');
                          }}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold py-2 rounded-xl"
                        >
                          Cargar
                        </button>
                        <button
                          onClick={() => {
                            setFormData(alumno);
                            setMaterias(alumno.materias || []);
                            setVista('certificado');
                          }}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold py-2 rounded-xl"
                        >
                          Ver certificado
                        </button>
                        <button
                          onClick={() => borrarExpediente(alumno.id)}
                          className="bg-red-600 hover:bg-red-500 text-xs font-bold py-2 px-3 rounded-xl"
                        >
                          Borrar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </aside>
          </div>
        )}

        {vista === 'certificado' && (
          <section className="space-y-6">
            <div className="flex justify-between items-center no-print">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-400">Vista previa</p>
                <h2 className="text-2xl font-black text-white">Certificado oficial</h2>
              </div>
              <button
                onClick={() => setVista('admin')}
                className="bg-slate-800 hover:bg-slate-700 text-xs font-bold py-2 px-4 rounded-xl border border-slate-700 text-slate-200"
              >
                Volver al panel
              </button>
            </div>

            {alumnoSeleccionado ? (
              renderCertificado(alumnoSeleccionado)
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950 p-10 text-center text-slate-400">
                No hay alumno seleccionado.
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
