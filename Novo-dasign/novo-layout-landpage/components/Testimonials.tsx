import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  text: string;
  stars: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Beatriz Mendes",
    role: "Designer Freelancer",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&fit=crop",
    text: "O Santo Dinheiro removeu toda a complexidade do meu controle. A função 'Sem Neura' foi libertadora: entendi que posso tomar um café sem culpa e continuar prosperando. Agora tenho paz de espírito e clareza como nunca antes.",
    stars: 5
  },
  {
    id: 2,
    name: "Carlos Eduardo",
    role: "Analista de Sistemas",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&fit=crop",
    text: "Sempre tive dificuldade em calcular e separar o dízimo corretamente. O app faz isso automático e visualmente. Sinto que estou honrando meu compromisso com fidelidade e sem burocracia. É simples e funciona.",
    stars: 5
  },
  {
    id: 3,
    name: "Fernanda Lima",
    role: "Empreendedora",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&fit=crop",
    text: "Comecei a usar endividada. A clareza das 'Saídas Fixas' me fez ver onde o dinheiro vazava. Em 3 meses, quitei o cartão e fiz meu primeiro aporte. Ver o gráfico de investimentos crescer virou meu novo vício!",
    stars: 5
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="relative py-24 bg-dark overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute -left-20 top-40 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -right-20 bottom-20 w-72 h-72 bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="inline-block"
          >
             <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              Histórias de quem prospera
            </h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Pessoas reais que transformaram sua relação com o dinheiro usando fé, organização e simplicidade.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 rounded-3xl relative group hover:border-white/10 transition-colors duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 text-white/5 group-hover:text-primary/20 transition-colors duration-300">
                <Quote size={40} fill="currentColor" />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gold rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-white/10 relative z-10"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{item.name}</h4>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{item.role}</span>
                </div>
              </div>

              <div className="flex gap-1 mb-4 text-gold">
                {[...Array(item.stars)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" className="drop-shadow-sm" />
                ))}
              </div>

              <p className="text-slate-300 leading-relaxed font-light text-base">
                "{item.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;