import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Briefcase, Cpu, Plus, Edit2, Trash2, LogOut, 
  Save, Globe, AlertCircle, RefreshCw, Layers, Inbox, 
  Eye, EyeOff, Shield, Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

interface Service {
  serviceId: string;
  name: string;
  subtitle: string;
  description: string;
  iconName: string;
  iconColor: string;
  dotBg: string;
}

interface Project {
  projectId: string;
  name: string;
  category: string;
  liveUrl: string;
  imgCol1Top: string;
  imgCol1Bottom: string;
  imgCol2: string;
}

interface Skill {
  skillId: string;
  name: string;
  tagline: string;
  glow: string;
  border: string;
  iconType: 'svg' | 'lucide';
  iconContent: string;
}

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  dateSubmitted: string;
}

type SectorType = 'about' | 'services' | 'projects' | 'skills' | 'messages' | 'adibot';

// --- Web Audio API Sci-Fi Synthesizer Sound Effects (Omnitrix Theme) ---
const playOmnitrixRotateSynth = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Create oscillator, gain, and filter nodes
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    
    // Pitch sweep: starts at 350Hz, sweeps up to 1800Hz, sweeps down to 150Hz
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.06);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);

    // Filter sweep (bandpass to create a resonant swoosh/whoosh effect)
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3, now);
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.06);
    filter.frequency.exponentialRampToValueAtTime(250, now + 0.2);

    // Volume envelope: fade in quickly, fade out exponentially
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    // Connections
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Start/Stop
    osc.start(now);
    osc.stop(now + 0.23);
  } catch (e) {
    console.warn('AudioContext failed to initialize or start:', e);
  }
};

const playOmnitrixScanSynth = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(450, now + 1.8);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 1.8);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 1.8);
  } catch (e) {
    console.warn('AudioContext failed to play scan sound:', e);
  }
};

const playOmnitrixSuccessSynth = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const playTone = (delay: number, freq: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.15, now + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + duration + 0.01);
    };

    playTone(0, 523.25, 0.15); // C5
    playTone(0.08, 659.25, 0.15); // E5
    playTone(0.16, 783.99, 0.3); // G5
    playTone(0.24, 1046.50, 0.4); // C6
  } catch (e) {
    console.warn('AudioContext failed to play success sound:', e);
  }
};

const playOmnitrixErrorSynth = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc1.type = 'sawtooth';
    osc2.type = 'sine';
    
    osc1.frequency.setValueAtTime(130, now);
    osc2.frequency.setValueAtTime(132, now); // Detune slightly
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);
  } catch (e) {
    console.warn('AudioContext failed to play error sound:', e);
  }
};

// Global Audio Cache for Preloaded Elements
const audioCache: Record<string, HTMLAudioElement> = {};
const getAudio = (url: string): HTMLAudioElement => {
  if (!audioCache[url]) {
    audioCache[url] = new Audio(url);
  }
  return audioCache[url];
};

const playAudioWithFallback = (url: string, fallbackFn: () => void) => {
  try {
    const audio = getAudio(url);
    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.warn(`HTML5 Audio play failed for ${url}, using synth fallback:`, err);
      fallbackFn();
    });
  } catch (e) {
    console.warn(`HTML5 Audio initialization failed for ${url}, using synth fallback:`, e);
    fallbackFn();
  }
};

const playOmnitrixRotateSound = () => playAudioWithFallback('/audio/omnitrix-rotate.mp3', playOmnitrixRotateSynth);
const playOmnitrixScanSound = () => playAudioWithFallback('/audio/omnitrix-scan.mp3', playOmnitrixScanSynth);
const playOmnitrixSuccessSound = () => playAudioWithFallback('/audio/omnitrix-success.mp3', playOmnitrixSuccessSynth);
const playOmnitrixErrorSound = () => playAudioWithFallback('/audio/omnitrix-error.mp3', playOmnitrixErrorSynth);

