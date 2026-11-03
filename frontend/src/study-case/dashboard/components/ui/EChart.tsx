import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EChartProps {
  option: echarts.EChartsOption;
  height?: string | number;
  width?: string | number;
  className?: string;
  theme?: string | object;
  loading?: boolean;
}

export const EChart: React.FC<EChartProps> = ({
  option,
  height = '320px',
  width = '100%',
  className = '',
  theme,
  loading = false,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, theme, {
        renderer: 'canvas',
      });
    }

    if (loading) {
      chartInstance.current.showLoading({
        text: 'Loading chart...',
        color: '#0077ff',
        textColor: '#64748b',
        maskColor: 'rgba(255, 255, 255, 0.7)',
      });
    } else {
      chartInstance.current.hideLoading();
      chartInstance.current.setOption(option, true);
    }
  }, [option, theme, loading]);

  // Handle container resizing cleanly
  useEffect(() => {
    if (!chartRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      chartInstance.current?.resize();
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Dispose on unmount per architecture standards
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
      }}
      className={className}
    />
  );
};
