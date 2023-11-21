import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MapperDto } from './dto/mapper.dto';
import { Mapper, MapperDocument } from './schemas/mapper.schema';
import jsonpathObjectTransform from 'jsonpath-object-transform';

@Injectable()
export class MappersService {
    constructor(
        @InjectModel(Mapper.name)
        private mapperModel: Model<MapperDocument>,
    ) {}

    async create(mapperDto: MapperDto): Promise<Mapper> {
        const mapper = new this.mapperModel(mapperDto);
        return mapper.save();
    }

    async count(): Promise<number> {
        return this.mapperModel.countDocuments();
    }

    async findAll(offset: string, limit: string): Promise<Mapper[]> {
        return this.mapperModel
            .find()
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .exec();
    }

    async getById(id: string): Promise<Mapper> {
        const mapper: Mapper | null = await this.mapperModel
            .findById(id)
            .exec();
        return mapper;
    }

    async update(id: string, mapperDto: MapperDto): Promise<Mapper> {
        return this.mapperModel
            .findByIdAndUpdate(id, mapperDto, {
                useFindAndModify: true,
                new: true,
            })
            .then((result) => <Mapper>result);
    }

    async delete(id: string): Promise<void> {
        this.mapperModel
            .deleteOne({
                _id: id,
            })
            .exec();
    }

    mapPayloadToFormat(payload: unknown, format: unknown): unknown {
        return jsonpathObjectTransform(payload, format);
    }
}
