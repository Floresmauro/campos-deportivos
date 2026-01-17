"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
    // Theme
    darkMode: boolean;

    // Notifications
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
        nuevosEmpleados: boolean;
        solicitudesPendientes: boolean;
        reportesSemanales: boolean;
    };

    // Localization
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
}

interface SettingsContextType {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
    toggleDarkMode: () => void;
    updateNotification: (key: string, value: boolean) => void;
}

const defaultSettings: Settings = {
    darkMode: false,
    notifications: {
        email: true,
        push: true,
        sms: false,
        nuevosEmpleados: true,
        solicitudesPendientes: true,
        reportesSemanales: true,
    },
    language: 'es',
    timezone: 'America/Argentina/Buenos_Aires',
    dateFormat: 'DD/MM/YYYY',
    currency: 'ARS',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('app_settings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings({ ...defaultSettings, ...parsed });
            } catch (error) {
                console.error('Error parsing settings:', error);
            }
        }
    }, []);

    // Apply dark mode
    useEffect(() => {
        if (settings.darkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    }, [settings.darkMode]);

    // Save to localStorage whenever settings change
    useEffect(() => {
        localStorage.setItem('app_settings', JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    const toggleDarkMode = () => {
        setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
    };

    const updateNotification = (key: string, value: boolean) => {
        setSettings((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: value,
            },
        }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, toggleDarkMode, updateNotification }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
