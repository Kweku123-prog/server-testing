export interface ICustomer extends Document {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	password: string;
	deleted: boolean;
	profilePhoto: string;
	country: string;
	street: string;
	city: string;
	state: string;
	postalCode: string;
	longitude: number;
	latitude: number;
	dateOfBirth: Date;
	accountStatus: string;
	lastLoggedIn: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface ISignupCustomer {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	password: string;
	photo: string;
	gender: string;
	street: string;
	city: string;
	state: string;
	country: string;
	postalCode: string;
}

export interface ILoginCustomer {
	phoneNumber: string;
	password: string;
}
