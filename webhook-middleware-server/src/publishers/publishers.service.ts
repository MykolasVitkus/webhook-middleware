import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PublisherDto } from './dto/publisher.dto';
import { Publisher, PublisherDocument } from './schemas/publisher.schema';

@Injectable()
export class PublishersService {
    constructor(
        @InjectModel(Publisher.name)
        private publisherModel: Model<PublisherDocument>,
    ) {}

    async create(publisherDto: PublisherDto): Promise<Publisher> {
        const publisher = new this.publisherModel(publisherDto);
        return publisher.save();
    }

    async findAll(offset: string, limit: string): Promise<Publisher[]> {
        return this.publisherModel
            .find()
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .exec();
    }

    async getById(id: string): Promise<Publisher> {
        const publisher: Publisher | null = await this.publisherModel
            .findById(id)
            .exec();
        if (!publisher) {
            return null;
        }
        return publisher;
    }

    async update(id: string, publisherDto: PublisherDto): Promise<Publisher> {
        return this.publisherModel
            .findByIdAndUpdate(id, publisherDto, {
                useFindAndModify: true,
                new: true,
            })
            .then((result) => <Publisher>result);
    }

    async delete(id: string): Promise<void> {
        this.publisherModel
            .deleteOne({
                _id: id,
            })
            .exec();
    }

    async count(): Promise<number> {
        return this.publisherModel.countDocuments();
    }
}
