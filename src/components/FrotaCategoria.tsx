import {
  useEffect,
} from 'react';

import {
  useParams,
} from 'react-router-dom';

import type {
  Vehicle,
} from '../types/fleet';

import {
  FleetTable,
} from './FleetTable';

interface FrotaCategoriaProps {
  frota: Vehicle[];

  isCategoryOnline: (
    category: string
  ) => boolean;
}

interface AudioWindow extends Window {
  webkitAudioContext?:
    typeof AudioContext;
}

export function FrotaCategoria({
  frota,
  isCategoryOnline,
}: FrotaCategoriaProps) {
  const {
    categoria,
  } = useParams<{
    categoria: string;
  }>();

  const categoriaAtual =
    categoria ?? '';

  const veiculosExibidos =
    frota.filter(
      (veiculo) =>
        veiculo.tipo ===
        categoriaAtual
    );

  const categoriaOnline =
    isCategoryOnline(
      categoriaAtual
    );

  // =========================================
  // SIRENE DA AMBULÂNCIA
  // =========================================

  useEffect(() => {
    if (
      categoriaAtual !==
      'Ambulância'
    ) {
      return undefined;
    }

    let audioCtx:
      AudioContext | null = null;

    let oscillator:
      OscillatorNode | null = null;

    let gain:
      GainNode | null = null;

    let intervalId:
      number | null = null;

    let encerrado = false;

    const iniciarSirene =
      async () => {
        try {
          const browserWindow =
            window as AudioWindow;

          const AudioContextClass =
            window.AudioContext ??
            browserWindow
              .webkitAudioContext;

          if (
            !AudioContextClass ||
            encerrado
          ) {
            return;
          }

          if (!audioCtx) {
            audioCtx =
              new AudioContextClass();
          }

          if (
            audioCtx.state ===
            'suspended'
          ) {
            await audioCtx.resume();
          }

          if (
            encerrado ||
            audioCtx.state !==
              'running' ||
            oscillator
          ) {
            return;
          }

          oscillator =
            audioCtx
              .createOscillator();

          gain =
            audioCtx.createGain();

          oscillator.type =
            'sine';

          gain.gain.value =
            0.12;

          oscillator
            .frequency
            .setValueAtTime(
              700,
              audioCtx.currentTime
            );

          oscillator.connect(
            gain
          );

          gain.connect(
            audioCtx.destination
          );

          oscillator.start();

          let frequenciaAlta =
            false;

          intervalId =
            window.setInterval(
              () => {
                frequenciaAlta =
                  !frequenciaAlta;

                if (
                  oscillator &&
                  audioCtx &&
                  audioCtx.state ===
                    'running'
                ) {
                  oscillator
                    .frequency
                    .setValueAtTime(
                      frequenciaAlta
                        ? 960
                        : 700,
                      audioCtx
                        .currentTime
                    );
                }
              },
              500
            );

        } catch (erro) {
          console.warn(
            'Áudio bloqueado pelo navegador.',
            erro
          );
        }
      };

    const liberarAudio = () => {
      void iniciarSirene();
    };

    void iniciarSirene();

    window.addEventListener(
      'pointerdown',
      liberarAudio
    );

    window.addEventListener(
      'keydown',
      liberarAudio
    );

    return () => {
      encerrado = true;

      window.removeEventListener(
        'pointerdown',
        liberarAudio
      );

      window.removeEventListener(
        'keydown',
        liberarAudio
      );

      if (
        intervalId !== null
      ) {
        window.clearInterval(
          intervalId
        );
      }

      if (oscillator) {
        try {
          oscillator.stop();
          oscillator.disconnect();
        } catch {
          // Já encerrado.
        }
      }

      if (gain) {
        try {
          gain.disconnect();
        } catch {
          // Já desconectado.
        }
      }

      if (
        audioCtx &&
        audioCtx.state !==
          'closed'
      ) {
        void audioCtx.close();
      }
    };

  }, [categoriaAtual]);

  return (
    <main className="min-h-screen bg-noc-bg px-4 py-6 md:px-8">

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">

        <div>

          <p className="text-xs uppercase tracking-widest text-blue-400">
            Telemetria Tática
          </p>

          <h1 className="mt-1 text-2xl font-bold text-white">
            {categoriaAtual}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {veiculosExibidos.length}{' '}
            veículos encontrados na
            amostra atual
          </p>

        </div>

        <span
          className={`
            rounded-lg
            border
            px-4
            py-2
            text-xs
            font-bold
            ${
              categoriaOnline
                ? `
                  border-emerald-500/20
                  bg-emerald-500/10
                  text-emerald-400
                `
                : `
                  border-red-500/20
                  bg-red-500/10
                  text-red-400
                `
            }
          `}
        >

          {categoriaOnline
            ? '● CATEGORIA ONLINE'
            : '● COMUNICAÇÃO PERDIDA'}

        </span>

      </div>

      {veiculosExibidos.length ===
      0 ? (

        <div className="rounded-2xl border border-slate-800 bg-noc-card p-10 text-center">

          <p className="text-slate-500">
            Nenhum veículo desta categoria
            está presente na amostra atual
            de 500 registros.
          </p>

        </div>

      ) : (

        <FleetTable
          vehicles={
            veiculosExibidos
          }
          isCategoryOnline={
            isCategoryOnline
          }
        />

      )}

    </main>
  );
}