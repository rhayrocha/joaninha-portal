import React from "react";
import { Camera, Lock } from "lucide-react";

export default function CameraPreview() {
  return (
    <div className="card overflow-hidden rounded-2xl relative flex flex-col group border border-joaninha-gray-200">
      <div className="p-4 border-b border-joaninha-gray-200 bg-white z-10 flex justify-between items-center">
        <div>
          <h3 className="font-display font-bold text-lg text-joaninha-black flex items-center gap-2">
            <Camera size={20} className="text-joaninha-red" />
            Câmera da Sala
          </h3>
          <p className="text-xs text-joaninha-gray-500">Acompanhe seu filho ao vivo</p>
        </div>
      </div>

      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-0 transition-all duration-300 group-hover:backdrop-blur-sm"></div>

        <div className="z-10 flex flex-col items-center bg-white/90 px-6 py-4 rounded-xl shadow-soft border border-gray-100">
          <Lock size={24} className="text-joaninha-red mb-2" />
          <span className="badge bg-joaninha-red text-white uppercase tracking-wider font-bold mb-1 px-3 py-1 text-xs rounded-full">
            Em breve
          </span>
          <p className="text-sm font-medium text-joaninha-gray-600 text-center">
            Transmissão ao vivo<br/>em desenvolvimento
          </p>
        </div>
      </div>
    </div>
  );
}
