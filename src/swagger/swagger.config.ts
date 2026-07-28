import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setUpSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle('Real Time Chat App Backend')
        .setDescription('REST API documentation for the Real Time Chat App Backend.')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        }
    });
}