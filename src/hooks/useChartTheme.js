'use client';
import { useSelector } from 'react-redux';

const THEMES = {
  light: {
    text: '#5B6B82', grid: '#E3E8F0', tipBg: '#FFFFFF', tipBorder: '#DDE3EC', tipText: '#0F1B2D',
    series: ['#0B7A75', '#4C5FD5', '#D98E04', '#C2456B', '#6B7A90', '#2A9DD8', '#7A5BD5', '#2E9E6B', '#B5651D', '#3B82A0'],
    risk: { Low: '#2E9E6B', Medium: '#D98E04', High: '#D64545' },
    status: { Open: '#0B7A75', Closing: '#D98E04', Funded: '#6B7A90' },
  },
  dark: {
    text: '#93A4BC', grid: '#223044', tipBg: '#16212F', tipBorder: '#2B3B52', tipText: '#E8EEF6',
    series: ['#3CC4BC', '#8497FF', '#F0B429', '#F0719A', '#93A4BC', '#5CC0F0', '#A78BFA', '#4FD08C', '#E39A55', '#6FB6D0'],
    risk: { Low: '#4FD08C', Medium: '#F0B429', High: '#F26B6B' },
    status: { Open: '#3CC4BC', Closing: '#F0B429', Funded: '#93A4BC' },
  },
};

export default function useChartTheme() {
  const theme = useSelector((s) => s.ui.theme);
  const t = THEMES[theme] || THEMES.light;
  return {
    ...t,
    tooltip: {
      contentStyle: { background: t.tipBg, border: `1px solid ${t.tipBorder}`, borderRadius: 10, color: t.tipText, fontSize: 13, boxShadow: '0 8px 24px rgba(0,0,0,.12)' },
      labelStyle: { color: t.tipText, fontWeight: 600 },
      itemStyle: { color: t.tipText },
    },
  };
}
