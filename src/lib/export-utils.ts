/**
 * Export Utilities for STC Ultimate Platform
 * Handles PDF and Excel export functionality for research data
 */

export interface ExportData {
  title: string;
  subtitle?: string;
  timestamp: string;
  sections: ExportSection[];
  metadata?: Record<string, unknown>;
}

export interface ExportSection {
  title: string;
  type: 'table' | 'metrics' | 'text' | 'chart';
  data: unknown;
}

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

export interface MetricData {
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
}

/**
 * Export data as JSON file
 */
export const exportAsJSON = (data: ExportData, filename: string): void => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', `${filename}-${Date.now()}.json`);
  linkElement.click();
};

/**
 * Export data as CSV file
 */
export const exportAsCSV = (data: TableData, filename: string): void => {
  const csvContent = [
    data.headers.join(','),
    ...data.rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate HTML report for printing/PDF
 */
export const generateHTMLReport = (data: ExportData): string => {
  const styles = `
    <style>
      @page {
        margin: 2cm;
      }
      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      h1 {
        color: #0066cc;
        border-bottom: 3px solid #0066cc;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      h2 {
        color: #0099cc;
        margin-top: 30px;
        margin-bottom: 15px;
      }
      .header {
        text-align: center;
        margin-bottom: 40px;
      }
      .subtitle {
        color: #666;
        font-size: 14px;
        margin-top: 5px;
      }
      .timestamp {
        color: #999;
        font-size: 12px;
        text-align: right;
        margin-bottom: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
      }
      th {
        background-color: #0066cc;
        color: white;
        font-weight: bold;
      }
      tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      .metric-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 20px 0;
      }
      .metric-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        background: #f9f9f9;
      }
      .metric-label {
        color: #666;
        font-size: 14px;
        margin-bottom: 5px;
      }
      .metric-value {
        font-size: 32px;
        font-weight: bold;
        color: #0066cc;
      }
      .metric-unit {
        font-size: 16px;
        color: #999;
        margin-left: 5px;
      }
      .footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
        text-align: center;
        color: #666;
        font-size: 12px;
      }
      @media print {
        body {
          padding: 0;
        }
        .no-print {
          display: none;
        }
      }
    </style>
  `;

  const header = `
    <div class="header">
      <h1>${data.title}</h1>
      ${data.subtitle ? `<p class="subtitle">${data.subtitle}</p>` : ''}
    </div>
    <p class="timestamp">Generated: ${data.timestamp}</p>
  `;

  const sections = data.sections.map(section => {
    if (section.type === 'table') {
      const tableData = section.data as TableData;
      return `
        <h2>${section.title}</h2>
        <table>
          <thead>
            <tr>
              ${tableData.headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${tableData.rows.map(row => `
              <tr>
                ${row.map(cell => `<td>${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (section.type === 'metrics') {
      const metrics = section.data as MetricData[];
      return `
        <h2>${section.title}</h2>
        <div class="metric-grid">
          ${metrics.map(metric => `
            <div class="metric-card">
              <div class="metric-label">${metric.label}</div>
              <div class="metric-value">
                ${metric.value}
                ${metric.unit ? `<span class="metric-unit">${metric.unit}</span>` : ''}
              </div>
              ${metric.trend ? `<div class="metric-trend">${metric.trend}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } else if (section.type === 'text') {
      return `
        <h2>${section.title}</h2>
        <p>${section.data}</p>
      `;
    }
    return '';
  }).join('');

  const footer = `
    <div class="footer">
      <p>STC Ultimate - Smart Tourism Chain Platform</p>
      <p>Blockchain-Enabled Tourism Management System</p>
      <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${data.title}</title>
      ${styles}
    </head>
    <body>
      ${header}
      ${sections}
      ${footer}
    </body>
    </html>
  `;
};

/**
 * Open print dialog for PDF export
 */
export const exportAsPDF = (data: ExportData): void => {
  const htmlContent = generateHTMLReport(data);
  
  // Open in new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }
};

/**
 * Format date for exports
 */
export const formatExportDate = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Format timestamp for exports
 */
export const formatExportTimestamp = (date: Date = new Date()): string => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};
