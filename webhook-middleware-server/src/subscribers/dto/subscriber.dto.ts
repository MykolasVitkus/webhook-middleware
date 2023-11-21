import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SubscriberPublisherDto } from './subscriber-publisher.dto';

export class SubscriberDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly webhookUrl: string;

    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubscriberPublisherDto)
    readonly subscribedTo: SubscriberPublisherDto[];
}
