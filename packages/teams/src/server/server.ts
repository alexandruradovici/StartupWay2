import { Router } from "express";
import { Server, ApiRequest, ApiResponse } from "@startupway/main/lib/server";
import { getPool } from "@startupway/database/lib/server";
import { QueryOptions, Connection } from "mariadb";
import { getAuthorizationFunction } from "@startupway/users/lib/server";
import { Team, UserTeams, UserActivity, Product } from "../common";
import { User } from "@startupway/users/lib/server";
import { v4 as uiidv4 } from 'uuid';

export class TeamsServer {

	private static INSTANCE?: TeamsServer;

	async addTeam(team: Team, product: Product): Promise<Team & Product | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				let o: Team & Product;
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: `INSERT INTO products (productId,startupName,businessTrack,teamType,workshopDay,mentorId,descriptionEN,descriptionRO,pendingDescriptionEN,pendingDescriptionRO,productDetails,updatedAt,lastMentorUpdate) VALUES(:productId,:startupName,:businessTrack,:teamType,:workshopDay,:mentorId,:descriptionEN,:descriptionRO,:pendingDescriptionEN,:pendingDescriptionRO,:productDetails,:updatedAt,:lastMentorUpdate)`
				};
				await conn.query(queryOptions,product);
				queryOptions.sql = "SELECT productId,startupName,businessTrack,teamType,workshopDay,mentorId,descriptionEN,descriptionRO,pendingDescriptionEN,pendingDescriptionRO,productDetails,updatedAt,lastMentorUpdate FROM products WHERE productId=:productId";
				const productResponse: Product[] = await conn.query(queryOptions, {productId:product.productId});
				if (productResponse && productResponse.length > 0 && productResponse[0]) {
					team.productId = productResponse[0].productId;
					queryOptions.sql = "INSERT INTO teams (teamId,productId,teamName,teamDetails,location,year) VALUES(:teamId,:productId,:teamName,:teamDetails,:location,:year)";
					await conn.query(queryOptions,team);
					queryOptions.sql = "SELECT teamId,productId,teamName,teamDetails,location,year FROM teams WHERE teamId=:teamId";
					const teamResponse: Team[] = await conn.query(queryOptions, {teamId:team.teamId});
					console.log(teamResponse);
					if (teamResponse && teamResponse.length > 0 && teamResponse[0]) {
						team = teamResponse[0];
						product = productResponse[0];
						o = {
							teamId: team.teamId,
							teamName: team.teamName,
							productId: team.productId,
							mentorId: product.mentorId,
							year: team.year,
							location: team.location,
							startupName: product.startupName,
							businessTrack: product.businessTrack,
							teamType: product.teamType,
							workshopDay: product.workshopDay,
							descriptionRO: product.descriptionRO,
							descriptionEN: product.descriptionEN,
							pendingDescriptionRO: product.pendingDescriptionRO,
							pendingDescriptionEN: product.pendingDescriptionEN,
							teamDetails: team.teamDetails,
							productDetails: product.productDetails,
							updatedAt: product.updatedAt,
							lastMentorUpdate: product.lastMentorUpdate
						}
						if(o) {
							await conn.commit();
							await conn.end();
							return o;
						} else {
							await conn.rollback();
							await conn.end();
							return null;
						}
					} else {
						await conn.rollback();
						await conn.end();
						return null;
					}
				} else {
					await conn.rollback();
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (error) {
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return null;
		}
	}

	async deleteTeam(team: Team): Promise<boolean> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "DELETE FROM userTeams WHERE userTeams.teamId=:teamId"
				}
				await conn.query(queryOptions,{ teamId: team.teamId });
				queryOptions.sql = "SELECT teamId as deleted_id FROM userTeams WHERE teamId=:teamId";
				const deleteUT:{deleted_id:string}[] = await conn.query(queryOptions, { teamId: team.teamId });
				if(deleteUT && deleteUT.length === 0) {
					queryOptions.sql = "DELETE FROM teams WHERE teams.teamId=:teamId";
					await conn.query(queryOptions,{ teamId: team.teamId });
					queryOptions.sql = "SELECT teamId as deleted_id FROM teams WHERE teamId=:teamId";
					const deleteT:{deleted_id:string}[] = await conn.query(queryOptions, { teamId: team.teamId });
					if(deleteT && deleteT.length === 0) {
						queryOptions.sql = "DELETE FROM products WHERE product.productId=:productId";
						await conn.query(queryOptions,{ teamId: team.teamId });
						queryOptions.sql = "SELECT productId as deleted_id FROM products WHERE productId=:productId";
						const deleteP:{deleted_id:string}[] = await conn.query(queryOptions, { productId: team.productId });
						if(deleteP && deleteP.length === 0) {
							await conn.commit();
							await conn.end();
							return true;
						}
					}
				}
				await conn.rollback();
				await conn.end();
				return true;
			} else {
				return false;
			}
		} catch (error) {
			console.error(error);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return false;
		}
	}

	async modifyTeam(team: Team): Promise<Team | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "UPDATE teams SET productId=:productId, teamName=:teamName, teamDetails=:teamDetails, location=:location, year=:year WHERE teamId=:teamId"
				};
				await conn.query(queryOptions,team);
				queryOptions.sql = "SELECT teamId,productId,teamName,teamDetails,location,year FROM teams WHERE teamId=:teamId"
				const teamResponse: Team[] = await conn.query(queryOptions, team);
				if (teamResponse && teamResponse.length > 0 && teamResponse[0]) {
					await conn.commit();
					await conn.end();
					return teamResponse[0];
				} else {
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return null;
		}
	}

	async addUserToTeam(user: User, team: Team, role: string): Promise<UserTeams | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "INSERT INTO userTeams (userProductId,userId,teamId,role) VALUES(:userProductId,:userId,:teamId,:role)"
				};
				const userProductId = uiidv4();
				await conn.query(queryOptions,{ userProductId: userProductId, userId:user.userId, teamId: team.teamId, role:role });
				queryOptions.sql = "SELECT userProductId,userId,teamId,role FROM userTeams WHERE userProductId=:userProductId"
				const userInTeam: UserTeams[] = await conn.query(queryOptions, {  userProductId: userProductId });
				if (userInTeam && userInTeam.length > 0 && userInTeam[0]) {
					await conn.commit();
					await conn.end();
					return userInTeam[0];
				} else {
					await conn.rollback();
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			if(conn){
				await conn.rollback();
				await conn.end();
			}
			return null
		}
	}

	async deleteUserFromTeam(user: User, team: Team): Promise<boolean> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "DELETE FROM userTeams WHERE userTeams.userId=:userId AND teamId=:teamId"
				};
				await conn.query(queryOptions, { userId: user.userId, teamId: team.teamId});
				queryOptions.sql = "SELECT userProductId as deleted_id FROM userTeams WHERE userTeams.userId=:userId AND teamId=:teamId";
				const response:{deleted_id:string}[] = await conn.query(queryOptions, { userId: user.userId, teamId: team.teamId });
				if(response && response.length === 0) {
					await conn.commit();
					await conn.end();
					return true;
				} else {
					await conn.rollback();
					await conn.end();
					return false;
				}
			} else {
				return false;
			}
		} catch (e) {
			console.error(e);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return false
		}
	}
	// changed param from User to number, (userId)
	async getUserTeams(userId: string): Promise<(Team & UserTeams)[]> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "SELECT teams.*, userTeams.userProductId, userTeams.role, userTeams.userId FROM teams INNER JOIN userTeams ON userTeams.teamId = teams.teamId WHERE userTeams.userId=:userId"
				};
				const teamsReponse: (Team & UserTeams)[] = await conn.query(queryOptions, { userId });
				if (teamsReponse && teamsReponse.length > 0) {
					await conn.end();
					return teamsReponse;
				} else {
					await conn.end();
					return [];
				}
			} else {
				return [];
			}
		} catch (e) {
			console.error(e);
			if(conn)
				await conn.end();
			return [];
		}
	}

	async getTeams(): Promise<(Team & Product)[]> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "SELECT teams.teamId, teams.teamName, teams.teamDetails, teams.location, teams.year, products.* FROM teams INNER JOIN products ON teams.productId = products.productId"
				};
				const teamsReponse: (Team & Product)[] = await conn.query(queryOptions);
				if (teamsReponse && teamsReponse.length > 0) {
					await conn.end();
					return teamsReponse;
				} else {
					await conn.end();
					return [];
				}
			} else {
				return [];
			}
		} catch (e) {
			console.error(e);
			if(conn)
				await conn.end();
			return [];
		}
	}
	async getTeamsByLocation(location: string): Promise<(Team & Product)[]> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "SELECT teams.teamId, teams.teamName, teams.teamDetails, teams.location, teams.year, products.* FROM teams INNER JOIN products ON teams.productId = products.productId and teams.location=:location"
				};
				const teamsReponse: (Team & Product)[] = await conn.query(queryOptions, { location });
				if (teamsReponse && teamsReponse.length > 0) {
					await conn.end();
					return teamsReponse;
				} else {
					await conn.end();
					return [];
				}
			} else {
				return [];
			}
		} catch (e) {
			console.error(e);
			if(conn)
				await conn.end();
			return [];
		}
	}

	async getTeamById(teamId: string): Promise<Team | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				if (teamId && teamId !== "") {
					const queryOptions: QueryOptions = {
						namedPlaceholders: true,
						sql: "SELECT * FROM teams WHERE teams.teamId=:teamId"
					};
					const teamsReponse: Team[] = await conn.query(queryOptions, { teamId });
					if (teamsReponse && teamsReponse.length > 0 && teamsReponse[0]){
						await conn.end();
						return teamsReponse[0];
					} else {
						await conn.end()
						return null;
					}
				} else{
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (e) {
			console.log("GetTeamByID");
			console.error(e);
			if(conn)
				await conn.end();
			return null;
		}
	}

	async getTeamByProductId(productId: string): Promise<Team | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				if (productId && productId !== "") {
					const queryOptions: QueryOptions = {
						namedPlaceholders: true,
						sql: "SELECT * FROM teams WHERE teams.productId=:productId"
					};
					const teamsReponse: Team[] = await conn.query(queryOptions, { productId });
					if (teamsReponse && teamsReponse.length > 0 && teamsReponse[0]) {
						await conn.end();
						return teamsReponse[0];
					} else {
						await conn.end();
						return null;
					}
				} else {
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			if(conn)
				await conn.end();
			return null;
		}
	}

	async getTeamsByIdList(list: string[]): Promise<Team[]> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "SELECT * FROM teams WHERE teams.teamId IN (:...list)"
				};
				const teamsReponse: Team[] = await conn.query(queryOptions, { list });
				if (teamsReponse && teamsReponse.length > 0 && teamsReponse[0]) {
					await conn.end();
					return teamsReponse;
				} else {
					await conn.end();
					return [];
				}
			} else {
				return [];
			}
		} catch (e) {
			console.error(e);
			if(conn)
				await conn.end();
			return [];
		}
	}
	/**
		OGOR 28 49
		iccguard 35 56
		PacketCloud 36 57
		Rungutan 105 127
		Exigo 32 53
		LEDD 40 61
		Synovius 101 123
		Vatis Tech 34 55
		actevanzarimasini 26 47
		ESENCA 15 34
		ParkingWizzard 67 88
		Themis 25 46
		KidsFinance 21 42
		HereItIs 106 128
		PolyMore 89 111
		Tire2Tire 18 37
	*/
	async tempF(): Promise<string[]> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const tList: string[] = [];
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "SELECT teamId FROM teams WHERE teams.teamId IN (:...list)"
				};
				const teamsList: Team[] = await conn.query(queryOptions, { list: [28, 35, 36, 105, 32, 40, 101, 34, 26, 15, 67, 25, 21, 106, 89, 18] });
				if (teamsList && teamsList.length > 0) {
					for (const t of teamsList) {
						tList.push(t.teamId);
					}
					await conn.end();
					return tList;
				} else {
					await conn.end();
					return [];
				}
			} else {
				return [];
			}
		} catch (e) {
			console.error(e);
			if(conn)
				await conn.end();
			return [];
		}
	}

	async getProductById(productId: string): Promise<Product | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				if (productId && productId !== "") {
					const queryOptions: QueryOptions = {
						namedPlaceholders: true,
						sql: "SELECT * FROM products WHERE products.productId=:productId"
					};
					const productResponse: Product[] = await conn.query(queryOptions, { productId });
					if (productResponse && productResponse.length > 0 && productResponse[0]) {
						await conn.end();
						return productResponse[0];
					} else {
						await conn.end();
						return null;
					};
				} else {
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			if(conn)
				await conn.end();
			return null;
		}
	}
	async getUserInTeam(userId: string, teamId: string): Promise<UserTeams | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "SELECT * FROM userTeams WHERE userTeams.userId=:userId AND userTeams.teamId=:teamId"
				};
				const userTeamsResponse: UserTeams[] = await conn.query(queryOptions, { teamId, userId });
				if (userTeamsResponse && userTeamsResponse.length > 0 && userTeamsResponse[0]) {
					await conn.end();
					return userTeamsResponse[0];
				} else {
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			if(conn)
				await conn.end();
			return null;
		}
	}

	async getTimestampProduct(productId: string): Promise<Product | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "SELECT products.timestamp FROM products WHERE products.productId=:productId"
				};
				const productResponse: Product[] = await conn.query(queryOptions, { productId });
				if (productResponse && productResponse.length > 0 && productResponse[0]) {
					await conn.end();
					return productResponse[0];
				} else {
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			if(conn)
				await conn.end();
			return null;
		}
	}
	async getTeamByYearAndLocation(year: number, location: string, teamName: string): Promise<Team | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "SELECT * FROM teams WHERE teams.year=:year AND teams.location=:location AND teams.teamName=:teamName"
				};
				const teamResponse: Team[] = await conn.query(queryOptions, { year, location, teamName });
				if (teamResponse && teamResponse.length > 0 && teamResponse[0]) {
					await conn.end();
					return teamResponse[0];
				} else {
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			if(conn)
				await conn.end();
			return null;
		}
	}

	async isTeamInDate(date: string, productId: string): Promise<boolean> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: ""
				};
				let response: Product[];
				if (date === "may") {
					queryOptions.sql = "SELECT * FROM products WHERE products.productId=:productId JSON_EXTRACT(productDetails,'$.assessment20May') = 'Yes'"
					response = await conn.query(queryOptions, { productId });
				} else if (date === "oct") {
					queryOptions.sql = "SELECT * FROM products WHERE products.productId=:productId JSON_EXTRACT(productDetails,'$.assessment20May') = 'Yes' AND JSON_EXTRACT(productDetails,'$.assessment12Oct') = 'Yes'"
					response = await conn.query(queryOptions, { productId });
				} else if (date === "none") {
					await conn.end();
					return true;
				} else {
					await conn.end();
					return false;
				}
				if (response && response.length > 0 && response[0]) {
					await conn.end();
					return true;
				} else {
					await conn.end();
					return false;
				}
			} else {
				return false;
			}
		} catch (e) {
			console.error(e);
			if(conn)
				await conn.end();
			return false;
		}
	}
	async getUsersByTeamId(teamId: string): Promise<(User & UserTeams)[]> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "SELECT userTeams.userProductId, userTeams.teamId, users.* FROM userTeams INNER JOIN users ON users.userId=userTeams.userId WHERE userTeams.teamId=:teamId"
				};
				const teamResponse: (User & UserTeams)[] = await conn.query(queryOptions, { teamId });
				if (teamResponse && teamResponse.length > 0) {
					await conn.end();
					return teamResponse;
				} else {
					await conn.end();
					return [];
				}
			} else {
				return [];
			}
		} catch (e) {
			console.error(e);
			if(conn)
				await conn.end();
			return [];
		}
	}

	async getProductByTeamId(teamId: string): Promise<Product | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const teamById: Team | null = await this.getTeamById(teamId);
				if (teamById) {
					const queryOptions: QueryOptions = {
						namedPlaceholders: true,
						sql: "SELECT * FROM products WHERE products.productId=:productId"
					};
					const teamResponse: Product[] = await conn.query(queryOptions, { productId: teamById.productId });
					if (teamResponse && teamResponse.length > 0 && teamResponse[0]){
						await conn.end();
						return teamResponse[0];
					} else {
						await conn.end();
						return null;
					}
				} else {
					return null;
				}
			} else {
				return null;
			}
		} catch (e) {
			console.log("getProductByTeamId");
			console.error(e);
			if(conn)
				await conn.end();
			return null;
		}
	}
	async getTeamAndProductByMentorId(mentorId: string): Promise<(Team & Product)[]> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "SELECT teams.teamId, teams.teamName, teams.teamDetails, teams.location, teams.year, products.* FROM teams INNER JOIN products ON teams.productId=products.productId AND products.mentorId=:mentorId"
				};
				const teamResponse: (Team & Product)[] = await conn.query(queryOptions, { mentorId });
				if (teamResponse && teamResponse.length > 0) {
					await conn.end();
					return teamResponse;
				} else {
					await conn.end();
					return [];
				}
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			if(conn)
				await conn.end();
			return [];
		}
	}
	async getTeamByMentorId(mentorId: string): Promise<(Team & Product)[]> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "SELECT teams.* FROM teams INNER JOIN products ON products.productId=teams.productId WHERE products.mentorId=:mentorId"
				};
				const teamResponse: (Team & Product)[] = await conn.query(queryOptions, { mentorId });
				if (teamResponse && teamResponse.length > 0) {
					await conn.end();
					return teamResponse;
				} else {
					await conn.end();
					return [];
				}
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			if(conn)
				await conn.end();
			return [];
		}
	}
	async getProductByMentorId(mentorId: string): Promise<Product[]> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "SELECT * FROM products WHERE mentorId=:mentorId"
				};
				const productResponse: Product[] = await conn.query(queryOptions, { mentorId });
				if (productResponse && productResponse.length > 0) {
					await conn.end();
					return productResponse;
				} else {
					await conn.end();
					return [];
				}
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			if(conn)
				await conn.end();
			return [];
		}
	}
	async updateProduct(product: Product): Promise<Product | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "UPDATE products SET startupName=:startupName, businessTrack=:businessTrack, teamType=:teamType, workshopDay=:workshopDay, mentorId=:mentorId, descriptionEN=:descriptionEN, descriptionRO=:descriptionRO, pendingDescriptionEN=:pendingDescriptionEN, pendingDescriptionRO=:pendingDescriptionRO, productDetails=:productDetails, updatedAt=:updatedAt, lastMentorUpdate=:lastMentorUpdate WHERE productId=:productId"
				};
				await conn.query(queryOptions,product);
				queryOptions.sql = "SELECT productId, startupName, businessTrack, teamType, workshopDay, mentorId, descriptionEN, descriptionRO, pendingDescriptionEN, pendingDescriptionRO, productDetails, updatedAt, lastMentorUpdate FROM products WHERE productId=:productId";
				const teamResponse: Product[] = await conn.query(queryOptions, product);
				if (teamResponse && teamResponse.length > 0 && teamResponse[0]) {
					await conn.commit();
					await conn.end();
					return teamResponse[0];
				} else {
					await conn.rollback();
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return null;
		}
	}
	async updateTeam(team: Team): Promise<Team | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "UPDATE teams SET productId=:productId, teamName=:teamName, teamDetails=:teamDetails, location=:location, year=:year WHERE teamId=:teamId"
				};
				await conn.query(queryOptions,team);
				queryOptions.sql = "SELECT teamId,productId,teamName,teamDetails,location,year FROM teams WHERE teamId=:teamId";
				const teamResponse: Team[] = await conn.query(queryOptions, team);
				if (teamResponse && teamResponse.length > 0 && teamResponse[0]){
					await conn.commit();
					await conn.end();
					return teamResponse[0];
				} else {
					await conn.rollback();
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return null;
		}
	}
	async approveDescription(product: Product): Promise<Product | null> {
		try {
			if (product.pendingDescriptionEN !== "")
				product.descriptionEN = product.pendingDescriptionEN;
			if (product.pendingDescriptionRO !== "")
				product.descriptionRO = product.pendingDescriptionRO;
			product.pendingDescriptionEN = "";
			product.pendingDescriptionRO = "";
			product.updatedAt = new Date();
			const productResponse = await this.updateProduct(product);
			if (productResponse)
				return productResponse;
			else
				return null;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
	async getUserActivity(userId: string, teamId: string): Promise<UserActivity[]> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "SELECT * FROM userActivities WHERE userActivities.userId=:userId AND userActivities.teamId=:teamId"
				};
				const teamResponse: UserActivity[] = await conn.query(queryOptions, { userId, teamId });
				if (teamResponse && teamResponse.length > 0) {
					await conn.end();
					return teamResponse;					
				} else {
					await conn.end();
					return [];
				}
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			if(conn)
				await conn.end();
			return [];
		}
	}

	async addActivityForUser(userActivity: UserActivity): Promise<UserActivity | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "SELECT * FROM userActivities WHERE userId=:userId AND teamId=:teamId AND (WEEK(date, 7)=WEEK(CURDATE(), 7) OR WEEK(date, 7)=(WEEK(CURDATE(), 7)-1)) AND WEEK(date, 7)=WEEK(:date, 7)"
				};
				const activityResponse: UserActivity[] = await conn.query(queryOptions, userActivity);
				if (activityResponse && activityResponse.length > 0 && activityResponse[0]) {
					await conn.rollback();
					await conn.end();
					return null;
				} else {
					queryOptions.sql = "INSERT INTO userActivities (activityId,userId,teamId,noOfHours,date,description) VALUES(:activityId,:userId,:teamId,:noOfHours,:date,:description)";
					await conn.query(queryOptions,userActivity);
					queryOptions.sql = "SELECT activityId,userId,teamId,noOfHours,date,description FROM userActivities WHERE activityId=:activityId";
					const activity: UserActivity[] = await conn.query(queryOptions, {activityId:userActivity.activityId});
					if (activity && activity.length > 0 && activity[0]) {
						await conn.commit();
						await conn.end();
						return activity[0];
					} else {
						await conn.rollback();
						await conn.end();
						return null;
					}
				}
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return null;
		}
	}

	async modifyActivityForUser(userActivity: UserActivity): Promise<UserActivity | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "SELECT * FROM userActivities WHERE userId=:userId AND teamId=:teamId AND (WEEK(date, 7)=WEEK(CURDATE(), 7) OR WEEK(date, 7)=(WEEK(CURDATE(), 7)-1)) AND WEEK(date, 7)=WEEK(:date, 7)"
				};
				const activityResponse: UserActivity[] = await conn.query(queryOptions, userActivity);
				if (activityResponse && activityResponse.length > 0 && activityResponse[0]) {
					queryOptions.sql = "UPDATE userActivities SET userId=:userId, teamId=:teamId, noOfHours=:noOfHours, date=:date, description=:description";
					await conn.query(queryOptions, userActivity);
					queryOptions.sql= "SELECT activityId,userId,teamId,noOfHours,date,description FROM userActivities WHERE activityId=:activityId";
					const activity: UserActivity[] = await conn.query(queryOptions, userActivity);
					if (activity && activity.length > 0 && activity[0]) {
						await conn.commit();
						await conn.end();
						return activity[0];
					} else {
						await conn.rollback();
						await conn.end();
						return null;
					}
				} else {
					await conn.rollback();
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return null;
		}
	}
	async updateActivity(userActivity: UserActivity): Promise<UserActivity | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "UPDATE userActivities SET userId=:userId, teamId=:teamId, noOfHours=:noOfHours, date=:date, description=:description WHERE activityId=:activityId"
				};
				await conn.query(queryOptions, userActivity);
				queryOptions.sql = "SELECT activityId,userId,teamId,noOfHours,date,description FROM userActivities WHERE activityId=:activityId";
				const activity: UserActivity[] = await conn.query(queryOptions, userActivity);
				if (activity && activity.length > 0 && activity[0]) {
					await conn.commit();
					await conn.end();
					return activity[0];
				} else {
					await conn.rollback();
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return null;
		}
	}
	async updateUserTeamDetails(userTeam: UserTeams): Promise<UserTeams | null> {
		let conn:Connection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				const queryOptions: QueryOptions = {
					namedPlaceholders: true,
					sql: "UPDATE userTeams SET userId=:userId, teamId=:teamId, role=:role WHERE userId=:userId and teamId=:teamId"
				};
				await conn.query(queryOptions, userTeam);
				queryOptions.sql = "SELECT userProductId,teamId,userId,role FROM userTeams WHERE teamId=:teamId AND userId=:userId"
				const activity: UserTeams[] = await conn.query(queryOptions, userTeam);
				if (activity && activity.length > 0 && activity[0]) {
					await conn.commit();
					await conn.end();
					return activity[0];
				} else {
					await conn.rollback();
					await conn.end();
					return null;
				}
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			if(conn) {
				await conn.rollback();
				await conn.end();
			}
			return null;
		}
	}

	public static getInstance(): TeamsServer {
		if (!this.INSTANCE) {
			this.INSTANCE = new TeamsServer();
		}
		return this.INSTANCE;
	}

}
const router = Router();
const teams = TeamsServer.getInstance();

