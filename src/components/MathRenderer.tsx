import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

interface MathRendererProps {
  children: string;
  display?: boolean;
  className?: string;
}

// Simple LaTeX converter for basic expressions
const convertToLatex = (expression: string): string => {
  // Handle fractions like "a/b" -> "\frac{a}{b}"
  let latex = expression.replace(/(\S+)\s*\/\s*(\S+)/g, '\\frac{$1}{$2}');
  
  // Handle multiplication symbols
  latex = latex.replace(/\*/g, '\\times');
  
  // Handle subscripts and superscripts
  latex = latex.replace(/(\w+)_\{?(\w+)\}?/g, '$1_{$2}');
  latex = latex.replace(/(\w+)\^(\{?\w+\}?)/g, '$1^{$2}');
  
  // Handle Greek letters
  latex = latex.replace(/\\alpha/g, '\\alpha');
  latex = latex.replace(/\\beta/g, '\\beta');
  latex = latex.replace(/\\gamma/g, '\\gamma');
  latex = latex.replace(/\\delta/g, '\\delta');
  latex = latex.replace(/\\theta/g, '\\theta');
  latex = latex.replace(/\\lambda/g, '\\lambda');
  latex = latex.replace(/\\mu/g, '\\mu');
  latex = latex.replace(/\\pi/g, '\\pi');
  latex = latex.replace(/\\sigma/g, '\\sigma');
  latex = latex.replace(/\\phi/g, '\\phi');
  latex = latex.replace(/\\omega/g, '\\omega');
  
  // Handle special operators
  latex = latex.replace(/\\det/g, '\\det');
  latex = latex.replace(/\\sum/g, '\\sum');
  latex = latex.replace(/\\prod/g, '\\prod');
  latex = latex.replace(/\\int/g, '\\int');
  latex = latex.replace(/\\partial/g, '\\partial');
  latex = latex.replace(/\\nabla/g, '\\nabla');
  latex = latex.replace(/\\infty/g, '\\infty');
  
  // Handle matrix notation
  latex = latex.replace(/\[\[/g, '\\begin{bmatrix}');
  latex = latex.replace(/\]\]/g, '\\end{bmatrix}');
  
  // Handle parentheses and brackets
  latex = latex.replace(/\(/g, '\\left(');
  latex = latex.replace(/\)/g, '\\right)');
  latex = latex.replace(/\[/g, '\\left[');
  latex = latex.replace(/\]/g, '\\right]');
  
  return latex;
};

export default function MathRenderer({ children, display = false, className }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const latex = convertToLatex(children);
    
    // For now, we'll render as styled text until KaTeX is properly installed
    // This is a fallback implementation
    containerRef.current.innerHTML = display 
      ? `<div class="math-display">${latex}</div>`
      : `<span class="math-inline">${latex}</span>`;
      
    // Add CSS classes for math formatting
    const style = document.createElement('style');
    style.textContent = `
      .math-inline {
        font-family: 'Cambria Math', 'Latin Modern Math', 'Times New Roman', serif;
        font-style: italic;
        color: #1e293b;
      }
      .math-display {
        font-family: 'Cambria Math', 'Latin Modern Math', 'Times New Roman', serif;
        font-style: italic;
        color: #1e293b;
        text-align: center;
        margin: 1rem 0;
        font-size: 1.1em;
      }
    `;
    
    if (!document.head.querySelector('style[data-math-renderer]')) {
      style.setAttribute('data-math-renderer', 'true');
      document.head.appendChild(style);
    }
  }, [children, display]);
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        display ? "text-center my-4" : "inline",
        className
      )}
    />
  );
}

// Helper function to format equations
export const formatEquation = (eq: string): string => {
  // Convert common equation patterns to LaTeX
  return convertToLatex(eq);
};
