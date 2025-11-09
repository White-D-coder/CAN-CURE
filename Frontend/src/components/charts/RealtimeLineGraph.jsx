"use client";
import React, { useState, useEffect, useRef } from 'react';

const RealtimeLineGraph = ({ 
  title = "Real-time Data", 
  maxDataPoints = 50,
  updateInterval = 2000,
  dataRange = { min: 0, max: 100 }
}) => {
  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Generate mock realtime data
  const generateMockData = () => {
    const now = new Date();
    const value = Math.random() * (dataRange.max - dataRange.min) + dataRange.min;
    return {
      timestamp: now,
      value: Math.round(value * 10) / 10,
    };
  };

  // Simulate WebSocket connection
  useEffect(() => {
    const simulateConnection = () => {
      setIsConnected(true);
      
      const interval = setInterval(() => {
        const newDataPoint = generateMockData();
        setData(prevData => {
          const updatedData = [...prevData, newDataPoint];
          // Keep only the last maxDataPoints
          return updatedData.length > maxDataPoints 
            ? updatedData.slice(-maxDataPoints)
            : updatedData;
        });
        setLastUpdate(new Date());
      }, updateInterval);

      return () => {
        clearInterval(interval);
        setIsConnected(false);
      };
    };

    const cleanup = simulateConnection();
    return cleanup;
  }, [updateInterval, maxDataPoints, dataRange]);

  // Draw the line graph
  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up drawing parameters
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Find min/max values for scaling
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (graphHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (graphWidth / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw data line
    if (data.length > 1) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();

      data.forEach((point, index) => {
        const x = padding + (graphWidth / (data.length - 1)) * index;
        const y = height - padding - ((point.value - minValue) / valueRange) * graphHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }

    // Draw data points
    ctx.fillStyle = '#3b82f6';
    data.forEach((point, index) => {
      const x = padding + (graphWidth / (data.length - 1)) * index;
      const y = height - padding - ((point.value - minValue) / valueRange) * graphHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (valueRange / 5) * (5 - i);
      const y = padding + (graphHeight / 5) * i;
      ctx.fillText(value.toFixed(1), padding - 10, y + 4);
    }

    // X-axis labels (time)
    const timeLabels = Math.min(5, data.length);
    for (let i = 0; i < timeLabels; i++) {
      const index = Math.floor((data.length - 1) * i / (timeLabels - 1));
      if (data[index]) {
        const x = padding + (graphWidth / (data.length - 1)) * index;
        const time = data[index].timestamp.toLocaleTimeString();
        ctx.fillText(time, x, height - padding + 20);
      }
    }

    // Draw current value
    if (data.length > 0) {
      const currentValue = data[data.length - 1].value;
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Current: ${currentValue}`, width - 150, 30);
    }
  };

  // Redraw graph when data changes
  useEffect(() => {
    const animate = () => {
      drawGraph();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [data]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawGraph();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial resize

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          {lastUpdate && (
            <span className="text-sm text-gray-500">
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-64 border border-gray-200 rounded-lg"
          style={{ maxHeight: '400px' }}
        />
        
        {/* Loading overlay */}
        {data.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Connecting to data stream...</p>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      {data.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Current</p>
            <p className="text-lg font-semibold text-blue-600">
              {data[data.length - 1]?.value.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Average</p>
            <p className="text-lg font-semibold text-green-600">
              {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Peak</p>
            <p className="text-lg font-semibold text-red-600">
              {Math.max(...data.map(d => d.value)).toFixed(1)}
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>
          Update interval: {updateInterval}ms | Data points: {data.length}/{maxDataPoints}
        </div>
        <button
          onClick={() => {
            setIsConnected(!isConnected);
            if (!isConnected) {
              // Restart connection
              window.location.reload();
            }
          }}
          className={`px-3 py-1 rounded text-sm ${
            isConnected 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>
      </div>
    </div>
  );
};

export default RealtimeLineGraph;