const authFunct = getAuthorizationFunction();
if (authFunct)
	router.use(authFunct);
// Bypass params dictionary and send authorization Function

router.get("/teams:userId", async (req: ApiRequest<undefined>, res: ApiResponse<(Team & UserTeams)[]>) => {
	try {
		const all_teams: (Team & UserTeams)[] = await teams.getUserTeams(req.params.userId);
		
		for(let team of all_teams) {
			team.teamDetails = JSON.parse((team.teamDetails as any) as string);
		}
		if (all_teams)
			res.send(all_teams);
		else
			res.status(204).send({ err: 204, data: [] });
	} catch (e) {
		console.error(e);
		res.status(500).send({ err: 500, data: [] });
	}
});
// List all teams
router.get("/mentor/teamsAndProduct/:mentorId", async (req: ApiRequest<undefined>, res: ApiResponse<(Team & Product)[]>) => {
	try {
		const allTeams: (Team & Product)[] = await teams.getTeamAndProductByMentorId(req.params.mentorId);
		
		for(let team of allTeams) {
			team.productDetails = JSON.parse((team.productDetails as any) as string);
			team.teamDetails = JSON.parse((team.teamDetails as any) as string);
		}
		if (allTeams)
			res.status(200).send(allTeams);
		else
			res.status(204).send([])
	} catch (e) {
		console.error(e);
		res.status(500).send({ err: 500, data: [] });
	}

});

