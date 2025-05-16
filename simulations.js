class PhysicsSimulation {
    constructor(container) {
        this.container = container;
        this.canvas = container.querySelector('.simulation-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = true;
        this.setupCanvas();
        this.bindControls();
    }

    setupCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        window.addEventListener('resize', () => this.setupCanvas());
    }

    bindControls() {
        const pauseBtn = this.container.querySelector('button[data-control="pause"]');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.isRunning = !this.isRunning;
                pauseBtn.textContent = this.isRunning ? 'Pause' : 'Resume';
                if (this.isRunning) this.animate();
            });
        }
    }

    animate() {
        if (!this.isRunning) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

class PhotoelectricEffect extends PhysicsSimulation {
    constructor(container) {
        super(container);
        this.frequency = 5;
        this.electrons = [];
        this.setupControls();
        this.animate();
    }

    setupControls() {
        const freqControl = this.container.querySelector('input[data-control="frequency"]');
        if (freqControl) {
            freqControl.addEventListener('input', (e) => {
                this.frequency = parseFloat(e.target.value);
            });
        }
    }

    draw() {
        // Draw metal surface
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(50, this.canvas.height - 100, this.canvas.width - 100, 80);

        // Draw light beam
        this.ctx.strokeStyle = `hsl(${this.frequency * 36}, 100%, 50%)`;
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height - 100);
        this.ctx.stroke();

        // Emit electrons if frequency is high enough
        if (this.frequency > 4.5 && Math.random() < 0.1) {
            this.electrons.push({
                x: this.canvas.width / 2,
                y: this.canvas.height - 100,
                vx: (Math.random() - 0.5) * 5,
                vy: -Math.random() * 5
            });
        }

        // Update and draw electrons
        this.electrons = this.electrons.filter(e => {
            e.x += e.vx;
            e.y += e.vy;
            e.vy += 0.1; // Gravity

            this.ctx.fillStyle = '#00f';
            this.ctx.beginPath();
            this.ctx.arc(e.x, e.y, 3, 0, Math.PI * 2);
            this.ctx.fill();

            return e.y < this.canvas.height;
        });
    }
}

class WaveParticleDuality extends PhysicsSimulation {
    constructor(container) {
        super(container);
        this.time = 0;
        this.particles = Array(10).fill().map(() => ({
            x: Math.random() * this.canvas.width,
            y: this.canvas.height / 2,
            phase: Math.random() * Math.PI * 2
        }));
        this.animate();
    }

    draw() {
        // Draw wave
        this.ctx.strokeStyle = '#2196F3';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 2);
        
        for (let x = 0; x < this.canvas.width; x++) {
            const y = Math.sin(x * 0.02 + this.time) * 50 + this.canvas.height / 2;
            this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();

        // Draw particles
        this.particles.forEach(p => {
            p.x += 2;
            if (p.x > this.canvas.width) p.x = 0;
            p.y = Math.sin(p.x * 0.02 + this.time) * 50 + this.canvas.height / 2;

            this.ctx.fillStyle = '#F44336';
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.time += 0.05;
    }
}

class QuantumTunneling extends PhysicsSimulation {
    constructor(container) {
        super(container);
        this.energy = 5;
        this.particle = {
            x: 100,
            phase: 0
        };
        this.setupControls();
        this.animate();
    }

    setupControls() {
        const energyControl = this.container.querySelector('input[data-control="energy"]');
        if (energyControl) {
            energyControl.addEventListener('input', (e) => {
                this.energy = parseFloat(e.target.value);
            });
        }
    }

    draw() {
        // Draw barrier
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(this.canvas.width / 2 - 25, 50, 50, this.canvas.height - 100);

        // Calculate tunneling probability
        const tunnelProb = Math.exp(-10 / this.energy);

        // Update particle position
        this.particle.x += 2;
        if (this.particle.x > this.canvas.width - 50) this.particle.x = 50;

        // Handle tunneling
        if (this.particle.x > this.canvas.width / 2 - 25 && 
            this.particle.x < this.canvas.width / 2 + 25) {
            if (Math.random() < tunnelProb) {
                this.particle.x = this.canvas.width / 2 + 25;
            } else {
                this.particle.x = this.canvas.width / 2 - 25;
            }
        }

        // Draw particle with wave function
        this.ctx.strokeStyle = '#4CAF50';
        this.ctx.beginPath();
        for (let x = 0; x < this.canvas.width; x++) {
            const dx = x - this.particle.x;
            const y = Math.exp(-dx * dx / (1000 * this.energy)) * 
                     Math.sin(dx * 0.1 + this.particle.phase) * 50 + 
                     this.canvas.height / 2;
            if (x === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();

        this.particle.phase += 0.1;
    }
}

// Initialize simulations when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.simulation-container');
    containers.forEach(container => {
        const type = container.dataset.simulation;
        switch (type) {
            case 'photoelectric':
                new PhotoelectricEffect(container);
                break;
            case 'waveparticle':
                new WaveParticleDuality(container);
                break;
            case 'quantum':
                new QuantumTunneling(container);
                break;
        }
    });
});