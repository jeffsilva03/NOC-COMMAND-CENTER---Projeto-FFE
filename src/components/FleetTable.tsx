import {
  Car,
  MapPin,
  Radio,
} from 'lucide-react';

import type {
  Vehicle,
} from '../types/fleet';

interface FleetTableProps {
  vehicles: Vehicle[];
  isCategoryOnline: (
    category: string
  ) => boolean;
}

export function FleetTable({
  vehicles,
  isCategoryOnline,
}: FleetTableProps) {
  return (
    <div className="bg-noc-card border border-slate-800 rounded-2xl overflow-hidden">

      <div className="p-6 border-b border-slate-800">

        <div className="flex items-center gap-3">

          <Car
            size={20}
            className="text-blue-400"
          />

          <div>

            <h2 className="text-white font-semibold">
              Frota Monitorada
            </h2>

            <p className="text-xs text-slate-500">
              {vehicles.length} veículos na amostra atual
            </p>

          </div>

        </div>

      </div>

      <div className="overflow-x-auto max-h-[500px]">

        <table className="w-full text-sm">

          <thead className="sticky top-0 bg-slate-950">

            <tr className="text-left text-xs uppercase text-slate-500">

              <th className="px-6 py-4">
                ID
              </th>

              <th className="px-6 py-4">
                Tipo
              </th>

              <th className="px-6 py-4">
                Velocidade
              </th>

              <th className="px-6 py-4">
                Localização
              </th>

              <th className="px-6 py-4">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {vehicles.map((vehicle) => {

              const online =
                isCategoryOnline(
                  vehicle.tipo
                );

              return (
                <tr
                  key={vehicle.id}
                  className="border-t border-slate-800/80 hover:bg-slate-800/30 transition"
                >

                  <td className="px-6 py-4">

                    <span className="text-blue-400 font-mono text-xs">
                      {vehicle.id}
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-2">

                      <span className="text-xl">
                        {vehicle.modelo}
                      </span>

                      <span className="text-slate-300">
                        {vehicle.tipo}
                      </span>

                    </div>

                  </td>

                  <td className="px-6 py-4">

                    <span className="bg-slate-800 text-white px-2 py-1 rounded-md">
                      {vehicle.vel} km/h
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-2 text-slate-400">

                      <MapPin size={14} />

                      <span className="font-mono text-xs">
                        {vehicle.latitude},
                        {' '}
                        {vehicle.longitude}
                      </span>

                    </div>

                  </td>

                  <td className="px-6 py-4">

                    <div
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        text-xs
                        font-semibold
                        ${
                          online
                            ? 'text-emerald-400'
                            : 'text-red-400'
                        }
                      `}
                    >

                      <Radio size={13} />

                      {online
                        ? 'ONLINE'
                        : 'OFFLINE'}

                    </div>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}