router.get("/mentor/teams/:mentorId", async (req: ApiRequest<undefined>, res: ApiResponse<(Team)[]>) => {
	try {
		const allTeams: (Team)[] = await teams.getTeamByMentorId(req.params.mentorId);
		
		for(let team of allTeams) {
			team.teamDetails = JSON.parse((team.teamDetails as any) as string);
		}
		if (allTeams)
			res.status(200).send(allTeams);
		else
			res.status(204).send([]);
	} catch (e) {
		console.error(e);
		res.status(500).send({ err: 500, data: [] });
	}

});

router.get("/teams/demoDay", async (req: ApiRequest<undefined>, res: ApiResponse<number[]>) => {
	try {
		const demoDayTeams: string[] = await teams.tempF();
		if (demoDayTeams)
			res.status(200).send(demoDayTeams);
		else
			res.status(204).send([]);
	} catch (e) {
		console.error(e);
		res.status(500).send({ err: 500, data: [] });
	}
});

router.get("/team/:teamId", async (req: ApiRequest<undefined>, res: ApiResponse<Team | null>) => {
	try {
		const team: Team | null = await teams.getTeamById(req.params.teamId);
		if (team)
			res.status(200).send(team);
		else
			res.status(204).send(null);
	} catch (e) {
		console.error(e);
		res.status(500).send({ err: 500, data: null });
	}
});

