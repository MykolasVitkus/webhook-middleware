import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubscriberPublisherDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly publisherId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly mapperId: string;
}
