import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { LinksComunicacao } from './components/LinksComunicacao';
import { FrotaCategoria } from './components/FrotaCategoria';

const categoriasVeiculos = [
  'Ônibus',
  'Caminhão',
  'Moto',
  'Carro',
  'Caminhonete',
  'Van',
  'SUV',
  'Esportivo',
  'Trator',
  'Ambulância',
];

const rotasDisponiveis = [
  '/',
  ...categoriasVeiculos.map((categoria) => `/frota/${categoria}`),
];

function iconeCategoria(categoria) {
  if (categoria === 'Moto') return '🏍️';
  if (categoria === 'Caminhonete') return '🛻';
  if (categoria === 'Ambulância') return '🚑';
  if (categoria === 'Trator') return '🚜';
  if (categoria === 'Ônibus' || categoria === 'Van') return '🚌';
  if (categoria === 'Carro' || categoria === 'SUV' || categoria === 'Esportivo') {
    return '🚗';
  }

  return '🚚';
}

function DashboardRouter() {

    const [dados, setDados] = useState({
      infraestrutura: [],
      frota: [],
       noc: {},
    });

  const [carregando, setCarregando] = useState(true);
  const [statusLinks, setStatusLinks] = useState({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  const [tempoRestante, setTempoRestante] = useState(5);

  const navigate = useNavigate();
  const location = useLocation();

    useEffect(() => {
    fetch('http://localhost:3000/api/dados')
      .then((resposta) => resposta.json())
      .then((dadosRecebidos) => {
        setDados(dadosRecebidos);
        setCarregando(false);
      })
      .catch((erro) => {
        console.error('Erro ao buscar dados da API:', erro);
        setCarregando(false);
      });
  }, []);

  function toggleLink(id) {
    setStatusLinks((estadoAtual) => ({
      ...estadoAtual,
      [id]: !estadoAtual[id],
    }));
  }

  useEffect(() => {
  if (tempoRestante > 0) {
    const timer = setTimeout(() => {
      setTempoRestante((tempoAtual) => tempoAtual - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }

  const rotaAtual = decodeURIComponent(location.pathname);
  const indiceAtual = rotasDisponiveis.indexOf(rotaAtual);
  const proximoIndice = (indiceAtual + 1) % rotasDisponiveis.length;

  navigate(rotasDisponiveis[proximoIndice]);
  setTempoRestante(5);
}, [tempoRestante, location.pathname, navigate]);

if (carregando) {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 text-info bg-black">
      <div
        className="spinner-border"
        style={{ width: '4rem', height: '4rem' }}
      ></div>
    </div>
  );
}

  const linksOnline = Object.values(statusLinks).filter(Boolean).length;

  return (
    <div className="app-shell">
      <nav className="navbar navbar-dark bg-black bg-opacity-75 shadow-lg border-bottom border-info sticky-top">
        <div className="container-fluid flex-column align-items-start px-3 py-2">
          <div className="d-flex flex-wrap gap-2 w-100 justify-content-between align-items-center mb-3">
            <span className="navbar-brand fw-bold text-info m-0 d-flex align-items-center">
              <a
  href={`https://www.google.com/maps/search/?api=1&query=${dados.noc.latitude},${dados.noc.longitude}`}
  target="_blank"
  rel="noopener noreferrer"
  title="Abrir Base NOC - SENAI Vila Leopoldina"
  className="spinning-globe"
></a>

              NOC COMMAND CENTER
            </span>

            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="badge bg-success px-3 py-2">
                LINKS: {linksOnline}/5 ONLINE
              </span>

              <span className="badge bg-transparent border border-info text-info px-3 py-2">
                AUTO-SWAP: 00:0{tempoRestante}
              </span>
            </div>
          </div>

          <div className="nav-scroll w-100 gap-2">
            <Link
              to="/"
              onClick={() => setTempoRestante(5)}
              className={`btn btn-sm text-nowrap px-4 py-2 ${
                location.pathname === '/'
                  ? 'btn-info text-dark fw-bold shadow'
                  : 'btn-outline-info text-white'
              }`}
            >
              📡 Links Comunicação
            </Link>

            {categoriasVeiculos.map((categoria) => {
              const rotaAtiva =
                decodeURIComponent(location.pathname) === `/frota/${categoria}`;

              return (
                <Link
                  key={categoria}
                  to={`/frota/${categoria}`}
                  onClick={() => setTempoRestante(5)}
                  className={`btn btn-sm text-nowrap px-3 py-2 ${
                    rotaAtiva
                      ? 'btn-light text-dark fw-bold shadow'
                      : 'btn-outline-light text-white'
                  }`}
                >
                  {iconeCategoria(categoria)} {categoria}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <LinksComunicacao
                dados={dados.infraestrutura}
                statusLinks={statusLinks}
                toggleLink={toggleLink}
              />
            }
          />

          <Route
            path="/frota/:categoria"
            element={
              <FrotaCategoria
               frota={dados.frota}
                statusLinks={statusLinks}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DashboardRouter />
    </BrowserRouter>
  );
}