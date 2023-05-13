import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SMTPServer } from 'smtp-server';

import { AppBase } from './app.base';
//import { SocketIoAdapter } from './common/socket/socket-io.adapter';
import { GSRsExceptionsFilter } from './common/errors/GSRsExceptionsFilter';

import base_config from './config.base';
import app_config from './app-modules/app.config';
import { createSMTPServer } from './app-modules/app.modules';

async function bootstrap() {
    const app = await NestFactory.create(AppBase);
    // Patch for socket.io 3.0 and nestjs
    // app.useWebSocketAdapter(new SocketIoAdapter(app, base_config().hostUrl));

    if( base_config().devmode ) {
        const options = new DocumentBuilder()
            .setTitle(app_config().document.title)
            .setDescription(app_config().document.description)
            .setVersion(app_config().document.version)
            .addTag('')
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('apidoc', app, document);
    }

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new GSRsExceptionsFilter(httpAdapter));

    app.listen(base_config().backendPort);

    const smtp = createSMTPServer(app);
    if( smtp ) {
        smtp.listen(app_config().smtpPort, ()=> {
            console.log(`Running smtp server on port ${app_config().smtpPort}`);
        });
        smtp.on('error', err => {
            console.log(err.name, err.message, err.stack);
        });
    }
    
}
bootstrap();
