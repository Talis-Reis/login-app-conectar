export type User = {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	roles: string[];
	firstAccess?: string | null;
	lastAccess?: string | null;
	createdAt?: string | null;
};
