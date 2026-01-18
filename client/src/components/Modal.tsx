"use client";

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: 'small' | 'medium' | 'large';
}

export default function Modal({ isOpen, onClose, title, children, size = 'medium' }: ModalProps) {
    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getMaxWidth = () => {
        switch (size) {
            case 'small': return '400px';
            case 'large': return '800px';
            default: return '600px';
        }
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal-container">
                <div className="modal-content" style={{ maxWidth: getMaxWidth() }}>
                    <div className="modal-header">
                        <h2>{title}</h2>
                        <button className="modal-close" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .modal-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                    animation: fadeIn 0.2s;
                }

                .modal-container {
                    position: fixed;
                    inset: 0;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    overflow-y: auto;
                }

                .modal-content {
                    background: var(--surface);
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s ease-out;
                    border: 1px solid var(--border);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border);
                }

                .modal-header h2 {
                    margin: 0;
                    font-size: 1.25rem;
                }

                .modal-close {
                    background: none;
                    border: none;
                    padding: 0.5rem;
                    cursor: pointer;
                    color: var(--text-secondary);
                    border-radius: var(--radius-sm);
                    transition: background 0.2s;
                }

                .modal-close:hover {
                    background: var(--bg-gray);
                }

                .modal-body {
                    padding: 1.5rem;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
}
