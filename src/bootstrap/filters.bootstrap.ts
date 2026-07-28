import { INestApplication } from "@nestjs/common";
import { AllExceptionFilter } from '../common/filters/all-exception.filter';


export function setUpFilters(app: INestApplication) {
    app.useGlobalFilters(new AllExceptionFilter());
}