router.get("/team/users/:teamId", async (req: ApiRequest<undefined>, res: ApiResponse<(User & UserTeams)[]>) => {
	try {
		const users: (User & UserTeams)[] = await teams.getUsersByTeamId(req.params.teamId);
		if (users) {
			for(let user of users) {
				user.socialMedia = JSON.parse((user.socialMedia as any) as string);
				user.userDetails = JSON.parse((user.userDetails as any) as string)
			}
			res.status(200).send(users);
		}
		else
			res.status(204).send([]);
	} catch (e) {
		console.error(e);
		res.status(500).send({ err: 500, data: [] });
	}

});

router.post("/team/activity", async (req: ApiRequest<{ userId: string, teamId: string }>, res: ApiResponse<UserActivity[]>) => {
	try {
		const userActivities: UserActivity[] = await teams.getUserActivity(req.body.userId, req.body.teamId);
		if (userActivities)
			res.status(200).send(userActivities);
		else
			res.status(204).send([]);
	} catch (e) {
		console.error(e);
		res.status(500).send({ err: 500, data: [] });
	}
});
router.post("/team/activity/update", async (req: ApiRequest<UserActivity>, res: ApiResponse<UserActivity | null>) => {
	try {
		const userActivity: UserActivity | null = await teams.updateActivity(req.body);
		if (userActivity)
			res.status(200).send(userActivity);
		else
			res.status(204).send(null);
	} catch (e) {
		console.error(e);
		res.status(500).send({ err: 500, data: null });
	}
});
router.post("/team/remove/users", async (req: ApiRequest<{ users: (User & UserTeams)[], teamId: string }>, res: ApiResponse<boolean>) => {
	try {
		const toRemove: (User & UserTeams)[] = req.body.users;
		const teamId = req.body.teamId;
		let r = false;
		for (const user of toRemove) {
			if (user && !user.userId)
				(user.userId as string) = user.teamId;
			r = await teams.deleteUserFromTeam(user, { teamId: teamId } as Team);
			if (!r) {
				break;
			}
		}
		if (r)
			res.status(200).send(true);
		else
			res.status(204).send(false);
	} catch (e) {
		console.error(e);
		res.status(500).send({ err: 500, data: false });
	}
});
router.post("/team/add/users", async (req: ApiRequest<{ users: (User & UserTeams)[], teamId: string }>, res: ApiResponse<boolean>) => {
	try {
		const toAdd = req.body.users;
		const teamId = req.body.teamId;
		let userTeam: UserTeams | null = null;
		for (const user of toAdd) {
			if (user.userId === undefined)
				user.userId = user.userId;
			userTeam = await teams.addUserToTeam(user, { teamId: teamId } as Team, "");
			if (userTeam === null) {
				break;
			}
		}
		if (userTeam)
			res.status(200).send(true);
		else
			res.status(204).send(false);
	} catch (e) {
		console.error(e);
		res.status(500).send({ err: 500, data: false });
	}
});

