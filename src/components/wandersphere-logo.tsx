import { useRef, useEffect } from "react";

const SIZE = 800;
const CENTER = SIZE / 2;

export default function CosmicOrbitalCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = SIZE;
    canvas.height = SIZE;

    let t = 0;

    function drawBackground() {
      const g = ctx.createRadialGradient(
        CENTER, CENTER, 0,
        CENTER, CENTER, CENTER
      );
      g.addColorStop(0, "#0f1022");
      g.addColorStop(0.6, "#090a15");
      g.addColorStop(1, "#030409");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, SIZE, SIZE);
    }

    function drawOuterHalo() {
      ctx.save();
      ctx.translate(CENTER, CENTER);
      ctx.rotate(t * 0.00005);

      for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(160,120,255,${0.015})`;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#9b7bff";
        ctx.arc(0, 0, 300 + i * 0.6, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    function drawDashedOrbit() {
      ctx.save();
      ctx.translate(CENTER, CENTER);
      ctx.rotate(-t * 0.0003);
      ctx.setLineDash([14, 12]);
      ctx.lineDashOffset = -t * 0.3;
      ctx.strokeStyle = "#d8c5ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 220, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    function drawInnerRings() {
      ctx.save();
      ctx.translate(CENTER, CENTER);
      ctx.rotate(t * 0.0002);

      [180, 165].forEach((r, i) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(140,100,255,${0.3 - i * 0.1})`;
        ctx.lineWidth = 1;
        ctx.setLineDash(i === 1 ? [4, 6] : []);
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.restore();
    }

    function drawDiagonalAxis() {
      ctx.save();
      ctx.translate(CENTER, CENTER);
      ctx.rotate(Math.PI / 4 + t * 0.0001);
      ctx.strokeStyle = "#9f7bff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-350, 0);
      ctx.lineTo(350, 0);
      ctx.stroke();
      ctx.restore();
    }

    function drawCoreSphere() {
      ctx.save();
      ctx.translate(CENTER, CENTER);

      const g = ctx.createRadialGradient(-40, -40, 30, 0, 0, 150);
      g.addColorStop(0, "#d0aaff");
      g.addColorStop(0.5, "#7b49e6");
      g.addColorStop(1, "#2a145f");

      ctx.fillStyle = g;
      ctx.shadowBlur = 50;
      ctx.shadowColor = "#7f5bff";

      ctx.beginPath();
      ctx.arc(0, 0, 140 + Math.sin(t * 0.02) * 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function drawRadialStriations() {
      ctx.save();
      ctx.translate(CENTER, CENTER);
      ctx.globalAlpha = 0.06;

      for (let i = 0; i < 160; i++) {
        ctx.rotate((Math.PI * 2) / 160);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(140, 0);
        ctx.strokeStyle = "#cbb6ff";
        ctx.stroke();
      }

      ctx.restore();
    }

    function drawOrbitingBodies() {
      ctx.save();
      ctx.translate(CENTER, CENTER);

      const planets = [
        { r: 220, size: 5, speed: 0.002 },
        { r: 170, size: 4, speed: -0.003 },
      ];

      planets.forEach((p, i) => {
        const a = t * p.speed + i;
        ctx.beginPath();
        ctx.fillStyle = "#f2ebff";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ffffff";
        ctx.arc(Math.cos(a) * p.r, Math.sin(a) * p.r, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    }

    function drawStars() {
      ctx.save();
      ctx.translate(CENTER, CENTER);

      const stars = [
        { x: 280, y: -40, pulse: 0.03 },
        { x: -250, y: -260, pulse: 0.02 },
      ];

      stars.forEach(s => {
        const p = 0.6 + Math.sin(t * s.pulse) * 0.4;
        ctx.globalAlpha = p;
        ctx.shadowBlur = 30;
        ctx.shadowColor = "#f5e9ff";
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    }

    function drawParticles() {
      ctx.save();
      ctx.translate(CENTER, CENTER);
      ctx.globalAlpha = 0.4;

      for (let i = 0; i < 40; i++) {
        const a = (i / 40) * Math.PI * 2 + t * 0.0001;
        const r = 260 + (i % 6) * 8;
        ctx.fillStyle = "#cdbbff";
        ctx.beginPath();
        ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function loop() {
      ctx.clearRect(0, 0, SIZE, SIZE);
      drawBackground();
      drawOuterHalo();
      drawDashedOrbit();
      drawInnerRings();
      drawDiagonalAxis();
      drawParticles();
      drawCoreSphere();
      drawRadialStriations();
      drawOrbitingBodies();
      drawStars();

      t++;
      requestAnimationFrame(loop);
    }

    loop();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "800px",
        height: "800px",
        display: "block",
      }}
    />
  );
}
