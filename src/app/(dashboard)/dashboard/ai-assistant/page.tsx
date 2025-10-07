// app/(dashboard)/ai-chat/page.tsx

'use client'; // Client Component para la interactividad del chat

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Bot, User2, Send, Wand2, Loader2, MessageSquareText } from 'lucide-react';

interface Message {
    id: string;
    sender: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

export default function AIChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll al final cuando se añaden nuevos mensajes
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString() + '-user',
            sender: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsSending(true);

        try {
            // Aquí harías la llamada a tu API de IA (Server Action, API Route, etc.)
            // Por ejemplo: const response = await fetch('/api/ai-chat', { method: 'POST', body: JSON.stringify({ message: userMessage.content }) });
            // const data = await response.json();
            // const aiResponseContent = data.response;

            // Simulación de respuesta de IA
            const aiResponseContent = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(`Hola, soy tu asistente IA. Has preguntado: "${userMessage.content}". Actualmente, puedo ayudarte con... (¡En el futuro, aquí irá la integración real con un modelo de IA!)`);
                }, 1500); // Simula el tiempo de procesamiento de la IA
            });

            const aiMessage: Message = {
                id: Date.now().toString() + '-ai',
                sender: 'ai',
                content: aiResponseContent as string,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);

        } catch (err) {
            console.error('Error al comunicarse con la IA:', err);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString() + '-error',
                    sender: 'ai',
                    content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.',
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-background-secondary rounded-lg shadow-md animate-fade-in-up">
            {/* Encabezado del Chat */}
            <div className="flex items-center space-x-3 p-4 border-b border-gray-200 bg-background-secondary rounded-t-lg">
                <Wand2 size={24} className="text-primary" />
                <h1 className="text-xl font-bold text-foreground-primary">Asistente IA</h1>
            </div>

            {/* Área de Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && !isSending && (
                    <div className="flex flex-col items-center justify-center h-full text-foreground-secondary">
                        <MessageSquareText size={48} className="text-primary opacity-60 mb-4" />
                        <p className="text-lg text-center">
                            ¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte hoy?
                            <br />
                            Puedes preguntarme sobre tus proyectos, tareas, o cualquier otra cosa.
                        </p>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${message.sender === 'user'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-foreground-primary'
                                } shadow-sm`}
                        >
                            <div className="flex items-center space-x-2 text-xs mb-1">
                                {message.sender === 'user' ? (
                                    <>
                                        <User2 size={12} className="text-white" />
                                        <span className="font-semibold text-white">Tú</span>
                                    </>
                                ) : (
                                    <>
                                        <Bot size={12} className="text-primary" />
                                        <span className="font-semibold text-primary">Asistente</span>
                                    </>
                                )}
                                <span className={`text-opacity-80 ${message.sender === 'user' ? 'text-white' : 'text-gray-600'}`}>
                                    {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                        </div>
                    </div>
                ))}

                {isSending && (
                    <div className="flex justify-start">
                        <div className="max-w-[70%] rounded-lg p-3 bg-gray-100 text-foreground-primary shadow-sm flex items-center space-x-2">
                            <Loader2 size={16} className="animate-spin text-primary" />
                            <span className="text-sm italic">Escribiendo...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} /> {/* Para el scroll automático */}
            </div>

            {/* Input de Mensajes */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-background-secondary rounded-b-lg flex items-center space-x-3">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe tu mensaje aquí..."
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 resize-none max-h-24 overflow-y-auto"
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { // Permite Shift+Enter para nueva línea
                            e.preventDefault();
                            handleSendMessage(e as unknown as FormEvent<HTMLFormElement>);
                        }
                    }}
                    disabled={isSending}
                />
                <button
                    type="submit"
                    className="rounded-full bg-primary p-3 text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!input.trim() || isSending}
                >
                    {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
            </form>
        </div>
    );
}