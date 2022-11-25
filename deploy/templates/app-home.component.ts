import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    template: `
<header class="banner" style="border-bottom: none;">
  <div class="container">
    <img src="assets/images/angular-nestjs.png" alt="Angular & NestJS" height="300">
    <h1>Fai da te</h1>
    <p class="lead">Internal Manufacturing Base</p>
  </div>
</header>
`,
    styles: [`
.banner {
  position: relative;
  padding: 30px 15px;
  color: #F5F5F5;
  text-align: center;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  background: #4393B9; }`,`
h1 {
  font-size: 60px;
  line-height: 1;
  letter-spacing: -1px; }`
]
})

export class AppHomeComponent {}