router.post("/product", async (req: ApiRequest<{ team: Team, product: Product }>, res: ApiResponse<(Team & Product) | null>) => {
	try {
		const newProduct: (Team & Product) | null = await teams.addTeam(req.body.team, req.body.product);
		if (newProduct)
			res.status(200).send(newProduct);
		else
			res.status(204).send(null);
	} catch (e) {
		console.error(e);
		res.status(500).send({ err: 500, data: null });
	}
});

router.get("/product/:teamId", async (req: ApiRequest<undefined>, res: ApiResponse<Product | null>) => {
	try {
		const product: Product | null = await teams.getProductByTeamId(req.params.teamId);
		if (product) {
			product.productDetails = JSON.parse((product.productDetails as any) as string);
			res.status(200).send(product);
		} else
			res.status(204).send(null);
	} catch (e) {
		console.error(e);
		res.status(500).send({ err: 500, data: null });
	}
});

router.post("/product/approve/description", async (req: ApiRequest<Product>, res: ApiResponse<Product | null>) => {
	try {
		const product: Product = req.body;
		if (product.pendingDescriptionEN.trim() == "") {
			product.pendingDescriptionEN = product.descriptionEN;
		}
		if (product.pendingDescriptionRO.trim() == "") {
			product.pendingDescriptionRO = product.descriptionRO;
		}
		if (product) {
			const response = await teams.approveDescription(product);
			if (response)
				res.status(200).send(response);
			else
				res.status(204).send(null);
		} else
			res.status(204).send(null);
	} catch (e) {
		console.error(e);
		res.status(500).send({ err: 500, data: null });
	}

});

router.post("/product/update", async (req: ApiRequest<{ teamId: string, product: Product }>, res: ApiResponse<Product | null>) => {
	try {
		const product: Product = req.body.product;
		const teamId: string = req.body.teamId;
		if (req.body.product) {
			const team: Team | null = await teams.getTeamById(teamId);
			if (team) {
				team.teamName = product.startupName;
				const newTeam: Team | null = await teams.updateTeam(team);
				if (newTeam) {
					const newProduct: Product | null = await teams.updateProduct(product);
					if (newProduct)
						res.status(200).send(newProduct);
					else
						res.status(204).send(null);
				} else {
					res.status(204).send(null);
				}
			} else {
				res.status(204).send(null);
			}
		}
		else
			res.status(204).send(null);
	} catch (e) {
		console.error(e);
		res.status(500).send({ err: 500, data: null });
	}
});

const server = Server.getInstance();
server.registerRouterAPI(1, router, "/teams");