import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from 'react';

import {
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  sectionName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  static getDerivedStateFromError(
    error: Error
  ): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage:
        error.message ||
        'Erro inesperado.',
    };
  }

  componentDidCatch(
    error: Error,
    info: ErrorInfo
  ) {
    console.error(
      `[ErrorBoundary] Falha em ${
        this.props.sectionName ??
        'componente'
      }:`,
      error,
      info
    );
  }

  reset = () => {
    this.setState({
      hasError: false,
      errorMessage: '',
    });
  };

  render() {
    if (
      this.state.hasError
    ) {
      return (
        <section
          className="
            m-6
            rounded-xl
            border
            border-rose-500/30
            bg-rose-500/5
            p-6
            text-slate-200
          "
        >
          <div
            className="
              flex
              items-start
              gap-4
            "
          >
            <div
              className="
                rounded-lg
                bg-rose-500/10
                p-3
                text-rose-400
              "
            >
              <AlertTriangle
                size={22}
              />
            </div>

            <div>
              <h2
                className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-wide
                  text-rose-300
                "
              >
                Falha isolada no componente
              </h2>

              <p
                className="
                  mt-2
                  text-xs
                  text-slate-400
                "
              >
                {this.props
                  .sectionName ??
                  'Componente'}
              </p>

              <p
                className="
                  mt-3
                  font-mono
                  text-[11px]
                  text-slate-600
                "
              >
                {
                  this.state
                    .errorMessage
                }
              </p>

              <p
                className="
                  mt-3
                  text-xs
                  text-slate-500
                "
              >
                O restante do
                NOC continua
                operacional.
              </p>

              <button
                onClick={
                  this.reset
                }
                className="
                  mt-4
                  flex
                  items-center
                  gap-2
                  rounded-md
                  border
                  border-rose-500/30
                  px-3
                  py-2
                  text-xs
                  text-rose-300
                  transition
                  hover:bg-rose-500/10
                "
              >
                <RotateCcw
                  size={13}
                />

                Tentar novamente
              </button>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}