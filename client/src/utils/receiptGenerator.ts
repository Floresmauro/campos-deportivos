import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReceiptData {
    company: {
        name: string;
        address: string;
        cuit: string;
    };
    employee: {
        name: string;
        cuil: string;
        category: string;
        entryDate: string;
    };
    period: {
        month: string;
        year: number;
    };
    items: {
        description: string;
        remunerative: number;
        deduction: number;
    }[];
    totals: {
        gross: number;
        deductions: number;
        net: number;
    };
}

export const generateReceiptPDF = async (data: ReceiptData): Promise<Blob> => {
    const doc = new jsPDF() as any;

    // Header
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102); // var(--primary)
    doc.text(data.company.name, 15, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(data.company.address, 15, 27);
    doc.text(`CUIT: ${data.company.cuit}`, 15, 32);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('RECIBO DE SUELDO', 140, 20);
    doc.setFontSize(10);
    doc.text(`Periodo: ${data.period.month} ${data.period.year}`, 140, 27);

    // Employee Box
    doc.setDrawColor(200);
    doc.rect(15, 40, 180, 25);
    doc.setFontSize(9);
    doc.text(`Apellido y Nombre: ${data.employee.name}`, 20, 47);
    doc.text(`CUIL/DNI: ${data.employee.cuil}`, 20, 53);
    doc.text(`Categoría: ${data.employee.category}`, 20, 59);
    doc.text(`Fecha Ingreso: ${data.employee.entryDate}`, 120, 47);

    // Table
    const tableRows = data.items.map(item => [
        item.description,
        item.remunerative > 0 ? item.remunerative.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : '',
        item.deduction > 0 ? item.deduction.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : ''
    ]);

    autoTable(doc, {
        startY: 75,
        head: [['Descripción', 'Remunerativo', 'Deducción']],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [0, 51, 102] },
        columnStyles: {
            0: { cellWidth: 100 },
            1: { halign: 'right' },
            2: { halign: 'right' }
        }
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setDrawColor(0);
    doc.line(120, finalY, 195, finalY);

    doc.setFontSize(10);
    doc.text('Total Bruto:', 120, finalY + 7);
    doc.text(`$ ${data.totals.gross.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, 170, finalY + 7, { align: 'right' });

    doc.text('Total Retenciones:', 120, finalY + 14);
    doc.text(`$ ${data.totals.deductions.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, 170, finalY + 14, { align: 'right' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('NETO A COBRAR:', 120, finalY + 24);
    doc.text(`$ ${data.totals.net.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, 170, finalY + 24, { align: 'right' });

    // Signature lines
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.line(30, finalY + 60, 80, finalY + 60);
    doc.text('Firma Empleador', 40, finalY + 65);

    doc.line(130, finalY + 60, 180, finalY + 60);
    doc.text('Firma Empleado', 142, finalY + 65);

    return doc.output('blob');
};
