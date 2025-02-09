import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
	public readonly id = crypto.randomUUID();
	constructor() {
		console.log(this.id);
	}
}