export const AdminPanel: React.FC = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('adityavarshney808@gmail.com');
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [authStage, setAuthStage] = useState('');
  
  // Data states
  const [aboutText, setAboutText] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Radial Navigation Sector
  const [activeSector, setActiveSector] = useState<SectorType>('about');

  // Feedback notifications
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form modals / editing states
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  // Tracks original projectId when editing an existing project (null = new project)
  const [originalProjectId, setOriginalProjectId] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'collab' | 'inquiry' | 'feedback'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [adibotContext, setAdibotContext] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Session expired');
        fetchData();
      })
      .catch(() => {
        handleLogout();
      });
    }
  }, [token]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);
    playOmnitrixScanSound();
    try {
      setAuthStage('Connecting to database...');
      await new Promise(r => setTimeout(r, 600));
      
      setAuthStage('Decrypting security key...');
      await new Promise(r => setTimeout(r, 600));

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Access Denied: Invalid Key');
      
      setAuthStage('Establishing secure link...');
      await new Promise(r => setTimeout(r, 600));

      localStorage.setItem('admin_token', data.token);
      setToken(data.token);
      playOmnitrixSuccessSound();
      showToast('Admin connection authenticated', 'success');
      fetchData();
    } catch (err: any) {
      setError(err.message);
      setIsVerifying(false);
      playOmnitrixErrorSound();
    } finally {
      setAuthStage('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const aboutRes = await fetch(`${API_BASE}/about`);
      const aboutData = await aboutRes.json();
      setAboutText(aboutData.bioText || '');

      const servicesRes = await fetch(`${API_BASE}/services`);
      const servicesData = await servicesRes.json();
      setServices(servicesData);

      const projectsRes = await fetch(`${API_BASE}/projects`);
      const projectsData = await projectsRes.json();
      setProjects(projectsData);

      const skillsRes = await fetch(`${API_BASE}/skills`);
      const skillsData = await skillsRes.json();
      setSkills(skillsData);

      const msgRes = await fetch(`${API_BASE}/contact`, { headers });
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData);
      }

      const adibotRes = await fetch(`${API_BASE}/adibot/context`, { headers });
      if (adibotRes.ok) {
        const adibotData = await adibotRes.json();
        setAdibotContext(adibotData.customContext || '');
        setGeminiApiKey(adibotData.geminiApiKey || '');
      }
    } catch (err: any) {
      showToast('Database synchronization error', 'error');
    }
  };

  // --- CRUD API Calls ---

  const handleUpdateAbout = async () => {
    try {
      const res = await fetch(`${API_BASE}/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bioText: aboutText })
      });
      if (!res.ok) throw new Error();
      showToast('Biography node saved to Atlas database', 'success');
    } catch {
      showToast('Failed to update bio', 'error');
    }
  };

  const handleUpdateAdibot = async () => {
    try {
      const res = await fetch(`${API_BASE}/adibot/context`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ customContext: adibotContext, geminiApiKey })
      });
      if (!res.ok) throw new Error();
      showToast('Adibot AI knowledge registry saved', 'success');
    } catch {
      showToast('Failed to update Adibot context', 'error');
    }
  };

  const handleSaveService = async () => {
    if (!editingService?.serviceId || !editingService?.name || !editingService?.subtitle || !editingService?.description) {
      showToast('Please fill all service fields', 'error');
      return;
    }
    const isNew = !services.some(s => s.serviceId === editingService.serviceId);
    const url = isNew ? `${API_BASE}/services` : `${API_BASE}/services/${editingService.serviceId}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingService)
      });
      if (!res.ok) throw new Error();
      showToast(`Service ${isNew ? 'registered' : 'updated'}`);
      setEditingService(null);
      fetchData();
    } catch {
      showToast('Failed to write service details', 'error');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this service?')) return;
    try {
      const res = await fetch(`${API_BASE}/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      showToast('Service card removed from DB');
      fetchData();
    } catch {
      showToast('Failed to delete service', 'error');
    }
  };

  const handleSaveProject = async () => {
    if (!editingProject?.projectId || !editingProject?.name || !editingProject?.category || !editingProject?.liveUrl) {
      showToast('All core project fields are required', 'error');
      return;
    }
    // Use originalProjectId to determine if this is an edit (not null) or new project (null)
    const isNew = originalProjectId === null;
    const url = isNew
      ? `${API_BASE}/projects`
      : `${API_BASE}/projects/${originalProjectId}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingProject)
      });
      if (!res.ok) throw new Error();
      showToast(`Project card ${isNew ? 'created' : 'updated'}`);
      setEditingProject(null);
      setOriginalProjectId(null);
      fetchData();
    } catch {
      showToast('Failed to commit project changes', 'error');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this project?')) return;
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      showToast('Project deleted');
      fetchData();
    } catch {
      showToast('Error dropping project entry', 'error');
    }
  };

  const handleSaveSkill = async () => {
    if (!editingSkill?.skillId || !editingSkill?.name || !editingSkill?.tagline || !editingSkill?.iconContent) {
      showToast('Please fill all skill card fields', 'error');
      return;
    }
    const isNew = !skills.some(s => s.skillId === editingSkill.skillId);
    const url = isNew ? `${API_BASE}/skills` : `${API_BASE}/skills/${editingSkill.skillId}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingSkill)
      });
      if (!res.ok) throw new Error();
      showToast(`Skill node ${isNew ? 'appended' : 'saved'}`);
      setEditingSkill(null);
      fetchData();
    } catch {
      showToast('Failed to save skill node', 'error');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Permanently delete this skill node?')) return;
    try {
      const res = await fetch(`${API_BASE}/skills/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      showToast('Skill node deleted');
      fetchData();
    } catch {
      showToast('Failed to drop skill node', 'error');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Move this message to trash?')) return;
    try {
      const res = await fetch(`${API_BASE}/contact/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      showToast('Message trashed', 'success');
      fetchData();
    } catch {
      showToast('Failed to delete message', 'error');
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyMessage || !replySubject) {
      showToast('Subject and message are required', 'error');
      return;
    }

    setIsSendingReply(true);
    playOmnitrixScanSound();
    try {
      const res = await fetch(`${API_BASE}/contact/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          to: selectedMessage.email,
          subject: replySubject,
          message: replyMessage
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send reply');

      playOmnitrixSuccessSound();
      showToast('Reply email transmitted successfully', 'success');
      setIsReplying(false);
      setSelectedMessage(null);
    } catch (err: any) {
      playOmnitrixErrorSound();
      showToast(err.message, 'error');
    } finally {
      setIsSendingReply(false);
    }
  };

  // Sector Mapping info (Omnitrix configuration)
  const sectorInfo: Record<SectorType, { label: string; desc: string; angle: number; color: string; glow: string; icon: React.FC<{className?: string}> }> = {
    about: { label: 'Biography', desc: 'Personal bio registry', angle: 0, color: 'text-[#00FF00]', glow: 'rgba(0, 255, 0, 0.45)', icon: FileText },
    services: { label: 'Capabilities', desc: 'Professional service deck', angle: 60, color: 'text-[#00FF00]', glow: 'rgba(0, 255, 0, 0.45)', icon: Cpu },
    projects: { label: 'Mission Nodes', desc: 'Catalog of live projects', angle: 120, color: 'text-[#00FF00]', glow: 'rgba(0, 255, 0, 0.45)', icon: Briefcase },
    skills: { label: 'Vector Modules', desc: 'Developer tech stack', angle: 180, color: 'text-[#00FF00]', glow: 'rgba(0, 255, 0, 0.45)', icon: Layers },
    messages: { label: 'Comms Inbox', desc: 'Visitor inquiries feed', angle: 240, color: 'text-[#00FF00]', glow: 'rgba(0, 255, 0, 0.45)', icon: Inbox },
    adibot: { label: 'Adibot Node', desc: 'AI Chatbot RAG context', angle: 300, color: 'text-[#00FF00]', glow: 'rgba(0, 255, 0, 0.45)', icon: Bot }
  };

  // Inline Forms Generators
  const renderServiceForm = () => {
    if (!editingService) return null;
    return (
      <div className="space-y-4 text-left font-sans text-xs">
        <h2 className="text-sm font-black uppercase tracking-widest text-[#00FF00] mb-4 border-b border-white/5 pb-3">
          {services.some(s => s.serviceId === editingService.serviceId) ? 'EDIT SERVICE NODE' : 'APPEND SERVICE NODE'}
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">ID</label>
            <input
              type="text"
              value={editingService.serviceId || ''}
              onChange={(e) => setEditingService({ ...editingService, serviceId: e.target.value })}
              className="w-full px-3 py-2.5 bg-black border border-white/10 focus:border-[#00FF00] rounded-xl text-white font-mono focus:outline-none"
              placeholder="01"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Title</label>
            <input
              type="text"
              value={editingService.name || ''}
              onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
              className="w-full px-3 py-2.5 bg-black border border-white/10 focus:border-[#00FF00] rounded-xl text-white focus:outline-none"
              placeholder="AI/ML Development"
            />
          </div>
        </div>

        <div>
          <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Subtitle</label>
          <input
            type="text"
            value={editingService.subtitle || ''}
            onChange={(e) => setEditingService({ ...editingService, subtitle: e.target.value })}
            className="w-full px-3 py-2.5 bg-black border border-white/10 focus:border-[#00FF00] rounded-xl text-white focus:outline-none"
            placeholder="Intelligence."
          />
        </div>

        <div>
          <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
          <textarea
            value={editingService.description || ''}
            onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
            className="w-full min-h-[90px] px-3 py-2.5 bg-black border border-white/10 focus:border-[#00FF00] rounded-xl text-white focus:outline-none leading-relaxed resize-none"
            placeholder="Describe module functionality..."
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[8px] font-bold text-[#00FF00] uppercase tracking-wider mb-2">Icon Name</label>
            <input
              type="text"
              value={editingService.iconName || ''}
              onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value })}
              className="w-full px-2.5 py-2 bg-black border border-white/10 focus:border-[#00FF00] rounded-lg text-white font-mono text-[10px]"
              placeholder="Cpu"
            />
          </div>
          <div>
            <label className="block text-[8px] font-bold text-[#00FF00] uppercase tracking-wider mb-2">Icon Color</label>
            <input
              type="text"
              value={editingService.iconColor || ''}
              onChange={(e) => setEditingService({ ...editingService, iconColor: e.target.value })}
              className="w-full px-2.5 py-2 bg-black border border-white/10 focus:border-[#00FF00] rounded-lg text-white font-mono text-[10px]"
              placeholder="text-[#EE4C2C]"
            />
          </div>
          <div>
            <label className="block text-[8px] font-bold text-[#00FF00] uppercase tracking-wider mb-2">Dot Bg</label>
            <input
              type="text"
              value={editingService.dotBg || ''}
              onChange={(e) => setEditingService({ ...editingService, dotBg: e.target.value })}
              className="w-full px-2.5 py-2 bg-black border border-white/10 focus:border-[#00FF00] rounded-lg text-white font-mono text-[10px]"
              placeholder="bg-[#EE4C2C]"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
          <button
            onClick={handleSaveService}
            className="flex-grow py-3 bg-[#00FF00]/10 border border-[#00FF00]/30 hover:bg-[#00FF00]/20 text-[#00FF00] font-bold rounded-xl uppercase tracking-widest text-[9px]"
          >
            Save Card
          </button>
          <button
            onClick={() => setEditingService(null)}
            className="px-5 py-3 border border-white/10 hover:border-white/20 rounded-xl uppercase tracking-widest text-[9px] text-gray-500 hover:text-white transition-all font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const ImageUploadField = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: string; 
    onChange: (val: string) => void; 
  }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      playOmnitrixScanSound();
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        onChange(data.url);
        playOmnitrixSuccessSound();
        showToast('Image uploaded successfully', 'success');
      } catch (err: any) {
        playOmnitrixErrorSound();
        showToast(err.message || 'Image upload failed', 'error');
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="space-y-1.5 text-left">
        <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
        <div className="flex gap-3 items-center">
          {/* Preview Panel */}
          <div className="w-14 h-14 rounded-xl border border-white/10 bg-black flex items-center justify-center overflow-hidden shrink-0 relative group">
            {value ? (
              <>
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button
                    type="button"
                    onClick={() => onChange('')}
                    className="text-red-500 hover:text-red-400 font-bold text-[7px] uppercase tracking-wider"
                  >
                    Clear
                  </button>
                </div>
              </>
            ) : (
              <span className="text-[7px] text-gray-600 font-mono">NO_FILE</span>
            )}
          </div>

          {/* Upload Input controls */}
          <div className="flex-grow space-y-1">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-1.5 bg-black border border-white/10 focus:border-[#00FF00] rounded-xl text-white text-[9px] focus:outline-none"
              placeholder="Paste URL or upload image file..."
            />
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-2.5 py-1 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#00FF00]/30 hover:text-[#00FF00] text-gray-400 rounded-lg text-[7px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {uploading ? 'UPLOADING...' : 'UPLOAD IMAGE'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProjectForm = () => {
    if (!editingProject) return null;
    return (
      <div className="space-y-4 text-left font-sans text-xs">
        <h2 className="text-sm font-black uppercase tracking-widest text-[#00FF00] mb-4 border-b border-white/5 pb-3">
          {originalProjectId !== null ? 'EDIT PROJECT NODE' : 'APPEND PROJECT NODE'}
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              ID {originalProjectId !== null && <span className="text-gray-600 normal-case">(locked)</span>}
            </label>
            <input
              type="text"
              value={editingProject.projectId || ''}
              onChange={(e) => originalProjectId === null && setEditingProject({ ...editingProject, projectId: e.target.value })}
              readOnly={originalProjectId !== null}
              className={`w-full px-3 py-2.5 bg-black border rounded-xl text-white font-mono focus:outline-none ${
                originalProjectId !== null
                  ? 'border-white/5 text-gray-600 cursor-not-allowed'
                  : 'border-white/10 focus:border-[#00FF00]'
              }`}
              placeholder="01"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Project Name</label>
            <input
              type="text"
              value={editingProject.name || ''}
              onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
              className="w-full px-3 py-2.5 bg-black border border-white/10 focus:border-[#00FF00] rounded-xl text-white focus:outline-none"
              placeholder="Nextlevel Studio"
            />
          </div>
        </div>

        <div>
          <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
          <input
            type="text"
            value={editingProject.category || ''}
            onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
            className="w-full px-3 py-2.5 bg-black border border-white/10 focus:border-[#00FF00] rounded-xl text-white focus:outline-none"
            placeholder="Client / AI Product Design"
          />
        </div>

        <div>
          <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Live URL</label>
          <input
            type="text"
            value={editingProject.liveUrl || ''}
            onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
            className="w-full px-3 py-2.5 bg-black border border-white/10 focus:border-[#00FF00] rounded-xl text-white focus:outline-none"
            placeholder="https://motionsites.ai"
          />
        </div>

        <ImageUploadField 
          label="Col 1 Top Thumbnail URL" 
          value={editingProject.imgCol1Top || ''} 
          onChange={(val) => setEditingProject({ ...editingProject, imgCol1Top: val })}
        />

        <ImageUploadField 
          label="Col 1 Bottom Thumbnail URL" 
          value={editingProject.imgCol1Bottom || ''} 
          onChange={(val) => setEditingProject({ ...editingProject, imgCol1Bottom: val })}
        />

        <ImageUploadField 
          label="Col 2 Main Aspect URL" 
          value={editingProject.imgCol2 || ''} 
          onChange={(val) => setEditingProject({ ...editingProject, imgCol2: val })}
        />

        <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
          <button
            onClick={handleSaveProject}
            className="flex-grow py-3 bg-[#00FF00]/10 border border-[#00FF00]/30 hover:bg-[#00FF00]/20 text-[#00FF00] font-bold rounded-xl uppercase tracking-widest text-[9px]"
          >
            Save Project
          </button>
          <button
            onClick={() => { setEditingProject(null); setOriginalProjectId(null); }}
            className="px-5 py-3 border border-white/10 hover:border-white/20 rounded-xl uppercase tracking-widest text-[9px] text-gray-500 hover:text-white transition-all font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderSkillForm = () => {
    if (!editingSkill) return null;
    return (
      <div className="space-y-4 text-left font-sans text-xs">
        <h2 className="text-sm font-black uppercase tracking-widest text-[#00FF00] mb-4 border-b border-white/5 pb-3">
          {skills.some(s => s.skillId === editingSkill.skillId) ? 'EDIT SKILL VECTOR' : 'APPEND SKILL VECTOR'}
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">ID KEY</label>
            <input
              type="text"
              value={editingSkill.skillId || ''}
              onChange={(e) => setEditingSkill({ ...editingSkill, skillId: e.target.value })}
              className="w-full px-3 py-2.5 bg-black border border-white/10 focus:border-[#00FF00] rounded-xl text-white font-mono focus:outline-none"
              placeholder="skill-pytorch"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Skill Label</label>
            <input
              type="text"
              value={editingSkill.name || ''}
              onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
              className="w-full px-3 py-2.5 bg-black border border-white/10 focus:border-[#00FF00] rounded-xl text-white focus:outline-none"
              placeholder="PyTorch"
            />
          </div>
        </div>

        <div>
          <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Tagline</label>
          <input
            type="text"
            value={editingSkill.tagline || ''}
            onChange={(e) => setEditingSkill({ ...editingSkill, tagline: e.target.value })}
            className="w-full px-3 py-2.5 bg-black border border-white/10 focus:border-[#00FF00] rounded-xl text-white focus:outline-none"
            placeholder="Deep Learning & Neural Networks"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Glow Shadow (RGBA)</label>
            <input
              type="text"
              value={editingSkill.glow || ''}
              onChange={(e) => setEditingSkill({ ...editingSkill, glow: e.target.value })}
              className="w-full px-3 py-2.5 bg-black border border-white/10 focus:border-[#00FF00] rounded-xl text-white font-mono text-[10px]"
              placeholder="rgba(238, 76, 44, 0.25)"
            />
          </div>
          <div>
            <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Border Color (Tailwind)</label>
            <input
              type="text"
              value={editingSkill.border || ''}
              onChange={(e) => setEditingSkill({ ...editingSkill, border: e.target.value })}
              className="w-full px-3 py-2.5 bg-black border border-white/10 focus:border-[#00FF00] rounded-xl text-white font-mono text-[10px]"
              placeholder="border-[#EE4C2C]/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Icon Type</label>
          <div className="flex gap-6 mt-1">
            <label className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-white">
              <input
                type="radio"
                name="iconType"
                checked={editingSkill.iconType === 'svg'}
                onChange={() => setEditingSkill({ ...editingSkill, iconType: 'svg' })}
                className="mr-2 accent-[#00FF00]"
              />
              Custom SVG
            </label>
            <label className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-white">
              <input
                type="radio"
                name="iconType"
                checked={editingSkill.iconType === 'lucide'}
                onChange={() => setEditingSkill({ ...editingSkill, iconType: 'lucide' })}
                className="mr-2 accent-[#00FF00]"
              />
              Lucide Token
            </label>
          </div>
        </div>

        <div>
          <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Icon Content Markup</label>
          <textarea
            value={editingSkill.iconContent || ''}
            onChange={(e) => setEditingSkill({ ...editingSkill, iconContent: e.target.value })}
            className="w-full min-h-[70px] px-3 py-2 bg-black border border-white/10 focus:border-[#00FF00] rounded-xl text-white font-mono text-[10px] focus:outline-none resize-none"
            placeholder={editingSkill.iconType === 'svg' ? '<path d="..." />' : 'Brain'}
          />
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
          <button
            onClick={handleSaveSkill}
            className="flex-grow py-3 bg-[#00FF00]/10 border border-[#00FF00]/30 hover:bg-[#00FF00]/20 text-[#00FF00] font-bold rounded-xl uppercase tracking-widest text-[9px]"
          >
            Save Skill
          </button>
          <button
            onClick={() => setEditingSkill(null)}
            className="px-5 py-3 border border-white/10 hover:border-white/20 rounded-xl uppercase tracking-widest text-[9px] text-gray-500 hover:text-white transition-all font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderMessageDetails = () => {
    if (!selectedMessage) return null;
    const charCount = selectedMessage.message.length;
    const wordCount = selectedMessage.message.split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200 * 60)); // in seconds
    
    // Heuristics
    const msgLower = selectedMessage.message.toLowerCase();
    let category = 'GENERAL INQUIRY';
    let catColor = 'text-[#00FF00]';
    let catGlow = 'rgba(0, 255, 0, 0.25)';
    if (msgLower.match(/(hire|work|project|collab|offer|job|opportunity|freelance)/)) {
      category = 'MISSION COLLABORATION';
      catColor = 'text-[#00D8FF]';
      catGlow = 'rgba(0, 216, 255, 0.25)';
    } else if (msgLower.match(/(love|awesome|great|cool|suggest|idea|bug|issue)/)) {
      category = 'FEEDBACK / METRICS';
      catColor = 'text-[#FFDD00]';
      catGlow = 'rgba(255, 221, 0, 0.25)';
    }

    const applyTemplate = (type: string) => {
      if (type === 'thanks') {
        setReplyMessage(`Hi ${selectedMessage.name},\n\nThanks for reaching out! I'd love to chat more about this. When are you free for a quick call?\n\nBest,\nAditya`);
      } else if (type === 'collab') {
        setReplyMessage(`Hi ${selectedMessage.name},\n\nThanks for your inquiry regarding collaboration. I've reviewed your request and would be excited to discuss details. Let's schedule a Zoom call.\n\nBest,\nAditya`);
      } else if (type === 'general') {
        setReplyMessage(`Hi ${selectedMessage.name},\n\n`);
      }
    };

    return (
      <div className="space-y-5 text-left font-sans text-xs">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <h2 className="text-sm font-black uppercase tracking-widest text-white">
            {isReplying ? 'COMPOSE REPLY' : 'COMMS DECODED'}
          </h2>
          <span 
            className={`px-2.5 py-1 border border-white/10 rounded-full text-[8px] font-mono font-bold tracking-wider ${catColor}`}
            style={{ textShadow: `0 0 10px ${catGlow}` }}
          >
            {category}
          </span>
        </div>

        {isReplying ? (
          /* REPLY INTERFACE */
          <div className="space-y-4">
            <div>
              <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-1">To</label>
              <input
                type="text"
                readOnly
                value={`${selectedMessage.name} <${selectedMessage.email}>`}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-gray-400 font-mono text-[9px]"
              />
            </div>

            <div>
              <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-1">Subject</label>
              <input
                type="text"
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-white font-mono text-[9px] focus:border-[#00FF00] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider">Quick Templates</label>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => applyTemplate('thanks')}
                    className="px-2 py-0.5 border border-white/5 hover:border-[#00FF00]/30 hover:bg-[#00FF00]/5 rounded text-[7px] font-bold text-gray-400 hover:text-[#00FF00] transition-colors"
                  >
                    THANKS
                  </button>
                  <button
                    onClick={() => applyTemplate('collab')}
                    className="px-2 py-0.5 border border-white/5 hover:border-[#00D8FF]/30 hover:bg-[#00D8FF]/5 rounded text-[7px] font-bold text-gray-400 hover:text-[#00D8FF] transition-colors"
                  >
                    COLLAB
                  </button>
                  <button
                    onClick={() => applyTemplate('general')}
                    className="px-2 py-0.5 border border-white/5 hover:border-white/20 rounded text-[7px] font-bold text-gray-400 hover:text-white transition-colors"
                  >
                    RESET
                  </button>
                </div>
              </div>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full min-h-[160px] bg-black border border-white/10 focus:border-[#00FF00] rounded-2xl p-4 text-white focus:outline-none transition-all leading-relaxed text-xs resize-none"
                placeholder="Type your reply message..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSendReply}
                disabled={isSendingReply}
                className="flex-grow py-3 bg-[#00FF00]/10 border border-[#00FF00]/30 hover:bg-[#00FF00]/20 text-[#00FF00] font-bold rounded-xl uppercase tracking-widest text-[9px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingReply ? 'TRANSMITTING...' : 'TRANSMIT REPLY'}
              </button>
              <button
                onClick={() => setIsReplying(false)}
                disabled={isSendingReply}
                className="px-5 py-3 border border-white/10 hover:border-white/20 rounded-xl uppercase tracking-widest text-[9px] text-gray-500 hover:text-white transition-all font-bold disabled:opacity-50"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          /* DECODED DETAILED VIEW */
          <>
            <div className="space-y-3 font-mono text-[9px] text-gray-400 bg-black/40 p-4 border border-white/5 rounded-2xl">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>SENDER_ID:</span>
                <span className="text-white font-bold">{selectedMessage.name}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>SECURE_COMMS:</span>
                <a href={`mailto:${selectedMessage.email}`} className="text-[#00D8FF] hover:underline font-bold">{selectedMessage.email}</a>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>TIME_STAMP:</span>
                <span className="text-white">{selectedMessage.dateSubmitted}</span>
              </div>
              <div className="flex justify-between">
                <span>NODE_ADDR:</span>
                <span className="text-white">IP_DECRYPTED</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider">Telemetry Report</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-black/60 border border-white/5 rounded-xl text-center">
                  <span className="block text-[8px] text-gray-500">WORDS</span>
                  <span className="text-xs font-bold font-mono text-[#00FF00]">{wordCount}</span>
                </div>
                <div className="p-3 bg-black/60 border border-white/5 rounded-xl text-center">
                  <span className="block text-[8px] text-gray-500">CHARS</span>
                  <span className="text-xs font-bold font-mono text-[#00FF00]">{charCount}</span>
                </div>
                <div className="p-3 bg-black/60 border border-white/5 rounded-xl text-center">
                  <span className="block text-[8px] text-gray-500">READ_TIME</span>
                  <span className="text-xs font-bold font-mono text-[#00FF00]">{readTime}s</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider">Raw Message Stream</label>
              <div className="bg-black/60 border border-white/5 rounded-xl p-4 text-gray-300 text-xs leading-relaxed font-mono relative min-h-[120px] select-text">
                <div className={`absolute top-0 left-0 w-[2.5px] h-full ${catColor.replace('text-', 'bg-')}`} />
                "{selectedMessage.message}"
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  setIsReplying(true);
                  playOmnitrixRotateSound();
                }}
                className="flex-grow py-3 bg-[#00FF00]/10 border border-[#00FF00]/30 hover:bg-[#00FF00]/20 text-[#00FF00] font-bold rounded-xl uppercase tracking-widest text-[9px]"
              >
                Compose Reply
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedMessage.message);
                  playOmnitrixSuccessSound();
                  showToast('Message text copied', 'success');
                }}
                className="py-3 px-4 border border-white/10 hover:border-white/20 rounded-xl uppercase tracking-widest text-[9px] text-gray-400 hover:text-white transition-all font-bold"
              >
                Copy
              </button>
              <button
                onClick={() => {
                  setSelectedMessage(null);
                }}
                className="px-5 py-3 border border-white/10 hover:border-white/20 rounded-xl uppercase tracking-widest text-[9px] text-gray-500 hover:text-white transition-all font-bold"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  const isModalOpen = !!(editingService || editingProject || editingSkill || selectedMessage);
  const activeIndex = Object.keys(sectorInfo).indexOf(activeSector);
  const rotationAngle = -activeIndex * 60;

  return (
    <div className="admin-console min-h-screen bg-[#07070a] text-[#CCD4DC] relative overflow-hidden font-sans select-none flex flex-col h-screen">
      
      {/* Background neon glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#00FF00]/4 to-transparent rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-[#00D8FF]/4 to-transparent rounded-full blur-[180px] pointer-events-none z-0" />

      {/* Top Menu bar - Transitions in when logged in */}
      <AnimatePresence>
        {token && (
          <motion.header 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="w-full h-16 border-b border-white/[0.04] bg-[#0A0A0F]/60 backdrop-blur-3xl px-8 flex items-center justify-between z-20 relative text-[10px] font-bold tracking-widest uppercase"
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse" />
                <span className="text-white text-xs font-black tracking-widest">ADITYA.CONSOLE</span>
              </div>
              <div className="h-4 w-[1px] bg-white/[0.08]" />
              <span className="text-gray-500 text-[8px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Database Live Sync
              </span>
            </div>

            <div className="flex items-center gap-4 text-gray-400">
              <button 
                onClick={fetchData}
                className="hover:text-white transition-colors flex items-center gap-1.5"
                title="Refresh database"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="text-[9px]">Sync DB</span>
              </button>
              <a href="#/" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[9px]">Launch site</span>
              </a>
              <div className="h-4 w-[1px] bg-white/[0.08]" />
              <button 
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="text-[9px]">Exit</span>
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Split Screen Area */}
      <div className={`flex-grow w-full max-w-[1440px] mx-auto px-8 py-8 flex items-center ${!token ? 'justify-center' : 'justify-between'} gap-6 overflow-hidden relative z-10 h-[calc(100vh-100px)]`}>
        
        {/* COLUMN 1: Central Radial Dial Navigator (Omnitrix) */}
        <motion.div 
          layout
          animate={{
            width: !token ? '100%' : isModalOpen ? '20%' : '48%',
            scale: !token ? 1.05 : isModalOpen ? 0.6 : 1,
            x: !token ? 0 : isModalOpen ? -40 : 0
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="flex flex-col items-center justify-center relative select-none shrink-0"
        >
          {/* Tech HUD corner borders (Only when not logged in) */}
          <AnimatePresence>
            {!token && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 pointer-events-none"
              >
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00FF00]/40 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00FF00]/40 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00FF00]/40 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00FF00]/40 rounded-br-xl" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative w-[340px] h-[340px] md:w-[420px] md:h-[420px] flex items-center justify-center">
            
            {/* Outer static green neon glow ring */}
            <div className="absolute inset-0 rounded-full border border-[#00FF00]/10 shadow-[0_0_80px_rgba(0,255,0,0.05)] pointer-events-none" />
            
            {/* Bezel marks (The Omnitrix watch bezel) */}
            <div className="absolute inset-2 rounded-full border-4 border-[#1E1E26] pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-[#2E2E3A] border-b border-white/10" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-[#2E2E3A] border-t border-white/10" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-[#2E2E3A] border-r border-white/10" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-[#2E2E3A] border-l border-white/10" />
            </div>

            <div 
              className="absolute inset-4 rounded-full border border-dashed border-[#00FF00]/30 transition-all duration-700 pointer-events-none" 
              style={{ boxShadow: `0 0 40px rgba(0, 255, 0, 0.35)` }}
            />

            {/* Rotating Dial Container */}
            <motion.div 
              className="w-full h-full rounded-full relative flex items-center justify-center"
              animate={!token && isVerifying ? { rotate: 360 } : { rotate: rotationAngle }}
              transition={!token && isVerifying ? { repeat: Infinity, duration: 4, ease: 'linear' } : { type: 'spring', stiffness: 100, damping: 15 }}
            >
              {/* Radial sector lines */}
              {token && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100">
                  {[0, 60, 120, 180, 240, 300].map((angle, idx) => {
                    const rad = (angle - 90) * (Math.PI / 180);
                    const x = 50 + 50 * Math.cos(rad);
                    const y = 50 + 50 * Math.sin(rad);
                    return (
                      <line key={idx} x1="50" y1="50" x2={x} y2={y} stroke="#00FF00" strokeWidth="0.25" strokeDasharray="1 1" />
                    );
                  })}
                </svg>
              )}

              {/* Orbiting buttons / Bezel notches */}
              <AnimatePresence mode="wait">
                {token ? (
                  /* Orbiting sector buttons for main dashboard */
                  <motion.div 
                    key="sector-buttons"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    {Object.entries(sectorInfo).map(([key, info]) => {
                      const isActive = activeSector === key;
                      const rad = (info.angle - 90) * (Math.PI / 180);
                      const xPos = `calc(50% + ${Math.cos(rad) * 41}%)`;
                      const yPos = `calc(50% + ${Math.sin(rad) * 41}%)`;

                      const Icon = info.icon;

                      return (
                        <button
                          key={key}
                          onClick={() => {
                            if (activeSector !== key) {
                              setActiveSector(key as SectorType);
                              setEditingService(null);
                              setEditingProject(null);
                              setEditingSkill(null);
                              setSelectedMessage(null);
                              setIsReplying(false);
                              setReplySubject('');
                              setReplyMessage('');
                              playOmnitrixRotateSound();
                            }
                          }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center transition-all duration-500 z-20 outline-none"
                          style={{
                            left: xPos,
                            top: yPos,
                            transform: `translate(-50%, -50%) rotate(${-rotationAngle}deg)`,
                            background: isActive ? 'rgba(0, 255, 0, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                            border: isActive ? `1.5px solid ${info.glow}` : '1.5px solid rgba(255, 255, 255, 0.05)',
                            boxShadow: isActive ? `0 0 20px ${info.glow}` : 'none'
                          }}
                        >
                          <Icon className={`w-5 h-5 md:w-5.5 md:h-5.5 transition-colors ${isActive ? info.color : 'text-gray-500 hover:text-white'}`} />
                        </button>
                      );
                    })}
                  </motion.div>
                ) : (
                  /* Triangular Bezel notches for login screen */
                  <motion.div 
                    key="login-notches"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
                      <div 
                        key={idx} 
                        className={`absolute w-3.5 h-6 transition-colors duration-500 ${error ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-[#00FF00] shadow-[0_0_10px_#00ff00]'} clip-triangle`}
                        style={{ 
                          transform: `rotate(${angle}deg) translateY(-165px)`,
                          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' 
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Concentric telemetry details (Only when not logged in) */}
            {!token && (
              <div className="absolute inset-16 rounded-full border border-dashed border-[#00FF00]/5 flex items-center justify-center text-[5px] font-mono text-[#00FF00]/20 tracking-widest pointer-events-none">
                <div className="rotate-45 absolute -top-1">GATEWAY_ACTIVE</div>
                <div className="rotate-135 absolute -right-2">SYS_AUTH_REQ</div>
                <div className="rotate-225 absolute -bottom-1">DNA_LOCK_ON</div>
              </div>
            )}

            {/* OMNITRIX CORE DIGITAL SCREEN (Glowing Holographic interface) */}
            <div className={`absolute w-[70%] h-[70%] rounded-full bg-gradient-to-b ${!token && error ? 'from-[#180a0a] to-[#080404] border-red-500/50 shadow-[0_0_35px_rgba(239,68,68,0.4)]' : 'from-[#0a150c] to-[#040806] border-[#00FF00]/50 shadow-[0_0_35px_rgba(0,255,0,0.4)]'} border-4 flex flex-col items-center justify-center p-6 text-center z-10 transition-all duration-500 overflow-hidden`}>
              
              {/* Grid Overlay & Scanlines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.02)_1px,transparent_1px)] bg-[size:10px_10px] opacity-80 pointer-events-none" />
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,255,0,0.08)_100%)] pointer-events-none" />
              <div className={`absolute top-0 left-0 w-full h-[1.5px] ${!token && error ? 'bg-red-500/30' : 'bg-[#00FF00]/25'} shadow-md animate-[bounce_5s_infinite_ease-in-out] pointer-events-none`} />

              <AnimatePresence mode="wait">
                {!token ? (
                  /* Login form */
                  <motion.form 
                    key="login-view"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    onSubmit={handleLogin} 
                    className="w-full h-full flex flex-col justify-between items-center z-10 relative mt-2"
                  >
                    {/* Header title */}
                    <div className="space-y-0.5">
                      <h2 className="text-white text-[12px] font-black font-heading tracking-[0.2em] uppercase leading-none">
                        ADITYA<span className={error ? 'text-red-500' : 'text-[#00FF00]'}>.CORE</span>
                      </h2>
                      <span className={`block text-[6px] font-mono tracking-wider ${error ? 'text-red-400' : 'text-gray-500'} uppercase leading-none`}>
                        {isVerifying ? authStage : error ? 'DECRYPTION_FAILED' : 'identity_verification_req'}
                      </span>
                    </div>

                    {/* Main Content Area */}
                    <div className="w-full flex-grow flex flex-col justify-center py-2 min-h-[140px]">
                      {isVerifying ? (
                        /* Decrypting holographic spinner */
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="relative flex items-center justify-center">
                            <svg className={`w-14 h-14 animate-spin ${error ? 'text-red-500' : 'text-[#00FF00]'}`} viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="30 40" />
                              <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="15 25" className="animate-[spin_2s_linear_infinite_reverse]" />
                            </svg>
                            <Shield className={`absolute w-5 h-5 ${error ? 'text-red-500 animate-pulse' : 'text-[#00FF00] animate-bounce'}`} />
                          </div>
                          <span className="text-[7.5px] font-mono tracking-widest text-white uppercase animate-pulse">{authStage}</span>
                        </div>
                      ) : error ? (
                        /* Error state readout */
                        <div className="flex flex-col items-center space-y-2 py-1 px-2.5">
                          <AlertCircle className="w-9 h-9 text-red-500 animate-bounce" />
                          <div className="text-center space-y-1 font-mono">
                            <span className="block text-[8px] font-bold text-red-500 uppercase tracking-widest">[ ACCESS_DENIED ]</span>
                            <p className="text-[7px] text-red-400 opacity-90 uppercase leading-relaxed max-w-[200px] mx-auto">{error}</p>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setError('')} 
                            className="text-[6.5px] font-mono font-bold uppercase tracking-wider text-gray-500 hover:text-white border border-white/10 hover:border-white/30 rounded px-2.5 py-1 mt-1 transition-all"
                          >
                            Reset Gateway
                          </button>
                        </div>
                      ) : (
                        /* Inputs Form view */
                        <div className="space-y-2.5">
                          {/* Email field */}
                          <div className="space-y-0.5 text-left">
                            <label className="block text-[6.5px] font-mono text-gray-500 uppercase tracking-wider pl-1.5 text-center">identity_key</label>
                            <div className="relative flex items-center group">
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="username@domain.com"
                                className="w-full px-3.5 py-1.5 bg-black/55 border border-white/[0.06] focus:border-[#00FF00] rounded-lg text-white placeholder-gray-700 focus:outline-none transition-all duration-300 text-[9.5px] font-mono text-center"
                                required
                              />
                            </div>
                          </div>

                          {/* Password field */}
                          <div className="space-y-0.5 text-left">
                            <label className="block text-[6.5px] font-mono text-gray-500 uppercase tracking-wider pl-1.5 text-center">secure_password_key</label>
                            <div className="relative flex items-center group">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-3.5 py-1.5 bg-black/55 border border-white/[0.06] focus:border-[#00FF00] rounded-lg text-white placeholder-gray-700 focus:outline-none transition-all duration-300 text-[9.5px] font-mono tracking-widest text-center"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2.5 text-gray-600 hover:text-white transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action button */}
                    {!isVerifying && !error && (
                      <div className="w-full pt-1.5">
                        <motion.button
                          type="submit"
                          className="w-full py-2 bg-gradient-to-r from-[#00FF00]/25 to-[#00FF00]/10 border border-[#00FF00]/40 text-[#00FF00] hover:bg-[#00FF00]/20 font-bold rounded-lg text-[7.5px] font-mono uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,255,0,0.15)] flex items-center justify-center gap-1.5"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>verify_credentials</span>
                        </motion.button>
                      </div>
                    )}
                  </motion.form>
                ) : (
                  /* Hourglass / Dashboard status display */
                  <motion.div 
                    key="dashboard-view"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full flex flex-col items-center justify-center relative select-none pointer-events-none"
                  >
                    {/* Pulsing Hourglass Symbol */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none pointer-events-none">
                      <svg className="w-full h-full text-[#00FF00] animate-pulse" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="#00FF00" />
                        <path d="M10,10 L50,50 L10,90 Z" fill="#07070a" />
                        <path d="M90,10 L50,50 L90,90 Z" fill="#07070a" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#00FF00" strokeWidth="2" />
                      </svg>
                    </div>

                    <div className="relative z-20 flex flex-col items-center">
                      <span className="block text-[8px] font-black tracking-[0.25em] text-[#00FF00] uppercase leading-none mb-2">OMNIPORT.ACTIVE</span>
                      <h3 className="text-white font-black text-sm uppercase tracking-widest leading-none mt-1">
                        {sectorInfo[activeSector].label}
                      </h3>
                      <span className="text-[7.5px] text-gray-500 font-bold uppercase tracking-wider mt-1.5 block">
                        {sectorInfo[activeSector].desc}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rotating Bezel Rivets */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
              <div 
                key={idx} 
                className="absolute w-2 h-2 rounded-full bg-[#111116] border border-white/5 pointer-events-none flex items-center justify-center"
                style={{ transform: `rotate(${angle}deg) translateY(-190px)` }}
              />
            ))}

          </div>



        </motion.div>

        {/* COLUMN 2: Inline Modal Editor Popup Panel */}
        <AnimatePresence>
          {token && isModalOpen && (
            <motion.div
              initial={{ opacity: 0, width: 0, scale: 0.95 }}
              animate={{ opacity: 1, width: '38%', scale: 1 }}
              exit={{ opacity: 0, width: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 220, damping: 25 }}
              className="h-[520px] bg-[#111116]/95 border border-white/[0.08] rounded-[32px] p-6 overflow-y-auto shadow-2xl relative shrink-0 z-20"
            >
              {/* Green indicator glow line at the top of editing block */}
              <div className="absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#00FF00]/40 to-transparent" />
              {editingService && renderServiceForm()}
              {editingProject && renderProjectForm()}
              {editingSkill && renderSkillForm()}
              {selectedMessage && renderMessageDetails()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* COLUMN 3: Config Forms Panels (Shifts right if modal is open) */}
        <AnimatePresence>
          {token && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: 1,
                width: isModalOpen ? '38%' : '48%',
                x: isModalOpen ? 40 : 0
              }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: 'spring', stiffness: 220, damping: 25 }}
              className="h-[520px] relative overflow-hidden shrink-0"
            >
              <motion.div
                key={activeSector}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-full h-full bg-[#111116]/80 border border-white/[0.08] rounded-[32px] p-8 flex flex-col justify-between backdrop-blur-3xl text-left shadow-2xl relative"
              >
                {/* Dynamic top gradient line based on selected sector */}
                <div 
                  className="absolute top-0 left-8 right-8 h-[1.5px] transition-all duration-500" 
                  style={{ background: `linear-gradient(90deg, transparent, ${sectorInfo[activeSector].glow}, transparent)` }}
                />

                {/* Scrollable Form Body container */}
                <div className="flex-grow overflow-y-auto pr-1">
                  
                  {/* 1. ABOUT SECTION */}
                  {activeSector === 'about' && (
                    <div className="space-y-5">
                      <div className="sticky top-0 z-10 bg-[#111116] flex items-center gap-2.5 text-[#00FF00] pt-2 pb-2 border-b border-white/5">
                        <FileText className="w-4 h-4" />
                        <h4 className="text-xs font-black uppercase tracking-widest">Biography Registry</h4>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-relaxed">
                        Modify your biography detail text stored inside the MongoDB database.
                      </p>
                      <textarea
                        value={aboutText}
                        onChange={(e) => setAboutText(e.target.value)}
                        className="w-full min-h-[220px] bg-black/40 border border-white/10 focus:border-[#00FF00] rounded-2xl p-4 text-white focus:outline-none transition-all leading-relaxed text-xs resize-none"
                        placeholder="Add biography bio description..."
                      />
                    </div>
                  )}

                  {/* 2. SERVICES SECTION */}
                  {activeSector === 'services' && (
                    <div className="space-y-4">
                      <div className="sticky top-0 z-10 bg-[#111116] flex justify-between items-center pt-2 pb-2 border-b border-white/5 mb-3">
                        <div className="flex items-center gap-2.5 text-[#00FF00]">
                          <Cpu className="w-4 h-4" />
                          <h4 className="text-xs font-black uppercase tracking-widest">Capabilities Deck</h4>
                        </div>
                        <button
                          onClick={() => {
                            const nextId = String(services.length + 1).padStart(2, '0');
                            setEditingService({ serviceId: nextId, name: '', subtitle: '', description: '', iconName: 'Cpu', iconColor: 'text-[#EE4C2C]', dotBg: 'bg-[#EE4C2C]' });
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 border border-[#00FF00]/20 hover:bg-[#00FF00]/5 rounded-lg text-[#00FF00] text-[8px] font-bold uppercase tracking-wider transition-all"
                        >
                          <Plus className="w-3 h-3" /> Add service
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {services.map(service => (
                          <div 
                            key={service.serviceId}
                            className="p-4 bg-black/40 border border-white/[0.04] rounded-xl flex justify-between items-center group transition-all duration-300"
                          >
                            <div className="flex items-center gap-4 text-left">
                              <div className="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-[#00FF00] font-bold text-xs">
                                {service.serviceId}
                              </div>
                              <div>
                                <h5 className="font-bold text-white text-xs uppercase tracking-wide group-hover:text-[#00FF00] transition-colors">{service.name}</h5>
                                <p className="text-gray-500 text-[8.5px] uppercase tracking-wider">{service.subtitle}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingService(service)}
                                className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/10 text-white"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(service.serviceId)}
                                className="p-2.5 rounded-lg border border-red-950/20 bg-red-950/5 hover:bg-red-900/20 text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {services.length === 0 && (
                          <p className="text-xs text-gray-500 py-6 uppercase tracking-widest text-center font-bold">No services initialized</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 3. PROJECTS SECTION */}
                  {activeSector === 'projects' && (
                    <div className="space-y-4">
                      <div className="sticky top-0 z-10 bg-[#111116] flex justify-between items-center pt-2 pb-2 border-b border-white/5 mb-3">
                        <div className="flex items-center gap-2.5 text-[#00FF00]">
                          <Briefcase className="w-4 h-4" />
                          <h4 className="text-xs font-black uppercase tracking-widest">Mission Catalog</h4>
                        </div>
                        <button
                          onClick={() => {
                            const nextId = String(projects.length + 1).padStart(2, '0');
                            setOriginalProjectId(null); // null = new project
                            setEditingProject({ projectId: nextId, name: '', category: '', liveUrl: '', imgCol1Top: '', imgCol1Bottom: '', imgCol2: '' });
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 border border-[#00FF00]/20 hover:bg-[#00FF00]/5 rounded-lg text-[#00FF00] text-[8px] font-bold uppercase tracking-wider transition-all"
                        >
                          <Plus className="w-3 h-3" /> Add Project
                        </button>
                      </div>

                      <div className="space-y-3.5">
                        {projects.map(project => (
                          <div 
                            key={project.projectId}
                            className="p-4 bg-black/40 border border-white/[0.04] rounded-xl flex flex-col justify-between group space-y-3"
                          >
                            <div className="flex justify-between items-start text-left">
                              <div>
                                <span className="text-[#00FF00] text-[8px] font-bold uppercase tracking-widest">{project.category}</span>
                                <h5 className="text-xs font-bold text-white uppercase tracking-wide mt-0.5">{project.name}</h5>
                              </div>
                              <span className="text-gray-600 text-[8px] font-mono">[ID_{project.projectId}]</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 rounded-lg overflow-hidden h-14 bg-black/60 p-1 border border-white/5">
                              <img src={project.imgCol1Top} alt="D1" className="w-full h-full object-cover rounded" />
                              <img src={project.imgCol1Bottom} alt="D2" className="w-full h-full object-cover rounded" />
                              <img src={project.imgCol2} alt="D3" className="w-full h-full object-cover rounded" />
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-white/[0.04]">
                              <button
                                onClick={() => {
                                  setOriginalProjectId(project.projectId); // store original ID for PUT routing
                                  setEditingProject(project);
                                }}
                                className="flex-grow py-1.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/10 text-white text-[8px] font-bold uppercase tracking-wider transition-all"
                              >
                                Modify Card
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.projectId)}
                                className="p-1.5 rounded-lg border border-red-950/20 bg-red-950/5 hover:bg-red-900/15 text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {projects.length === 0 && (
                          <p className="text-xs text-gray-500 py-6 uppercase tracking-widest text-center font-bold">No projects registered</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 4. SKILLS SECTION */}
                  {activeSector === 'skills' && (
                    <div className="space-y-4">
                      <div className="sticky top-0 z-10 bg-[#111116] flex justify-between items-center pt-2 pb-2 border-b border-white/5 mb-3">
                        <div className="flex items-center gap-2.5 text-[#00FF00]">
                          <Layers className="w-4 h-4" />
                          <h4 className="text-xs font-black uppercase tracking-widest">Vector Modules</h4>
                        </div>
                        <button
                          onClick={() => {
                            setEditingSkill({ skillId: 'skill-new-' + Math.random().toString(36).substring(2, 7), name: '', tagline: '', glow: 'rgba(255, 255, 255, 0.25)', border: 'border-white/30', iconType: 'lucide', iconContent: 'Brain' });
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 border border-[#00FF00]/20 hover:bg-[#00FF00]/5 rounded-lg text-[#00FF00] text-[8px] font-bold uppercase tracking-wider transition-all"
                        >
                          <Plus className="w-3 h-3" /> Add skill
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {skills.map(skill => (
                          <div 
                            key={skill.skillId}
                            className="p-4 bg-black/40 border border-white/[0.04] rounded-xl flex justify-between items-center group"
                          >
                            <div className="text-left">
                              <h5 className="font-bold text-white text-xs uppercase tracking-wide group-hover:text-[#00FF00] transition-colors">{skill.name}</h5>
                              <p className="text-gray-500 text-[8px] mt-0.5 uppercase tracking-wider">{skill.tagline}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingSkill(skill)}
                                className="p-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/10 text-white"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteSkill(skill.skillId)}
                                className="p-2 rounded-lg border border-red-950/20 bg-red-950/5 hover:bg-red-900/20 text-red-400"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {skills.length === 0 && (
                          <p className="text-xs text-gray-500 py-6 uppercase tracking-widest text-center font-bold">No tech marquee skills active</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 5. MESSAGES INBOX */}
                  {activeSector === 'messages' && (
                    <div className="space-y-4">
                      <div className="sticky top-0 z-10 bg-[#111116] flex items-center gap-2.5 text-[#00FF00] pt-2 pb-2 border-b border-white/5 mb-3">
                        <Inbox className="w-4 h-4" />
                        <h4 className="text-xs font-black uppercase tracking-widest font-heading">Comms Inbox Feed</h4>
                      </div>

                      {/* High-tech Search & Filter Row */}
                      <div className="flex gap-2 items-center pb-2">
                        <div className="relative flex-grow">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SCAN FOR KEYWORDS..."
                            className="w-full px-3 py-1.5 bg-black/60 border border-white/10 focus:border-[#00FF00] rounded-xl text-white font-mono text-[9px] placeholder-gray-600 focus:outline-none transition-all"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[7px] text-[#00FF00] font-mono animate-pulse">SYS_SCAN</span>
                        </div>
                        <select
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value as any)}
                          className="bg-black/60 border border-white/10 focus:border-[#00FF00] text-gray-400 font-mono text-[9px] px-2 py-1.5 rounded-xl focus:outline-none"
                        >
                          <option value="all">ALL NODES</option>
                          <option value="collab">COLLABS</option>
                          <option value="inquiry">INQUIRIES</option>
                          <option value="feedback">FEEDBACK</option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        {(() => {
                          const filteredMessages = messages.filter(msg => {
                            const matchesSearch = searchQuery === '' || 
                              msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              msg.message.toLowerCase().includes(searchQuery.toLowerCase());

                            if (!matchesSearch) return false;
                            if (filterCategory === 'all') return true;

                            const msgLower = msg.message.toLowerCase();
                            const isCollab = msgLower.match(/(hire|work|project|collab|offer|job|opportunity|freelance)/);
                            const isFeedback = msgLower.match(/(love|awesome|great|cool|suggest|idea|bug|issue)/);

                            if (filterCategory === 'collab') return isCollab;
                            if (filterCategory === 'feedback') return isFeedback;
                            if (filterCategory === 'inquiry') return !isCollab && !isFeedback;

                            return true;
                          });

                          return (
                            <>
                              {filteredMessages.map(msg => {
                                const msgLower = msg.message.toLowerCase();
                                let tag = 'INQUIRY';
                                let tagColor = 'text-[#00FF00] border-[#00FF00]/20 bg-[#00FF00]/5';
                                if (msgLower.match(/(hire|work|project|collab|offer|job|opportunity|freelance)/)) {
                                  tag = 'COLLAB';
                                  tagColor = 'text-[#00D8FF] border-[#00D8FF]/20 bg-[#00D8FF]/5';
                                } else if (msgLower.match(/(love|awesome|great|cool|suggest|idea|bug|issue)/)) {
                                  tag = 'FEEDBACK';
                                  tagColor = 'text-[#FFDD00] border-[#FFDD00]/20 bg-[#FFDD00]/5';
                                }

                                const borderBg = tag === 'COLLAB' ? 'bg-[#00D8FF]' : tag === 'FEEDBACK' ? 'bg-[#FFDD00]' : 'bg-[#00FF00]';

                                const isSelected = selectedMessage?._id === msg._id;

                                return (
                                  <div 
                                    key={msg._id}
                                    onClick={() => {
                                      setSelectedMessage(msg);
                                      setReplySubject(`Re: Portfolio Message - ${msg.name}`);
                                      setReplyMessage(`Hi ${msg.name},\n\n`);
                                      setIsReplying(false);
                                      playOmnitrixRotateSound();
                                    }}
                                    className={`p-4 bg-black/40 border ${isSelected ? 'border-[#00FF00]' : 'border-white/[0.04]'} hover:border-[#00FF00]/30 rounded-xl text-left space-y-3 relative group cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,0,0.05)]`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h5 className="font-bold text-white text-xs uppercase tracking-wide group-hover:text-[#00FF00] transition-colors">{msg.name}</h5>
                                        <a 
                                          href={`mailto:${msg.email}`} 
                                          onClick={(e) => e.stopPropagation()} 
                                          className="text-[#00D8FF] text-[9px] hover:underline font-mono block mt-0.5"
                                        >
                                          {msg.email}
                                        </a>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className={`px-1.5 py-0.5 border rounded text-[7px] font-mono font-bold tracking-wider ${tagColor}`}>
                                          {tag}
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteMessage(msg._id);
                                          }}
                                          className="p-1.5 rounded-lg border border-red-950/20 bg-red-950/5 hover:bg-red-900/15 text-red-400 opacity-60 group-hover:opacity-100 transition-opacity"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="bg-black/60 border border-white/5 rounded-lg p-3 text-gray-300 text-xs italic leading-relaxed font-mono relative line-clamp-2">
                                      <div className={`absolute top-0 left-0 w-[2px] h-full ${borderBg} rounded-l-lg`} />
                                      "{msg.message}"
                                    </div>
                                  </div>
                                );
                              })}
                              {filteredMessages.length === 0 && (
                                <p className="text-xs text-gray-500 py-8 uppercase tracking-widest text-center font-bold">No matching messages found</p>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* 6. ADIBOT SECTION */}
                  {activeSector === 'adibot' && (
                    <div className="space-y-5">
                      <div className="sticky top-0 z-10 bg-[#111116] flex items-center gap-2.5 text-[#00FF00] pt-2 pb-2 border-b border-white/5">
                        <Bot className="w-4 h-4" />
                        <h4 className="text-xs font-black uppercase tracking-widest">Adibot AI Node</h4>
                      </div>

                      {/* API Key configuration */}
                      <div>
                        <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Gemini AI API Key</label>
                        <div className="relative flex items-center group">
                          <input
                            type={showApiKey ? 'text' : 'password'}
                            value={geminiApiKey}
                            onChange={(e) => setGeminiApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full px-3 py-2 bg-black border border-white/10 focus:border-[#00FF00] rounded-xl text-white font-mono text-[10px] focus:outline-none tracking-widest"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 text-gray-600 hover:text-white transition-colors"
                          >
                            {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Custom RAG Context</label>
                        <textarea
                          value={adibotContext}
                          onChange={(e) => setAdibotContext(e.target.value)}
                          className="w-full min-h-[160px] bg-black/40 border border-white/10 focus:border-[#00FF00] rounded-2xl p-4 text-white focus:outline-none transition-all leading-relaxed text-xs resize-none"
                          placeholder="Paste your LinkedIn summary, resume items, or bot instructions here..."
                        />
                      </div>
                    </div>
                  )}

                </div>

                {/* Form Bottom Save action (Visible for Biography and Adibot sectors) */}
                {(activeSector === 'about' || activeSector === 'adibot') && (
                  <div className="pt-5 border-t border-white/[0.05] flex justify-end">
                    <motion.button
                      onClick={activeSector === 'about' ? handleUpdateAbout : handleUpdateAdibot}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00FF00] to-[#00CC00] text-black font-extrabold rounded-xl text-[9px] uppercase tracking-widest shadow-md shadow-[#00FF00]/20 hover:shadow-[#00FF00]/40 transition-all duration-300 border border-[#00FF00]/30 hover:border-[#00FF00]/60"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Save className="w-3.5 h-3.5" /> Commit Changes
                    </motion.button>
                  </div>
                )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl border z-50 text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 ${
              statusMessage.type === 'error'
                ? 'bg-red-950/80 border-red-500/30 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                : 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusMessage.type === 'error' ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-ping'}`} />
            {statusMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminPanel;
