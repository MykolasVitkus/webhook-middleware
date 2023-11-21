import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MapperDto {
    @IsNotEmpty()
    @ApiProperty()
    readonly format: unknown;

    @ApiProperty()
    @IsNotEmpty()
    readonly sample: unknown;

    @IsNotEmpty()
    @ApiProperty()
    readonly name: string;
}
