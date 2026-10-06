import React, { useEffect, useRef } from 'react';

export const ThreeDBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Grid Parameters (Simulating Cadastral Topographic Mesh)
    const cols = 28;
    const rows = 18;
    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep atmospheric gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(0.5, '#022c22');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const fov = 350;
      const points: { x: number; y: number; z: number; px: number; py: number }[][] = [];

      for (let y = 0; y < rows; y++) {
        points[y] = [];
        for (let x = 0; x < cols; x++) {
          const worldX = (x - cols / 2) * 60;
          const worldZ = (y + 4) * 55;
          // Topographic undulating wave
          const worldY =
            Math.sin(x * 0.35 + time) * 35 +
            Math.cos(y * 0.4 + time * 0.8) * 45 +
            140;

          // Perspective Projection
          const scale = fov / (fov + worldZ);
          const px = width / 2 + worldX * scale;
          const py = height / 2 + worldY * scale;

          points[y][x] = { x: worldX, y: worldY, z: worldZ, px, py };
        }
      }

      // Draw wireframe cadastral polygons
      for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols - 1; x++) {
          const p1 = points[y][x];
          const p2 = points[y][x + 1];
          const p3 = points[y + 1][x + 1];
          const p4 = points[y + 1][x];

          const depthAlpha = Math.max(0.04, 1 - p1.z / 1400);

          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.lineTo(p3.px, p3.py);
          ctx.lineTo(p4.px, p4.py);
          ctx.closePath();

          // Cadastral polygon shading
          if ((x + y) % 3 === 0) {
            ctx.fillStyle = `rgba(16, 185, 129, ${depthAlpha * 0.12})`;
            ctx.fill();
          }

          ctx.strokeStyle = `rgba(52, 211, 153, ${depthAlpha * 0.35})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Cadastral vertex survey markers
          if ((x + y) % 2 === 0) {
            ctx.fillStyle = `rgba(110, 231, 183, ${depthAlpha * 0.8})`;
            ctx.beginPath();
            ctx.arc(p1.px, p1.py, 2 * (1 - p1.z / 1500), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
