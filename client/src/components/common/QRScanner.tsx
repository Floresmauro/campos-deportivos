"use client";

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanError?: (errorMessage: string) => void;
    fps?: number;
    qrbox?: number;
    aspectRatio?: number;
    disableFlip?: boolean;
}

const QRScanner: React.FC<QRScannerProps> = ({
    onScanSuccess,
    onScanError,
    fps = 10,
    qrbox = 250,
    aspectRatio = 1.0,
    disableFlip = false,
}) => {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => {
                    console.error("Failed to clear scanner", err);
                });
            }
        };
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const config = {
            fps,
            qrbox,
            aspectRatio,
            disableFlip,
        };

        scannerRef.current = new Html5QrcodeScanner(
            "qr-reader",
            config,
      /* verbose= */ false
        );

        scannerRef.current.render(
            (decodedText) => {
                // Success callback
                onScanSuccess(decodedText);
            },
            (error) => {
                // Error callback (optional, can be very verbose)
                if (onScanError) {
                    onScanError(error);
                }
            }
        );

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => {
                    console.error("Failed to clear scanner during cleanup", err);
                });
            }
        };
    }, [isMounted, onScanSuccess, onScanError, fps, qrbox, aspectRatio, disableFlip]);

    return (
        <div className="qr-scanner-container">
            <div id="qr-reader" style={{ width: '100%' }}></div>
            <style jsx>{`
        .qr-scanner-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          border-radius: 12px;
          overflow: hidden;
          background: var(--surface);
          border: 1px solid var(--border);
        }

        #qr-reader {
          border: none !important;
        }

        #qr-reader__dashboard {
          padding: 1rem !important;
          background: var(--background) !important;
          color: var(--text-main) !important;
        }

        #qr-reader__dashboard button {
          background: var(--primary) !important;
          color: white !important;
          border: none !important;
          padding: 0.5rem 1rem !important;
          border-radius: 6px !important;
          cursor: pointer !important;
          font-weight: 600 !important;
        }

        #qr-reader__dashboard button:hover {
          background: var(--primary-light) !important;
        }

        #qr-reader__scan_region {
          background: black !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
        </div>
    );
};

export default QRScanner;
