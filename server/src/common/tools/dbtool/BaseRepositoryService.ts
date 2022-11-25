import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

export class BaseRepositoryService<P extends {_id: number}> {
    classname : string;
    repository : Repository<P>;
    constructor(classname: string, repository: Repository<P>) {
        this.classname = classname;
        this.repository = repository;
    }
    
    async create(datas) : Promise<P> {
        let {_id, ...attributes} = datas;
		return await this.repository.save(attributes);
	}
    async update(pobj:any) : Promise<P> {
        const origin = await this.repository.findOneBy({ _id: pobj._id });
        if (!origin) throw new NotFoundException(`Update:${this.classname}:id=${pobj._id}`);
        let {_id, ...attributes} = pobj;
        const updated = Object.assign(origin, attributes);
		return await this.repository.save(updated);
	}
    async delete(id) {
        const obj = await this.repository.findOneBy({ _id: id });
        if (!obj) throw new NotFoundException(`Delete:${this.classname}:id=${id}`);
        return await this.repository.remove(obj);
	}

}
