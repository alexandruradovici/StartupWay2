export class WorkspaceServer {

	private static INSTANCE?: WorkspaceServer;

	public static getInstance (): WorkspaceServer
	{
		if (!this.INSTANCE)
		{
			this.INSTANCE = new WorkspaceServer ();
		}
		return this.INSTANCE;
	}

}
