import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Simple Storage Dapp API')
    .setDescription(`<div style="margin-bottom: 12px"><strong>Nama:</strong> HAPIZD NURYADIN<br/><strong>NIM:</strong> 241011402448</div><div>Backend API untuk membaca smart contract Avalanche Fuji</div>`)
    .setVersion('1.0.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, documentFactory, {
    customCss: `
    /* ===== GLOBAL ===== */
    body {
      background: #f9fafb;
    }

    .swagger-ui {
      background: #f9fafb;
      font-family: Inter, system-ui, sans-serif;
    }

    /* ===== TOP BAR ===== */
    .swagger-ui .topbar {
      background: linear-gradient(90deg, #f97316, #fb923c);
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    }

    .swagger-ui .topbar-wrapper img {
      display: none;
    }

    /* ===== INFO HEADER ===== */
    .swagger-ui .info {
      background: #ffffff;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      color: #111827;
    }

    .swagger-ui .info h1 {
      color: #111827;
      font-weight: 700;
    }

    .swagger-ui .info p {
      color: #374151;
    }

    /* ===== OPERATION BLOCK ===== */
    .swagger-ui .opblock {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      margin-bottom: 16px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.04);
    }

    .swagger-ui .opblock-summary {
      background: #fff7ed;
      border-radius: 12px;
    }

    .swagger-ui .opblock-summary-method {
      background: #f97316;
      border-radius: 999px;
      padding: 6px 14px;
      font-weight: 600;
      color: #ffffff;
    }

    .swagger-ui .opblock-summary-path {
      color: #c2410c;
      font-weight: 500;
    }

    /* ===== EXECUTE BUTTON ===== */
    .swagger-ui .btn.execute {
      background: linear-gradient(90deg, #f97316, #fb923c);
      border-radius: 999px;
      border: none;
      color: #ffffff;
      font-weight: 600;
      padding: 8px 18px;
      box-shadow: 0 4px 14px rgba(249,115,22,0.35);
    }

    .swagger-ui .btn.execute:hover {
      filter: brightness(1.05);
    }

    /* ===== RESPONSE BOX ===== */
    .swagger-ui .responses-wrapper {
      background: #fff7ed;
      border-radius: 10px;
      padding: 12px;
      border: 1px solid #fed7aa;
    }

    .swagger-ui .response-col_status {
      color: #c2410c;
      font-weight: 600;
    }

    .swagger-ui .model-box {
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    /* ===== LINKS ===== */
    .swagger-ui a {
      color: #f97316;
    }

    .swagger-ui a:hover {
      color: #c2410c;
    }
  `,
});
  app.enableCors({
    origin: true,
});
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
