class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.colors = ['rgba(255, 215, 0, 0.6)', 'rgba(255, 8, 68, 0.6)', 'rgba(255, 51, 102, 0.5)'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.life = Math.random() * 100;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life += 0.5;

        if (this.life > 100) {
            this.life = 0;
            this.size = Math.random() * 3 + 1;
        }

        if (this.x > this.canvas.width || this.x < 0) {
            this.speedX *= -1;
        }
        if (this.y > this.canvas.height || this.y < 0) {
            this.speedY *= -1;
        }
    }

    draw(ctx) {
        ctx.save();
        const opacity = Math.sin((this.life / 100) * Math.PI);
        ctx.globalAlpha = opacity * 0.8;
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class FashionParticles {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        document.body.insertBefore(this.canvas, document.body.firstChild);

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;

        this.resize();
        this.init();
        
        setTimeout(() => {
            this.createSparkles();
            this.createLightBeams();
        }, 100);
        
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.save();
                    this.ctx.strokeStyle = `rgba(255, 215, 0, ${0.15 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }

    createSparkles() {
        for (let i = 0; i < 15; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 3 + 's';
            sparkle.style.animationDuration = (2 + Math.random() * 2) + 's';
            document.body.appendChild(sparkle);
        }
    }

    createLightBeams() {
        for (let i = 0; i < 5; i++) {
            const beam = document.createElement('div');
            beam.className = 'light-beam';
            beam.style.left = (i * 25) + '%';
            beam.style.animationDelay = (i * 1.5) + 's';
            beam.style.animationDuration = (6 + Math.random() * 4) + 's';
            document.body.appendChild(beam);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FashionParticles();
    });
} else {
    new FashionParticles();
}
