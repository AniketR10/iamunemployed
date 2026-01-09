'use client';
import { useState } from 'react';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { Github, Send, User, Mail, CheckCircle, Loader2, ExternalLink } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/submitForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error('Form submission failed');
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900 flex flex-col">
      <Navbar />

      <div className="grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Get in <span className="text-[#FF5A5F]">Touch</span>
          </h1>
          <p className="text-lg font-medium text-gray-600 max-w-xl mx-auto">
            Have a suggestion, found a bug, or just want to say hi? Fill out the form below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          <div className="md:col-span-1 space-y-6">
            <div className="p-6 border-2 border-gray-900 rounded-lg bg-[#24292e] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                <Github size={24} /> Open Source
              </h3>
              <p className="font-bold text-sm leading-relaxed opacity-90 mb-4">
                The fastest way to fix a bug or add a feature is to contribute directly to the codebase.
              </p>
              <a 
                href="https://github.com/AniketR10/iamunemployed"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-black text-xs uppercase tracking-wider bg-white/10 hover:bg-white/20 transition p-2 rounded w-fit text-white"
              >
                <ExternalLink size={14} /> Contribute
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="p-8 border-2 border-gray-900 rounded-lg bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-green-100 border-2 border-green-600 rounded-full flex items-center justify-center mb-4 text-green-600">
                    <CheckCircle size={32} strokeWidth={3} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 font-medium text-center">Thanks for reaching out. Will get back to you shortly.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm font-bold text-gray-900 underline hover:text-[#FF5A5F]"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">

                  <div>
                    <label className="block text-xs font-black text-gray-900 uppercase tracking-wider mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-900 rounded-lg text-sm font-bold placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-900 uppercase tracking-wider mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-900 rounded-lg text-sm font-bold placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-900 uppercase tracking-wider mb-2">
                      Your Feedback / Suggestions
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      placeholder="Tell us what's on your mind..."
                      className="w-full p-4 bg-gray-50 border-2 border-gray-900 rounded-lg text-sm font-bold placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00A86B] text-white border-2 border-gray-900 py-3.5 rounded-lg font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        Submit <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}