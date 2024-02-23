import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


/*   class WinterEffect {
    private w: number;
    private h: number;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private rate: number = 60;
    private arc: number = 200;
    private time: number = 0;
    private count: number = 0;
    private size: number = 6;
    private speed: number = 5;
    private lights: Array<any> = [];
    private colors: string[] = ['#fff', '#fff', '#fff', '#fff', '#fff'];
    private timerID: any;

    constructor() {
      this.w = window.innerWidth;
      this.h = window.innerHeight;
      this.canvas = document.getElementById('winter-effect') as HTMLCanvasElement;
      
      const context = this.canvas.getContext('2d');
      if (!context) {
          throw new Error('2D context not supported on this canvas');
      }
      this.ctx = context;
        this.canvas.setAttribute('width', this.w.toString());
        this.canvas.setAttribute('height', this.h.toString());
        this.init();
        this.bubble();
    }

    init(): void {
        this.time = 0;
        this.count = 0;

        for (let i = 0; i < this.arc; i++) {
            this.lights[i] = {
                x: Math.ceil(Math.random() * this.w),
                y: Math.ceil(Math.random() * this.h),
                toX: Math.random() * 5 + 1,
                toY: Math.random() * 5 + 1,
                c: this.colors[Math.floor(Math.random() * this.colors.length)],
                size: Math.random() * this.size
            };
        }
    }

    bubble(): void {
        this.ctx.clearRect(0, 0, this.w, this.h);

        for (let i = 0; i < this.arc; i++) {
            let li = this.lights[i];
            this.ctx.beginPath();
            this.ctx.arc(li.x, li.y, li.size, 0, Math.PI * 2, false);
            this.ctx.fillStyle = li.c;
            this.ctx.fill();

            li.x = li.x + li.toX * (this.time * 0.05);
            li.y = li.y + li.toY * (this.time * 0.05);

            if (li.x > this.w) li.x = 0;
            if (li.y > this.h) li.y = 0;
            if (li.x < 0) li.x = this.w;
            if (li.y < 0) li.y = this.h;
        }

        if (this.time < this.speed) this.time++;

        this.timerID = setTimeout(() => this.bubble(), 2000 / this.rate);
    }
}

// Run the WinterEffect after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    new WinterEffect();
});
 */


class WinterEffect {
    private w: number;
    private h: number;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private rate: number = 60;
    private arc: number = 200;
    private time: number = 0;
    private count: number = 0;
    private size: number = 50;  // Adjust size as needed
    private speed: number = 5;
    private lights: Array<any> = [];
    private pngs: Array<HTMLImageElement> = [];
    private timerID: any;

    constructor() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.canvas = document.getElementById('winter-effect') as HTMLCanvasElement;
        
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('2D context not supported on this canvas');
        }
        this.ctx = context;
        this.canvas.setAttribute('width', this.w.toString());
        this.canvas.setAttribute('height', this.h.toString());
        this.loadpngs().then(() => {
            this.init();
            this.bubble();
        });
    }

    async loadpngs(): Promise<void> {
        const pngFolderPath = '/assets/images/halloween-snow-images-png/';
        const pngFiles = [
            'Pumpkin - 01.png', 'Pumpkin - 02.png', 'Pumpkin - 03.png', 'Pumpkin - 04.png', 'Pumpkin - 05.png', 'Pumpkin - 06.png',
            'Pumpkin - 07.png', 'Pumpkin - 08.png', 'Pumpkin - 09.png', 'Pumpkin - 10.png', 'Pumpkin - 11.png', 'Pumpkin - 12.png',
        ];
        
        for (let pngFile of pngFiles) {
            const png = new Image();
            png.src = `${pngFolderPath}${pngFile}`;
            await new Promise(resolve => png.onload = resolve);
            this.pngs.push(png);
        }
    }

    init(): void {
        this.time = 0;
        this.count = 0;

        for (let i = 0; i < this.arc; i++) {
            this.lights[i] = {
                x: Math.ceil(Math.random() * this.w),
                y: Math.ceil(Math.random() * this.h),
                toX: Math.random() * 5 + 1,
                toY: Math.random() * 5 + 1,
                png: this.pngs[Math.floor(Math.random() * this.pngs.length)],
                size: Math.random() * this.size
            };
        }
    }

    bubble(): void {
        this.ctx.clearRect(0, 0, this.w, this.h);

        for (let i = 0; i < this.arc; i++) {
            let li = this.lights[i];
            this.ctx.drawImage(li.png, li.x, li.y, li.size, li.size);

            li.x = li.x + li.toX * (this.time * 0.05);
            li.y = li.y + li.toY * (this.time * 0.05);

            if (li.x > this.w) li.x = 0;
            if (li.y > this.h) li.y = 0;
            if (li.x < 0) li.x = this.w;
            if (li.y < 0) li.y = this.h;
        }

        if (this.time < this.speed) this.time++;

        this.timerID = setTimeout(() => this.bubble(), 2000 / this.rate);
    }
}

// Run the WinterEffect after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    new WinterEffect();
});


////////////


