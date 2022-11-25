import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppBase } from './app.base';
import { SocketIoAdapter } from './common/socket/socket-io.adapter';
import { GSRsExceptionsFilter } from './common/errors/GSRsExceptionsFilter';

import base_config from './config.base';
import app_config from './app-modules/app.config';

async function bootstrap() {
    const app = await NestFactory.create(AppBase);
    // Patch for socket.io 3.0 and nestjs
    // app.useWebSocketAdapter(new SocketIoAdapter(app, base_config().hostUrl));
    
    const options = new DocumentBuilder()
        .setTitle(app_config().document.title)
        .setDescription(app_config().document.description)
        .setVersion(app_config().document.version)
        .addTag('')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('apidoc', app, document);

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new GSRsExceptionsFilter(httpAdapter));

    await app.listen(base_config().backendPort);
}
bootstrap();
