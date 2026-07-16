import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Clock, Copy, Check, Send, AlertCircle } from 'lucide-react';
import { FadeIn } from './FadeIn';

// Form backend migrated to node express backend using Gmail nodemailer.

export const ContactSection: React.FC = () => {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Copy Email State
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('adityavarshney808@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setFormStatus('submitting');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message
        })
      });

      if (response.ok) {
        setFormStatus('success');
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error(error);
      setFormStatus('error');
    }
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
    setFormStatus('idle');
  };

  return (
    <section
      id="contact"
      className="w-full bg-[#0C0C0C] text-[#D7E2EA] pt-24 pb-16 sm:pt-32 sm:pb-24 px-6 md:px-10 border-t border-[#D7E2EA]/10 relative overflow-hidden select-none"
    >
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#B600A8]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-[#7621B0]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Left Column: Heading & Quick Info Cards */}
          <div className="lg:col-span-5 flex flex-col text-left">
            <FadeIn delay={0} y={30} duration={0.8}>
              <div className="inline-flex items-center gap-2 mb-4 bg-white/[0.03] border border-white/10 rounded-full py-1.5 px-3.5 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-[10px] tracking-widest text-[#BBCCD7]/90 uppercase font-semibold font-heading">
                  Available for new projects
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} y={30} duration={0.8}>
              <h2
                className="hero-heading font-black uppercase mb-4 tracking-tight leading-none"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 85px)' }}
              >
                Let&apos;s talk
              </h2>
            </FadeIn>

            <FadeIn delay={0.2} y={20} duration={0.8}>
              <p className="text-sm md:text-base text-[#D7E2EA]/60 max-w-md mb-10 font-light tracking-wide leading-relaxed">
                Have a vision or an idea you want to bring to life? Let&apos;s collaborate to design and develop elegant, robust fullstack applications or AI-powered experiences.
              </p>
            </FadeIn>

            {/* Quick Contact Cards */}
            <div className="flex flex-col gap-4">
              {/* Copyable Email Card */}
              <FadeIn delay={0.3} y={20} duration={0.8}>
                <button
                  onClick={handleCopyEmail}
                  className="w-full text-left bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-[#B600A8]/30 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#BBCCD7] group-hover:text-[#B600A8] transition-colors duration-300">
                      <Mail size={18} />
                    </div>
                    <div>
                      <span className="block text-[10px] tracking-widest text-[#BBCCD7]/40 uppercase font-bold">
                        Email Me
                      </span>
                      <span className="block text-sm sm:text-base text-[#D7E2EA] font-medium group-hover:text-white transition-colors duration-300">
                        adityavarshney808@gmail.com
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center text-[#BBCCD7] hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </div>
                </button>
              </FadeIn>

              {/* Status / Response time Card */}
              <FadeIn delay={0.4} y={20} duration={0.8}>
                <div className="w-full bg-white/[0.01] border border-white/5 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#BBCCD7]">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] tracking-widest text-[#BBCCD7]/40 uppercase font-bold">
                      Response Rate
                    </span>
                    <span className="block text-sm sm:text-base text-[#D7E2EA] font-medium">
                      Usually within 24 hours
                    </span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 w-full">
            <FadeIn delay={0.2} y={30} duration={0.8}>
              <div className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative overflow-hidden min-h-[480px] flex flex-col justify-center">

                <AnimatePresence mode="wait">
                  {formStatus === 'success' ? (
                    /* Form Submission Success Screen */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center justify-center text-center py-10"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                      >
                        <Check size={32} strokeWidth={2.5} />
                      </motion.div>

                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-wide uppercase font-heading">
                        Message Received!
                      </h3>

                      <p className="text-sm text-[#D7E2EA]/60 max-w-sm mb-8 leading-relaxed font-light">
                        Thank you, <span className="text-white font-medium">{name}</span>. Your message has been received. I will check it and reach out to you at <span className="text-white font-medium">{email}</span> soon.
                      </p>

                      <button
                        onClick={handleResetForm}
                        className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : formStatus === 'error' ? (
                    /* Form Submission Error Screen */
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center justify-center text-center py-10"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                      >
                        <AlertCircle size={32} strokeWidth={2.5} />
                      </motion.div>

                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-wide uppercase font-heading">
                        Submission Failed
                      </h3>

                      <p className="text-sm text-[#D7E2EA]/60 max-w-sm mb-8 leading-relaxed font-light">
                        Something went wrong while sending the email. Make sure your EmailJS credentials (Service ID, Template ID, and Public Key) are set correctly in <code className="text-white bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs">ContactSection.tsx</code>.
                      </p>

                      <button
                        onClick={handleResetForm}
                        className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                      >
                        Try Again
                      </button>
                    </motion.div>
                  ) : (
                    /* The Contact Form itself */
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-6 text-left"
                    >
                      {/* Name & Email Group */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#BBCCD7]/60 mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            disabled={formStatus === 'submitting'}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-white/[0.01] border border-white/10 hover:border-white/20 focus:border-[#B600A8] focus:ring-1 focus:ring-[#B600A8] rounded-xl px-4 py-3.5 text-sm text-[#D7E2EA] placeholder-[#D7E2EA]/20 outline-none transition-all duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#BBCCD7]/60 mb-2">
                            Your Email
                          </label>
                          <input
                            type="email"
                            required
                            disabled={formStatus === 'submitting'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                            className="w-full bg-white/[0.01] border border-white/10 hover:border-white/20 focus:border-[#B600A8] focus:ring-1 focus:ring-[#B600A8] rounded-xl px-4 py-3.5 text-sm text-[#D7E2EA] placeholder-[#D7E2EA]/20 outline-none transition-all duration-300"
                          />
                        </div>
                      </div>



                      {/* Message Textarea */}
                      <div>
                        <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#BBCCD7]/60 mb-2">
                          Your Message
                        </label>
                        <textarea
                          required
                          rows={4}
                          disabled={formStatus === 'submitting'}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tell me about your project, idea or question..."
                          className="w-full bg-white/[0.01] border border-white/10 hover:border-white/20 focus:border-[#B600A8] focus:ring-1 focus:ring-[#B600A8] rounded-xl px-4 py-3.5 text-sm text-[#D7E2EA] placeholder-[#D7E2EA]/20 outline-none transition-all duration-300 resize-none"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        style={{
                          background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                          boxShadow: '0 4px 15px rgba(181, 1, 167, 0.25), inset 0 2px 4px rgba(255,255,255,0.2)',
                          outline: '1px solid rgba(255, 255, 255, 0.4)',
                          outlineOffset: '-2px',
                        }}
                        className="w-full h-12 rounded-xl flex items-center justify-center font-heading text-white font-medium cursor-pointer overflow-hidden select-none gap-2 px-6 uppercase tracking-widest text-[11px] sm:text-xs font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed group"
                      >
                        {formStatus === 'submitting' ? (
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <Send size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="w-full border-t border-[#D7E2EA]/10 mt-20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs font-light uppercase tracking-widest opacity-60">
          <span>&copy; {new Date().getFullYear()} Aditya Varshney. All Rights Reserved.</span>
          <div className="flex gap-6">
            <a
              href="https://github.com/adityavar808"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:opacity-100 transition-colors"
            >
              Github
            </a>
            <a
              href="https://www.linkedin.com/in/adityaavarshney/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:opacity-100 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
