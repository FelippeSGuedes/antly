"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  CheckCircle2
} from "lucide-react";

function FloatingDots({ count = 30 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dots: { x: number; y: number; r: number; vy: number; a: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        r: Math.random() * 3 + 1,
        vy: -(Math.random() * 0.3 + 0.1),
        a: Math.random() * 0.3 + 0.05,
      });
    }

    const loop = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      for (const d of dots) {
        d.y += d.vy;
        if (d.y < -10) {
          d.y = canvas.offsetHeight + 10;
          d.x = Math.random() * canvas.offsetWidth;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${d.a})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />;
}

function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  if (!password) return null;

  const strength = getStrength();
  const labels = ["Muito fraca", "Fraca", "Razoável", "Boa", "Forte", "Excelente"];
  const colors = ["bg-red-500", "bg-red-400", "bg-orange-400", "bg-amber-400", "bg-green-400", "bg-green-500"];

  return (
    <div className="mt-2 space-y-1.5 animate-fade-in">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              i < strength ? colors[strength] : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-[11px] font-medium transition-colors ${strength <= 1 ? "text-red-500" : strength <= 3 ? "text-amber-600" : "text-green-600"}`}>
        {labels[strength]}
      </p>
    </div>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/auth/${mode === "login" ? "login" : "register"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            mode === "login"
              ? { email: form.email, password: form.password }
              : form
          ),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha na autenticação.");
      }

      const data = await response.json();
      if (data.role === "admin") {
        router.push("/admin");
      } else if (data.role === "client") {
        router.push("/cliente");
      } else {
        router.push("/prestador");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha na autenticação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    { icon: Shield, text: "Profissionais qualificados", delay: "200ms" },
    { icon: CheckCircle2, text: "Segurança garantida", delay: "400ms" },
    { icon: Clock, text: "Atendimento 24h", delay: "600ms" },
  ];

  return (
    <div className="flex min-h-screen w-full font-sans bg-white">

      {/* ═══ LADO ESQUERDO ═══ */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 p-16 flex-col justify-between overflow-hidden">

        <FloatingDots />

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-700/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-400/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        {/* Logo */}
        <div className={`relative z-10 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
          <Link href="/" className="inline-block group">
            <div className="relative">
              <div className="absolute -inset-6 bg-white/15 rounded-3xl blur-3xl group-hover:bg-white/25 transition-all duration-500" />
              <img
                src="/logo.svg"
                alt="Antly"
                className="relative h-28 w-auto brightness-0 invert drop-shadow-[0_6px_40px_rgba(255,255,255,0.5)] group-hover:scale-110 group-hover:drop-shadow-[0_6px_50px_rgba(255,255,255,0.7)] transition-all duration-500"
              />
            </div>
          </Link>
        </div>

        {/* Hero */}
        <div className="relative z-10 max-w-lg mb-12">
          <h1
            className={`text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.08] mb-8 tracking-tight transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Tudo o que você <br />precisa,{" "}
            <span className="relative">
              <span className="relative z-10 text-orange-100">em um só lugar.</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-white/10 rounded-sm -z-0" />
            </span>
          </h1>

          <p
            className={`text-lg text-white/80 font-medium leading-relaxed max-w-md transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            A plataforma definitiva para conectar talentos e oportunidades. Simples, rápido e seguro.
          </p>

          <div className="mt-10 space-y-4">
            {features.map((f, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 group transition-all duration-700 ${
                  mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
                style={{ transitionDelay: f.delay }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div
          className={`relative z-10 flex items-center gap-8 transition-all duration-700 delay-[800ms] ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {[
            { n: "10k+", label: "Profissionais" },
            { n: "50k+", label: "Serviços" },
            { n: "4.9", label: "Avaliação" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-extrabold text-white">{stat.n}</p>
              <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          ))}

          <div className="ml-auto text-[10px] font-semibold text-white/30 uppercase tracking-widest">
            © 2026 Antly
          </div>
        </div>
      </div>

      {/* ═══ LADO DIREITO ═══ */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 py-10 sm:px-14 sm:py-12 lg:px-20 lg:py-16 bg-white relative overflow-hidden">

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50/80 rounded-full blur-[140px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-50/50 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div
          className={`w-full max-w-md relative z-10 transition-all duration-700 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 flex justify-center">
            <Link href="/" className="inline-block">
              <img src="/logo.svg" alt="Antly" className="h-14 w-auto" />
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest">
                {mode === "login" ? "Bem-vindo de volta" : "Comece grátis"}
              </span>
            </div>
            <h2 className="text-[28px] font-extrabold text-slate-900 mb-2 tracking-tight leading-tight">
              {mode === "login" ? "Entre na sua conta" : "Crie sua conta"}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {mode === "login"
                ? "Insira suas credenciais para continuar."
                : "Preencha os dados abaixo para começar."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-shake">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} className="space-y-5">

            {/* Name */}
            {mode === "register" && (
              <div className="space-y-1.5 animate-slide-down">
                <label className="text-sm font-semibold text-slate-700">Nome</label>
                <div className={`relative rounded-xl transition-shadow duration-300 ${focusedField === "name" ? "shadow-[0_0_0_3px_rgba(249,115,22,0.1)]" : ""}`}>
                  <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "name" ? "text-orange-600" : "text-slate-400"}`}>
                    <User className="h-[18px] w-[18px]" />
                  </div>
                  <input
                    type="text"
                    required={mode === "register"}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 py-3.5 text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-orange-500 focus:ring-0 focus:outline-none text-sm transition-all duration-200"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <div className={`relative rounded-xl transition-shadow duration-300 ${focusedField === "email" ? "shadow-[0_0_0_3px_rgba(249,115,22,0.1)]" : ""}`}>
                <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "email" ? "text-orange-600" : "text-slate-400"}`}>
                  <Mail className="h-[18px] w-[18px]" />
                </div>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 py-3.5 text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-orange-500 focus:ring-0 focus:outline-none text-sm transition-all duration-200"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Senha</label>
                {mode === "login" && (
                  <Link href="#" className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                    Esqueceu?
                  </Link>
                )}
              </div>
              <div className={`relative rounded-xl transition-shadow duration-300 ${focusedField === "password" ? "shadow-[0_0_0_3px_rgba(249,115,22,0.1)]" : ""}`}>
                <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "password" ? "text-orange-600" : "text-slate-400"}`}>
                  <Lock className="h-[18px] w-[18px]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-11 py-3.5 text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-orange-500 focus:ring-0 focus:outline-none text-sm transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
              {mode === "register" && <PasswordStrength password={form.password} />}
            </div>

            {/* Role Selector */}
            {mode === "register" && (
              <div className="pt-1 animate-slide-down">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Eu quero:</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "client" as const, icon: User, label: "Contratar", desc: "Encontrar profissionais" },
                    { key: "provider" as const, icon: Briefcase, label: "Trabalhar", desc: "Oferecer serviços" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setForm({ ...form, role: opt.key })}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 group ${
                        form.role === opt.key
                          ? "border-orange-500 bg-orange-50 text-orange-700 shadow-[0_0_0_3px_rgba(249,115,22,0.1)]"
                          : "border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 ${
                        form.role === opt.key
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                      }`}>
                        <opt.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold">{opt.label}</span>
                      <span className={`text-[10px] mt-0.5 transition-colors ${form.role === opt.key ? "text-orange-500" : "text-slate-400"}`}>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full flex items-center justify-center py-4 px-4 mt-3 rounded-xl text-[15px] font-bold text-white bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:via-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isSubmitting ? (
                <svg className="animate-spin mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : null}
              {isSubmitting
                ? "Processando..."
                : mode === "login"
                ? "Entrar"
                : "Criar conta"}
              {!isSubmitting && (
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </button>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <span className="text-slate-400 text-sm">
                {mode === "login" ? "Novo no Antly? " : "Já tem uma conta? "}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError(null);
                }}
                className="text-orange-600 font-bold hover:text-orange-700 text-sm transition-colors hover:underline underline-offset-2"
              >
                {mode === "login" ? "Crie sua conta" : "Fazer login"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); max-height: 0; }
          to { opacity: 1; transform: translateY(0); max-height: 200px; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-5px); }
          30%, 60% { transform: translateX(5px); }
        }
        .animate-slide-down {
          animation: slideDown 0.4s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
