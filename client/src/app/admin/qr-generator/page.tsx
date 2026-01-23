"use client";

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Building2, MapPin, QrCode } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Predio {
  id: string;
  name: string;
  address: string;
  location_lat: number;
  location_lng: number;
}

export default function QRGeneratorPage() {
  const [predios, setPredios] = useState<Predio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPredio, setSelectedPredio] = useState<Predio | null>(null);

  useEffect(() => {
    loadPredios();
  }, []);

  const loadPredios = async () => {
    try {
      const { data, error } = await supabase
        .from('stadiums')
        .select('*')
        .order('name');

      if (error) throw error;
      setPredios(data || []);
    } catch (error) {
      console.error('Error loading predios:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = (predio: Predio) => {
    const svg = document.getElementById(`qr-${predio.id}`)?.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = 400;
        canvas.height = 500;
        if (ctx) {
          // White background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw QR centered
          ctx.drawImage(img, 50, 30, 300, 300);

          // Add predio name
          ctx.fillStyle = '#1a472a';
          ctx.font = 'bold 24px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(predio.name, 200, 380);

          // Add instruction
          ctx.fillStyle = '#666';
          ctx.font = '16px Inter, sans-serif';
          ctx.fillText('Escanear para fichar asistencia', 200, 420);

          // Add logo text
          ctx.fillStyle = '#2d5a27';
          ctx.font = 'bold 14px Inter, sans-serif';
          ctx.fillText('CAMPOS DEPORTIVOS', 200, 470);

          const downloadLink = document.createElement("a");
          downloadLink.download = `QR-Fichaje-${predio.name.replace(/\s/g, '-')}.png`;
          downloadLink.href = canvas.toDataURL("image/png");
          downloadLink.click();
        }
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const printQR = (predio: Predio) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const svg = document.getElementById(`qr-${predio.id}`)?.querySelector('svg');
      const svgData = svg ? new XMLSerializer().serializeToString(svg) : '';

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>QR Fichaje - ${predio.name}</title>
          <style>
            body {
              font-family: 'Inter', Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: white;
            }
            .qr-card {
              text-align: center;
              padding: 40px;
              border: 3px solid #1a472a;
              border-radius: 16px;
              max-width: 400px;
            }
            .qr-code { margin-bottom: 20px; }
            .qr-code svg { width: 280px; height: 280px; }
            h1 {
              color: #1a472a;
              font-size: 28px;
              margin: 0 0 10px;
            }
            .instructions {
              color: #666;
              font-size: 16px;
              margin-bottom: 20px;
            }
            .logo {
              color: #2d5a27;
              font-size: 14px;
              font-weight: bold;
              letter-spacing: 2px;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div className="qr-card">
            <div className="qr-code">${svgData}</div>
            <h1>${predio.name}</h1>
            <p class="instructions">Escanear para registrar entrada/salida</p>
            <p class="logo">CAMPOS DEPORTIVOS</p>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="qr-generator-page">
      <header className="page-header">
        <div className="header-content">
          <QrCode size={32} />
          <div>
            <h1>Generador de Códigos QR</h1>
            <p>Genera e imprime códigos QR para el fichaje de personal en cada predio</p>
          </div>
        </div>
      </header>

      <main className="page-main">
        {loading ? (
          <div className="loading">Cargando predios...</div>
        ) : predios.length === 0 ? (
          <div className="empty-state">
            <Building2 size={48} />
            <p>No hay predios registrados. Agrega predios primero.</p>
          </div>
        ) : (
          <>
            <div className="info-banner">
              <p>
                <strong>Instrucciones:</strong> Descarga o imprime el código QR de cada sede y colócalo en la entrada.
                Los empleados podrán escanear el código con la app del portal para registrar su entrada y salida.
              </p>
            </div>

            <div className="stadiums-grid">
              {predios.map((predio) => (
                <div key={predio.id} className="stadium-qr-card">
                  <div className="qr-preview" id={`qr-${predio.id}`}>
                    <QRCodeSVG
                      value={predio.id}
                      size={180}
                      level="H"
                      includeMargin={true}
                      bgColor="white"
                      fgColor="#1a472a"
                    />
                  </div>
                  <div className="stadium-info">
                    <h3>{predio.name}</h3>
                    <div className="stadium-address">
                      <MapPin size={14} />
                      <span>{predio.address || 'Sin dirección'}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => downloadQR(predio)}
                    >
                      <Download size={16} /> Descargar
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => printQR(predio)}
                    >
                      <Printer size={16} /> Imprimir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <style jsx>{`
        .qr-generator-page {
          padding: 2rem;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--primary);
        }

        .header-content h1 {
          margin: 0;
          font-size: 1.75rem;
        }

        .header-content p {
          margin: 0.25rem 0 0;
          color: var(--text-secondary);
        }

        .info-banner {
          background: var(--surface);
          border-left: 4px solid var(--accent);
          padding: 1rem 1.5rem;
          border-radius: var(--radius-md);
          margin-bottom: 2rem;
        }

        .info-banner p {
          margin: 0;
          color: var(--text-main);
        }

        .stadiums-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .stadium-qr-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          text-align: center;
          transition: all 0.2s;
        }

        .stadium-qr-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }

        .qr-preview {
          background: white;
          padding: 1rem;
          border-radius: var(--radius-sm);
          display: inline-block;
          margin-bottom: 1rem;
        }

        .stadium-info h3 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
          color: var(--text-main);
        }

        .stadium-address {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .card-actions {
          display: flex;
          gap: 0.75rem;
        }

        .card-actions .btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
          border: none;
        }

        .btn-secondary {
          background: var(--background);
          color: var(--text-main);
          border: 1px solid var(--border);
        }

        .btn:hover {
          opacity: 0.9;
        }

        .loading, .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
        }

        .empty-state svg {
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .qr-generator-page {
            padding: 1rem;
          }

          .stadiums-grid {
            grid-template-columns: 1fr;
          }

          .card-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
