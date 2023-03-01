import type { PrismaClient } from '@prisma/client';

declare global {
	declare namespace App {
		// interface Error {}
		// interface Locals {
		// 	username?: string;
		// 	roles?: string[];
		// }
		// interface PageData {}
		// interface Platform {}
	}
	
	// eslint-disable-next-line no-var
	var __prisma: PrismaClient;
}
