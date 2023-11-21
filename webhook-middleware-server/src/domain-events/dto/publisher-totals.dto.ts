import { ApiProperty } from '@nestjs/swagger';

export class PublisherTotalsDto {
    @ApiProperty()
    readonly totalWebhooksPublished: number;
}
