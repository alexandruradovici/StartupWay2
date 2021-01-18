export class MenuServer {

	private static INSTANCE?: MenuServer;

	public static getInstance (): MenuServer
	{
		if (!this.INSTANCE)
		{
			this.INSTANCE = new MenuServer ();
		}
		return this.INSTANCE;
	}

}
