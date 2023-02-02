import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'about-IMB',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {

    stacks = [
        {
            name: "Angular",
            version: "v14.1.0",
            logo: "https://angular.io/assets/images/logos/angular/angular.svg",
            link: "https://angular.io",
            doc: "https://angular.io/docs",
            explain: "Angular is an application design framework and development platform for creating efficient and sophisticated single-page apps."
        },{
            name: "ngx-Bootstrap",
            version: "v8.0.0",
            logo: "assets/images/ngx-bootstrap-logo.svg",
            link: "https://valor-software.com/ngx-bootstrap/#/",
            explain: "ngx-bootstrap is an Open Source (MIT Licensed) independent project with ongoing development made possible thanks to the support of our awesome backers.",
            doc: "https://valor-software.com/ngx-bootstrap/#/documentation"

        },{
            name: "Bootstrap",
            version: "v5.1.3",
            logo: "assets/images/bootstrap.png",
            link: "https:/getbootstrap.com/",
            explain: "The world’s most popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system, extensive prebuilt components, and powerful JavaScript plugins.",
            doc: "https://getbootstrap.com/docs/4.5/getting-started/introduction/"
        },{
            name: "Angular Material",
            version: "v14.0.4",
            logo: "assets/images/material.png",
            link: "https://material.angular.io",
            explain: "Material design components for Angular. Internationalized and accessible components for everyone. Straightforward APIs with consistent cross platform behaviour.",
            doc: "https://material.angular.io/components/categories"
        },{
            name: "Font Awesome",
            version: "v6.1.1",
            logo: "assets/images/font_awesome_logo.png",
            link: "https://fontawesome.com",
            explain: "Get vector icons and social logos on your website with Font Awesome, the web's most popular icon set and toolkit.",
            doc: "https://fontawesome.com/icons?d=gallery"
        },{
            name: "Chart.js",
            version: "v3.8.0",
            logo: "https://www.chartjs.org/img/chartjs-logo.svg",
            link: "https://www.chartjs.org",
            explain: "Simple yet flexible JavaScript charting for designers & developers",
            doc: "https://www.chartjs.org/docs/latest/"
        },{
            name: "Lodash",
            version: "v4.17.21",
            logo: "assets/images/lodash.png",
            link: "https://lodash.com",
            explain: "A modern JavaScript utility library delivering modularity, performance & extras.",
            doc: "https://lodash.com/docs/4.17.15"

        },{
            name: "PDFmake",
            version: "v0.2.5",
            logo: "assets/images/pdf.png",
            link: "http://pdfmake.org/#/",
            explain: "PDF document generation library for server-side and client-side usage in pure JavaScript.",
            doc: "https://pdfmake.github.io/docs/0.1/"
        },{
            name: "Puppetter",
            version: "v15.3.1",
            logo: "https://user-images.githubusercontent.com/10379601/29446482-04f7036a-841f-11e7-9872-91d1fc2ea683.png",
            link: "https://pptr.dev",
            explain: "Puppeteer is a Node library which provides a high-level API to control Chromium or Chrome over the DevTools Protocol.",
            doc: "https://devdocs.io/puppeteer/"
        },{
            name: "NestJS",
            version: "v9.0.3",
            logo: "assets/images/nest-logo.svg",
            link: "https://nestjs.com",
            explain: "Nest is a framework for building efficient, scalable Node.js server-side applications. It uses modern JavaScript, is built with TypeScript and combines elements of OOP, FP, and FRP.",
            doc: "https://docs.nestjs.com",
            reference: "http://nestjs-doc.exceptionfound.com/globals.html"
        },{
            name: "TypeORM",
            version: "v0.3.7",
            logo: "assets/images/typeorm.png",
            link: "https://typeorm.io/#",
            explain: "TypeORM is an ORM that can run in NestJS on NodeJS platforms and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8).",
            doc: "https://typeorm.io/#",
            reference: "https://orkhan.gitbook.io/typeorm/"
        },{
            name: "Node JS",
            version: "v18.0.3",
            logo: "assets/images/nodejs.png",
            link: "https://nodejs.org/en/",
            explain: "As an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications.", 
            doc: "https://nodejs.org/dist/latest-v14.x/docs/api/"
        },{
            name: "MySQL",
            version: "v5.7.30",
            logo: "assets/images/mysql.png",
            link: "https://www.mysql.com",
            explain: "MySQL is the world's most popular open source database. Whether you are a fast growing web property, technology ISV or large enterprise, MySQL can cost-effectively help you deliver high performance, scalable database applications.",
            doc: "https://dev.mysql.com/doc/refman/5.7/en/"
        },{
            name: "mongoDB",
            version: "4.7",
            logo: "assets/images/mongo.png",
            link: "https://www.mongodb.com",
            explain: "MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era. No database makes you more productive.",
            doc: "https://docs.mongodb.com/manual/"
        },{
            name: "Docker",
            version: "v20.10.11",
            logo: "assets/images/docker.jpg",
            link: "https://www.docker.com",
            explain: "Docker is a tool designed to make it easier to create, deploy, and run applications by using containers.",
            doc: "https://docs.mongodb.com/manual/"
        }
    ]

    constructor() {}
}
