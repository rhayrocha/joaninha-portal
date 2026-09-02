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
      <div className="z-10 w-full md:w-2/3">
        <h1 className="text-3xl font-display font-bold text-joaninha-black mb-2">
          {greeting}, {user?.name || "Responsável"}!
        </h1>
        {mainChild && (
          <p className="text-joaninha-gray-600 mb-4">
            Acompanhe o dia a dia de <span className="font-semibold text-joaninha-red">{mainChild.name}</span>.
          </p>
        )}
        {mainChild && (
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-xl shadow-soft">
              <span className="block text-xs text-joaninha-gray-500 uppercase tracking-wider font-semibold">Turma</span>
              <span className="font-medium text-joaninha-black">{mainChild.className || "Não definida"}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl shadow-soft">
              <span className="block text-xs text-joaninha-gray-500 uppercase tracking-wider font-semibold">Turno</span>
              <span className="font-medium text-joaninha-black">{mainChild.shift || "Integral"}</span>
            </div>
          </div>
        )}
      </div>
      <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-joaninha-red-light to-transparent opacity-20 pointer-events-none"></div>
      
      {/* Decorative elements */}
      <div className="hidden md:block absolute right-12 top-1/2 transform -translate-y-1/2 z-0">
        <div className="w-24 h-24 bg-joaninha-red rounded-full opacity-10 blur-xl"></div>
        <div className="absolute inset-0 flex items-center justify-center text-joaninha-red opacity-80 text-6xl">
          🐞
        </div>
      </div>
    </div>
  );
}
