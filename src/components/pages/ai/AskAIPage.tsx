import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Button } from '../../common/Button';
import { PROMPT_SUGGESTIONS } from '../../../mock/mockAIChat';
import { Sparkles, Plus, Send, Bot, User as UserIcon } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const AskAIPage: React.FC = () => {
  const { aiMessages, sendAIMessage, resetAIChat } = useApp();
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendAIMessage(inputText);
    setInputText('');
  };

  const handleChipClick = (promptText: string) => {
    sendAIMessage(promptText);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 text-[#217C70] rounded-xl border border-teal-100">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">SmartEco Assistant</h2>
            <p className="text-xs text-slate-500">
              Ask me anything about your rooms and their air-quality history — I'll answer with text, tables or charts.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={resetAIChat}
        >
          New chat
        </Button>
      </div>

      {/* Main Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
        {/* Intro Banner & Prompt Suggestions */}
        {aiMessages.length <= 1 && (
          <div className="p-5 bg-teal-50/50 border border-teal-100/80 rounded-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#217C70] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Hi — I'm the SmartEco Assistant.
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Ask me anything about your rooms and their air-quality history — I'll answer with text, tables or charts.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-teal-100/60">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                For Example
              </span>
              <div className="flex flex-col gap-2">
                {PROMPT_SUGGESTIONS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChipClick(prompt)}
                    className="text-left text-xs font-semibold text-[#217C70] hover:text-[#196359] hover:bg-teal-100/50 px-3 py-2 rounded-xl border border-teal-200/60 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Messages */}
        {aiMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-slate-800 text-white'
                  : 'bg-[#217C70] text-white'
              }`}
            >
              {msg.sender === 'user' ? (
                <UserIcon className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            <div
              className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-[#217C70] text-white rounded-tr-none'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed font-normal">{msg.text}</div>

              {/* Render Table Data if present */}
              {msg.tableData && (
                <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                      <tr>
                        {msg.tableData.headers.map((h, i) => (
                          <th key={i} className="p-2.5">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {msg.tableData.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2.5 font-medium">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Render Chart Data if present */}
              {msg.chartData && (
                <div className="mt-3 p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800">{msg.chartData.title}</h4>
                  <div className="h-48 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={msg.chartData.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Line type="monotone" dataKey="Room01" stroke="#217C70" strokeWidth={2} />
                        <Line type="monotone" dataKey="ExecutiveSuite" stroke="#10B981" strokeWidth={2} />
                        <Line type="monotone" dataKey="Lab04" stroke="#F59E0B" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar & Footer */}
      <div className="shrink-0 space-y-2">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask about air quality, sensors, alerts..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#217C70] shadow-sm"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-2.5 p-2 bg-[#217C70] hover:bg-[#196359] text-white rounded-xl disabled:opacity-40 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-400">
          AI-generated from your monitored data · verify critical figures before official reporting
        </p>
      </div>
    </div>
  );
};
