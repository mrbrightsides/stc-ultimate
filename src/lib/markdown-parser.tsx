import React from 'react';

/**
 * Simple markdown parser for whitepaper content
 * Converts markdown syntax to React elements
 */

export function parseMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Split by line breaks
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    if (!line.trim()) {
      // Empty line - add space
      elements.push(<br key={`br-${index}`} />);
      return;
    }

    // Parse inline markdown in the line
    const parsedLine = parseInlineMarkdown(line);
    
    // Check if it's a bullet point
    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
      elements.push(
        <div key={index} className="ml-4 mb-2">
          {parsedLine}
        </div>
      );
    } else {
      elements.push(
        <div key={index} className="mb-2">
          {parsedLine}
        </div>
      );
    }
  });

  return <>{elements}</>;
}

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  let partKey = 0;

  // Regular expression to match **bold** text
  const boldRegex = /\*\*(.+?)\*\*/g;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      parts.push(
        <span key={`text-${partKey++}`}>
          {text.substring(currentIndex, match.index)}
        </span>
      );
    }

    // Add bold text
    parts.push(
      <strong key={`bold-${partKey++}`} className="font-semibold text-purple-300">
        {match[1]}
      </strong>
    );

    currentIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(
      <span key={`text-${partKey++}`}>
        {text.substring(currentIndex)}
      </span>
    );
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * Alternative: Parse markdown to plain string for PDF generation
 */
export function parseMarkdownToPlainText(text: string): string {
  if (!text) return '';
  
  // Remove bold markers
  let plainText = text.replace(/\*\*(.+?)\*\*/g, '$1');
  
  // Remove italic markers
  plainText = plainText.replace(/\*(.+?)\*/g, '$1');
  
  return plainText;
}
