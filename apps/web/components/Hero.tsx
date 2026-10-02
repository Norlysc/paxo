"use client";

import { motion } from "framer-motion";
import { Button } from "@paxo/ui";
import { HeroArtwork } from "./HeroArtwork";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="hero-shell relative isolate min-h-[47rem] overflow-hidden bg-[#0b3d91] lg:min-h-[50rem]">
      <div aria-hidden className="hero-shell__grid pointer-events-none absolute inset-0 opacity-35" />
      <div aria-hidden className="pointer-events-none absolute -right-28 top-8 h-[34rem] w-[34rem] rounded-full border border-white/15 sm:-right-12" />
      <div aria-hidden className="pointer-events-none absolute -right-8 top-28 h-[28rem] w-[28rem] rounded-full border-[18px] border-white/10" />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="hero-blue" x1="110" y1="40" x2="1320" y2="720" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A327A" />
            <stop offset="0.52" stopColor="#125BB7" />
            <stop offset="1" stopColor="#1289BF" />
          </linearGradient>
        </defs>
        <path d="M0 0H1440V620C1210 558 1030 635 820 688C590 747 300 735 0 628V0Z" fill="url(#hero-blue)" />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 pb-40 sm:px-6 sm:py-24 sm:pb-44 lg:px-8 lg:py-28 lg:pb-48 xl:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] lg:gap-6 xl:gap-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="relative z-10 lg:pb-4"
          >
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/7 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/90 shadow-lg shadow-[#081f4f]/30 backdrop-blur-sm">
              Construcción · Mantenimiento · Seguridad Electrónica
            </span>
            <h1 className="mt-6 max-w-xl text-4xl font-black leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl lg:text-[3.35rem] xl:text-[4rem]">
              Ingeniería y construcción con el rigor de una <span className="text-[#ffd6d9]">empresa industrial</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-white/80">
              Desde obra civil hasta sistemas de seguridad electrónica: un solo equipo confiable para construir, remodelar,
              mantener y proteger tu propiedad o negocio en Venezuela.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <motion.a href="#cotizar" whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Button size="lg" className="rounded-2xl px-7 shadow-[0_18px_35px_-20px_rgba(166,29,40,0.7)]">
                  Solicitar Asesoría Personalizada
                </Button>
              </motion.a>
              <motion.a href="#servicios" whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-white/40 bg-white/5 text-white hover:bg-white hover:text-[#163d7a]"
                >
                  Ver Servicios
                </Button>
              </motion.a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/25 pt-6 text-sm text-white/90">
              <TrustPoint>Personal certificado</TrustPoint>
              <TrustPoint>Cobertura nacional</TrustPoint>
              <TrustPoint>Presupuesto sin costo</TrustPoint>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative z-10 mx-auto w-full max-w-[25rem] sm:max-w-[29rem] lg:ml-auto lg:mr-0 lg:max-w-[34rem]"
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              <HeroArtwork />
            </motion.div>
          </motion.div>
        </div>
      </div>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 w-full sm:h-36 lg:h-44"
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
      >
        <path d="M0 76C245 18 445 161 725 129C1000 97 1198 8 1440 69V180H0V76Z" fill="#fff" />
        <path d="M0 67C245 9 445 152 725 120C1000 88 1198 -1 1440 60" fill="none" stroke="#A61D28" strokeOpacity="0.75" strokeWidth="5" />
      </svg>
    </section>
  );
}

function TrustPoint({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <CheckIcon className="h-4 w-4 text-white" />
      {children}
    </span>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
