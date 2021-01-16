export class DatabaseUi {
	private static instance: DatabaseUi;
	public static getInstance(): DatabaseUi {
		if(!DatabaseUi.instance) {
			DatabaseUi.instance = new DatabaseUi();
		}
		return DatabaseUi.instance;
	}

}
