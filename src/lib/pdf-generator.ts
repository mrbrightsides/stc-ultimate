import jsPDF from 'jspdf';
import type { WhitepaperSection } from './whitepaper-content';
import { parseMarkdownToPlainText } from './markdown-parser';

export async function generateWhitepaperPDF(
  sections: WhitepaperSection[],
  language: 'en' | 'id'
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkNewPage = (requiredSpace: number): void => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  // Helper function to add text with word wrap
  const addText = (
    text: string,
    fontSize: number,
    isBold: boolean = false,
    color: [number, number, number] = [0, 0, 0]
  ): void => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.setTextColor(color[0], color[1], color[2]);

    // Parse markdown to plain text
    const plainText = parseMarkdownToPlainText(text);
    
    // Split text into lines that fit the page width
    const lines = pdf.splitTextToSize(plainText, contentWidth);
    
    lines.forEach((line: string) => {
      checkNewPage(fontSize / 2 + 2);
      pdf.text(line, margin, yPosition);
      yPosition += fontSize / 2 + 2;
    });
  };

  // Cover Page
  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(138, 43, 226); // Purple
  const title = 'STC ULTIMATE';
  const titleWidth = pdf.getTextWidth(title);
  pdf.text(title, (pageWidth - titleWidth) / 2, pageHeight / 3);

  pdf.setFontSize(16);
  pdf.setTextColor(100, 100, 100);
  const subtitle = language === 'en' 
    ? 'Smart Tourism & Culture Platform' 
    : 'Platform Pariwisata & Budaya Pintar';
  const subtitleWidth = pdf.getTextWidth(subtitle);
  pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, pageHeight / 3 + 15);

  pdf.setFontSize(12);
  const tagline = 'Powered by Blockchain, IoT, AI & Extended Reality';
  const taglineWidth = pdf.getTextWidth(tagline);
  pdf.text(tagline, (pageWidth - taglineWidth) / 2, pageHeight / 3 + 25);

  pdf.setFontSize(10);
  pdf.setTextColor(150, 150, 150);
  const version = 'Version 1.0 • December 2025 • ELPEEF x RANTAI';
  const versionWidth = pdf.getTextWidth(version);
  pdf.text(version, (pageWidth - versionWidth) / 2, pageHeight / 3 + 35);

  // Add new page for content
  pdf.addPage();
  yPosition = margin;

  // Process all sections
  const processSection = (section: WhitepaperSection, level: number = 0): void => {
    const title = section.title[language];
    const content = section.content[language];

    // Section Title
    checkNewPage(20);
    yPosition += 5; // Add some space before section
    
    if (level === 0) {
      addText(title, 18, true, [138, 43, 226]); // Purple for main sections
    } else if (level === 1) {
      addText(title, 14, true, [100, 100, 100]); // Gray for subsections
    } else {
      addText(title, 12, true, [120, 120, 120]); // Lighter gray
    }

    yPosition += 3;

    // Section Content
    if (content) {
      addText(content, 10, false, [50, 50, 50]);
      yPosition += 5;
    }

    // Process subsections
    if (section.subsections && section.subsections.length > 0) {
      section.subsections.forEach((subsection: WhitepaperSection) => {
        processSection(subsection, level + 1);
      });
    }
  };

  // Add all sections
  sections.forEach((section: WhitepaperSection) => {
    processSection(section);
  });

  // Footer on last page
  pdf.setFontSize(9);
  pdf.setTextColor(150, 150, 150);
  const footer = language === 'en'
    ? '© 2025 STC Ultimate. All rights reserved.'
    : '© 2025 STC Ultimate. Hak cipta dilindungi.';
  const footerWidth = pdf.getTextWidth(footer);
  pdf.text(footer, (pageWidth - footerWidth) / 2, pageHeight - 15);

  const contact = 'support@elpeef.com';
  const contactWidth = pdf.getTextWidth(contact);
  pdf.text(contact, (pageWidth - contactWidth) / 2, pageHeight - 10);

  // Save the PDF
  const fileName = language === 'en' 
    ? 'STC_Ultimate_Whitepaper_EN.pdf'
    : 'STC_Ultimate_Whitepaper_ID.pdf';
  
  pdf.save(fileName);
}
