"use client";

import React from "react";
import { getGreeting } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function WelcomeCard() {
  const { user, children } = useAuth();
  const greeting = getGreeting();
  const mainChild = children && children.length > 0 ? children[0] : null;

  return (
    <div className="card-elevated bg-joaninha-off-white flex flex-col md:flex-row justify-between items-center p-6 rounded-3xl overflow-hidden relative border border-joaninha-gray-200">
      <div className="z-10 w-full md:w-3/5">
        <div className="flex items-center gap-3 mb-2">
          {user?.avatarUrl && (
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-joaninha-black">
            {greeting}, {user?.name ? user.name.split(' ')[0] : "Responsável"}!
          </h1>
        </div>
        {mainChild && (
          <p className="text-joaninha-gray-600 mb-4 text-sm sm:text-base">
            Acompanhe o dia a dia e informações de <span className="font-semibold text-joaninha-red">{mainChild.name}</span>.
          </p>
        )}
        {mainChild && (
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-xl shadow-soft border border-gray-100/80">
              <span className="block text-[10px] text-joaninha-gray-400 uppercase tracking-wider font-bold">Turma</span>
              <span className="font-semibold text-joaninha-black text-sm">{mainChild.className || "Não definida"}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl shadow-soft border border-gray-100/80">
              <span className="block text-[10px] text-joaninha-gray-400 uppercase tracking-wider font-bold">Turno</span>
              <span className="font-semibold text-joaninha-black text-sm">{mainChild.shift || "Integral"}</span>
            </div>
          </div>
        )}
      </div>

      {mainChild && (
        <div className="hidden md:flex items-center gap-4 z-10 bg-white/80 backdrop-blur-xs p-3.5 pr-6 rounded-2xl border border-white/60 shadow-card">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-joaninha-red/30 shadow-sm shrink-0">
            {mainChild.photoUrl ? (
              <img src={mainChild.photoUrl} alt={mainChild.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-joaninha-pink-light flex items-center justify-center font-bold text-joaninha-red">
                {mainChild.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="font-display font-bold text-joaninha-black text-base leading-tight">{mainChild.name}</p>
            <p className="text-xs text-joaninha-gray-500 mt-0.5">{mainChild.className} • {mainChild.shift}</p>
            <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
              Matrícula Ativa
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
